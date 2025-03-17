
//const API_BASE_URL = 'http://gergovzaurbek.online/api';
const API_BASE_URL = 'https://localhost:32769/api';

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

export async function updateProfile(userId, firstName, lastName, avatarFile, coverFile, about, removeAvatar, removeCover) {
    const formData = new FormData();
    formData.append("UserId", userId);
    formData.append("FirstName", firstName);
    formData.append("LastName", lastName);
    formData.append("About", about);
    formData.append("RemoveAvatar", removeAvatar);
    formData.append("RemoveCover", removeCover);
    if (avatarFile) {
        formData.append("Avatar", avatarFile);
    }
    if (coverFile) {
        formData.append("Cover", coverFile);
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

export async function searchUsers(query) {
    const response = await fetch(`${API_BASE_URL}/Users/search?query=${encodeURIComponent(query)}`);
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка поиска пользователей');
    }
    return await response.json();
}



export async function sendFriendRequest(userId, friendId) {
    const response = await fetch(`${API_BASE_URL}/Friendships/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, friendId })
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка отправки запроса в друзья');
    }
    return await response.json();
}

export async function sendMessage(senderId, receiverId, content) {
    const response = await fetch(`${API_BASE_URL}/Messages/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senderId, receiverId, content })
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка отправки сообщения');
    }
    return await response.json();
}

export async function getConversation(userId, friendId) {
    const response = await fetch(`${API_BASE_URL}/Messages/conversation?userId=${userId}&friendId=${friendId}`);
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка получения переписки');
    }
    return await response.json();
}

export async function getFriendRequests(userId) {
    const response = await fetch(`${API_BASE_URL}/Friendships/${userId}`)
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка получения запросов');
    }
    return await response.json();
}

export async function acceptFriendRequest(id) {
    const response = await fetch(`${API_BASE_URL}/Friendships/accept/${id}`, {
        method: 'POST',
    });
    if (!response.ok) {
        const errorData = await response
        throw new Error(errorData.message || 'Ошибка принятие запроса');
    }
    return await response.json();
}


export async function getFriendRequest(userId, friendId) {
    const response = await fetch(`${API_BASE_URL}/Friendships/check?senderId=${userId}&receiverId=${friendId}`);
    if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Ошибка получения запросов');
    }
    const text = await response.text();
    return text ? JSON.parse(text) : null;
}


export async function cancelFriendRequest(id) {
    const response = await fetch(`${API_BASE_URL}/Friendships/remove/${id}`, {
        method: 'DELETE',
    })
    if (!response.ok) {
        const errorData = await response;
        throw new Error(errorData.message || 'Ошибка получения запросов');
    }
    return await response;
}

export async function removeFriendship(id) {
    const response = await fetch(`${API_BASE_URL}/Friendships/remove/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        const errorData = await response;
        throw new Error(errorData.message || 'Ошибка удаления дружбы');
    }
    return await response;
}


export async function getFriends(userId) {
    const response = await fetch(`${API_BASE_URL}/Friendships/friends?userId=${userId}`);
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка загрузки друзей');
    }
    return await response.json();
}


export async function getChats(userId) {
    const response = await fetch(`${API_BASE_URL}/Messages/chats?userId=${userId}`);
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка загрузки чатов');
    }
    return await response.json();
}
