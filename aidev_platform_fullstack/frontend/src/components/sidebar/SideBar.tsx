import React from 'react';
import { sidebarItems } from "../../data/sidebarConfig";
import { Icon } from '@iconify/react'; // Assuming iconify is installed or add it

// Define agent types based on architecture
const agentGroups = {
  general: [
    { name: 'Dev Agent', icon: 'mdi:code-braces' },
    { name: 'UI Agent', icon: 'mdi:palette' },
    { name: 'Infra Agent', icon: 'mdi:server-network' },
    { name: 'Docs Agent', icon: 'mdi:file-document-outline' },
    { name: 'File Agent', icon: 'mdi:folder-outline' },
    { name: 'Test Agent', icon: 'mdi:test-tube' },
    { name: 'Terminal Agent', icon: 'mdi:console' },
    { name: 'Web Agent', icon: 'mdi:web' },
    { name: 'Installer Agent', icon: 'mdi:package-variant-closed' },
    { name: 'Automation Agent', icon: 'mdi:robot-outline' },
    { name: 'Planner Agent', icon: 'mdi:clipboard-list-outline' },
  ],
  internetApi: [
    { name: 'API Task Agent', icon: 'mdi:api' },
    { name: 'WebAutomation Agent', icon: 'mdi:play-box-outline' },
    { name: 'Search Agent', icon: 'mdi:magnify' },
    { name: 'Data Extraction Agent', icon: 'mdi:database-export-outline' },
    { name: 'Web Reasoning Agent', icon: 'mdi:brain' },
  ],
  supervisory: [
    { name: 'Quality Checker', icon: 'mdi:check-decagram-outline' },
    { name: 'Safety & Ethics', icon: 'mdi:shield-account-outline' },
    { name: 'Resource Optimizer', icon: 'mdi:chart-line' },
  ],
};

const SideBar: React.FC = () => {
  return (
    <div className="w-16 bg-gray-900 text-gray-400 flex flex-col items-center py-4 space-y-6">
      {/* Existing Sidebar Icons */}
      {sidebarConfig.map((item, index) => (
        <div key={index} className="cursor-pointer hover:text-white" title={item.title}>
          <Icon icon={item.icon} className="w-6 h-6" />
        </div>
      ))}

      {/* Divider */}
      <div className="w-full border-t border-gray-700 my-4"></div>

      {/* Simulated Agent Status Section */}
      <div className="text-xs text-center font-semibold mb-2">AGENTS</div>
      {Object.entries(agentGroups).map(([groupKey, agents]) => (
        <React.Fragment key={groupKey}>
          {/* Optional: Group Title */}
          {/* <div className="text-tiny text-gray-500 uppercase mt-2">{groupKey}</div> */}
          {agents.map((agent) => (
            <div key={agent.name} className="cursor-pointer hover:text-white relative group" title={agent.name}>
              <Icon icon={agent.icon} className="w-6 h-6" />
              {/* Simulated Status Indicator (e.g., green dot for idle) */}
              <span className="absolute bottom-0 right-0 block h-2 w-2 rounded-full bg-green-500 ring-2 ring-gray-900" title="Simulated Status: Idle"></span>
            </div>
          ))}
        </React.Fragment>
      ))}
    </div>
  );
};

export default SideBar;

