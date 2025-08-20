import React, { useEffect, useRef } from 'react';
import styles from "../Styling/StoryDilog.module.css";
import { imageExtensions, videoExtensions } from '../Scripts/GetData';
import { MAIN_BACKEND_URL } from '../Scripts/URL';

interface props {
    setCurrentStory: React.Dispatch<React.SetStateAction<number>>;
    index: number;
    allStoriesLength: number;
    currentStory: number;
    closeDilogBox: React.Dispatch<React.SetStateAction<boolean>>;
    story: { _id: string, userId: string, username: string, storyData: { duration: number, contentType: string } };
    className: { name: string, positions: string };
    logoIcon?: string;
}

function StoryCard({
    setCurrentStory,
    currentStory,
    index,
    story,
    className,
    logoIcon
}: props) {
    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        if (index === currentStory && className.positions === "center") {
            video.currentTime = 0;
            video.play().catch(() => { });

        } else {
            video.pause();
            video.currentTime = 0;
        }
    }, [index, currentStory, className.positions]);

    return (
        <div className={className.name}>

            {logoIcon && (
                <div className={styles.logoContainer}>

                    <div id={styles.currentStory}>

                        <div style={{
                            width: "95%",
                            height: "95%",
                            background: "white",
                            borderRadius: "50%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            overflow: "hidden"
                        }}>
                            <img
                                src={`${MAIN_BACKEND_URL}/accounts/profileImage/${logoIcon}`}
                                style={{ width: "50px", borderRadius: "50%" }}
                            />
                        </div>

                    </div>
                    <span style={{ fontSize: "13px" }}>{story.username}</span>

                </div>
            )}

            {story.storyData.duration > 0 && className.positions === "center" && (
                <div className={styles.storyLoaderWrapper}>
                    <div className={styles.storyLoaderBackground}>
                        <div className={styles.storyLoaderBar}>
                            <div
                                style={{
                                    height: "100%",
                                    background: "#007aff",
                                    width: 0,
                                    borderRadius: "2px",
                                    position: "absolute",
                                    left: 0,
                                    top: 0,
                                    animation: `storyLoaderAnim ${story.storyData.duration}ms linear forwards`
                                }}
                            />
                        </div>
                    </div>
                    <style>
                        {`
                            @keyframes storyLoaderAnim {
                                from { width: 0%; }
                                to { width: 100%; }
                            }
                        `}
                    </style>
                </div>
            )}

            {imageExtensions.has(story.storyData.contentType) && (
                <img
                    src={`${MAIN_BACKEND_URL}/uploadPost/render-story/${story._id}`}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "20px",

                        opacity: className.positions === "side" ? "0.5" : "1",
                        transition: "opacity 300ms ease"
                    }}
                />
            )}

            {videoExtensions.has(story.storyData.contentType) && (
                <video
                    ref={videoRef}
                    src={`${MAIN_BACKEND_URL}/uploadPost/render-story/${story._id}`}
                    playsInline
                    onEnded={() => {
                        if (index === currentStory && className.positions === "center") {
                            setCurrentStory(prev => prev + 1);
                        }
                    }}
                    style={{
                        width: "100%",
                        border: "2px solid white",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "20px",
                        opacity: className.positions === "side" ? "0.5" : "1",
                        transition: "opacity 300ms ease"
                    }}
                />
            )}
        </div>
    );
}

export default StoryCard;
