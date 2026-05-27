"use client";

import { 
  SandpackProvider, 
  SandpackLayout, 
  SandpackPreview,
} from "@codesandbox/sandpack-react";

export default function ReactPreview({ files }: { files: Record<string, string> }) {
  return (
    <div className="w-full h-screen">
      <SandpackProvider
        template="react-ts"
        theme="light"
        files={Object.keys(files).length > 0 ? files : {
          "/App.tsx": "export default function App() { return <div>Building project...</div> }"
        }}
        customSetup={{
          dependencies: {
            "lucide-react": "0.344.0",
            "framer-motion": "11.0.0",
            "react-router-dom": "6.22.0"
          }
        }}
        options={{
          externalResources: [
            "https://unpkg.com/@tailwindcss/browser@4"
          ]
        }}
      >
        <SandpackLayout style={{ height: "100vh", width: "100%", border: "none", flex: 1 }}>
          <SandpackPreview
            showNavigator={true}
            showOpenInCodeSandbox={false}
            showRefreshButton={true}
            style={{ height: "100vh", width: "100%", flex: 1 }}
          />
        </SandpackLayout>
      </SandpackProvider>
    </div>
  );
}
