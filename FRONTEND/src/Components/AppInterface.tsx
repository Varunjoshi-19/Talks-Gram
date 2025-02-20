import styles from "../Styling/AppInterface.module.css";
import MenuOptions from "./MenuOptions";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faThumbsUp, faComment, faShareAlt, faSearch, faBell
} from "@fortawesome/free-solid-svg-icons";


import { useEffect, useState } from "react";
import LoadingScreen from "./LoadingScreen";
import { useNavigate  } from "react-router-dom";
import { useToogle } from "../Context/ToogleContext"
import CommentBox from "./CommentBox";

 export  interface ProfileInfo {
  _id: string,
  username: string,
  fullname: string,
  post: number,
  bio: string,
  followers: number,
  following: number
};

interface AllPostsProps {

  _id: string;
  authorName: string;
  likeStatus: boolean;
  postLike: number;
  postComment: number;
  postDescription: string;
  author: {
    userId: string;
    userAccId: string;
  }
}[];


function AppInterface() {

  const [profileInfo, setProfileInfo] = useState<ProfileInfo | null>(null);
  const [allAccounts, setAllAccounts] = useState<ProfileInfo[]>([]);
  const [uploadedPosts, setUploadedPosts] = useState<AllPostsProps[]>([]);
  const [postId , setPostId] = useState<string>("");
  const [userId , setUserId] = useState<string>("");
  const[currentPostCount, setCurrentPostCount]  = useState<number>(0);
  const [selectedPostUsername, setSelectedPostUsername]  = useState<string>("");
  const [searchInputClicked, setSearchInputClicked] = useState<boolean>(false);
  const [toogleCommentBox , setCommentBox] = useState<boolean>(false);
  const [noMorePost , setNoMorePost]  =useState<boolean>(false); 
 
  const navigate = useNavigate();

 
  const { toogleVisiblility, setSearchInput, searchInput } = useToogle();

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
        } else {
          
        }
      }
    }

    async function fetchAllAccounts() {

      let parsedUser;
      const user = localStorage.getItem("user-token");
      if (user) {
        parsedUser = JSON.parse(user);
       
      }


      const response = await fetch("http://localhost:3000/accounts/allAccounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify(parsedUser)
      });

      const result = await response.json();

      if (response.ok) {
       
        setAllAccounts(result.allAccounts);
      }


    }



    fetchProfileInformation();
    fetchAllAccounts();

  }, []);


  useEffect(() => {

    if (!profileInfo || profileInfo?._id == "") {
      return;
    }
    
    else {

      fetchAllPosts();
    }

  }, [profileInfo]);


  async function fetchAllPosts() {
    try {
      const response = await fetch(`http://localhost:3000/uploadPost/fetchPosts/?skip=${currentPostCount}`, { method: "POST" });
      const postsResult = await response.json();

      if (response.ok && response.status == 202) {
        const postsWithDetails = await Promise.all(
          postsResult.shuffledPosts.map(async (post: AllPostsProps) => {

            try {

              const IdInfo = {
                postId: post._id,
                userId: profileInfo?._id,
              }

              const [authorResponse, likeResponse] = await Promise.all([
                fetch(`http://localhost:3000/accounts/fetchOtherUser/${post.author.userId}`, { method: "POST" }),
                fetch(`http://localhost:3000/uploadPost/fetchLikePost`, {

                  method: "POST",
                  headers: {
                    "Content-Type": "application/json"

                  },
                  body: JSON.stringify(IdInfo)

                }),
              ]);

              const authorResult = await authorResponse.json();
              const likeResult = await likeResponse.json();

              setCurrentPostCount(prevCount => prevCount + 1);

              return {
                ...post,
                authorName: authorResponse.ok ? authorResult.userProfile.username : "Unknown",
                likeStatus: likeResponse.ok && likeResponse.status == 200 ? likeResult.likeStatus : false,
              };
            } 
            catch (error) {
              console.error(`Error fetching details for post by ${post.author.userId}:`, error);
              return { ...post, authorName: "Unknown", likeStatus: false };
            }
          })
        );

        setUploadedPosts([...uploadedPosts,  ...postsWithDetails]);
      } 
      if(response.ok && response.status == 201)  {
         setNoMorePost(true);
         
      }
  
    } catch (error) {
      console.error("Error fetching all posts:", error);
      setUploadedPosts([]);
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
      userId: profileInfo?._id
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


      await fetch("http://localhost:3000/uploadPost/remove-likePost", {
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


      await fetch("http://localhost:3000/uploadPost/add-likePost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify(idInfo)
      });

    }

  }


  function handleOpenCommentBox(id : string , username : string , userId : string) {
      
    setPostId(id);
    setSelectedPostUsername(username);
    setUserId(userId);
    setCommentBox(true);
  
  }

  function closeCommentInfoBox(){ 
     setCommentBox(false);
     setPostId("");
  }

 function ProvideInfoToCommentBox() {
   const info = {
    userId : userId,
    username : selectedPostUsername 
   }

   return info;
 }



  if (!profileInfo) {
    return <LoadingScreen />
  }


  return (
    <>

      <div className={styles.topLogos}>

        <div  >
          TalksGram
        </div>


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
                onClick={closeInputBar}  // Call closeInputBar on button click
                style={{
                  position: "fixed",
                  right: "27%",
                  borderRadius: "50%",
                  width: "20px",
                  height: "20px",
                  border: "none",
                  opacity: "0.7",
                  cursor: "pointer"
                }}
              >
                x
              </button>
            </>
            :
            <>
              <FontAwesomeIcon style={{ opacity: "0.5" }} icon={faSearch} />
              <p style={{ opacity: "0.5" }}>Search</p>
            </>
          }
        </div>

        <FontAwesomeIcon onClick={() => navigate("/Notification")} icon={faBell} fontSize={"1.2rem"} style={{ marginRight: "10px" }} />

      </div>



      {/* left side options  */}

      <MenuOptions  profile = {profileInfo} />
   
     { toogleCommentBox &&  <CommentBox id = {postId} toogleBox = {closeCommentInfoBox} userInfoF = {ProvideInfoToCommentBox}/>}
     

      {/* left side options  */}

      {/* center part account and stories  / profile and account suggestions */}
      <div className={styles.rightOptions}>

        <div className={styles.PostAndStories}>


          <div className={styles.Posts}>
            <ul id={styles.Stories}>
              <li>user</li>
              <li>user</li>
              <li>user</li>
              <li>user</li>
            </ul>



            {uploadedPosts.length > 0 ?

              uploadedPosts.map((post, index) => (

                <div key={index} id={styles.eachPosts} >
                  <div id={styles.header}>
                    <div id={styles.profile}>
                      <img width="100%" height="100%" src={`http://localhost:3000/accounts/profileImage/${post?.author.userId}`} alt="" />
                    </div>

                    <p>{post?.authorName}</p>
                  </div>

                  <div id={styles.PostImage}>
                    <img width="100%" height="100%" style={{ borderRadius: "4px", border: "1px solid rgba(128, 128, 128, 0.562)" }} src={`http://localhost:3000/uploadPost/postImage/${post?._id}`} alt="" />
                  </div>

                  <div style={{ cursor: "pointer" }} id={styles.description}>

                    <span><FontAwesomeIcon onClick={() => handleClickLike(post?._id, post?.likeStatus)} icon={faThumbsUp}
                      style={{ color: `${post?.likeStatus ? "BD0553" : "white"}` }} /></span>


                    <span><FontAwesomeIcon icon={faComment} onClick={() => handleOpenCommentBox(post?._id , post?.authorName , post?.author.userId)} /></span>


                    <span><FontAwesomeIcon icon={faShareAlt} />
                    </span>

                  </div>
                  <p style={{ fontWeight: "bolder" }}>{post?.postLike} {post.postLike > 1 ? "likes" : "like"}</p>
                  <p style={{ marginBottom: "10px" }}>{post?.postDescription}</p>

                 
                </div>


              ))


              :

              <LoadingScreen />



            }

 
             { uploadedPosts.length > 0 && 
             <button style={{  border : '1px solid white', display :`${noMorePost ? "none" : "flex" }` , alignItems : "center", justifyContent : "center", 
              color :"white", 
              bottom : "47px", padding : "10px", backgroundColor : "transparent", fontWeight :"bolder",
              fontSize : "2rem", cursor :"pointer",
                position : "relative",  width : "25px" , height : "25px", borderRadius : "50%" }}  
              
             onClick={fetchAllPosts}>+</button> }
          </div>

        </div>


        <div className={styles.profileAndSuggestions}>

          <div className={styles.UserProfile}>
            <div className={styles.userImage}>
              <img src={`http://localhost:3000/accounts/profileImage/${profileInfo?._id}`} width="100%" height="100%" alt="_pic" />
            </div>

            <div>
              <p>{profileInfo?.username}</p>
              <p>{profileInfo?.fullname}</p>
            </div>
          </div>

          <p>Suggested for you   </p>
          <div className={styles.suggestions}>

            {allAccounts ?

              allAccounts.map((item, index) => (

                <div onClick={() => VisitProfile(item._id)} key={index} className={styles.suggestedAccount}>

                  <div id={styles.suggestedProfile}>
                    <img src={`http://localhost:3000/accounts/profileImage/${item._id}`} width="100%" height="100%" alt="_user" />
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


          <div style={{ marginLeft: "20px" }} >
            <span style={{ marginTop: "20px", fontWeight: "100", fontSize: "15px" }}>About,
              Help,
              Press,
              API,
              Jobs,
              Privacy,
              Terms,
              Locations,
              Language
            </span>
            <p style={{ marginTop: "20px", fontWeight: "100", fontSize: "12px" }}>@2024 TALKSGRAM BY VARUN JOSHI</p>
          </div>

        </div>


      </div>

    </>
  )
}

export default AppInterface
