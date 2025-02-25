import { useNavigate, useParams } from 'react-router-dom'
import MenuOptions from './MenuOptions';
import styles from "../Styling/Profile.module.css";


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from "react";


import {  fetchOtherUserDetails, fetchProfileDetails } from "../Scripts/FetchDetails";

import { ProfileInfo } from "../Components/Profile";
import LoadingScreen from './LoadingScreen';
import { MAIN_BACKEND_URL } from '../Scripts/URL';



interface AllPostsProps {

    _id: string;
    postLike: number;
    postComment: number;
    postDescription: string;
    author: {
        userId: string;
        userAccId: string;
    }
}



function UserProfile() {

    const { id }: any = useParams();
    const navigate = useNavigate();


    const [profileInfo, setProfileInfo] = useState<ProfileInfo | any>();
    const [myProfileInfo, setMyProfileInfo] = useState<ProfileInfo | any>();
    const [showStatus, setShowStatus] = useState<string>("Follow");
    const [allPosts, setAllPosts] = useState<AllPostsProps[]>([]);
    const [lazyLoading , setLazyLoading] = useState<boolean>(true);
    const[contentReady  , setContentReady] = useState<boolean>(false);
   


    useEffect(() => {


        async function fetchProfileInfo() {

            const user = await fetchOtherUserDetails(id);

            if (!user) {
                navigate("/error");
                return;
            }
            setProfileInfo(user);

            const profile = await fetchProfileDetails();
            if (id == profile._id) {
                navigate("/accounts/profile");
                return;
            }
            setMyProfileInfo(profile);
        }

        async function fetchAllPosts() {

            const response = await fetch(`${MAIN_BACKEND_URL}/uploadPost/allPosts/${id}`, { method: "POST" });

            const result = await response.json();
            if (response.ok) {
                setAllPosts(result.allPosts);

            }
            if (!response.ok) {
                setAllPosts([]);
            }
        }

        

        fetchProfileInfo();
        fetchAllPosts();
      

    }, [id]);



    useEffect(() => {
        async function checkFollowStatus() {
            const userIdOf = myProfileInfo?._id;
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
    
        checkFollowStatus();
        setLazyLoading(false);
        setContentReady(true);
    }, [myProfileInfo]);
    
    


    async function handleFollowUser() {

        let followInfo = {

            userId: "",
            userIdOf: "",
            usernameOf: ""
        };

        const userId = profileInfo._id;
        followInfo.userId = userId;



        followInfo.userIdOf = myProfileInfo?._id;
        followInfo.usernameOf = myProfileInfo?.username;


        if (showStatus == "Requested") {
            
            const response = await fetch(`${MAIN_BACKEND_URL}/Personal-chat/removeFromRequested`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(followInfo)
            })

            const result = await response.json();
            if (response.ok  && response.status == 202) {
                setShowStatus(result.status)
                return;
            }

        }

        if (showStatus == "Follow") {

 
            const response = await fetch(`${MAIN_BACKEND_URL}/Personal-chat/SendFollowRequest`, {

                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(followInfo)
            })

            const result = await response.json();

            if (response.ok  && response.status == 202) {

                setShowStatus(result.status);
                return;
            }
            if (response.ok  && response.status == 204 ) {
               setShowStatus(result.status);
                return;
            }

        }

        if (showStatus == "Following") {

            const response = await fetch(`${MAIN_BACKEND_URL}/Personal-chat/removeFollower`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(followInfo)

            })

            const result = await response.json();
            if (response.ok  && response.status == 202) {
                setShowStatus("Follow");
            }
            if (response.ok && response.status == 204) {
                setShowStatus(result.status);
            }

        }

    }


    if ( lazyLoading ||  !profileInfo || showStatus == "" || !myProfileInfo || !allPosts) {
       
        return <LoadingScreen />
    }
     

    if(!contentReady) {
         return <LoadingScreen/>
    }
   

    return (
        <>

            { myProfileInfo != null && <MenuOptions profile={myProfileInfo} />}

            <div className={styles.profileContainer}>

                <div className={styles.profileInformation}>

                    <div className={styles.profileImage} >
                        <img src={`${MAIN_BACKEND_URL}/accounts/profileImage/${profileInfo?._id}`} alt="_profileImage" width="100%" height="100%" />
                    </div>

                    <div className={styles.profileInfo} >

                        <div style={{ display: "flex", gap: "25px", alignItems: "center" }} >
                            <span style={{ fontSize: "1.05rem" }} >{profileInfo?.username}</span>
                            <button onClick={handleFollowUser} style={{ cursor: "pointer", fontSize: "1.03rem", color: "white", backgroundColor: "rgba(82, 78, 78, 0.712)", padding: "5px 10px", borderRadius: "5px", border: 'none', fontWeight: "bolder" }}>{showStatus}</button>
                            <button onClick={() => navigate(`/Personal-chat/${profileInfo?._id}`)} style={{ cursor: "pointer", fontSize: "1.03rem", color: "white", backgroundColor: "#1877F2", padding: "5px 10px", borderRadius: "5px", border: 'none', fontWeight: "bolder" }}>Message</button>
                            <span><FontAwesomeIcon icon={faCog} /></span>
                        </div>

                        <div style={{ display: "flex", gap: "25px" }}>
                            <p><span style={{ fontWeight: "bolder" }}>{profileInfo.post}</span> posts</p>
                            <p><span style={{ fontWeight: "bolder" }}>{profileInfo.followers} </span>{profileInfo.followers > 1 ? "followers" : "follower"}</p>
                            <p><span style={{ fontWeight: "bolder" }}>{profileInfo.following} </span>{profileInfo.following > 1 ? "followings" : "following"}</p>
                        </div>
                        <div><span style={{ fontWeight: "bolder" }}>{profileInfo.fullname}</span></div>

                        <div style={{ display: "flex" }}>
                            {profileInfo?.bio}
                        </div>
                    </div>

                </div>

                <div className={styles.highlights}>

                    <div style={{ fontSize: "3rem", display: "flex", alignItems: "center", justifyContent: "center" }} id={styles.eachHighlights}>
                        +
                    </div>

                    <div style={{ fontSize: "3rem", display: "flex", alignItems: "center", justifyContent: "center" }} id={styles.eachHighlights}>
                        +
                    </div>

                    <div style={{ fontSize: "3rem", display: "flex", alignItems: "center", justifyContent: "center" }} id={styles.eachHighlights}>
                        +
                    </div>

                    <div style={{ fontSize: "3rem", display: "flex", alignItems: "center", justifyContent: "center" }} id={styles.eachHighlights}>
                        +
                    </div>

                </div>




                <div className={styles.postContainer} >

                    <div >
                        <span style={{ cursor: "pointer", padding: "10px 10px", borderTop: '1px solid white' }} >POSTS</span>

                    </div>




                    {allPosts.length > 0 ?

                        <div className={styles.allPostsContainer} >

                            {allPosts.map((post, index) => (

                                <div key={index} className={styles.eachPost}>

                                    <img src={`${MAIN_BACKEND_URL}/uploadPost/postImage/${post?._id}`} height="100%" width="100%" alt="image" />

                                </div>
                            ))}

                        </div>


                        :

                        <div>
                            no post
                        </div>



                    }




                </div>
























































                <footer>

                    <div style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center", gap: "20px", fontSize: "11px",
                        alignItems: "center", wordWrap: "break-word", flexWrap: "wrap"
                    }}>

                        <span>About</span>
                        <span>Blog</span>
                        <span>Jobs</span>
                        <span>Help</span>
                        <span>API</span>
                        <span>Privacy</span>
                        <span>Terms</span>
                        <span>Locations</span>
                        <span>Instagram Lite</span>
                        <span>Threads</span>
                        <span>Contact uploading and non-users</span>
                        <span>Meta Verified</span>
                    </div>

                    <div style={{ display: "flex", gap: "30px", fontSize: "12px", padding: "20px 20px" }} >
                        <span>English (UK)</span>
                        <span>© 2024 TALKSGRAM BY VARUN JOSHI</span>
                    </div>


                </footer>

            </div>

        </>
    )
}

export default UserProfile