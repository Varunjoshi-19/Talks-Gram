import React, { useEffect, useState } from 'react'
import styles from "../Styling/CommentBox.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSmile
} from "@fortawesome/free-solid-svg-icons";
import { fetchOtherUserDetails, fetchProfileDetails } from "../Scripts/FetchDetails.ts";



interface UserInfoProps {
  username: string,
  userId: string
}

interface PostIdProps {

  id: string;
  toogleBox: () => void;
  userInfoF: () => UserInfoProps

}

interface ProfileInfo {
  _id: string,
  username: string,

}

interface CommentProps {
  userId: string | any,
  username: string | any,
  comment: string,
  time: string,
  initiateTime: number
}



const CommentBox: React.FC<PostIdProps> = ({ id, toogleBox, userInfoF }) => {

  const [userInfo, setUserInfo] = useState<UserInfoProps | null>(null);
  const [commentInput, setCommentInput] = useState<string>("");
  const [allComments, setAllComments] = useState<CommentProps[]>([]);
  const [profileInfo, setProfileInfo] = useState<ProfileInfo>();

  useEffect(() => {

    if (id == "") return;

    async function fetchAllComments() {

      const info = userInfoF();
      setUserInfo(info);

      const response = await fetch(`http://localhost:3000/uploadPost/fetch-comments/${id}`, { method: "POST" });

      const result = await response.json();

      if (response.ok) {

        const commentsWithUsernames = await Promise.all(
          result.comments.map(async (item: CommentProps) => {

            const commentResponse = await fetchOtherUserDetails(item.userId);
            const timeAgo = handleTimeFormating(item.initiateTime);

            return {
              ...item,
              username: commentResponse?.username || "unknown user",
              time: timeAgo
            };
          })
        );

        setAllComments(commentsWithUsernames);
      }

      if (!response.ok) {
        setAllComments([]);

      }


    }

    async function fetchProfileInfo() {
      const profile = await fetchProfileDetails();
      setProfileInfo(profile);
    }

    fetchAllComments();
    fetchProfileInfo();
  }, [id]);


  async function handlePostComment() {

    if (commentInput.trim() != "") {
      const newComment = commentInput;
      setCommentInput("");



      const commentInfo = {
        postId: id,
        userId: profileInfo?._id,
        comment: newComment
      }

      const response = await fetch("http://localhost:3000/uploadPost/add-comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(commentInfo)

      })

      const result = await response.json();

      if (response.ok) {

        const commentTime = result.comment.initiateTime;

        const timeAgo: string = handleTimeFormating(commentTime);

        setAllComments([{
          userId: profileInfo?._id,
          username: profileInfo?.username,
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


  function handleTimeFormating(previousTime: number) {

    const timeNow = Date.now();
    let timeAgo;
    const seconds = Math.floor((timeNow - previousTime) / 1000);

    if (seconds < 60) {
      timeAgo = `${seconds} sec`;
      return timeAgo;
    }
    const minutes = Math.floor(seconds / 60);

    if (minutes < 60) {
      timeAgo = `${minutes} min`;
      return timeAgo;
    }
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      timeAgo = `${hours} hr`;
      return timeAgo;
    }

    const days = Math.floor(hours / 24);
    if (days == 1) {
      timeAgo = `${days} day`;
      return timeAgo;
    }
    else {
      timeAgo = `${days} days`
      return timeAgo;
    }

  }

  return (
    <>
      <div className={styles.CommentBoxContainer} >

        <button style={{
          position: "absolute", right: "10px",
          color: "white", fontSize: "2rem", backgroundColor: "transparent", border: "none",
          cursor: "pointer"
        }} onClick={toogleBox}>✖</button>

      </div>

      <div className={styles.commentBox}>

        <div className={styles.postImage}>
          <img src={`http://localhost:3000/uploadPost/postImage/${id}`}
            alt="" width="100%" height="100%"
            style={{ borderBottomLeftRadius: "10px", borderTopLeftRadius: "10px" }} />
        </div>

        <div className={styles.comments} >

          <div id={styles.postedUserInfo} >

            <div id={styles.profileImage}>
              <img src={`http://localhost:3000/accounts/profileImage/${userInfo?.userId}`} alt="" />
            </div>

            <p>{userInfo?.username}</p>

          </div>

          <div className={styles.allComments}>


            {allComments.length > 0 ?


              allComments.map((comment, index) => (


                <div key={index} className={styles.eachComment}>

                  <div id={styles.imageIcon} >
                    <img src={`http://localhost:3000/accounts/profileImage/${comment.userId}`}
                      style={{ width: "40px", height: "40px", borderRadius: "50%" }}
                      alt="" />
                  </div>

                  <div id={styles.usernameAndTime}>
                    <p style={{ fontWeight: "bolder" }} >{comment.username}</p>
                    <p style={{ fontSize: "12px" }}>{comment.time}</p>
                  </div>

                  <div id={styles.userComment}>
                    <p style={{ fontSize: "15px" }} >{comment.comment}</p>
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
            <FontAwesomeIcon icon={faSmile} style={{ fontSize: "1.2rem" }} />
            <input value={commentInput} onChange={(e) => setCommentInput(e.target.value)}
              type="text" placeholder='Add a comment...' />
            <button onClick={handlePostComment} disabled={commentInput.length > 0 ? false : true}
              style={{ opacity: `${commentInput.length > 0 ? "1" : "0.2"}` }} >Post</button>

          </div>





        </div>

      </div>

    </>
  )
}

export default CommentBox
