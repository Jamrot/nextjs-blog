// components/Layout.js
import React from 'react';
import Banner from './Banner';

function Layout() {
    return (
        <div className="layout">
            <div className="sidebar">Sidebar Content</div>
            <div className="main-content">
                <Banner />
                <div className="intro">Introduction Content</div>
            </div>
        </div>
    );
}

export default Layout;
