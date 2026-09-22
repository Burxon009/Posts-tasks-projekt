import {create} from 'zustand';

interface Post {
    id: number;
    title: string;
    body: string;
}

interface PostsStore {
    posts: Post[];
    setPosts: (posts: Post[]) => void;
}

export const usePostsStore = create<PostsStore>((set) => ({
    posts: [],
    setPosts: (posts) => set({ posts }),
}));