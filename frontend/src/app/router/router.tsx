import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '@app/layouts/MainLayout';
import { HomePage } from '@pages/HomePage/Home';
import { CatalogPage } from '@pages/CatalogPage/Catalog';
import { ExcursionDetailPage } from '@pages/ExcursionPage/ExcursionDetailPage';
import { SceneViewerPage } from '@pages/sceneViewerPage';
import { ExhibitsCatalogPage } from '@pages/ExhibitPage/ExhibitPage';
import { UserProfilePage } from '@pages/ProfilePage/UserProfilePage';

import { CreateExhibitPage } from '@pages/CreateExhibitPage/CreateExhibitPage';
import { CreateExcursionPage } from '@pages/CreateExcursionPage/CreateExcursionPage';
import { NotFoundPage } from '@pages/NotFoundPage/NotFoundPage';
import { AboutPage } from '@pages/AboutPage/AboutPage';
import { AuthPage } from '@pages/AuthPage/AuthPage';
import WorkspacesCatalogPage from "../../pages/AuthorsCatalogPage/AuthorsCatalogPage.tsx";
import WorkspacePage from "../../pages/WorkspacePage/WorkspacePage.tsx";
import WorkspacePublicPage from "@pages/AuthorsCatalogPage/AuthorPublicPage/AuthorPublicPage.tsx";

export const router = createBrowserRouter([
    {
        path: '/auth',
        element: <AuthPage />,
    },
    {
        path: '/',
        element: <MainLayout />,
        children: [
            { index: true, element: <HomePage /> },
            { path: 'catalog', element: <CatalogPage /> },
            { path: 'excursion/:id', element: <ExcursionDetailPage /> },
            { path: 'scene/:excursionId/:sceneId', element: <SceneViewerPage /> },
            {
                path: 'scene/:sceneId',
                element: <SceneViewerPage />,
            },
            {path: 'workspace/:id', element: <WorkspacePage/>},
            { path: 'authors', element: <WorkspacesCatalogPage /> },
            { path: 'author/:id', element: <WorkspacePublicPage /> },
            { path: 'exhibits', element: <ExhibitsCatalogPage /> },
            { path: 'profile', element: <UserProfilePage /> },
            { path: 'create-exhibit', element: <CreateExhibitPage /> },
            { path: 'create-excursion', element: <CreateExcursionPage /> },
            {path: 'edit-excursion/:id', element: <CreateExcursionPage/>},
            { path: 'about', element: <AboutPage /> },
            { path: '*', element: <NotFoundPage /> },

        ],
    },
],
    // {
    //     scrollRestoration: true
    // }
    );