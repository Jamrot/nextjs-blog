// components/Layout.js
import React from 'react';
import Banner from './Banner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSchool, faEnvelope, faGraduationCap, faBook } from '@fortawesome/free-solid-svg-icons';
import { faTwitter, faGithub } from '@fortawesome/free-brands-svg-icons';

function Layout() {
    return (
        <div className="layout">
            {/* <Banner /> */}
            <div className="sidebar">
                <img src="/happydog.png" alt="my photo" className="sidebar-photo"/><br/>
                <div className="sidebar-name">
                    Junming Liu<br/>刘 君 茗
                </div>
                <div className="sidebar-info">
                    {/* <FontAwesomeIcon icon={faSchool} />  */}
                    Zhejiang University<br/>
                    {/* <FontAwesomeIcon icon={faEnvelope} />  */}
                    jmliu@zju.edu.cn<br/>
                </div>
                <div className="sidebar-icon">
                    <a href="https://scholar.google.com/citations?user=VWst5KEAAAAJ"><FontAwesomeIcon icon={faGraduationCap} /></a>
                    <a href=""><FontAwesomeIcon icon={faTwitter} /></a>
                    <a href="https://github.com/jamrot"><FontAwesomeIcon icon={faGithub} /></a>
                </div>
            </div>
            <div className="main-content">
                <div className="intro">
                    <h1>Biography</h1>
                    <div className="intro-content">
                        I am a dog in <a href='https://www.zju.edu.cn/'>Zhejiang University</a> supervised by <a href='https://person.zju.edu.cn/wangweihai'>Prof. Wenhai Wang</a>.
                    </div>
                    <h1>Interests</h1>
                    <div className="intro-content">                        
                        <h4>LLM for Security</h4><h4>Bug detection in DL</h4>
                    </div>
                    <h1>Education</h1>
                    <div className="intro-content">
                        <h3>Zhejiang University, 2022</h3>
                        M.S., System Security
                        <h3>University of Science and Technology Beijing, 2018</h3>
                        B.S., Automation
                    </div>
                    <h1>Publications</h1>
                    <div className="intro-content">
                        <h4>[In Submission] LLM's Capabilities for Vulnerability Management (name changed for anonymity)</h4>
                        Anonymous authors 
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Layout;
