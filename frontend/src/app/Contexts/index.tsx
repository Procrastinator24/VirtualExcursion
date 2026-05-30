import { AuthProvider, useAuth } from './authContext/AuthContext.tsx';
import { FavouritesProvider, useFavourites } from './favouriteContext/favouriteContext.tsx';
import { PropsWithChildren } from 'react';

export const AppProviders = ({ children }: PropsWithChildren) => {
    return (
        <AuthProvider>
            <FavouritesProvider>
                {children}
            </FavouritesProvider>
        </AuthProvider>
    );
};
export { useAuth, useFavourites };