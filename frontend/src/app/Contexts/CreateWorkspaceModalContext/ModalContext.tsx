import { createContext, useContext, useState, ReactNode } from 'react';

interface ModalContextType {
    isCreateWorkspaceOpen: boolean;
    openCreateWorkspace: () => void;
    closeCreateWorkspace: () => void;
}

const ModalContext = createContext<ModalContextType | null>(null);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
    const [isCreateWorkspaceOpen, setIsCreateWorkspaceOpen] = useState(false);

    const openCreateWorkspace = () => setIsCreateWorkspaceOpen(true);
    const closeCreateWorkspace = () => setIsCreateWorkspaceOpen(false);

    return (
        <ModalContext.Provider value={{
            isCreateWorkspaceOpen,
            openCreateWorkspace,
            closeCreateWorkspace,
        }}>
            {children}
        </ModalContext.Provider>
    );
};

export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) throw new Error('useModal must be used within ModalProvider');
    return context;
};