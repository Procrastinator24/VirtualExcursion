import React, { createContext, useContext, useState, useEffect, PropsWithChildren } from 'react';
import { favouriteApi } from '@entities/favourite/api/favourite.api';
import type { ExcursionResponse } from '@entities/excursion';

type FavouritesContextType = {
    favourites: ExcursionResponse[];
    favouriteIds: number[];
    loading: boolean;
    addFavourite: (excursionId: number) => Promise<void>;
    removeFavourite: (excursionId: number) => Promise<void>;
    toggleFavourite: (excursionId: number) => Promise<void>;
    isFavourite: (excursionId: number) => boolean;
};

const FavouritesContext = createContext<FavouritesContextType | null>(null);

export const FavouritesProvider = ({ children }: PropsWithChildren) => {
    const [favourites, setFavourites] = useState<ExcursionResponse[]>([]);
    const [favouriteIds, setFavouriteIds] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);

    // Загрузка избранного при монтировании
    useEffect(() => {
        loadFavourites();
    }, []);

    const loadFavourites = async () => {
        try {
            setLoading(true);
            const response = await favouriteApi.getAll();
            setFavourites(response.data);
            setFavouriteIds(response.data.map(f => f.id));
        } catch (error) {
            console.error('Failed to load favourites:', error);
        } finally {
            setLoading(false);
        }
    };

    const addFavourite = async (excursionId: number) => {
        try {
            await favouriteApi.add({ excursionId });
            await loadFavourites(); // перезагружаем список
        } catch (error) {
            console.error('Failed to add favourite:', error);
        }
    };

    const removeFavourite = async (excursionId: number) => {
        try {
            await favouriteApi.removeByExcursion(excursionId);
            setFavourites(prev => prev.filter(f => f.id !== excursionId));
            setFavouriteIds(prev => prev.filter(id => id !== excursionId));
        } catch (error) {
            console.error('Failed to remove favourite:', error);
        }
    };

    const toggleFavourite = async (excursionId: number) => {
        if (isFavourite(excursionId)) {
            await removeFavourite(excursionId);
        } else {
            await addFavourite(excursionId);
        }
    };

    const isFavourite = (excursionId: number): boolean => {
        return favouriteIds.includes(excursionId);
    };

    return (
        <FavouritesContext.Provider value={{
            favourites,
            favouriteIds,
            loading,
            addFavourite,
            removeFavourite,
            toggleFavourite,
            isFavourite,
        }}>
            {children}
        </FavouritesContext.Provider>
    );
};

export const useFavourites = (): FavouritesContextType => {
    const context = useContext(FavouritesContext);
    if (!context) {
        throw new Error('useFavourites must be used within FavouritesProvider');
    }
    return context;
};