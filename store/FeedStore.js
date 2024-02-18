import { create } from "zustand";

const useFeedStore = create((set) => ({
  posts: [],
  createPost: (post) =>
    set((state) => ({
      posts: [post, ...state.posts],
    })),
  setPosts: (posts) => set({ posts }) 
}));

export default useFeedStore;
