import { useNavigate, useParams } from 'react-router-dom'
import styles from "../Styling/Profile.module.css";
import userStyles from "../Styling/UserProfile.module.css"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from "react";


import LoadingScreen from './LoadingScreen';
import { MAIN_BACKEND_URL } from '../Scripts/URL';
import { useSocketContext } from '../Context/SocketContext';
import { useUserAuthContext } from '../Context/UserContext';
import CommentBox from './CommentBox';
import { fetchProfileDetails, fetchUserNote, fetchUserStory } from '../Scripts/FetchDetails';
import { AllPostsProps, ProfileInfo } from '../Interfaces';
import PostInfo from './ui/PostInfo';
import { Clapperboard, Film, Grid, UserRound } from 'lucide-react';
import Footer from './Footer';
import UserPosts from '../modules/UserPosts';
import UserReels from '../modules/UserReels';



function UserProfile() {

    const { id }: any = useParams();
    const navigate = useNavigate();

    const { socket } = useSocketContext();
    const { profile } = useUserAuthContext();
    const [selectedOption, setSelectedOption] = useState<string>("POST");

    const [profileInfo, setProfileInfo] = useState<ProfileInfo | any>();
    const [showStatus, setShowStatus] = useState<string>("Follow");
    const [allPosts, setAllPosts] = useState<AllPostsProps[]>([]);
    const [selectedPostUsername, setSelectedPostUsername] = useState<string>("");
    const [currentLikes, setCurrentLikes] = useState<number>(0);
    const [createdAtTime, setCreatedAt] = useState<string>("");
    const [postId, setPostId] = useState<string>("");
    const [userId, setUserId] = useState<string>("");
    const [toogleCommentBox, setCommentBox] = useState<boolean>(false);
    const [note, setNote] = useState<{ noteMessage: string, _id: string, userId: string } | null>(null);
    const [uploadedStory, setUploadedStory] = useState<any | null>(null);
    const [allReels, setAllReels] = useState<any | null>(null);
    const [postType, setPostType] = useState<string>("");
    const [showMain, setShowMain] = useState<boolean>(false);

    const itemIconsStyles = {
        borderBottom: '4px solid white',
        cursor: "pointer",
        userSelect: "none"
    } as React.CSSProperties;


    useEffect(() => {

        (async () => {

            const user = await fetchProfileDetails(id);

            if (profile) {
                if (id == profile._id) {
                    navigate("/accounts/profile");
                    return;
                }

            }

            if (!user) {
                navigate("/error");
                return;
            }
            setProfileInfo(user);

        })();

        (async () => {
            const response = await fetch(`${MAIN_BACKEND_URL}/uploadPost/allPosts/${id}`, { method: "POST" });

            const result = await response.json();
            if (response.ok) {
                setAllPosts(result.allPosts);

            }
            if (!response.ok) {
                setAllPosts([]);
            }
        })();

    }, [id, profile]);


    useEffect(() => {

        async function checkFollowStatus() {
            const userIdOf = profile?._id;
            const userIds = {
                userId: profileInfo?._id,
                userIdOf: userIdOf
            };

            try {
                // Check requested status
                const response = await fetch(`${MAIN_BACKEND_URL}/Personal-chat/checkRequested`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(userIds)
                });

                if (!response.ok) {
                    console.error('Failed to fetch checkRequested', response.statusText);
                    return;
                }

                const result = await response.text(); // Use text() to check the raw response
                const parsedResult = result ? JSON.parse(result) : null;

                if (response.status === 202 && parsedResult) {
                    setShowStatus(parsedResult.status);
                    return;
                }

                // If not requested, check followed status
                if (response.status === 204) {
                    const rs = await fetch(`${MAIN_BACKEND_URL}/Personal-chat/checkFollowed`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(userIds)
                    });
                    const res = await rs.text();
                    const parsedRes = res ? JSON.parse(res) : null;

                    if (rs.ok && parsedRes) {
                        setShowStatus(parsedRes.status);
                    }
                }
            } catch (error) {
                console.error("Error checking follow status:", error);
            }
        }

        (async () => {
            if (profile) {
                const story = await fetchUserStory(profileInfo?._id);
                console.log("fetch story", story);
                setUploadedStory(story);
            }
        })();

        (async () => {
            if (profile) {
                const note = await fetchUserNote(profileInfo._id);
                console.log("fetched note", note);
                setNote(note);
            }
        })();

        (async () => {
            const myId = profileInfo._id;
            const response = await fetch(`${MAIN_BACKEND_URL}/uploadReel/getReels/${myId}`);
            const result = await response.json();

            if (response.ok) {
                setAllReels(result.reels);
                console.log(result.reels);
            }
            if (!response.ok) {
                console.log(result.message);
            }

        })();

        checkFollowStatus();

    }, [profile, profileInfo]);


    useEffect(() => {
        const timer = setTimeout(() => {
            setShowMain(true);
        }, 500);

        return () => clearTimeout(timer);
    }, []);



    function handleOpenCommentBox(id: string, userId: string, type: string, currentLikes: number, createdAt: string) {

        setCurrentLikes(currentLikes);
        setPostType(type);
        setCreatedAt(createdAt);
        setPostId(id);
        document.body.style.overflow = "hidden";
        setSelectedPostUsername(profile?.username!);
        setUserId(userId);
        setCommentBox(true);

    }

    function closeCommentInfoBox() {
        setCommentBox(false);
        document.body.style.overflow = "visible";
        document.body.style.overflowX = "hidden";

        setPostId("");
    }

    function ProvideInfoToCommentBox() {
        const info = {
            userId: userId,
            username: selectedPostUsername
        }

        return info;
    }

    async function handleFollowUser() {

        if (!profile) return;

        let followInfo = {

            userId: "",
            userIdOf: "",
            usernameOf: ""
        };

        const userId = profileInfo._id;
        followInfo.userId = userId;



        followInfo.userIdOf = profile?._id;
        followInfo.usernameOf = profile?.username;


        if (showStatus == "Requested") {
            setShowStatus("Follow");
            await fetch(`${MAIN_BACKEND_URL}/Personal-chat/removeFromRequested`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(followInfo)
            });
        }

        if (showStatus == "Follow") {

            setShowStatus("Requested");
            const response = await fetch(`${MAIN_BACKEND_URL}/Personal-chat/SendFollowRequest`, {

                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(followInfo)
            })

            if (response.ok && response.status == 202) {

                const data = {
                    socketId: socket.id,
                    receiverUserID: userId,
                    senderUserID: profile._id,
                    username: profile.username
                }

                socket.emit("follow-request", data);
                return;
            }

        }

        if (showStatus == "Following") {
            setShowStatus("Follow");
            await fetch(`${MAIN_BACKEND_URL}/Personal-chat/removeFollower`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(followInfo)

            })



        }

    }

    if (!showMain || !profileInfo) {
        return <LoadingScreen />
    }

    return (
        <>

            {toogleCommentBox &&
                <CommentBox id={postId}
                    postType={postType}
                    toogleBox={closeCommentInfoBox}
                    userInfoF={ProvideInfoToCommentBox} currentLikes={currentLikes}
                    createdAt={createdAtTime} />
            }

            <div className={styles.mainProfileContainer}>

                <div className={styles.profileContainer} >

                    <div className={styles.topBox} >

                        <div className={styles.userImage}>


                            {
                                note &&

                                <div className={userStyles.activeNote} >
                                    <span>{note?.noteMessage}</span>
                                </div>

                            }

                            {uploadedStory &&

                                <div style={{
                                    position: "absolute", width: `110%`, height: `110%`,
                                    borderRadius: "50%", background: "linear-gradient(45deg, #fdf497, #fd5949, #d6249f, #285aeb)",
                                    zIndex: "-1", cursor: "pointer"
                                }}>
                                </div>
                            }

                            <img

                                onClick={() => {
                                    if (!uploadedStory) return;
                                    navigate(`/stories/${profileInfo.username}/${profileInfo._id}`)
                                }}

                                src={`${MAIN_BACKEND_URL}/accounts/profileImage/${profileInfo?._id}`} alt="user"
                                style={{
                                    width: "100%", height: "100%", objectFit: "contain",
                                    cursor: `${uploadedStory ? "pointer" : "default"}`,
                                    borderRadius: "50%"
                                }}
                            />

                        </div>

                        <div className={styles.ButtonContainer} >
                            <div style={{ display: "flex", justifyContent: "flex-start", gap: "10px", alignItems: "center" }}>
                                <span style={{ fontSize: "1.2rem" }} >{profileInfo.fullname}</span>
                            </div>

                            <div style={{ display: "flex", justifyContent: "center", gap: "5px", alignItems: "center" }}>
                                <button onClick={handleFollowUser} style={{ cursor: "pointer", fontSize: "1.03rem", color: "white", backgroundColor: "rgba(82, 78, 78, 0.712)", padding: "5px 10px", borderRadius: "5px", border: 'none', fontWeight: "bolder" }}>{showStatus}</button>
                                <button onClick={() => navigate(`/accounts/inbox/messages/Personal-chat/${profileInfo?._id}`)} style={{ cursor: "pointer", fontSize: "1.03rem", color: "white", backgroundColor: "#1877F2", padding: "5px 10px", borderRadius: "5px", border: 'none', fontWeight: "bolder" }}>Message</button>
                            </div>
                        </div>


                        <div className={styles.allNewInfo} >
                            <div style={{ display: "flex", justifyContent: "flex-start", gap: "10px", alignItems: "center" }}>
                                <span style={{ fontSize: "1.05rem" }} >{profileInfo?.username}</span>
                                <button onClick={handleFollowUser} style={{ cursor: "pointer", fontSize: "1.03rem", color: "white", backgroundColor: "rgba(82, 78, 78, 0.712)", padding: "5px 10px", borderRadius: "5px", border: 'none', fontWeight: "bolder" }}>{showStatus}</button>
                                <button onClick={() => navigate(`/accounts/inbox/messages/Personal-chat/${profileInfo?._id}`)} style={{ cursor: "pointer", fontSize: "1.03rem", color: "white", backgroundColor: "#1877F2", padding: "5px 10px", borderRadius: "5px", border: 'none', fontWeight: "bolder" }}>Message</button>
                            </div>

                            <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "20px" }}>
                                <PostInfo format='row' gap="6px" />
                                <span style={{ fontWeight: "bolder", fontSize: "1.2rem" }}>{profileInfo.username}</span>
                                <span style={{ display: 'flex', wordWrap: "break-word", width: "300px" }}>{profileInfo.bio}</span>
                            </div>

                        </div>


                    </div>

                    <div className={styles.infoSection} >
                        <span style={{ fontWeight: "bolder", fontSize: "1.2rem" }}>{profileInfo.username}</span>
                        <span>{profileInfo.bio}</span>
                    </div>

                    <div className={styles.Userhighlights} >



                    </div>

                </div>


                <div className={styles.infoBox} >
                    <PostInfo format='column' gap="3px" />

                </div>


                <div className={styles.postContainer} >

                    <div className={styles.itemIcons}>
                        <Grid
                            size={25}
                            cursor="pointer"
                            style={selectedOption === "POST" ? itemIconsStyles : undefined}
                            color={selectedOption === "POST" ? "white" : "gray"}
                            onClick={() => setSelectedOption("POST")}
                        />
                        <Clapperboard
                            size={25}
                            cursor="pointer"
                            style={selectedOption === "REELS" ? itemIconsStyles : undefined}
                            color={selectedOption === "REELS" ? "white" : "gray"}
                            onClick={() => setSelectedOption("REELS")}
                        />

                        <UserRound
                            size={25}
                            cursor="pointer"
                            style={selectedOption === "TAGGED" ? itemIconsStyles : undefined}
                            color={selectedOption === "TAGGED" ? "white" : "gray"}
                            onClick={() => setSelectedOption("TAGGED")}
                        />
                    </div>

                    {
                        selectedOption == "POST" &&
                        <div className={styles.allPostContainer}>

                            {allPosts && allPosts.length ?

                                <UserPosts allPosts={allPosts} handleOpenCommentBox={handleOpenCommentBox} />

                                :

                                <div style={{
                                    marginLeft: "50%", height: "200px", padding: '10px',
                                    display: "flex", gap: "15px", flexDirection: "column", alignSelf: "center",
                                    alignItems: "center", width: "500px"
                                }} >

                                    <div id={styles.cameraIcon}>
                                        <FontAwesomeIcon icon={faCamera} size="3x" />

                                    </div>

                                    <p style={{ fontSize: "25px", fontWeight: "bolder" }} >No posts yet</p>

                                </div>


                            }

                        </div>
                    }

                    {
                        selectedOption == "REELS" &&
                        <div className={styles.allPostContainer}>


                            {allReels && allReels.length > 0 ?

                                <UserReels allReels={allReels} handleOpenReel={handleOpenCommentBox} />

                                :

                                <div style={{
                                    marginLeft: "50%", height: "200px", padding: '10px',
                                    display: "flex", gap: "15px", flexDirection: "column", alignSelf: "center",
                                    alignItems: "center", width: "500px"
                                }} >

                                    <div id={styles.cameraIcon}>
                                        <Film size={50} />

                                    </div>

                                    <p style={{ fontSize: "25px", fontWeight: "bolder" }} >No Reels yet</p>

                                </div>
                            }




                        </div>
                    }


                </div>

                <Footer />
            </div>

        </>
    )
}

export default UserProfile