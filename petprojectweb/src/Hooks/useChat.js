// src/Hooks/useChat.js
import { useEffect } from 'react';
import * as signalR from '@microsoft/signalr';

const useChat = (token, onReceiveMessage) => {
    useEffect(() => {
        if (!token) return;

        const connection = new signalR.HubConnectionBuilder()
            .withUrl('http://gergovzaurbek.online/chatHub', {
            //.withUrl('https://localhost:32769/chatHub', {
                accessTokenFactory: () => token,
                fetchOptions: {
                    credentials: 'omit'
                }
            })
            .withAutomaticReconnect()
            .build();

        connection
            .start()
            .then(() => console.log('ChatHub connection established'))
            .catch(err => console.error('ChatHub connection error', err));

        connection.on('ReceiveMessage', (message) => {
            console.log('Получено сообщение:', message);
            onReceiveMessage(message);
        });

        return () => {
            connection.stop();
        };
    }, [token, onReceiveMessage]);
};

export default useChat;
