import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../Assets/ProfilePage.css';
import { getUserPhotos, uploadUserPhoto, getPostsByUser, deletePhoto, getUserById } from '../Services/Api';
import PostsComponent from '../Components/PostsComponent';

const ProfilePage = () => {
    const navigate = useNavigate();
    const { userId: routeUserId } = useParams();
    const [viewProfile, setViewProfile] = useState(false);
    const safeParse = (jsonString) => {
        try {
            return JSON.parse(jsonString);
        } catch (error) {
            console.error("Ошибка парсинга JSON:", error);
            return null;
        }
    };

    const [currentUser, setCurrentUser] = useState(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? safeParse(savedUser) : null;
    });

    const [profileUser, setProfileUser] = useState(null);

    const [activeTab, setActiveTab] = useState('about');
    const [photos, setPhotos] = useState([]);
    const [photosLoading, setPhotosLoading] = useState(false);
    const [photosError, setPhotosError] = useState(null);
    const [uploadPhotoFile, setUploadPhotoFile] = useState(null);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [uploadError, setUploadError] = useState(null);
    const [postsLoading, setPostsLoading] = useState(null);
    const [posts, setPosts] = useState([]);
    const [postsError, setPostsError] = useState(null);

    useEffect(() => {
        if (!currentUser) {
            navigate('/auth');
        }
    }, [currentUser, navigate]);

    useEffect(() => {
        if (routeUserId) {
            setViewProfile(true);
            getUserById(routeUserId)
                .then(data => setProfileUser(data))
                .catch(err => console.error(err));
        } else {
            setProfileUser(currentUser);
        }
    }, [routeUserId, currentUser]);

    useEffect(() => {
        if (activeTab === 'photos' && profileUser) {
            setPhotosLoading(true);
            getUserPhotos(profileUser.id)
                .then(data => {
                    setPhotos(data);
                    setPhotosLoading(false);
                })
                .catch(err => {
                    setPhotosError(err);
                    setPhotosLoading(false);
                });
        }
    }, [activeTab, profileUser]);

    useEffect(() => {
        if (activeTab === 'posts' && profileUser) {
            setPostsLoading(true);
            getPostsByUser(profileUser.id)
                .then(data => {
                    setPosts(data);
                    setPostsLoading(false);
                })
                .catch(err => {
                    setPostsError(err);
                    setPostsLoading(false);
                });
        }
    }, [activeTab, profileUser]);

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate('/auth');
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setUploadPhotoFile(e.target.files[0]);
        }
    };

    const handlePhotoUpload = async () => {
        if (!uploadPhotoFile) return;
        setUploadLoading(true);
        setUploadError(null);
        try {
            const newPhoto = await uploadUserPhoto(profileUser.id, uploadPhotoFile);
            const formattedPhoto = {
                id: newPhoto.id,
                url: newPhoto.photoURL,
                createdAt: newPhoto.createdAt,
            };
            setPhotos(prevPhotos => [formattedPhoto, ...prevPhotos]);
            setUploadPhotoFile(null);
        } catch (error) {
            setUploadError(error.message);
        } finally {
            setUploadLoading(false);
        }
    };

    if (!profileUser) {
        return <p>Загрузка профиля...</p>;
    }

    const handlePhotoDelete = async (photo) => {
        try {
            await deletePhoto(photo.id);
            setPhotos(prevPhotos => prevPhotos.filter(p => p.id !== photo.id));
        } catch (error) {
            console.error("Ошибка удаления фотографии:", error);
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'about':
                return (
                    <>
                        <h2>О себе</h2>
                        <p>{profileUser.about || 'Информация отсутствует'}</p>
                    </>
                );
            case 'friends':
                return (
                    <>
                        <h2>Друзья</h2>
                        <p>Список друзей отсутствует.</p>
                    </>
                );
            case 'photos':
                return (
                    <>
                        <h2>Фотографии</h2>
                        {currentUser && currentUser.id === profileUser.id && (
                            <div className="upload-photo">
                                <input type="file" onChange={handleFileChange} accept="image/*" />
                                <button onClick={handlePhotoUpload} disabled={uploadLoading}>
                                    {uploadLoading ? 'Загрузка...' : 'Загрузить фотографию'}
                                </button>
                                {uploadError && <p className="error">Ошибка загрузки: {uploadError}</p>}
                            </div>
                        )}
                        {photosLoading && <p>Загрузка фотографий...</p>}
                        {photosError && <p>Ошибка загрузки: {photosError.message}</p>}
                        <div className="photos-gallery">
                            {photos.map(photo => (
                                <React.Fragment key={photo.id}>
                                    <img src={photo.url} alt={photo.description || 'Фотография'} className="photo-item" />
                                    {currentUser && currentUser.id === profileUser.id && (
                                        <button onClick={() => handlePhotoDelete(photo)}>Удалить</button>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </>
                );
            case 'posts':
                return <PostsComponent userId={currentUser.id} viewProfile={viewProfile} />;
            default:
                return null;
        }
    };

    return (
        <div className="profile-container">
            <div className="profile-cover">
                <img
                    src={profileUser.cover || 'https://sun9-33.userapi.com/impf/Ce-dT6lYDP47lpGzYqYOc0gq6ymBwiQrs9mXQw/UY7k4fz4OA0.jpg?size=1080x540&quality=96&crop=0,282,1080,540&sign=946773e0bd7b110559a5be6d138955ae&c_uniq_tag=C8OiUIWg_d6fe85Csb3efUS3CWNvKXmzv5ZsLqQ9ghM&type=helpers'}
                    alt="Cover"
                    className="cover-photo"
                />
            </div>
            <div className="profile-info">
                <div className="avatar">
                    <img src={profileUser.avatarURL} alt="Avatar" />
                </div>
                <div className="user-details">
                    <h1>{profileUser.firstName} {profileUser.lastName}</h1>
                    {currentUser && currentUser.id === profileUser.id &&
                        <>
                            <button onClick={() => navigate('/edit-profile')}>Редактировать профиль</button>
                            <button onClick={handleLogout} style={{ marginLeft: '10px' }}>Выйти</button>
                        </>
                    }
                </div>
            </div>
            <div className="profile-content">
                <div className="sidebar">
                    <ul className="menu">
                        <li onClick={() => setActiveTab('about')} className={activeTab === 'about' ? 'active' : ''}>О себе</li>
                        <li onClick={() => setActiveTab('friends')} className={activeTab === 'friends' ? 'active' : ''}>Друзья</li>
                        <li onClick={() => setActiveTab('photos')} className={activeTab === 'photos' ? 'active' : ''}>Фотографии</li>
                        <li onClick={() => setActiveTab('posts')} className={activeTab === 'posts' ? 'active' : ''}>Посты</li>
                    </ul>
                </div>
                <div className="main-content">{renderContent()}</div>
            </div>
        </div>
    );
};

export default ProfilePage;
