import React from "react";
import styles from "../Styling/Footer.module.css";

const Footer: React.FC = () => {
    return (
        <footer className={styles.footer}>
            <nav className={styles.links}>
                <a href="#">Joshi</a>
                <a href="#">About</a>
                <a href="#">Blog</a>
                <a href="#">Jobs</a>
                <a href="#">Help</a>
                <a href="#">API</a>
                <a href="#">Privacy</a>
                <a href="#">Terms</a>
                <a href="#">Locations</a>
                <a href="#">Talksgram Lite</a>
                <a href="#">JOSHI AI</a>
                <a href="#">Meta AI Articles</a>
                <a href="#">Threads</a>
                <a href="#">Contact Uploading & Non-Users</a>
                <a href="#">JOSHI Verified</a>
            </nav>

            <div className={styles.bottom}>
                <select className={styles.language}>
                    <option>English</option>
                    <option>हिन्दी</option>
                    <option>Español</option>
                    <option>Français</option>
                </select>
                <span>© 2025 Talksgram from Varun</span>
            </div>
        </footer>
    );
};

export default Footer;
