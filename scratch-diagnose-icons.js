/**
 * Diagnostic script: scans all project files in MongoDB for lucide-react imports
 * and validates each named import against the real package exports from unpkg.
 *
 * Usage: node scratch-diagnose-icons.js [projectId]
 * If no projectId given, uses the latest project.
 */
const fs = require('fs');
const https = require('https');
const { MongoClient, ObjectId } = require('mongodb');

// Fetch text from a URL
function fetchText(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let data = '';
      res.on('data', chunk => (data += chunk));
      res.on('end', () => resolve(data));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function getLucideExports(version) {
  console.log(`\nFetching lucide-react@${version} exports from unpkg...`);
  const url = `https://unpkg.com/lucide-react@${version}/dist/cjs/lucide-react.js`;
  const src = await fetchText(url);
  // Extract all exports.XxxName = ... patterns from the CJS bundle
  const matches = [...src.matchAll(/exports\.([A-Z][A-Za-z0-9]+)\s*=/g)];
  const names = [...new Set(matches.map(m => m[1]))];
  console.log(`  → Found ${names.length} named exports.`);
  return new Set(names);
}

function extractLucideImports(content) {
  // Match: import { A, B, C } from 'lucide-react'
  const results = [];
  const regex = /import\s*\{([^}]+)\}\s*from\s*['"]lucide-react['"]/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const names = match[1]
      .split(',')
      .map(s => s.trim().split(/\s+as\s+/)[0].trim()) // handle "X as Y" aliases
      .filter(Boolean);
    results.push(...names);
  }
  return results;
}

async function main() {
  const projectId = process.argv[2];
  const LUCIDE_VERSION = '0.344.0';

  // 1. Get lucide exports
  const lucideExports = await getLucideExports(LUCIDE_VERSION);

  // 2. Connect to DB
  const envContent = fs.readFileSync('.env.local', 'utf8');
  const uriLine = envContent.split('\n').find(l => l.trim().startsWith('MONGO_URI='));
  const uri = uriLine.split('=')[1].trim().replace(/^['"]|['"]$/g, '');
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db();

  // 3. Load project
  const query = projectId
    ? { _id: new ObjectId(projectId) }
    : {};
  const project = await db.collection('projects').findOne(query, { sort: { createdAt: -1 } });
  if (!project) { console.error('No project found.'); await client.close(); return; }
  console.log(`\nProject: ${project._id} — "${project.prompt.substring(0, 60)}..."`);

  // 4. Scan every file
  console.log('\n── Lucide Import Analysis ─────────────────────────────────');
  let totalBroken = 0;

  for (const file of (project.files || [])) {
    const imports = extractLucideImports(file.content);
    if (imports.length === 0) continue;

    const valid = imports.filter(n => lucideExports.has(n));
    const broken = imports.filter(n => !lucideExports.has(n));

    if (broken.length > 0) {
      console.log(`\n❌ ${file.path}`);
      console.log(`   Valid   : ${valid.join(', ') || '(none)'}`);
      console.log(`   BROKEN  : ${broken.join(', ')}   ← these are UNDEFINED at runtime`);
      totalBroken += broken.length;
    } else {
      console.log(`✅ ${file.path}  [${imports.join(', ')}]`);
    }
  }

  if (totalBroken === 0) {
    console.log('\n🎉 All lucide-react imports are valid!');
  } else {
    console.log(`\n⚠️  Total broken imports: ${totalBroken}`);
  }

  await client.close();
}

main().catch(console.error);
