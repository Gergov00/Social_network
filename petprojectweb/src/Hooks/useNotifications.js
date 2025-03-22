// useNotifications.js
import { useEffect } from 'react';
import * as signalR from '@microsoft/signalr';

const useNotifications = (token, onReceiveNotification, onReceiveCancelNotification) => {
    useEffect(() => {
        if (!token) return;
        const connection = new signalR.HubConnectionBuilder()
            .withUrl('http://gergovzaurbek.online/notificationsHub', {
            //.withUrl('https://localhost:32769/notificationsHub', {
                accessTokenFactory: () => token,
                fetchOptions: {
                    credentials: 'omit'
                }
            })
            .withAutomaticReconnect()
            .build();

        connection
            .start()
            .then(() => console.log('Соединение с уведомлениями установлено'))
            .catch(err => console.error('Ошибка подключения к уведомлениям:', err));

        connection.on('ReceiveNotification', (notification) => {
            console.log('Получено уведомление:', notification);
            onReceiveNotification(notification);
        });

        connection.on('ReceiveCancelNotification', (cancelInfo) => {
            console.log('Получено уведомление об отмене:', cancelInfo);
            if (onReceiveCancelNotification) {
                onReceiveCancelNotification(cancelInfo);
            }
        });

        return () => {
            connection.stop();
        };
    }, [token, onReceiveNotification, onReceiveCancelNotification]);
};

export default useNotifications;
