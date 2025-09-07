import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause, faHeart, faComment, faShare, faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import styles from "../Styling/reels.module.css";
import LoadingScreen from './LoadingScreen';
import { useNavigate } from 'react-router-dom';
import { MAIN_BACKEND_URL } from '../Scripts/URL';
import { AllReelsType, RecievedReelType, ReelLikeAndStatus } from '../Interfaces';
import { useUserAuthContext } from '../Context/UserContext';
import LineLoader from '../modules/LineLoader';
import defaultImage from "../assets/default.png";


function Reels() {

    const [AllReels, setAllReels] = useState<AllReelsType[]>([]);
    const reelContainer = useRef<HTMLDivElement | null>(null);
    const videoRefs = useRef<HTMLVideoElement[]>([]);
    const [PlayAndPauseButton, setPlayAndPauseButton] = useState<boolean>(false);
    const [playing, setPlaying] = useState<boolean>(true);
    const [reelFetching, setReelsFetching] = useState<boolean>(false);
    const [likes, setLikes] = useState<ReelLikeAndStatus[]>([]);
    const [skip, setSkip] = useState<number>(0);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const { profile } = useUserAuthContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (!profile) return;
        fetchReels(skip);
    }, [profile]);

    useEffect(() => {
        if (!profile || skip === 0) return;
        fetchReels(skip);
    }, [skip]);

    async function fetchReels(currentSkip: number) {
        setReelsFetching(true);
        try {
            const response = await fetch(`${MAIN_BACKEND_URL}/uploadReel/fetch-reels/?skip=${currentSkip}&limit=4`, { method: "POST" });
            const result = await response.json();
            if (response.ok) {
                const shuffedPost: RecievedReelType[] = result.shuffledReels;
                if (!shuffedPost || shuffedPost.length === 0) {
                    setHasMore(false);
                    setReelsFetching(false);
                    return;
                }
                const reelWithItsDetails = await Promise.all(
                    shuffedPost.map((async (each: RecievedReelType, index: number) => {
                        try {
                            const IdInfo = {
                                postId: each._id,
                                userId: profile!._id
                            }
                            const likedResponse = await fetch(`${MAIN_BACKEND_URL}/uploadPost/fetchLikePost`, {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify(IdInfo)
                            });
                            const likeResult = await likedResponse.json();
                            return {
                                ...each,
                                likeStatus: likedResponse.ok && likedResponse.status == 200 ? likeResult.likeStatus : false,
                                videoRef: (el: HTMLVideoElement | null) => {
                                    if (el) videoRefs.current[index + currentSkip] = el;
                                }
                            };
                        } catch (error) {
                            console.error(`Error fetching details for post by ${each.authorUserId._id}:`, error);
                            return {
                                ...each,
                                authorName: "Unknown",
                                likeStatus: false,
                                videoRef: (el: HTMLVideoElement | null) => {
                                    if (el) videoRefs.current[index + currentSkip] = el;
                                }
                            };
                        }
                    }))
                );
                setAllReels(prev => [...prev, ...reelWithItsDetails]);
                setLikes(prev => [...prev, ...reelWithItsDetails.map((each) => ({
                    likes: each.reelLike,
                    likeStatus: each.likeStatus
                }))]);
            }
        } catch (error : any) {
          throw new Error(error);
        } finally {
            setReelsFetching(false);
        }
    }


    useEffect(() => {
        if (videoRefs.current.length === 0) return;
        const options = {
            root: reelContainer.current,
            threshold: 0.6,
        };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const video = entry.target as HTMLVideoElement;
                if (entry.isIntersecting) {
                    video.autoplay = true;
                    video.play();
                    video.currentTime = 0;
                } else {
                    video.autoplay = false;
                    video.pause();
                    video.currentTime = 0;
                }
            });
        }, options);
        videoRefs.current.forEach((video) => {
            if (video) observer.observe(video);
        });
        return () => {
            videoRefs.current.forEach((video) => {
                if (video) observer.unobserve(video);
            });
        };
    }, [AllReels]);

    // Infinite scroll logic
    useEffect(() => {
        const handleScroll = () => {
            if (!reelContainer.current || reelFetching || !hasMore) return;
            const { scrollTop, scrollHeight, clientHeight } = reelContainer.current;
            if (scrollHeight - scrollTop - clientHeight < 100) {
                setSkip(prev => prev + 4);
            }
        };
        const container = reelContainer.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
        }
        return () => {
            if (container) {
                container.removeEventListener('scroll', handleScroll);
            }
        };
    }, [reelFetching, hasMore]);


    function clearUi() {
        const timeoutId = setTimeout(() => {

            setPlayAndPauseButton(false);

        }, 500);


        return () => {
            clearTimeout(timeoutId);
        }
    }

    function ToogleVideoPlayAndPause(videoRef: HTMLVideoElement) {

        if (videoRef.paused) {
            setPlaying(true)
            videoRef.play()
        }
        else {
            setPlaying(false)
            videoRef.pause()
        }

    }

    async function handleClickLike(Currentindex: number, id: string, likeStatus: boolean) {



        const idInfo = {
            postId: id,
            userId: profile!._id
        }

        if (likeStatus) {
            setLikes(likes.map((each, index) =>

                index === Currentindex
                    ? {
                        likes: each.likes - 1,
                        likeStatus: !each.likeStatus
                    }
                    : each
            ));



            await fetch(`${MAIN_BACKEND_URL}/uploadReel/remove-likePost`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(idInfo)
            });


        }

        else {

            setLikes(likes.map((each, index) =>

                index === Currentindex
                    ? {
                        likes: each.likes + 1,
                        likeStatus: !each.likeStatus
                    }
                    : each
            ));

            await fetch(`${MAIN_BACKEND_URL}/uploadReel/add-likePost`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(idInfo)
            });

        }

    }


    if (!AllReels || !profile || !videoRefs || !reelContainer) {
        return <LoadingScreen />;
    }

    return (
        <>
            <div className={styles.reelsContainer}>
                <div ref={reelContainer} className={styles.reelsLayout}>
                    {AllReels && AllReels.length > 0 ?


                        AllReels.map((video, index) => (

                            <div key={index} className={styles.eachReels}>
                                <div
                                    onClick={() => {
                                        ToogleVideoPlayAndPause(videoRefs.current[index]);
                                        setPlayAndPauseButton(true);
                                        clearUi();
                                    }}
                                    style={{
                                        zIndex: 1,
                                        top: "0", left: "0", position: "absolute", width: "80%", height: "85%"
                                    }}
                                >
                                </div>
                                <video
                                    id={styles.eachReelVideo}
                                    ref={video.videoRef}
                                    autoPlay={false}
                                    loop={true}
                                    src={video.reelVideo?.url}
                                ></video>
                                {PlayAndPauseButton && (
                                    <div className={styles.VideoController}>
                                        <button onClick={() => ToogleVideoPlayAndPause(videoRefs.current[index])}>
                                            <FontAwesomeIcon icon={playing ? faPause : faPlay} />
                                        </button>
                                    </div>
                                )}
                                <div className={styles.reelInfoContainer}>
                                    <span id={styles.likeAndComment} style={{ zIndex: 10 }}>
                                        <FontAwesomeIcon
                                            icon={faHeart}
                                            onClick={() => handleClickLike(index, video._id, likes[index]?.likeStatus)}
                                            style={{ cursor: "pointer", color: likes[index]?.likeStatus ? "red" : "white" }}
                                        />
                                        <span style={{ fontSize: "14px" }}>{likes[index]?.likes}</span>
                                    </span>
                                    <span id={styles.likeAndComment}>
                                        <FontAwesomeIcon icon={faComment} />
                                        <span style={{ fontSize: "14px" }}>{video.reelComment}</span>
                                    </span>
                                    <FontAwesomeIcon icon={faShare} />
                                    <FontAwesomeIcon icon={faEllipsisH} />
                                </div>
                                <div className={styles.reelUserInfo}>
                                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                        <img
                                            onClick={() => navigate(`/userProfile/${video.authorUserId._id}`)}
                                            src={video.authorUserId.profileImage?.url || defaultImage}
                                            style={{
                                                width: "40px", height: "40px",
                                                borderRadius: "50%",
                                                objectFit: "cover"
                                            }}
                                        />
                                        <p>{video.authorUserId.username}</p>
                                    </div>
                                    <span style={{ fontSize: "14px" }}>
                                        {video.reelDescription.length > 40 ? (
                                            <span>
                                                {video.reelDescription.substring(0, 140)}
                                                <span style={{ cursor: "pointer", color: "rgb(0, 72, 255)", fontSize: "14px" }}>...Read more</span>
                                            </span>
                                        ) : (
                                            video.reelDescription
                                        )}
                                    </span>
                                </div>
                            </div>


                        ))
                        :

                        <div style={{
                            width: "100vw", display: "flex", justifyContent: "center", alignItems: "center",
                            height: "100vh"
                        }}>
                            {reelFetching ?

                                <LineLoader />

                                :

                                <span>
                                    No Reels
                                </span>

                            }

                        </div>

                    }
                </div>
            </div>
        </>
    );
}

export default Reels;
