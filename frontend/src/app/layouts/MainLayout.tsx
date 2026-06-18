import { Outlet } from 'react-router-dom';
import { Header } from '@shared/ui/header/Header.tsx';
import { Footer } from '@shared/ui/footer/Footer';
import {useModal} from "../Contexts/CreateWorkspaceModalContext/ModalContext.tsx";
import {WorkspaceCreateModal} from "../../entities/workspace/ui/CreateWorkspaceModal.tsx";

export const MainLayout = () => {
    const { isCreateWorkspaceOpen, closeCreateWorkspace } = useModal();

    const handleWorkspaceCreated = () => {
        // �������� ������ ����������� (����� ����� refetch ��� �������)
        console.log('Workspace created, refresh list');
    };
    return (
        <div className="min-h-screen flex flex-col">
            <Header/>
            <main className="flex-1">
                <Outlet/>
            </main>
            <Footer/>

            {/* ������� �������� ������������ �� ������ ������� */}
            <WorkspaceCreateModal
                isOpen={isCreateWorkspaceOpen}
                onClose={closeCreateWorkspace}
                onSuccess={handleWorkspaceCreated}
            />
        </div>
    );
};