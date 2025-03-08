
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';

const Layout = () => {
    const location = useLocation();
    const hideHeaderRoutes = ['/auth'];
    const shouldHideHeader = hideHeaderRoutes.includes(location.pathname);

    return (
        <>
            {!shouldHideHeader && <Header />}
            <Outlet />
        </>
    );
};

export default Layout;
