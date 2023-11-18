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
                    I am a dog in <a href='https://www.zju.edu.cn/'>Zhejiang University</a> supervised by <a href='https://person.zju.edu.cn/wangweihai'>Prof. Wenhai Wang</a>. I lead a unique and fascinating life. Mornings are filled with sunny courtyard lounging, where students greet me warmly, offering treats and affection. I'm a familiar, calming presence in Prof. Wang's lectures, often dozing at his feet while students engage in academic discussions. Afternoons are spent strolling with Prof. Wang, playfully contributing to his research talks. I'm not just a pet here, but a cherished part of the university community.
                </div>
                <div className='dual-content'>
                    <div className="interests">    
                        <h2>Interests</h2>
                        <div className="intro-content">                    
                            <h4>LLM for Security</h4><h4>Bug detection in DL</h4>
                        </div>
                    </div>                    
                    <div className="education">
                        <h2>Education</h2>
                        <div className="intro-content">
                            <h4>Zhejiang University, 2022</h4>
                            M.S., System Security
                            <h4>University of Science and Technology Beijing, 2018</h4>
                            B.S., Automation, School of Automation and Electrical Engineering
                        </div>
                    </div>
                </div>
                <h2>Publications</h2>
                <div className="publications">
                    <div className='pub-item'>
                        <h4>[In Submission] <a href='https://arxiv.org/abs/2311.06530'>How ChatGPT is Solving Vulnerability Management Problem</a> (name changed for anonymity)</h4>
                        Anonymous authors
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Layout;
