"use client";

import {
  SandpackProvider,
  SandpackPreview,
} from "@codesandbox/sandpack-react";

export default function ReactSite({ files }: { files: Record<string, string> }) {
  return (
    <SandpackProvider
      template="react-ts"
      theme="light"
      files={
        Object.keys(files).length > 0
          ? files
          : {
              "/App.tsx":
                "export default function App() { return <div>Loading...</div> }",
            }
      }
      customSetup={{
        dependencies: {
          "lucide-react": "0.344.0",
          "framer-motion": "11.0.0",
          "react-router-dom": "6.22.0",
        },
      }}
      options={{
        externalResources: ["https://unpkg.com/@tailwindcss/browser@4"],
      }}
    >
      {/* Render ONLY the preview iframe with all chrome stripped */}
      <SandpackPreview
        showNavigator={false}
        showOpenInCodeSandbox={false}
        showRefreshButton={false}
        style={{
          position: "fixed",
          inset: 0,
          width: "100vw",
          height: "100vh",
          border: "none",
        }}
      />
    </SandpackProvider>
  );
}
