import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Assets/ProfilePage.css';
import { getUserPhotos, uploadUserPhoto } from '../Services/Api';

const ProfilePage = () => {
    const navigate = useNavigate();

    function safeParse(jsonString) {
        try {
            return JSON.parse(jsonString);
        } catch (error) {
            console.error("Ошибка парсинга JSON:", error);
            return null;
        }
    }

    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? safeParse(savedUser) : null;
    });

    // Состояние для отслеживания выбранного пункта меню
    const [activeTab, setActiveTab] = useState('about');

    // Состояния для загрузки фотографий
    const [photos, setPhotos] = useState([]);
    const [photosLoading, setPhotosLoading] = useState(false);
    const [photosError, setPhotosError] = useState(null);

    // Состояния для загрузки новой фотографии
    const [uploadPhotoFile, setUploadPhotoFile] = useState(null);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [uploadError, setUploadError] = useState(null);

    useEffect(() => {
        if (!user) {
            console.log("Нет сохраненных данных пользователя");
            navigate('/auth');
        }
    }, [user, navigate]);

    // Загружаем фотографии, когда выбрана вкладка "photos"
    useEffect(() => {
        if (activeTab === 'photos' && user) {
            setPhotosLoading(true);
            getUserPhotos(user.id)
                .then(data => {
                    setPhotos(data);
                    setPhotosLoading(false);
                })
                .catch(err => {
                    setPhotosError(err);
                    setPhotosLoading(false);
                });
        }
    }, [activeTab, user]);

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate('/auth');
    };

    // Обработчик выбора файла
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setUploadPhotoFile(e.target.files[0]);
        }
    };

    // Обработчик загрузки фотографии
    const handlePhotoUpload = async () => {
        if (!uploadPhotoFile) return;
        setUploadLoading(true);
        setUploadError(null);
        try {
            const newPhoto = await uploadUserPhoto(user.id, uploadPhotoFile);
            // Добавляем новую фотографию в начало списка
            setPhotos(prevPhotos => [newPhoto, ...prevPhotos]);
            setUploadPhotoFile(null);
        } catch (error) {
            setUploadError(error.message);
        } finally {
            setUploadLoading(false);
        }
    };

    if (!user) {
        return <p>Пользователь не авторизован. Пожалуйста, выполните вход.</p>;
    }

    // Функция для отображения контента в зависимости от выбранной вкладки
    const renderContent = () => {
        switch (activeTab) {
            case 'about':
                return (
                    <>
                        <h2>О себе</h2>
                        <p>{user.about || 'Информация отсутствует'}</p>
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
                        <div className="upload-photo">
                            <input
                                type="file"
                                onChange={handleFileChange}
                                accept="image/*"
                            />
                            <button
                                onClick={handlePhotoUpload}
                                disabled={uploadLoading}
                            >
                                {uploadLoading ? 'Загрузка...' : 'Загрузить фотографию'}
                            </button>
                            {uploadError && <p className="error">Ошибка загрузки: {uploadError}</p>}
                        </div>
                        {photosLoading && <p>Загрузка фотографий...</p>}
                        {photosError && <p>Ошибка загрузки: {photosError.message}</p>}
                        <div className="photos-gallery">
                            {photos.map((photo) => (
                                <img
                                    key={photo.id}
                                    src={photo.url}
                                    alt={photo.description || 'Фотография'}
                                    className="photo-item"
                                />
                            ))}
                        </div>
                    </>
                );
            case 'videos':
                return (
                    <>
                        <h2>Видео</h2>
                        <p>Видео отсутствуют.</p>
                    </>
                );
            case 'messages':
                return (
                    <>
                        <h2>Сообщения</h2>
                        <p>Сообщения отсутствуют.</p>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="profile-container">
            <div className="profile-cover">
                <img
                    src={user.cover || 'https://sun9-33.userapi.com/impf/Ce-dT6lYDP47lpGzYqYOc0gq6ymBwiQrs9mXQw/UY7k4fz4OA0.jpg?size=1080x540&quality=96&crop=0,282,1080,540&sign=946773e0bd7b110559a5be6d138955ae&c_uniq_tag=C8OiUIWg_d6fe85Csb3efUS3CWNvKXmzv5ZsLqQ9ghM&type=helpers'}
                    alt="Cover"
                    className="cover-photo"
                />
            </div>
            <div className="profile-info">
                <div className="avatar">
                    <img
                        src={user.avatarURL}
                        alt="Avatar"
                    />
                </div>
                <div className="user-details">
                    <h1>{user.firstName} {user.lastName}</h1>
                    <button onClick={() => navigate('/edit-profile')}>
                        Редактировать профиль
                    </button>
                    <button onClick={handleLogout} style={{ marginLeft: '10px' }}>
                        Выйти
                    </button>
                    <button onClick={() => navigate('/newsfeed')} style={{ marginLeft: '10px' }}>
                        Новости
                    </button>
                </div>
            </div>
            <div className="profile-content">
                <div className="sidebar">
                    <ul className="menu">
                        <li
                            onClick={() => setActiveTab('about')}
                            className={activeTab === 'about' ? 'active' : ''}
                        >
                            О себе
                        </li>
                        <li
                            onClick={() => setActiveTab('friends')}
                            className={activeTab === 'friends' ? 'active' : ''}
                        >
                            Друзья
                        </li>
                        <li
                            onClick={() => setActiveTab('photos')}
                            className={activeTab === 'photos' ? 'active' : ''}
                        >
                            Фотографии
                        </li>
                        <li
                            onClick={() => setActiveTab('videos')}
                            className={activeTab === 'videos' ? 'active' : ''}
                        >
                            Видео
                        </li>
                        <li
                            onClick={() => setActiveTab('messages')}
                            className={activeTab === 'messages' ? 'active' : ''}
                        >
                            Сообщения
                        </li>
                    </ul>
                </div>
                <div className="main-content">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
