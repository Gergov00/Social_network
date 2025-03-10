import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../Services/Api';
import '../Assets/AuthPage.css';
import $ from 'jquery';
import { useUser } from '../Context/UserContext';

const AuthPage = () => {
    const [activeTab, setActiveTab] = useState('login');

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [signupError, setSignupError] = useState(null);

    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginError, setLoginError] = useState(null);

    const navigate = useNavigate();
    const { user, loginUser } = useUser();

    useEffect(() => {
        if (user) {
            navigate('/profile');
        }
    }, [user, navigate]);


    const handleTabClick = (tab) => {
        setActiveTab(tab);
        setSignupError(null);
        setLoginError(null);
        setFirstName('');
        setLastName('');
        setSignupEmail('');
        setSignupPassword('');
        setLoginEmail('');
        setLoginPassword('');
    };

    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        setSignupError(null);
        try {
            await register(firstName, lastName, signupEmail, signupPassword);
            const data = await login(signupEmail, signupPassword);
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            loginUser(data.user);
            navigate('/profile');
        } catch (err) {
            console.error(err);
            setSignupError(err.message);
        }
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setLoginError(null);
        try {
            const data = await login(loginEmail, loginPassword);
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            loginUser(data.user);
            navigate('/profile');
        } catch (err) {
            console.error(err);
            setLoginError(err.message);
        }
    };

    useEffect(() => {
        $('.form').on('keyup blur focus', 'input, textarea', function (e) {
            var $this = $(this),
                label = $this.closest('.field-wrap').find('label');

            if (e.type === 'keyup') {
                if ($this.val() === '') {
                    label.removeClass('active highlight');
                } else {
                    label.addClass('active highlight');
                }
            } else if (e.type === 'blur') {
                if ($this.val() === '') {
                    label.removeClass('active highlight');
                } else {
                    label.removeClass('highlight');
                }
            } else if (e.type === 'focus') {
                if ($this.val() === '') {
                    label.removeClass('highlight');
                } else if ($this.val() !== '') {
                    label.addClass('highlight');
                }
            }
        });

        $('.tab a').on('click', function (e) {
            e.preventDefault();
            $(this).parent().addClass('active');
            $(this).parent().siblings().removeClass('active');

            const target = $(this).attr('href');
            $('.tab-content > div').not(target).hide();
            $(target).fadeIn(600);
        });

        return () => {
            $('.form').find('input, textarea').off('keyup blur focus');
            $('.tab a').off('click');
        };
    }, []);

    return (
        <div className="form">
            <ul className="tab-group">
                <li
                    className={`tab ${activeTab === 'signup' ? 'active' : ''}`}
                    onClick={() => handleTabClick('signup')}
                >
                    <a href="#signup">Sign Up</a>
                </li>
                <li
                    className={`tab ${activeTab === 'login' ? 'active' : ''}`}
                    onClick={() => handleTabClick('login')}
                >
                    <a href="#login">Log In</a>
                </li>
            </ul>

            <div className="tab-content">
                {activeTab === 'signup' && (
                    <div id="signup">
                        <h1 className="auth-h1"> Up for Free</h1>
                        {signupError && <p style={{ color: 'red' }}>{signupError}</p>}
                        <form onSubmit={handleSignupSubmit}>
                            <div className="top-row">
                                <div className="field-wrap">
                                    <label>
                                        First Name<span className="req">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        autoComplete="off"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                    />
                                </div>
                                <div className="field-wrap">
                                    <label>Last Name</label>
                                    <input
                                        type="text"
                                        autoComplete="off"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="field-wrap">
                                <label>
                                    Email Address<span className="req">*</span>
                                </label>
                                <input
                                    type="email"
                                    required
                                    autoComplete="off"
                                    value={signupEmail}
                                    onChange={(e) => setSignupEmail(e.target.value)}
                                />
                            </div>
                            <div className="field-wrap">
                                <label>
                                    Set A Password<span className="req">*</span>
                                </label>
                                <input
                                    type="password"
                                    required
                                    autoComplete="off"
                                    value={signupPassword}
                                    onChange={(e) => setSignupPassword(e.target.value)}
                                />
                            </div>
                            <button type="submit" className="button button-block">
                                Get Started
                            </button>
                        </form>
                    </div>
                )}
                {activeTab === 'login' && (
                    <div id="login">
                        <h1 className="auth-h1">Welcome Back!</h1>
                        {loginError && <p style={{ color: 'red' }}>{loginError}</p>}
                        <form onSubmit={handleLoginSubmit}>
                            <div className="field-wrap">
                                <label>
                                    Email Address<span className="req">*</span>
                                </label>
                                <input
                                    type="email"
                                    required
                                    autoComplete="off"
                                    value={loginEmail}
                                    onChange={(e) => setLoginEmail(e.target.value)}
                                />
                            </div>
                            <div className="field-wrap">
                                <label>
                                    Password<span className="req">*</span>
                                </label>
                                <input
                                    type="password"
                                    required
                                    autoComplete="off"
                                    value={loginPassword}
                                    onChange={(e) => setLoginPassword(e.target.value)}
                                />
                            </div>
                            <button type="submit" className="button button-block">
                                Log In
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AuthPage;
    