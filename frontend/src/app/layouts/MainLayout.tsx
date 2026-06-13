import { Outlet } from 'react-router-dom';
import { Header } from '@shared/ui/Header/Header';
import { Footer } from '@shared/ui/Footer/Footer';
import {useModal} from "../Contexts/CreateWorkspaceModalContext/ModalContext.tsx";
import {WorkspaceCreateModal} from "../../entities/workspace/ui/CreateWorkspaceModal.tsx";

export const MainLayout = () => {
    const { isCreateWorkspaceOpen, closeCreateWorkspace } = useModal();

    const handleWorkspaceCreated = () => {
        // Обновить список пространств (можно через refetch или событие)
        console.log('Workspace created, refresh list');
    };
    return (
        <div className="min-h-screen flex flex-col">
            <Header/>
            <main className="flex-1">
                <Outlet/>
            </main>
            <Footer/>

            {/* Модалка создания пространства на уровне лейаута */}
            <WorkspaceCreateModal
                isOpen={isCreateWorkspaceOpen}
                onClose={closeCreateWorkspace}
                onSuccess={handleWorkspaceCreated}
            />
        </div>
    );
};