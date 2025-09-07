import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchUserStory } from "../Scripts/FetchDetails";
import LoadingScreen from "../Components/LoadingScreen";
import shareDilogStyles from "../Styling/ShareDilog.module.css";
import { RefreshCcw, Volume2, VolumeX, X } from "lucide-react";
import { imageExtensions, videoExtensions } from "../Scripts/GetData";
import styles from "../Styling/RenderStory.module.css";
import storyDilogStyle from "../Styling/StoryDilog.module.css";
import { MAIN_BACKEND_URL } from "../Scripts/URL";
import DropdownMenu from "../UI/dropDownMenu";
import { useUserAuthContext } from "../Context/UserContext";


interface fetchedStoryProps {
    _id: string;
    userId: string;
    username: string;
    storyData: {
        duration: number;
        contentType: string;
    }
}

function RenderSingleStory() {

    const { id, username } = useParams();
    const { profile } = useUserAuthContext();
    const navigate = useNavigate();
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [videoMuted, setVideoMuted] = useState<boolean>(true);
    const [fetchedStory, setFetchedStory] = useState<fetchedStoryProps | null>(null);
    const [videoEnded, setVideoEnded] = useState<boolean>(false);
    const [loaderKey, setLoaderKey] = useState<number>(Date.now());

    useEffect(() => {

        (async () => {
            if (id && username) {
                await verifyStory()
            }

        })();
    }, [id, username]);

    useEffect(() => {
        const video = videoRef.current;
        if (video) {
            video.play();
            setTimer();
        }
    }, [fetchedStory, loaderKey]);


    async function setTimer() {
        const duration = Number(fetchedStory?.storyData.duration) + 1000;
        setTimeout(() => {

            setVideoEnded(true);

        }, duration);
    }

    async function verifyStory() {
        const story: any = await fetchUserStory(id!);
      
        if (!story) {
            navigate("/error");
            return;
        }

        const { _id, username: providedUsername } = story;

        if (id != _id && username != providedUsername) {
            navigate("/error");
            return;
        }

        setFetchedStory(story);

    }

    function renderStory() {

        return (
            <div className={shareDilogStyles.blackBehindContainer} >

                <div className={shareDilogStyles.crossButton} >
                    <X onClick={() => navigate(-1)} />
                </div>


                {
                    fetchedStory &&

                    <div className={styles.centerContainer}>

                        {fetchedStory.storyData.duration > 0 && (

                            <div key={loaderKey} className={storyDilogStyle.storyLoaderWrapper}
                                style={{ top: "30px" }}
                            >
                                <div className={storyDilogStyle.storyLoaderBackground}>
                                    <div className={storyDilogStyle.storyLoaderBar}>
                                        <div
                                            style={{
                                                height: "100%",
                                                background: "#007aff",
                                                width: 0,
                                                borderRadius: "2px",
                                                position: "absolute",
                                                left: 0,
                                                top: 0,
                                                animation: `storyLoaderAnim ${fetchedStory.storyData.duration}ms linear forwards`
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


                        <div
                            style={{
                                position: "absolute", top: "40px", zIndex: "10",
                                right: "20px", cursor: "pointer",
                            }}
                        >

                            {profile?._id === id &&
                                <DropdownMenu id={fetchedStory._id} />
                            }
                        </div>



                        {imageExtensions.has(fetchedStory.storyData.contentType) &&
                            <img src={`${MAIN_BACKEND_URL}/uploadPost/render-story/${fetchedStory._id}`}
                                style={{
                                    objectFit: "contain", height: '100%', width: "auto", maxWidth: "400px", border: "4px solid white"
                                    , borderRadius: "20px"
                                }}
                            />
                        }



                        {videoExtensions.has(fetchedStory.storyData.contentType) &&
                            <div onClick={() => {
                                if (videoRef.current) {
                                    if (videoRef.current.muted) {
                                        setVideoMuted(false);
                                        videoRef.current.muted = false;
                                    }
                                    else {
                                        setVideoMuted(true);
                                        videoRef.current.muted = true;
                                    }

                                }

                            }} style={{
                                position: "absolute", top: "40px", zIndex: "1",
                                left: "20px", cursor: "pointer"
                            }}>
                                {videoMuted ? <VolumeX /> : <Volume2 />}
                            </div>
                        }



                        {videoExtensions.has(fetchedStory.storyData.contentType) &&

                            <video id="storyVideo" ref={videoRef} src={`${MAIN_BACKEND_URL}/uploadPost/render-story/${fetchedStory._id}`}
                                autoPlay muted
                                style={{
                                    objectFit: "contain", height: '100%', width: "auto", border: "4px solid white"
                                    , borderRadius: "20px"
                                }}
                            />
                        }

                        {videoEnded &&
                            <div style={{
                                width: "102%", display: "flex", background: "rgba(12, 12, 12, 0.662)", zIndex: "5",
                                position: "absolute", alignItems: "center", justifyContent: "center",
                                height: "102%"
                            }}>
                                <RefreshCcw size={50}
                                    onClick={() => {
                                        if (videoRef.current) {
                                            videoRef.current.play();
                                            setVideoEnded(false);
                                            setLoaderKey(Date.now());
                                        }
                                    }}
                                    style={{ cursor: "pointer" }} />
                            </div>
                        }

                    </div>
                }

            </div>
        )
    }


    if (!id || !username || !fetchedStory) {
        return <LoadingScreen />
    }
    else {
        return renderStory();
    }

}

export default RenderSingleStory
