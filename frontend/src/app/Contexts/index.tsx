import { AuthProvider, useAuth } from './authContext/AuthContext.tsx';
import { FavouritesProvider, useFavourites } from './favouriteContext/favouriteContext.tsx';
import { PropsWithChildren } from 'react';
import {ModalProvider} from "./CreateWorkspaceModalContext/ModalContext.tsx";

export const AppProviders = ({ children }: PropsWithChildren) => {
    return (
        <AuthProvider>
            <FavouritesProvider>
                <ModalProvider>
                {children}
                </ModalProvider>
            </FavouritesProvider>
        </AuthProvider>
    );
};
export { useAuth, useFavourites };