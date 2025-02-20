import { useState, useRef, useEffect } from 'react';
import MenuOptions from './MenuOptions';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause, faHeart, faComment, faShare, faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import styles from "../Styling/reels.module.css";
import { ProfileInfo } from './AppInterface';
import LoadingScreen from './LoadingScreen';
import { useNavigate } from 'react-router-dom';


type RecievedReelType = {

    _id: string;
    reelLike: number;
    reelComment: number;
    reelDescription: string;
    author: {
        userId: string;
        userAccId: string;
    }


}

type AllReelsType = {

    _id: string;
    authorName: string;
    likeStatus : boolean;
    reelLike: number;
    reelComment: number;
    reelDescription: string;
    author: {
        userId: string;
        userAccId: string;
    }
    videoRef: any;

}

type ReelLikeAndStatus = {

    likes: number,
    likeStatus: boolean

}


function Reels() {

    const [profileInfo, setProfileInfo] = useState<ProfileInfo | any>();
    const [AllReels, setAllReels] = useState<AllReelsType[]>([]);
    const reelContainer = useRef<HTMLDivElement | null>(null);
    const videoRefs = useRef<HTMLVideoElement[]>([]);
    const [PlayAndPauseButton, setPlayAndPauseButton] = useState<boolean>(false);
    const [playing, setPlaying] = useState<boolean>(true);
    const [likes, setLikes] = useState<ReelLikeAndStatus[]>([]);

 const navigate = useNavigate();


    useEffect(() => {

        async function fetchProfileInformation() {
            const profile = localStorage.getItem("user-token");
            if (profile) {
                const parsedProfile = JSON.parse(profile);
                const id = parsedProfile.id;

                const response = await fetch(`http://localhost:3000/accounts/fetchProfileDetails/${id}`, { method: "POST" });
                const result = await response.json();

                if (response.ok) {
                    setProfileInfo(result.userProfile);
                }
            }
        }

        fetchProfileInformation();
    }, []);

    useEffect(() => {

        async function FetchReels() {

            try {

                const response = await fetch(`http://localhost:3000/uploadReel/fetch-reels/?skip=0`, { method: "POST" })
                const result = await response.json();

                if (response.ok) {
                    const shuffedPost: RecievedReelType[] = result.shuffledReels;

                    const reelWithItsDetails = await Promise.all(

                        shuffedPost.map((async (each: RecievedReelType, index: number) => {

                            try {


                                const IdInfo = {
                                    postId: each._id,
                                    userId: profileInfo._id
                                }

                                const [authorResponse, likedResponse] = await Promise.all([
                                    fetch(`http://localhost:3000/accounts/fetchOtherUser/${each.author.userId}`, { method: "POST" }),
                                    fetch(`http://localhost:3000/uploadPost/fetchLikePost`, {

                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json"

                                        },
                                        body: JSON.stringify(IdInfo)

                                    }),
                                ])

                                const authorResult = await authorResponse.json();
                                const likeResult = await likedResponse.json();

                                
                                return {
                                    ...each,
                                    authorName: authorResponse.ok ? authorResult.userProfile.username : "Unknown",
                                    likeStatus: likedResponse.ok && likedResponse.status == 200 ? likeResult.likeStatus : false,
                                    videoRef: (el: HTMLVideoElement | null) => {
                                        if (el) videoRefs.current[index] = el;
                                    }
                                };

                            }
                            catch (error) {
                                console.error(`Error fetching details for post by ${each.author.userId}:`, error);
                                return {
                                    ...each,
                                    authorName: "Unknown",
                                    likeStatus: false,
                                    videoRef: (el: HTMLVideoElement | null) => {
                                        if (el) videoRefs.current[index] = el;
                                    }
                                };
                            }


                        }))
                    )
                    setAllReels(reelWithItsDetails);
                    setLikes(reelWithItsDetails.map((each) => ({
                        likes: each.reelLike,
                        likeStatus: each.likeStatus
                    })));
                    
                }
            }
            catch (error) {
                console.log(error);
            }

        }

      if(!profileInfo) return;

        FetchReels();

    }, [profileInfo])


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
            userId: profileInfo._id
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



            await fetch("http://localhost:3000/uploadReel/remove-likePost", {
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

            await fetch("http://localhost:3000/uploadReel/add-likePost", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(idInfo)
            });

        }

    }


if(!AllReels || !profileInfo || !videoRefs  || !reelContainer) { 
    <LoadingScreen/>
}

    return (
       
       <>
            <MenuOptions profile={profileInfo} />

            <div className={styles.reelsContainer}>
                <div ref={reelContainer} className={styles.reelsLayout}>
                    { AllReels && AllReels.map((video, index) => (

                        <div key={index} className={styles.eachReels}>

                            <div  onClick={function () {
                                ToogleVideoPlayAndPause(videoRefs.current[index]);
                                setPlayAndPauseButton(true);
                                clearUi();
                            }} style={{ zIndex :"1", 
                           
                            top: "0", left: "0", position: "absolute", width: "80%", height: "85%" }} > </div>

                            <video style={{ userSelect: "none", objectFit: "cover", marginTop: "10px", borderRadius: "5px " }}
                                ref={video.videoRef}
                                autoPlay={false}
                                loop={true}
                                // muted
                                src={`http://localhost:3000/uploadReel/render-reel/${video._id}`}
                                width="100%"
                                height="100%"
                            ></video>

                            {PlayAndPauseButton &&
                                <div className={styles.VideoController} >
                                    <button onClick={() => ToogleVideoPlayAndPause(videoRefs.current[index])}>
                                        <FontAwesomeIcon icon={playing ? faPause : faPlay} />
                                    </button>
                                </div>
                            }

                            <div className={styles.reelInfoContainer} >
                                <span id={styles.likeAndComment} style={{ zIndex: 10 }}  >
                                    <FontAwesomeIcon icon={faHeart}
                                        onClick={() => handleClickLike(index, video._id, likes[index]?.likeStatus)}
                                        style={{ cursor: "pointer", color: likes[index]?.likeStatus ? "red" : "white" }} />
                                    <span style={{ fontSize: "14px" }} >{likes[index]?.likes}</span>
                                </span>

                                <span id={styles.likeAndComment}  >
                                    <FontAwesomeIcon icon={faComment} />
                                    <span style={{ fontSize: "14px" }} >{video.reelComment}</span>
                                </span>


                                <FontAwesomeIcon icon={faShare} />
                                <FontAwesomeIcon icon={faEllipsisH} />

                            </div>


                            <div className={styles.reelUserInfo} >
                                <div style={{ display: "flex", gap: "10px", alignItems: "center" }} >
                                    <img  onClick={() => navigate(`/userProfile/${video.author.userId}`)}
                                    src={`http://localhost:3000/accounts/profileImage/${video.author.userId}`} alt="" style={{
                                        width: "40px", height: "40px",
                                        borderRadius: "50%",
                                        objectFit: "cover"
                                    }} />
                                    <p>{video.authorName}</p>
                                </div>
                                <p>{video.reelDescription}</p>
                            </div>
                        </div>


                    ))}
                </div>
            </div>
        </>
    );
}

export default Reels;
