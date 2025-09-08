import styles from '../Styling/Profile.module.css';
import CreatePost from "./CreatePost";
import { useEffect, useRef, useState } from "react";
import EditProfile from "./EditProfile";
import LoadingScreen from "./LoadingScreen";
import CommentBox from "./CommentBox";
import { MAIN_BACKEND_URL } from "../Scripts/URL";
import { ACTIONS, useUserAuthContext } from "../Context/UserContext";
import { fetchProfileLocalStorage, fetchUserNote, fetchUserStory } from "../Scripts/FetchDetails";
import { useNavigate } from "react-router-dom";
import { AllPostsProps } from "../Interfaces";
import { Plus, Settings, Grid, Clapperboard, Bookmark, UserRound, Film } from "lucide-react";
import ShareThoughtDilogBox from "../modules/ShareThoughtDilogBox";
import ShareStoryDilog from "../modules/ShareStoryDilog";
import { handleGetDuration } from "../Scripts/GetData";
import PostInfo from './ui/PostInfo';
import Footer from './Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import UserPosts from '../modules/UserPosts';
import UserReels from '../modules/UserReels';
import LineLoader from '../modules/LineLoader';
import defaultImage from "../assets/default.png"


function Profile() {

    const [selectedOption, setSelectedOption] = useState<string>("POST");

    const [uploadPostPopUp, setUploadPostPopUp] = useState<boolean>(false);
    const [allPosts, setAllPosts] = useState<AllPostsProps[]>([]);
    const [enableEditProfile, setEnableEditProfile] = useState<boolean>(false);
    const [postId, setPostId] = useState<string>("");
    const [userId, setUserId] = useState<string>("");
    const [posturl, setPostUrl] = useState<string | null>(null);
    const [toogleCommentBox, setCommentBox] = useState<boolean>(false);
    const [selectedPostUsername, setSelectedPostUsername] = useState<string>("");
    const [currentLikes, setCurrentLikes] = useState<number>(0);
    const [createdAtTime, setCreatedAt] = useState<string | null>(null);
    const { profile, dispatch } = useUserAuthContext();
    const [shareThoughtDilogBox, setShareThoughtDilogBox] = useState<boolean>(false);
    const [showMain, setShowMain] = useState<boolean>(false);
    const storyFileRef = useRef<HTMLInputElement | null>(null);
    const [selectedStoryFile, setSelectedStoryFile] = useState<File | null>(null);
    const [uploadedStory, setUploadedStory] = useState<any | null>(null);
    const [storyUrl, setStoryUrl] = useState<string | null>(null);
    const [note, setNote] = useState<any>();
    const [storyDuration, setStoryDuration] = useState<number>(5000);
    const [postFetchLoader, setPostFetchLoader] = useState<boolean>(false);
    const [reelFetchLoader, setReelFetchLoader] = useState<boolean>(false);
    const [allReels, setAllReels] = useState<any | null>(null);
    const [postType, setPostType] = useState<string | null>(null);
    const navigate = useNavigate();

    const itemIconsStyles = {
        borderBottom: '4px solid white',
        cursor: "pointer",
        userSelect: "none",
    } as React.CSSProperties;




    useEffect(() => {

        async function fetchAllPosts() {
            setPostFetchLoader(true);

            if (!profile?._id || profile?._id == "") {
                setPostFetchLoader(false);
                return;
            }



            const response = await fetch(`${MAIN_BACKEND_URL}/uploadPost/allPosts/${profile?._id}`, { method: "POST" });
            const result = await response.json();
            if (response.ok) {
                setAllPosts(result.allPosts);

            }
            if (!response.ok) {
                setAllPosts([]);
            }
            setPostFetchLoader(false);


        }

        (async () => {
            setReelFetchLoader(true);
            const myId = profile?._id;
            const response = await fetch(`${MAIN_BACKEND_URL}/uploadReel/getReels/${myId}`);
            const result = await response.json();

            if (response.ok) {
                setAllReels(result.reels);

            }


            setReelFetchLoader(false);


        })();

        (async () => {
            if (profile) {
                const story = await fetchUserStory(profile?._id);

                setUploadedStory(story);
            }
        })();

        (async () => {
            if (profile) {
                const note = await fetchUserNote(profile._id);

                setNote(note);
            }
        })();

        fetchAllPosts();

    }, [profile]);

    useEffect(() => {

        if (!profile) {
            (async () => {
                const localProfile = await fetchProfileLocalStorage();
                if (!localProfile) {
                    navigate("/login");
                } else {
                    dispatch({ type: ACTIONS.REMOVE_PROFILE, payload: localProfile });
                }
            })();
        }
    }, [profile, navigate, dispatch]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowMain(true);
        }, 500);

        return () => clearTimeout(timer);
    }, []);



    function UploadNewPostOption() {
        setUploadPostPopUp(c => !c);
    }

    function handleEditProfile() {
        setEnableEditProfile(c => !c);
    }

    function handleOpenCommentBox(id: string, url: string, userId: string, type: string, currentLikes: number, createdAt: string) {

        setCurrentLikes(currentLikes);
        setPostType(type);
        setPostUrl(url);
        setCreatedAt(createdAt);
        setPostId(id);
        document.body.style.overflow = "hidden";
        setSelectedPostUsername(profile?.username!);
        setUserId(userId);
        setCommentBox(true);

    }

    function ProvideInfoToCommentBox() {
        const info = {
            userId: userId,
            username: selectedPostUsername
        }

        return info;
    }

    function closeCommentInfoBox() {
        setCommentBox(false);
        document.body.style.overflow = "visible";
        document.body.style.overflowX = "hidden";

        setPostId("");
    }

    async function handleOnChangeStoryFile(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedStoryFile(file);

            const blob = new Blob([file], { type: file.type })
            const url = URL.createObjectURL(blob);
            setStoryUrl(url);
            handleGetDuration(file)?.then((duration) => {

                setStoryDuration(duration)
            });

        }
    }


    if (!showMain || !profile) {
        return <LoadingScreen/>
    }


    return (
        <>

            {uploadPostPopUp && <CreatePost s={UploadNewPostOption} />}

            {selectedStoryFile != null && storyUrl &&
                <ShareStoryDilog id={profile._id}
                    storyDuration={storyDuration}
                    username={profile.username}
                    storyFile={selectedStoryFile} itemUrl={storyUrl}
                    closeDilogBox={setSelectedStoryFile}
                    type={selectedStoryFile.type} />}


            {shareThoughtDilogBox && profile &&
                <ShareThoughtDilogBox
                    setNote={setNote}
                    userId={profile._id}
                    imageSrc={profile.profileImage?.url || defaultImage}
                    closeDilogBox={setShareThoughtDilogBox} />}

            {enableEditProfile && <EditProfile profileInfo={profile} s={handleEditProfile} />}
            {toogleCommentBox && postType && posturl && createdAtTime &&
                <CommentBox id={postId}
                    userImageUrl={profile.profileImage?.url || defaultImage}
                    postUrl={posturl}
                    toogleBox={closeCommentInfoBox}
                    postType={postType}
                    userInfoF={ProvideInfoToCommentBox} currentLikes={currentLikes}
                    createdAt={createdAtTime} />
            }


            <div className={styles.mainProfileContainer}>

                <div className={styles.profileContainer} >

                    <div className={styles.topBox} >

                        <div className={styles.userImage}>

                            {
                                note ?
                                    <div onClick={() => setShareThoughtDilogBox(prev => !prev)} className={styles.activeNote} >
                                        <span>{note.noteMessage}</span>
                                    </div>
                                    :

                                    <div onClick={() => setShareThoughtDilogBox(prev => !prev)} className={styles.shareANote} >
                                        <span style={{ opacity: "0.8" }} >Share a note</span>
                                    </div>
                            }

                            {!uploadedStory ?

                                <button className={styles.plusIcon} onClick={() => storyFileRef.current?.click()} >
                                    <Plus stroke="white" />
                                    <input hidden ref={storyFileRef} type="file" onChange={handleOnChangeStoryFile} />
                                </button>

                                :

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
                                    navigate(`/stories/${profile.username}/${profile._id}`)
                                }}
                                src={profile.profileImage?.url || defaultImage} alt="user"
                                style={{
                                    width: "100%", height: "100%", objectFit: "contain",
                                    cursor: `${uploadedStory ? "pointer" : "default"}`,
                                    borderRadius: "50%"
                                }}
                            />

                        </div>

                        <div className={styles.ButtonContainer} >
                            <div style={{ display: "flex", justifyContent: "flex-start", gap: "10px", alignItems: "center" }}>
                                <span style={{ fontSize: "1.2rem" }} >{profile.fullname}</span>
                                <Settings />
                            </div>
                            <div style={{ display: "flex", justifyContent: "center", gap: "5px", alignItems: "center" }}>
                                <button onClick={handleEditProfile} id={styles.editButtons} >Edit Profile</button>
                                <button id={styles.editButtons} >View archieve</button>
                            </div>
                        </div>


                        <div className={styles.allNewInfo} >
                            <div style={{ display: "flex", justifyContent: "flex-start", gap: "10px", alignItems: "center" }}>
                                <span style={{ fontSize: "1.2rem" }} >{profile.fullname}</span>
                                <button onClick={handleEditProfile} id={styles.editButtons} >Edit Profile</button>
                                <button id={styles.editButtons} >View archieve</button>
                                <Settings />
                            </div>

                            <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "20px" }}>
                                <PostInfo format='row' gap="6px" />
                                <span style={{ fontWeight: "bolder", fontSize: "1.2rem" }}>{profile.username}</span>
                                <span style={{ display: 'flex', wordWrap: "break-word", width: "300px" }}>{profile.bio}</span>
                            </div>

                        </div>


                    </div>

                    <div className={styles.infoSection} >
                        <span style={{ fontWeight: "bolder", fontSize: "1.2rem" }}>{profile.username}</span>
                        <span>{profile.bio}</span>
                    </div>

                    <div className={styles.Userhighlights} >

                        <div className={styles.highlight} >
                            <Plus size={20} />
                        </div>

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
                        <Bookmark
                            size={25}
                            cursor="pointer"
                            style={selectedOption === "SAVED" ? itemIconsStyles : undefined}
                            color={selectedOption === "SAVED" ? "white" : "gray"}
                            onClick={() => setSelectedOption("SAVED")}
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

                                <div className={styles.noPostContainer} >

                                    {
                                        postFetchLoader ?
                                            <LineLoader />
                                            :
                                            <>
                                                <div id={styles.cameraIcon}>
                                                    <FontAwesomeIcon icon={faCamera} size="3x" />
                                                </div>

                                                <span style={{ fontSize: "25px", fontWeight: "bolder" }} >Share photos</span>
                                                <span id={styles.postLine}>when you share photos ,they will appear on your profile</span>
                                                <span onClick={() => setUploadPostPopUp(true)} style={{ color: "#1877F2", fontWeight: "bolder", cursor: "pointer" }} >Share your first photo</span>
                                            </>

                                    }
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

                                <div className={styles.noPostContainer} >

                                    {
                                        reelFetchLoader ?
                                            <LineLoader />
                                            :

                                            <>
                                                <div id={styles.cameraIcon}>
                                                    <Film size={50} />
                                                </div>

                                                <span style={{ fontSize: "25px", fontWeight: "bolder" }} >Share Reel</span>
                                                <span id={styles.postLine}>when you share reel ,they will appear on your profile</span>
                                                <span onClick={() => setUploadPostPopUp(true)} style={{ color: "#1877F2", fontWeight: "bolder", cursor: "pointer" }} >Share your first Reel</span>

                                            </>

                                    }



                                </div>
                            }




                        </div>
                    }


                    {
                        selectedOption == "SAVED" &&
                        <div className={styles.allPostContainer}>


                            <div className={styles.noPostContainer} >

                                <div id={styles.cameraIcon}>
                                    <Bookmark size={50} fill='white' />
                                </div>

                                <span style={{ fontSize: "25px", fontWeight: "bolder" }} >Saved</span>
                                <span id={styles.postLine} >Save photos and videos that you want to see again. No</span>
                                <span id={styles.postLine} >one is notified, and only you can see what you've saved.</span>

                            </div>


                        </div>
                    }


                    <Footer />
                </div>

            </div>

        </>
    )
}

export default Profile


