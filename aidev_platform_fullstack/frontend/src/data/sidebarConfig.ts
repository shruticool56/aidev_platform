import { SidebarItem, FileItem, StatusBarItem } from '../types';
import { FolderIcon, FileIcon } from 'lucide-react';

export const sidebarItems: SidebarItem[] = [
  { id: 'explorer', icon: 'Files', label: 'Explorer', active: true },
  { id: 'search', icon: 'Search', label: 'Search' },
  { id: 'git', icon: 'GitBranch', label: 'Source Control' },
  { id: 'debug', icon: 'Play', label: 'Run and Debug' },
  { id: 'extensions', icon: 'Package', label: 'Extensions' }
];

export const fileExplorer: FileItem[] = [
  {
    id: '1',
    name: 'project',
    type: 'folder',
    expanded: true,
    children: [
      {
        id: '2',
        name: 'src',
        type: 'folder',
        expanded: true,
        children: [
          { id: '3', name: 'App.tsx', type: 'file' },
          { id: '4', name: 'main.tsx', type: 'file' },
          { id: '5', name: 'index.css', type: 'file' }
        ]
      },
      { id: '6', name: 'package.json', type: 'file' },
      { id: '7', name: 'tsconfig.json', type: 'file' },
      { id: '8', name: 'index.html', type: 'file' }
    ]
  }
];

export const statusBarItems: StatusBarItem[] = [
  { id: 'branch', text: 'main', icon: 'GitBranch', position: 'left' },
  { id: 'errors', text: '0 errors', icon: 'XCircle', position: 'left' },
  { id: 'warnings', text: '0 warnings', icon: 'AlertTriangle', position: 'left' },
  { id: 'encoding', text: 'UTF-8', position: 'right' },
  { id: 'lineEnding', text: 'LF', position: 'right' },
  { id: 'language', text: 'TypeScript React', position: 'right' }
];