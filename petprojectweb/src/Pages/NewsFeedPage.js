import React, { useState } from 'react';
import PostsComponent from '../Components/PostsComponent';
import '../Assets/NewsFeedPage.css';

const NewsFeedPage = () => {
    
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = Number(user.id)
    return (
        <div className="newsfeed-page">
            

            <main className="content">
                <PostsComponent userId={userId} />
            </main>
        </div>
    );
};

export default NewsFeedPage;
