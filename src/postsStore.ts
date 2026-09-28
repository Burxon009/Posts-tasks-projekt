import {create} from 'zustand';

interface Post {
    id: number;
    title: string;
    body: string;
}

interface PostsStore {
    posts: Post[];
    setPosts: (posts: Post[]) => void;
    boards: any;
    setBoards: (boards: any) => void;
    deletedIds: number[];
    addDeletedId: (id: number) => void;
}

export const usePostsStore = create<PostsStore>((set) => ({
    posts: [],
    setPosts: (posts) => set({ posts }),
    boards: null,
    setBoards: (boards) => set({ boards }),
    deletedIds: [],
    addDeletedId: (id) => set((state) => ({ deletedIds: [...state.deletedIds, id] })),
}));

