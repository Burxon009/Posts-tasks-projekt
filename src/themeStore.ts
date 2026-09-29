import {create} from 'zustand';

interface ThemeStore {
    mode: 'dark' | 'light';
    toggleMode: () => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
    mode: localStorage.getItem('theme') === 'light' ? 'light' : 'dark',
    toggleMode: () => set((state) => {
        const mode = state.mode === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', mode);
        return { mode };
    }),
}));
