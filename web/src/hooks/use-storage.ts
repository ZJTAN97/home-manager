import { useLocalStorage } from '@mantine/hooks';
import type { ExpiryItem, Chore, Appliance } from '../types';

export const useExpiryItems = () => {
    return useLocalStorage<ExpiryItem[]>({
        key: 'expiry-items',
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
