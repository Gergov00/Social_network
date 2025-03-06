// src/services/api.js

const API_BASE_URL = 'http://www.gergovzaurbek.online/api'; // Замените на адрес вашего API

// Функция для входа
export async function login(email, password) {
    const response = await fetch(`${API_BASE_URL}/Auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка авторизации');
    }
    return await response.json();
}

// Функция для регистрации
export async function register(firstName, lastName, email, password) {
    const response = await fetch(`${API_BASE_URL}/Auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password }),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка регистрации');
    }
    return await response.json();
}
