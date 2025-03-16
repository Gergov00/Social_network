import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

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
        <UserContext.Provider value={{ user, loginUser, logoutUser, updateUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
