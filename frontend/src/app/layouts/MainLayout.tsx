import { Outlet } from 'react-router-dom';
import { Header } from '@shared/ui/Header/Header';
import { Footer } from '@shared/ui/Footer/Footer';

export const MainLayout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-[#FAFAF8]">
            <Header/>
            <main className="flex-1">
                <Outlet/>
            </main>
            <Footer/>
        </div>
    );
};