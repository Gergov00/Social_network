
const API_BASE_URL = 'http://www.gergovzaurbek.online/api';

export async function login(email, password) {
    const response = await fetch(`${API_BASE_URL}/Auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '������ �����������');
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
        throw new Error(errorData.message || '������ �����������');
    }
    return await response.json();
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