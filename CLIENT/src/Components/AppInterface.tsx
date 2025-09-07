import styles from "../Styling/AppInterface.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch
} from "@fortawesome/free-solid-svg-icons";


import { useEffect, useRef, useState } from "react";
import LoadingScreen from "./LoadingScreen";
import { useNavigate } from "react-router-dom";
import { useToogle } from "../Context/ToogleContext"
import CommentBox from "./CommentBox";
import { MAIN_BACKEND_URL } from "../Scripts/URL.ts";
import ShareDilogBox from "../modules/ShareDilogBox.tsx";
import { Bell, Heart, LogOut, MessageCircle, Plus, Send, X } from 'lucide-react';
import { ACTIONS, useUserAuthContext } from "../Context/UserContext.tsx";
import { AllPostsProps, ProfilePayload, } from "../Interfaces/index.ts";
import PlayStoryBox from "../modules/PlayStoryBox.tsx";
import LineLoader from "../modules/LineLoader.tsx";
import Footer from "./Footer.tsx";
import { useSocketContext } from "../Context/SocketContext.tsx";
import defaultImage from "../assets/default.png";

function AppInterface() {

  const [allAccounts, setAllAccounts] = useState<ProfilePayload[]>([]);
  const [uploadedPosts, setUploadedPosts] = useState<AllPostsProps[]>([]);
  const [postId, setPostId] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [currentPostCount, setCurrentPostCount] = useState<number>(0);
  const [selectedPostUsername, setSelectedPostUsername] = useState<string>("");
  const [searchInputClicked, setSearchInputClicked] = useState<boolean>(false);
  const [toogleCommentBox, setCommentBox] = useState<boolean>(false);
  const [noMorePost, setNoMorePost] = useState<boolean>(false);
  const [currentPostLikes, setCurrentPostLikes] = useState<number>(0);
  const [currentPostDate, setCurrentPostDate] = useState<string>("");
  const [toogleShareDilogBox, setToogleShareDilogBox] = useState<boolean>(false);
  const [allStories, setAllStories] = useState<any[]>([]);
  const [playStoriesDilogBox, setPlayStoriesBox] = useState<boolean>(false);
  const [fetchingPostLoader, setFetchingPostLoader] = useState<boolean>(false);
  const [currentStoryDetails, setCurrentStoryDetails] = useState<any | null>(null);
  const [userImageUrl, setUserImageUrl] = useState<string | null>(null);

  //   shared post item

  const [postRef, setPostRef] = useState<any | null>(null);
  const [userRef, setUserRef] = useState<any | null>(null);


  const navigate = useNavigate();
  const storiesRef = useRef<HTMLDivElement | null>(null);
  const [postUrl, setPostUrl] = useState<string | null>(null);
  const { toogleVisiblility, setSearchInput, searchInput } = useToogle();
  const { profile, dispatch } = useUserAuthContext();
  const { socket } = useSocketContext();



  useEffect(() => {

    (() => {
      if (!profile || profile?._id == "") {
        return;
      }
      fetchAllPosts();
      fetchAllStories();
      fetchAllAccounts();
    })();

  }, [profile]);



  useEffect(() => {
    const stories = storiesRef.current;

    if (stories) {
      const handleWheel = (e: WheelEvent) => {
        if (e.deltaY !== 0) {
          e.preventDefault();
          stories.scrollLeft += e.deltaY;
        }
      };

      stories.addEventListener("wheel", handleWheel, { passive: false });

      return () => {
        stories.removeEventListener("wheel", handleWheel);
      };
    }
  }, []);



  async function fetchAllStories() {
    try {
      const response = await fetch(`${MAIN_BACKEND_URL}/uploadPost/fetch-all-stories`);
      const result = await response.json();
      if (response.ok) {
        setAllStories(result);
      }
      if (!response.ok) setAllStories([]);
    } catch (error: any) {
      throw new Error(`${error.message}`)
    }
  }

  async function fetchAllAccounts() {

    const email = profile?.email;
    const response = await fetch(`${MAIN_BACKEND_URL}/accounts/allAccounts?email=${email}`);
    const result = await response.json();
    if (response.ok) {
      setAllAccounts(result.allAccounts);
    }

  }

  async function fetchAllPosts() {
    setFetchingPostLoader(true);

    try {
      const response = await fetch(`${MAIN_BACKEND_URL}/uploadPost/fetchPosts/?skip=${currentPostCount}`, { method: "POST" });
      const postsResult = await response.json();

      if (response.ok && response.status == 202) {
        const postsWithDetails = await Promise.all(
          postsResult.shuffledPosts.map(async (post: AllPostsProps) => {

            try {

              const IdInfo = {
                postId: post._id,
                userId: profile?._id,
              }
              const likeResponse = await fetch(`${MAIN_BACKEND_URL}/uploadPost/fetchLikePost`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"

                },
                body: JSON.stringify(IdInfo)
              })

              const likeResult = await likeResponse.json();

              setCurrentPostCount(prevCount => prevCount + 1);

              return {
                ...post,
                likeStatus: likeResponse.ok && likeResponse.status == 200 ? likeResult.likeStatus : false,
              };
            }
            catch (error) {
              return { ...post, authorName: "Unknown", likeStatus: false };
            }

          })
        );

        setUploadedPosts([...uploadedPosts, ...postsWithDetails]);
      }
      if (response.ok && response.status == 201) {
        setNoMorePost(true);

      }


    } catch (error) {
      console.error("Error fetching all posts:", error);
      setUploadedPosts([]);
    }
    finally {
      setFetchingPostLoader(false);
    }


  }

  function closeInputBar(e: React.MouseEvent) {
    toogleVisiblility(false);
    e.stopPropagation();
    setSearchInputClicked(false);
    setSearchInput("");
  }

  function showSearchAccounts() {
    setSearchInputClicked(true);
    toogleVisiblility(true);


  }

  function VisitProfile(id: string) {

    navigate(`/userProfile/${id}`);
  }

  async function handleClickLike(id: string, likeStatus: boolean) {

    const idInfo = {
      postId: id,
      userId: profile?._id
    }

    if (likeStatus) {

      setUploadedPosts(
        uploadedPosts.map((post) => {

          if (post._id === id) {

            return { ...post, likeStatus: !post.likeStatus, postLike: post.postLike - 1 };
          }

          return post;
        })
      );


      await fetch(`${MAIN_BACKEND_URL}/uploadPost/remove-likePost`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify(idInfo)
      });


    }


    else {
      setUploadedPosts(
        uploadedPosts.map((post) => {

          if (post._id === id) {

            return { ...post, likeStatus: !post.likeStatus, postLike: post.postLike + 1 };
          }

          return post;
        })
      );


      await fetch(`${MAIN_BACKEND_URL}/uploadPost/add-likePost`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify(idInfo)
      });

    }

  }


  function handleOpenCommentBox(id: string, url: string, imageUrl: string = defaultImage, username: string, userId: string, totalLikes: number, date: string) {

    setPostId(id);
    setPostUrl(url);
    setUserImageUrl(imageUrl);
    setCurrentPostLikes(totalLikes);
    setSelectedPostUsername(username);
    setCurrentPostDate(date);
    setUserId(userId);
    setCommentBox(true);

  }

  function closeCommentInfoBox() {
    setCommentBox(false);
    setPostId("");
  }

  function ProvideInfoToCommentBox() {
    const info = {
      userId: userId,
      username: selectedPostUsername
    }

    return info;
  }

  function handleSharePost(post: AllPostsProps) {

    const postObjectRef = {
      _id: post._id,
      postImage: post.postImage,
      postLike: post.postLike,
      createdAt: post.createdAt,
    }
    const userobjectRef = {
      _id: post.authorId._id,
      profileImage: post.authorId.profileImage,
      username: post.authorId.username
    }
    setPostRef(postObjectRef);
    setUserRef(userobjectRef);
    setToogleShareDilogBox(prev => !prev);


  }


  function handleOpenStory(id: string, username: string = "user", story: any, index: number) {
    window.history.replaceState({}, '', `/stories/${username}/${id}`);
    setCurrentStoryDetails({ currentIndex: index, story: story })
    setPlayStoriesBox(prev => !prev);
    document.body.style.overflow = "hidden";
  }

  function Logout() {
    dispatch({ type: ACTIONS.REMOVE_PROFILE });
    handleSendOfflineStatus();
    localStorage.removeItem("profile-details");
    navigate("/accounts/login");
  }

  function handleSendOfflineStatus() {
    const user = localStorage.getItem("profile-details");
    if (user) {
      const parsedUserProfile = JSON.parse(user);
      const userId = parsedUserProfile._id;
      socket.emit("offline", userId);


    }
  }



  if (!profile) {
    return <LoadingScreen />
  }


  return (
    <>

      <div className={styles.topLogos}>
        <span style={{ fontSize: "1.2rem" }} >𝑻𝒂𝒍𝒌𝒔𝒈𝒓𝒂𝒎</span>

        <div
          onClick={showSearchAccounts}
          className={styles.searchBar}
        >
          {searchInputClicked ?
            <>
              <input
                id={styles.inputBox}
                type="text"
                placeholder="Search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <button
                onClick={closeInputBar}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "absolute",
                  right: "5px",
                  borderRadius: "50%",
                  width: "20px",
                  height: "20px",
                  border: "none",
                  opacity: "0.7",
                  cursor: "pointer"
                }}
              >
                <X size={16} />
              </button>
            </>
            :
            <>
              <FontAwesomeIcon style={{ opacity: "0.5" }} icon={faSearch} />
              <p style={{ opacity: "0.5" }}>Search</p>
            </>
          }

        </div>
        <LogOut onClick={Logout} />
        <Bell onClick={() => navigate("/Notification")} />


      </div>

      {/* left side options  */}


      {toogleCommentBox && postUrl && currentPostDate && userImageUrl &&
        <CommentBox id={postId}
          postUrl={postUrl}
          userImageUrl={userImageUrl}
          postType="image/png"
          toogleBox={closeCommentInfoBox}
          userInfoF={ProvideInfoToCommentBox}
          currentLikes={currentPostLikes}
          createdAt={currentPostDate} />}


      {toogleShareDilogBox && userRef && postRef &&
        <ShareDilogBox userRef={userRef} postRef={postRef}
          toogleOpenCloseButton={setToogleShareDilogBox} />
      }

      {playStoriesDilogBox &&
        currentStoryDetails &&
        <PlayStoryBox allStories={allStories}
          closeDilogBox={setPlayStoriesBox}
          currentSelectedStory={currentStoryDetails} />}


      <div className={styles.MainCenterContainer} >

        <div className={styles.StoriesAndPostContainer} >

          <div ref={storiesRef} className={styles.storiesContainer}>

            {allStories.map((each, index) => (

              <div key={index} className={styles.Stories} onClick={() => handleOpenStory(each.userId._id, each.username, each, index)}  >

                <div id={styles.eachStories} >

                  <div style={{
                    width: "90%", height: "90%", background: "white", borderRadius: "50%",
                    display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden"
                  }}>

                    <img src={each.userId?.profileImage?.url || defaultImage} alt="story"
                      style={{
                        objectFit: "cover", width: "100%", height: "100%", borderRadius: "50%",
                        pointerEvents: "none",
                      }}
                    />

                  </div>

                </div>

                <span>{each.username ? each.username : "Unknown"}</span>

              </div>

            ))}

          </div>


          {uploadedPosts && uploadedPosts.length > 0 ?

            <div className={styles.postsContainer} >

              {uploadedPosts.map((post, index) => (
                <div key={index} id={styles.eachPostContainer} >

                  <div id={styles.headerInfo}>

                    <img style={{ width: "50px", height: "50px", borderRadius: "50%" }} src={post.authorId?.profileImage?.url || defaultImage} alt="" />
                    <p>{post.authorId.username}</p>

                  </div>

                  <img id={styles.mainPostImage}
                    src={post?.postImage?.url} alt="" />

                  <div style={{ cursor: "pointer" }} id={styles.description}>

                    <div style={{ display: "flex", alignItems: "center", gap: "10px", userSelect: "none", fontSize: "1.5rem" }} >

                      <Heart stroke={`${post.likeStatus ? "red" : "white"}`} fill={`${post.likeStatus ? "red" : "none"}`} onClick={() => handleClickLike(post?._id, post?.likeStatus)} />

                      <span style={{ fontSize: "16px" }}>{post?.postLike}</span>

                      <MessageCircle onClick={() => handleOpenCommentBox(post?._id, post.postImage?.url, post.authorId.profileImage?.url, post.authorId.username,
                        post?.authorId._id, post.postLike, post.createdAt)} />

                      <span style={{ fontSize: "16px" }}>{post.postComment}</span>

                      <Send onClick={() => handleSharePost(post)} />
                      <span style={{ fontSize: "16px" }}>{post.postShare}</span>

                    </div>

                    <div style={{ display: "flex", flexDirection: "column" }} >
                      <p style={{ marginBottom: "10px" }}>{post?.postDescription}</p>
                    </div>

                  </div>



                </div>


              ))}

              {uploadedPosts.length > 0 && fetchingPostLoader ?


                <LineLoader />
                :

                <div onClick={fetchAllPosts} style={{ display: `${noMorePost ? "none" : "flex"}` }}  >
                  <Plus size={30}
                    style={{
                      border: "3px solid white", width: "40px", height: "40px", borderRadius: "50%"
                    }}
                  />
                </div>




              }

            </div>

            :

            <div className={styles.loadingContainer}>
              {fetchingPostLoader ?
                <LineLoader />
                :
                <div>
                  <p>No posts available</p>
                </div>
              }
            </div>





          }




        </div>


        <div className={styles.profileAndSuggestions} >

          <div className={styles.UserProfile}>
            <div className={styles.userImage}>
              <img src={profile?.profileImage?.url || defaultImage} width="100%" height="100%" alt="_pic" />
            </div>

            <div>
              <p>{profile?.username}</p>
              <p>{profile?.fullname}</p>
            </div>
          </div>

          <div className={styles.suggestions}>
            <p>Suggested for you </p>

            {allAccounts ?

              allAccounts.map((item, index) => (

                <div onClick={() => VisitProfile(item._id)} key={index} className={styles.suggestedAccount}>

                  <div id={styles.suggestedProfile}>
                    <img src={item?.profileImage?.url || defaultImage} width="100%" height="100%"
                      style={{ objectFit: "cover" }}
                      alt="_user" />
                  </div>

                  <div>

                    <p>{item.username}</p>
                    <p>{item.fullname}</p>

                  </div>

                </div>

              ))


              :

              <div>No suggestions</div>

            }

          </div>

          <div>
            <Footer />
          </div>

        </div>


      </div>


    </>
  )
}

export default AppInterface
