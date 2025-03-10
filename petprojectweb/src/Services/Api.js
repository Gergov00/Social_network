
const API_BASE_URL = 'http://www.gergovzaurbek.online/api';

export async function login(email, password) {
    const response = await fetch(`${API_BASE_URL}/Auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
    }
    return await response.json();
}

export async function register(firstName, lastName, email, password) {
    const response = await fetch(`${API_BASE_URL}/Auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password }),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
    }
    return await response.json();
}

export async function createComment(postId, userId, text, createdAt) {
    const response = await fetch(`${API_BASE_URL}/Comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, userId, text, createdAt }),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
    }
    return await response.json();
}

export async function deleteComment(commentId) {
    const response = await fetch(`${API_BASE_URL}/Comments/${commentId}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
    }
    return true;
}

export async function putLikeOnComment(commentId, userId, createdAt) {
    const response = await fetch(`${API_BASE_URL}/CommentLikes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentId, userId, createdAt }),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
    }
    return await response.json();
}

export async function deleteLikeOnComment(likeId) {
    const response = await fetch(`${API_BASE_URL}/CommentLikes/${likeId}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
    }
    return true;
}

export async function putLikeOnPost(postId, userId, createdAt) {
    const response = await fetch(`${API_BASE_URL}/PostLikes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, userId, createdAt }),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
    }
    return await response.json();
}

export async function deleteLikeOnPost(likeId) {
    const response = await fetch(`${API_BASE_URL}/PostLikes/${likeId}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
    }
    return true;
}

export async function updateProfile(userId, firstName, lastName, avatarFile) {
    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    if (avatarFile) {
        formData.append("avatar", avatarFile);
    }

    const response = await fetch(`${API_BASE_URL}/Users/UpdateProfile`, {
        method: 'PUT',
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка обновления профиля');
    }
    return await response.json();
}

export async function getUserPhotos(userId) {
    const response = await fetch(`${ API_BASE_URL }/UserPhotos/${userId}`);
    if (!response.ok) {
        throw new Error('Ошибка загрузки фотографий');
    }
    const data = await response.json();
    console.log(response);
    return data.map(photo => ({
        id: photo.id,
        url: photo.photoURL,
        createdAt: photo.createdAt,
    }));
}

export async function uploadUserPhoto(userId, file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId);

    const response = await fetch(`${API_BASE_URL }/UserPhotos/upload`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error('Ошибка загрузки фотографии');
    }

    return await response.json();
}


export async function getPosts() {
    const response = await fetch(`${API_BASE_URL}/Posts`);
    if (!response.ok) {
        throw new Error('Ошибка загрузки постов');
    }
    return await response.json();
}


export async function createPost(post, file) {
    const formData = new FormData();
    formData.append("userId", post.userId);
    formData.append("content", post.content);
    formData.append("createdAt", post.createdAt);
    
    formData.append("file", file);
    console.log(file);

    const response = await fetch(`${API_BASE_URL}/Posts/create`, {
        method: 'POST',
        body: formData,
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка создания поста');
    }
    return await response.json();
}

export async function getPostsByUser(userId) {
    const response = await fetch(`${API_BASE_URL}/Posts/user/${userId}`);
    if (!response.ok) {
        throw new Error('Ошибка заргузки постов');
    }
    return await response.json();
}

export async function deletePost(postId) {
    const response = await fetch(`${API_BASE_URL}/Posts/delete/${postId}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка удаления поста');
    }
    return true;
}

export async function deletePhoto(photoId) {
    const response = await fetch(`${API_BASE_URL}/UserPhotos/${photoId}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error(response.json().message || 'Ошибка удаление');
    }
    return true;
}

export async function getUserById(userId) {
    const response = await fetch(`${API_BASE_URL}/Users/${userId}`, {
        method: 'GET',
    });
    if (!response.ok) {
        throw new Error(response.json().message || 'Ошибка получение данных пользователя');
    }
    return await response.json();
}

export async function getComentsByPostId(postId) {
    const response = await fetch(`${API_BASE_URL}/Comments/comments/${postId}`)
    if (!response.ok) {
        throw new Error(response.json().message || 'Ошибка получение данных пользователя');
    }
    return await response.json();
}


export async function getPostLikesByPostId(postId) {
    const response = await fetch(`${API_BASE_URL}/PostLikes/likes/${postId}`)
    if (!response.ok) {
        throw new Error(response.json().message || 'Ошибка получение данных пользователя');
    }
    return await response.json();
}

export async function getCommentsLikesByCommentId(commentId) {
    const response = await fetch(`${API_BASE_URL}/CommentLikes/likes/${commentId}`)
    if (!response.ok) {
        throw new Error(response.json().message || 'Ошибка получение данных пользователя');
    }
    return await response.json();
}