import React, { useState, useEffect } from 'react';
import PostsComponent from './PostsComponent';

const ProfileContent = ({ activeTab, profileUser, currentUser }) => {
    const [photos, setPhotos] = useState([]);
    const [photosLoading, setPhotosLoading] = useState(false);
    const [photosError, setPhotosError] = useState(null);
    const [uploadPhotoFile, setUploadPhotoFile] = useState(null);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [uploadError, setUploadError] = useState(null);

    useEffect(() => {
        if (activeTab === 'photos' && profileUser) {
            setPhotosLoading(true);
            // Функция getUserPhotos должна быть импортирована внутри компонента, либо передана как prop
            import('../Services/Api').then(({ getUserPhotos }) => {
                getUserPhotos(profileUser.id)
                    .then(data => {
                        setPhotos(data);
                        setPhotosLoading(false);
                    })
                    .catch(err => {
                        setPhotos([]);
                        setPhotosError(err);
                        setPhotosLoading(false);
                    });
            });
        }
    }, [activeTab, profileUser]);

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
            const { uploadUserPhoto } = await import('../Services/Api');
            const newPhoto = await uploadUserPhoto(profileUser.id, uploadPhotoFile);
            setPhotos(prevPhotos => [{ id: newPhoto.id, url: newPhoto.photoURL }, ...prevPhotos]);
            setUploadPhotoFile(null);
        } catch (error) {
            setUploadError(error.message);
        } finally {
            setUploadLoading(false);
        }
    };

    const handlePhotoDelete = async (photo) => {
        try {
            const { deletePhoto } = await import('../Services/Api');
            await deletePhoto(photo.id);
            setPhotos(prevPhotos => prevPhotos.filter(p => p.id !== photo.id));
        } catch (error) {
            console.error("Ошибка удаления фотографии:", error);
        }
    };

    if (activeTab === 'about') {
        return (
            <div className="main-content">
                <h2>О себе</h2>
                <p>{profileUser?.about || 'Информация отсутствует'}</p>
            </div>
        );
    } else if (activeTab === 'photos') {
        return (
            <div className="main-content">
                <h2>Фотографии</h2>
                {currentUser?.id === profileUser.id && (
                    <div className="upload-photo">
                        <input type="file" onChange={handleFileChange} accept="image/*" />
                        <button onClick={handlePhotoUpload} disabled={uploadLoading}>
                            {uploadLoading ? 'Загрузка...' : 'Загрузить фотографию'}
                        </button>
                        {uploadError && <p className="error">Ошибка загрузки: {uploadError}</p>}
                    </div>
                )}
                {photosLoading && <p>Загрузка фотографий...</p>}
                {photosError && <p className="error">Ошибка загрузки: {photosError.message}</p>}
                <div className="photos-gallery">
                    {photos.map(photo => (
                        <React.Fragment key={photo.id}>
                            <img src={photo.url} alt="Фотография" className="photo-item" />
                            {currentUser?.id === profileUser.id && (
                                <button onClick={() => handlePhotoDelete(photo)}>Удалить</button>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        );
    } else if (activeTab === 'posts') {
        return (
            <div className="main-content">
                <PostsComponent userId={profileUser.id} />
            </div>
        );
    }
    return null;
};

export default ProfileContent;
