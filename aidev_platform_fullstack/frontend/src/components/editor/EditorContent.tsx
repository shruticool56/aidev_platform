import React from 'react';

interface EditorContentProps {
  filename: string;
}

const EditorContent: React.FC<EditorContentProps> = ({ filename }) => {
  const getEditorContent = () => {
    switch (filename) {
      case 'App.tsx':
        return `import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <p>Start prompting (or editing) to see magic happen :)</p>
    </div>
  );
}

export default App;`;
      case 'index.css':
        return `@tailwind base;
@tailwind components;
@tailwind utilities;`;
      case 'package.json':
        return `{
  "name": "vite-react-typescript-starter",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "lucide-react": "^0.344.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  }
}`;
      default:
        return 'Select a file to view its contents';
    }
  };

  return (
    <div className="h-full p-2 font-mono text-sm text-[#d4d4d4] whitespace-pre overflow-auto">
      <div className="pl-12 relative">
        {getEditorContent().split('\n').map((line, index) => (
          <div key={index} className="leading-6">
            <span className="absolute left-0 text-[#858585] w-8 text-right pr-2">
              {index + 1}
            </span>
            <span>{line}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EditorContent;