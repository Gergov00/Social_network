/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserById, putLikeOnComment, getCommentsLikesByCommentId, createComment, getComentsByPostId, getPostLikesByPostId, putLikeOnPost, deleteLikeOnPost, deleteLikeOnComment, deleteComment } from '../Services/Api';
import { usePosts } from '../Context/PostsContext';
import { useUser } from '../Context/UserContext';
import '../Assets/PostsComponent.css'


const Comment = ({ comment, onDelete, onUpdate }) => {
    const { user } = useUser();
    const navigate = useNavigate();

    // Состояние для автора комментария (загружается по comment.userId)
    const [author, setAuthor] = useState(null);
    // Состояние для лайков комментария (объекты типа CommentLike)
    const [commentLikes, setCommentLikes] = useState([]);

    // Загружаем данные автора по userId комментария
    useEffect(() => {
        getUserById(comment.userId)
            .then(setAuthor)
            .catch(err => console.error("Ошибка загрузки автора комментария:", err));
    }, [comment.userId]);

    // Загружаем лайки комментария
    useEffect(() => {
        getCommentsLikesByCommentId(comment.id)
            .then(likes => setCommentLikes(likes))
            .catch(err => console.error("Ошибка загрузки лайков комментария:", err));
    }, [comment.id]);

    // Обработка лайка комментария: если лайк уже поставлен – удаляем его, иначе – ставим лайк
    const handleLike = async () => {
        try {
            const existingLike = commentLikes.find(like => like.userId === user.id);
            if (existingLike) {
                await deleteLikeOnComment(existingLike.id);
                const updatedLikes = commentLikes.filter(like => like.id !== existingLike.id);
                setCommentLikes(updatedLikes);
                onUpdate && onUpdate({ ...comment, CommentLikes: updatedLikes });
            } else {
                const newLike = await putLikeOnComment(comment.id, user.id, new Date().toISOString());
                const updatedLikes = [...commentLikes, newLike];
                setCommentLikes(updatedLikes);
                onUpdate && onUpdate({ ...comment, CommentLikes: updatedLikes });
            }
        } catch (error) {
            console.error("Ошибка при обработке лайка комментария:", error);
        }
    };

    // Удаление комментария, если комментарий принадлежит текущему пользователю
    const handleDelete = async () => {
        try {
            await deleteComment(comment.id);
            onDelete && onDelete(comment.id);
        } catch (error) {
            console.error("Ошибка при удалении комментария:", error);
        }
    };

    return (
        <div className="comment">
            <div className="comment-header" onClick={() => comment.userId !== user.id ? navigate(`/profile/${comment.userId}`) : navigate('/profile')}>
                {author && author.avatarURL && (
                    <img
                        src={author.avatarURL}
                        alt="Аватар автора"
                        className="avatar"
                        style={{ width: 40, height: 40, borderRadius: '50%', marginRight: '8px' }}
                    />
                )}
                <span>{author ? `${author.firstName} ${author.lastName}` : 'Загрузка...'}</span>
            </div>
            <p>{comment.text}</p>
            <div className="comment-actions">
                <button onClick={handleLike}>
                    {commentLikes.some(like => like.userId === user.id)
                        ? 'Отменить лайк'
                        : 'Лайк'}
                </button>
                <span>{commentLikes.length} лайков</span>
                {comment.userId === user.id && (
                    <button onClick={handleDelete} style={{ marginLeft: '10px' }}>
                        Удалить
                    </button>
                )}
            </div>
        </div>
    );
};


const CommentsSection = ({ postId, userId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');


    useEffect(() => {
        getComentsByPostId(postId)
            .then(comments => setComments(comments))
            .catch(err => console.error(err));
    }, [postId]);

    const onAddComment = async () => {
        if (!newComment.trim()) return;
        try {
            const createdComment = await createComment(
                postId,
                userId,
                newComment,
                new Date().toISOString()
            );
            // Обновляем состояние комментариев, добавляя созданный комментарий
            setComments([...comments, createdComment]);
            setNewComment('');
        } catch (error) {
            console.error("Ошибка при создании комментария:", error);
        }
    };

    const onDeleteComment = (commentId) => {
        setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
    };


    return (
        <div className="comments-section">
            {comments && comments.map((comment, index) => (
                <Comment comment={comment} key={comment.id} onDelete={onDeleteComment} />
            ))}
            <div className="new-comment">
                <input
                    type="text"
                    placeholder="Напишите комментарий..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                />
                <button onClick={onAddComment}>Отправить</button>
            </div>
        </div>
    );
};


export const Post = ({ post, onUpdate }) => {
    const { removePost } = usePosts();
    const { user } = useUser();
    const navigate = useNavigate();

    const [postComments, setPostComments] = useState([]);
    const [postLikes, setPostLikes] = useState([]);
    const [author, setAuthor] = useState(null);
    const [showComments, setShowComments] = useState(false);

    useEffect(() => {
        getUserById(post.userId)
            .then(setAuthor)
            .catch(console.error);
    }, [post.userId]);


    useEffect(() => {
        getComentsByPostId(post.id)
            .then(comments => setPostComments(comments))
            .catch(err => console.error(err));
    }, [post.id]);

    useEffect(() => {
        getPostLikesByPostId(post.id)
            .then(likes => setPostLikes(likes))
            .catch(err => console.error(err));
    }, [post.id]);

    const handleLike = async () => {
        try {
            const existingLike = postLikes.find(like => like.userId === user.id);
            if (existingLike) {
                await deleteLikeOnPost(existingLike.id);
                const updatedLikes = postLikes.filter(like => like.id !== existingLike.id);
                setPostLikes(updatedLikes);
                const updatedPost = { ...post, postLikes: updatedLikes };
                onUpdate && onUpdate(updatedPost);
                return;
            }
            const newLike = await putLikeOnPost(post.id, user.id, new Date().toISOString());
            const updatedLikes = [...postLikes, newLike];
            setPostLikes(updatedLikes);
            const updatedPost = { ...post, postLikes: updatedLikes };
            onUpdate && onUpdate(updatedPost);
        } catch (err) {
            console.error(err);
        }
    };

    const toggleComments = () => {
        setShowComments(!showComments);
    };


    return (
        <div className="post">
            <div className="post-header">
                <div className="user-info" onClick={() => post.userId !== user.id ? navigate(`/profile/${post.userId}`) : navigate('/profile')}>
                    {author && author.avatarURL && (
                        <img
                            src={author.avatarURL}
                            alt="Аватар пользователя"
                            className="avatar"
                        />
                    )}
                    <h3>{author ? `${author.firstName} ${author.lastName}` : 'Загрузка...'}</h3>
                </div>
                <span>{new Date(post.createdAt).toLocaleString()}</span>
            </div>
            <div className="post-content">
                <p>{post.content}</p>
                {post.photoUrl && <img src={post.photoUrl} alt="Пост" />}
            </div>
            <div className="post-actions">
                <button onClick={handleLike}>
                    {postLikes.some(like => like.userId === user.id) ? 'Отменить лайк' : 'Лайк'}
                </button>
                <span>{postLikes?.length || 0} лайков</span>
                <button onClick={toggleComments}>Комментировать</button>
                <span>{postComments?.length || 0} комментариев</span>
                {post.userId === user.id && (
                    <button onClick={() => removePost(post.id)}>Удалить</button>
                )}
            </div>
            {showComments && <CommentsSection postId={post.id} userId={user.id} />}
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
