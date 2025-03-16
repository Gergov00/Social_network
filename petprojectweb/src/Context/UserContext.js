import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    useEffect(() => {
        const savedToken = localStorage.getItem("token");
        if (savedToken) {
            setToken(savedToken);
        }
    })

    const loginUser = (data) => {
        setUser(data.user);

        localStorage.setItem("token", data.token)
        localStorage.setItem("user", JSON.stringify(data.user));
    };

    const logoutUser = () => {
        setUser(null);

        localStorage.removeItem("user");
        localStorage.removeItem("token");
    };

    const updateUser = (user) => {
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
    };

    return (
        <UserContext.Provider value={{ token, user, loginUser, logoutUser, updateUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
