import { MenuConfig } from '../types';

export const menuConfig: MenuConfig = {
  'File': [
    { label: 'New File', shortcut: 'Ctrl+N' },
    { label: 'New Window', shortcut: 'Ctrl+Shift+N' },
    { divider: true },
    { label: 'Open File...', shortcut: 'Ctrl+O' },
    { label: 'Open Folder...', shortcut: 'Ctrl+K Ctrl+O' },
    { divider: true },
    { label: 'Save', shortcut: 'Ctrl+S' },
    { label: 'Save As...', shortcut: 'Ctrl+Shift+S' },
    { divider: true },
    { label: 'Exit' }
  ],
  'Edit': [
    { label: 'Undo', shortcut: 'Ctrl+Z' },
    { label: 'Redo', shortcut: 'Ctrl+Y' },
    { divider: true },
    { label: 'Cut', shortcut: 'Ctrl+X' },
    { label: 'Copy', shortcut: 'Ctrl+C' },
    { label: 'Paste', shortcut: 'Ctrl+V' },
    { divider: true },
    { label: 'Find', shortcut: 'Ctrl+F' },
    { label: 'Replace', shortcut: 'Ctrl+H' }
  ],
  'Selection': [
    { label: 'Select All', shortcut: 'Ctrl+A' },
    { label: 'Expand Selection', shortcut: 'Alt+Shift+→' },
    { label: 'Shrink Selection', shortcut: 'Alt+Shift+←' }
  ],
  'View': [
    { label: 'Command Palette...', shortcut: 'Ctrl+Shift+P' },
    { divider: true },
    { label: 'Explorer', shortcut: 'Ctrl+Shift+E' },
    { label: 'Search', shortcut: 'Ctrl+Shift+F' },
    { label: 'Source Control', shortcut: 'Ctrl+Shift+G' },
    { label: 'Run and Debug', shortcut: 'Ctrl+Shift+D' },
    { label: 'Extensions', shortcut: 'Ctrl+Shift+X' }
  ],
  'Go': [
    { label: 'Back', shortcut: 'Alt+←' },
    { label: 'Forward', shortcut: 'Alt+→' },
    { divider: true },
    { label: 'Go to File...', shortcut: 'Ctrl+P' },
    { label: 'Go to Symbol...', shortcut: 'Ctrl+Shift+O' }
  ],
  'Run': [
    { label: 'Start Debugging', shortcut: 'F5' },
    { label: 'Run Without Debugging', shortcut: 'Ctrl+F5' },
    { label: 'Stop Debugging', shortcut: 'Shift+F5' },
    { divider: true },
    { label: 'Toggle Breakpoint', shortcut: 'F9' }
  ],
  'Terminal': [
    { label: 'New Terminal', shortcut: 'Ctrl+Shift+`' },
    { label: 'Split Terminal', shortcut: 'Ctrl+Shift+5' },
    { divider: true },
    { label: 'Run Task...', shortcut: 'Ctrl+Shift+B' }
  ],
  'Help': [
    { label: 'Welcome', shortcut: '' },
    { label: 'Documentation', shortcut: '' },
    { divider: true },
    { label: 'About', shortcut: '' }
  ]
};