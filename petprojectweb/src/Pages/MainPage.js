import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MainPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const user = localStorage.getItem("user");
        if (user) {
            navigate('/profile');
        } else {
            navigate('/auth');
        }
    }, [navigate]);

    return <p>Загрузка...</p>;
};

export default MainPage;
