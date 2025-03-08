import React, { useState, useEffect } from 'react';
import { getPosts, createPost } from '../Services/Api';

const Post = ({ post }) => {
    return (
        <div className="post">
            <div className="post-header">
                <h3>{post.user?.firstName} {post.user?.lastName}</h3>
                <span>{new Date(post.createdAt).toLocaleString()}</span>
            </div>
            <div className="post-content">
                <p>{post.content}</p>
                {post.photoUrl && <img src={post.photoUrl} alt="Пост" />}
            </div>
            <div className="post-actions">
                <button>Лайк</button>
                <span>{post.postLikes?.length || 0} лайков</span>
                <button>Комментировать</button>
                <span>{post.comments?.length || 0} комментариев</span>
            </div>
        </div>
    );
};

const NewPostForm = ({ onPostCreated }) => {
    const [content, setContent] = useState('');
    const [photo, setPhoto] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handlePhotoChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setPhoto(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            let photoUrl = '';
            if (photo) {
                const currentUser = JSON.parse(localStorage.getItem("user"));
                //const uploadedPhoto = await uploadUserPhoto(currentUser.id, photo);
                //photoUrl = uploadedPhoto.photoURL; 
            }
            const currentUser = JSON.parse(localStorage.getItem("user"));
            const newPostData = {
                userId: currentUser.id,
                content,
                photoUrl,
                createdAt: new Date().toISOString(),
            };
            const newPost = await createPost(newPostData);
            onPostCreated(newPost);
            setContent('');
            setPhoto(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="new-post-form">
            <textarea
                placeholder="Что у вас нового?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
            />
            <input type="file" accept="image/*" onChange={handlePhotoChange} />
            {error && <p className="error">{error}</p>}
            <button type="submit" disabled={loading}>
                {loading ? 'Публикация...' : 'Опубликовать'}
            </button>
        </form>
    );
};

const PostsComponent = () => {
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const data = await getPosts();
            data.sort(() => Math.random() - 0.5);
            setPosts(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handlePostCreated = (newPost) => {
        setPosts(prevPosts => [newPost, ...prevPosts]);
    };

    return (
        <div className="posts-component">
            <NewPostForm onPostCreated={handlePostCreated} />
            {loading && <p>Загрузка постов...</p>}
            {error && <p className="error">{error}</p>}
            <div className="posts-list">
                {posts.map(post => (
                    <Post key={post.id} post={post} />
                ))}
            </div>
        </div>
    );
};

export default PostsComponent;
