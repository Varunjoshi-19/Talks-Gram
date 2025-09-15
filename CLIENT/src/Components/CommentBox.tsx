import React, { useEffect, useState } from 'react'
import styles from "../Styling/CommentBox.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSmile
} from "@fortawesome/free-solid-svg-icons";
import { MAIN_BACKEND_URL } from '../Scripts/URL.ts';
import { Bookmark, Heart, MessageCircle, Send } from "lucide-react";
import { formattedPostTime, handleTimeFormating, imageExtensions, videoExtensions } from '../Scripts/GetData.ts';
import ShareDilogBox from '../modules/ShareDilogBox.tsx';
import { useGeneralContext } from '../Context/GeneralContext.tsx';
import { useUserAuthContext } from '../Context/UserContext.tsx';
import { CommentProps, PostIdProps, UserInfoProps } from '../Interfaces/index.ts';
import LoadingScreen from './LoadingScreen.tsx';
import defaultImage from "../assets/default.png";



const CommentBox: React.FC<PostIdProps> = ({ id, userImageUrl, postUrl, toogleBox, userInfoF, postType, currentLikes, createdAt }) => {

  const [userInfo, setUserInfo] = useState<UserInfoProps | null>(null);
  const [commentInput, setCommentInput] = useState<string>("");
  const [allComments, setAllComments] = useState<CommentProps[]>([]);
  const [toogleShareDilogBox, setToogleShareDilogBox] = useState<boolean>(false);
  const [likeStatus, setLikeStatus] = useState<boolean>(false);
  const [totalLikes, setTotalLikes] = useState<number>(currentLikes);
  const [showMain, setShowMain] = useState<boolean>(false);
  const [userRef, setUserRef] = useState<any | null>(null);
  const [postRef, setPostRef] = useState<any | null>(null);
  const { fetchPostStatus, handleLikePost } = useGeneralContext();
  const { profile } = useUserAuthContext();

  useEffect(() => {

    if (id == "") return;

    async function fetchAllComments() {

      const info = userInfoF();
      setUserInfo(info);

      const response = await fetch(`${MAIN_BACKEND_URL}/uploadPost/fetch-comments/${id}`, { method: "POST" });

      const result = await response.json();

      if (response.ok) {
        setAllComments(result.comments);
      }

      if (!response.ok) {
        setAllComments([]);

      }


    }

    fetchAllComments();
  }, [id]);

  useEffect(() => {

    (async () => {
      const status = await fetchPostStatus(id);
      const { likeStatus } = status;
      setLikeStatus(likeStatus);
    })();

  }, [id, fetchPostStatus]);


  async function handlePostComment() {

    if (commentInput.trim() != "") {
      const newComment = commentInput;
      setCommentInput("");



      const commentInfo = {
        postId: id,
        userId: profile?._id,
        comment: newComment
      }

      const response = await fetch(`${MAIN_BACKEND_URL}/uploadPost/add-comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(commentInfo)

      })

      const result = await response.json();

      if (response.ok) {
        const commentTime = result.data.initiateTime;

        const timeAgo: string = handleTimeFormating(commentTime);

        setAllComments([{
          userId: {
            _id: profile?._id!,
            name: profile?.username!,
            profileImage: profile?.profileImage!,
          },
          username: profile?.username,
          comment: newComment,
          time: timeAgo,
          initiateTime: commentTime

        },
        ...allComments]);

        setCommentInput("");
      }
      if (!response.ok) {
        setCommentInput("");

      }

    }

  }

  async function handleSharePost() {

    const postObjectRef = {
      _id: id,
      postImage: {
        url: postUrl,
        contentType: "image/jpeg"
      },
      postLike: currentLikes,
      createdAt: createdAt,
    }
    const userobjectRef = {
      _id: userInfo?.userId,
      profileImage: {
        url: postUrl,
        contentType: userImageUrl
      },
      username: userInfo?.username
    }
    setPostRef(postObjectRef);
    setUserRef(userobjectRef);
    setToogleShareDilogBox(prev => !prev);

  }

  async function handleClickLikePost() {
    setLikeStatus(prev => {
      if (!prev) {
        setTotalLikes(prev => prev + 1);
      }
      else {
        setTotalLikes(prev => prev - 1);
      }

      return !prev;
    });

    await handleLikePost(id, likeStatus);

  }


  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMain(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (!showMain || !allComments) {
    return <LoadingScreen />
  }




  return (
    <>

      {toogleShareDilogBox && userRef && postRef &&

        <ShareDilogBox userRef={userRef} postRef={postRef}
          toogleOpenCloseButton={setToogleShareDilogBox} />}


      <div className={styles.CommentBoxContainer} >



      </div>

      <div className={styles.commentBox}>
        <button style={{
          position: "absolute", right: "15px", zIndex: "10", top: "10px",
          color: "white", fontSize: "2rem", backgroundColor: "transparent", border: "none",
          cursor: "pointer"
        }} onClick={toogleBox}>✖</button>

        <div className={styles.postImage}>
          {
            imageExtensions.has(postType) && (
              <img src={postUrl}
                alt="" width="90%" height="100%"
                style={{ borderBottomLeftRadius: "10px", objectFit: "contain", borderTopLeftRadius: "10px" }} />
            )
          }

          {
            videoExtensions.has(postType) && (
              <video src={postUrl}
                autoPlay controls={false}
                width="90%" height="100%"
                style={{ borderBottomLeftRadius: "10px", objectFit: "contain", borderTopLeftRadius: "10px" }} />
            )
          }
        </div>

        <div className={styles.comments} >

          <div id={styles.postedUserInfo} >

            <div id={styles.profileImage}>
              <img src={userImageUrl || defaultImage} alt="" />
            </div>

            <p>{userInfo?.username}</p>

          </div>


          <div className={styles.allComments}>


            {allComments.length > 0 ?


              allComments.map((comment, index) => (


                <div key={index} className={styles.eachComment}>

                  <div id={styles.imageIcon} >
                    <img src={comment.userId?.profileImage?.url || defaultImage}
                      style={{ objectFit: "cover", width: "40px", height: "40px", borderRadius: "50%" }}
                      alt="" />
                  </div>

                  <div id={styles.usernameAndTime}>
                    <p style={{ fontWeight: "bolder", fontSize: "13px", fontFamily: "Helvetica Neue , Helvetica, Arial, sans-serif" }} >{comment.username}</p>
                    <p style={{ fontSize: "12px", marginTop: "5px", opacity: "0.7" }}>{handleTimeFormating(comment.initiateTime - 2000)}</p>
                  </div>

                  <div id={styles.userComment}>
                    <p style={{ fontSize: "15px", opacity: "0.9", fontWeight: "400", fontFamily: "Helvetica Neue , Helvetica, Arial, sans-serif" }} >{comment.comment}</p>
                  </div>

                </div>

              ))

              :


              <div id={styles.noComments} >
                <p style={{ fontSize: "1.4rem", fontWeight: "bolder" }} >No comments yet.</p>
                <p style={{ fontSize: "14px" }} >Start the conversation.</p>
              </div>

            }








          </div>



          <div id={styles.postComment}>
            <div className={styles.LikeOperations}  >
              <div style={{ width: "100%", display: 'flex', alignItems: "center", justifyContent: "space-between" }} >
                <div style={{ display: "flex", gap: "10px", alignItems: "center", justifyContent: "center" }} >
                  <Heart stroke={`${likeStatus ? "red" : "white"}`} fill={`${likeStatus ? "red" : "none"}`} onClick={handleClickLikePost} id={styles.likeItems} />
                  <MessageCircle id={styles.likeItems} />
                  <Send onClick={handleSharePost} id={styles.likeItems} />
                </div>
                <div>
                  <Bookmark id={styles.likeItems} />
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "3px" }} >
                <div style={{ display: "flex", gap: "3px" }} >
                  <span>{totalLikes}</span>
                  <span>{totalLikes > 1 ? "likes" : "like"}</span>
                </div>
                <div>
                  <span>{formattedPostTime(createdAt)}</span>
                </div>
              </div>

            </div>

            <div style={{ width: "100%", display: "flex", alignItems: "center", gap: "10px" }} >
              <FontAwesomeIcon icon={faSmile} style={{ fontSize: "1.2rem" }} />
              <input value={commentInput} onChange={(e) => setCommentInput(e.target.value)}
                type="text" placeholder='Add a comment...' />
              <button onClick={handlePostComment} disabled={commentInput.length > 0 ? false : true}
                style={{ opacity: `${commentInput.length > 0 ? "1" : "0.2"}` }} >Post</button>
            </div>



          </div>





        </div>

      </div>

    </>
  )
}

export default CommentBox
