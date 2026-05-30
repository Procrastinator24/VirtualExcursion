import { ReactNode } from 'react';

export interface TabConfig {
    id: string;
    label: string;
    component: ReactNode;
}

interface WorkspaceSettingsTabsProps {
    tabs: TabConfig[];
    activeTab: string;
    onTabChange: (tabId: string) => void;
}

export const SettingsModalLayout = ({ tabs, activeTab, onTabChange }: WorkspaceSettingsTabsProps) => {
    return (
        <div className="flex justify-start items-start gap-14">
            {/* Боковое меню — sticky относительно скролл-контейнера */}
            <div className="w-70 flex flex-col justify-start items-start gap-2 sticky top-0">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`self-stretch px-3 py-2 rounded-md flex justify-start items-center gap-2.5 transition-colors ${
                            activeTab === tab.id
                                ? 'bg-black text-white'
                                : 'text-zinc-900 hover:bg-gray-100'
                        }`}
                    >
                        <div
                            className={`w-1.5 h-1.5 rounded-full ${
                                activeTab === tab.id ? 'bg-white' : 'bg-black'
                            }`}
                        />
                        <span className="text-base font-medium font-['Inter'] leading-6">
                            {tab.label}
                        </span>
                    </button>
                ))}
            </div>

            {/* Контент */}
            <div className="w-[640px]">
                {tabs.find((tab) => tab.id === activeTab)?.component}
            </div>
        </div>
    );
};