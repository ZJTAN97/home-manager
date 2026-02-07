import { useLocalStorage } from '@mantine/hooks';
import type { FoodItem, Chore, Appliance } from '../types';

export const useFoodItems = () => {
    return useLocalStorage<FoodItem[]>({
        key: 'food-items',
        defaultValue: [],
        getInitialValueInEffect: true,
    });
};

export const useChores = () => {
    return useLocalStorage<Chore[]>({
        key: 'chores',
        defaultValue: [],
        getInitialValueInEffect: true,
    });
};

export const useAppliances = () => {
    return useLocalStorage<Appliance[]>({
        key: 'appliances',
        defaultValue: [],
        getInitialValueInEffect: true,
    });
};
