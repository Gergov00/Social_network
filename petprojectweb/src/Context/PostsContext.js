import { createContext, useContext, useState, useEffect } from "react";
import { getPosts, createPost, deletePost, getPostsByUser } from "../Services/Api";

const PostsContext = createContext(null);

export const PostsProvider = ({ children }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchPosts = async (userId = null) => {
        setLoading(true);
        try {
            const data = userId ? await getPostsByUser(userId) : await getPosts();
            setPosts(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const addPost = async (postData, photo) => {
        try {
            const newPost = await createPost(postData, photo);
            setPosts((prev) => [newPost, ...prev]);
        } catch (err) {
            setError(err.message);
        }
    };

    const removePost = async (postId) => {
        try {
            await deletePost(postId);
            setPosts((prev) => prev.filter((post) => post.id !== postId));
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <PostsContext.Provider value={{ posts, loading, error, fetchPosts, addPost, removePost }}>
            {children}
        </PostsContext.Provider>
    );
};

export const usePosts = () => useContext(PostsContext);
