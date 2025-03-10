import React, { useState, useEffect } from 'react';
import { usePosts } from '../Context/PostsContext';
import { useUser } from '../Context/UserContext';
import { useNavigate } from 'react-router-dom';
import { getUserById } from '../Services/Api';
import '../Assets/PostsComponent.css';

export const Post = ({ post }) => {
    const { removePost } = usePosts();
    const { user } = useUser();
    const navigate = useNavigate();

    const [author, setAuthor] = useState(null); // Данные о создателе поста

    useEffect(() => {
        getUserById(post.userId).then(setAuthor).catch(console.error);
    }, [post.userId]);


    return (
        <div className="post">
            <div className="post-header">
                <div className="user-info" onClick={() => post.userId !== user.id ? navigate(`/profile/${post.userId}`) : navigate('/profile')}>
                    {author && author?.avatarURL && (
                        <img
                            src={author.avatarURL}
                            alt="Аватар пользователя"
                            className="avatar"
                        />
                    )}
                    <h3>
                        {author ? `${author.firstName} ${author.lastName}` : 'Загрузка...'}
                    </h3>
                </div>

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
                {post.userId === user.id && <button onClick={() => removePost(post.id)}>Удалить</button>}

            </div>
        </div>
    );
};

export const NewPostForm = () => {
    const { addPost } = usePosts();
    const { user } = useUser();
    const [content, setContent] = React.useState('');
    const [photo, setPhoto] = React.useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await addPost({ userId: user.id, content, createdAt: new Date().toISOString() }, photo);
        setContent('');
        setPhoto(null);
    };

    return (
        <form onSubmit={handleSubmit} className="new-post-form">
            
            <textarea
                placeholder="Что у вас нового?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
            />
            <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files[0])} />
            <button type="submit">
                Опубликовать
            </button>
        </form>
    );
};

const PostsComponent = ({ userId }) => {
    const { posts, loading, fetchPosts } = usePosts();
    useEffect(() => {
        fetchPosts(userId);
    }, [userId]);

    return (
        <div className="posts-component">
            {!userId && <NewPostForm />} 
            {loading && <p>Загрузка постов...</p>}
            <div className="post-list">
                {posts.map((post) => (
                    <Post key={post.id} post={post} />
                ))}
            </div>
        </div>
    );
};

export default PostsComponent;
