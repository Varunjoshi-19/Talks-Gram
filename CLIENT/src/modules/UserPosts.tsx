import { MAIN_BACKEND_URL } from "../Scripts/URL";
import styles from "../Styling/Profile.module.css";

interface UserPostProps {
    allPosts: any;
    handleOpenCommentBox: (id: string, userId: string, postType : string,  currentLikes: number, createdAt: string) => void;
}

function UserPosts({ allPosts, handleOpenCommentBox }: UserPostProps) {

    return (
        <>
            {

                allPosts.map((post: any) => (
                    <div
                        key={post._id}
                        className={styles.eachPost}
                        onClick={() =>
                            handleOpenCommentBox(
                                post._id,
                                post.author.userId,
                                post.postImage.contentType,
                                post.postLike || 0,
                                post.createdAt
                            )
                        }
                    >

                        <img
                            src={`${MAIN_BACKEND_URL}/uploadPost/postImage/${post._id}`}
                            alt="post"
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",

                            }}
                        />

                    </div>

                ))}


        </>
    )
}

export default UserPosts
