import styles from "../Styling/Profile.module.css";

interface UserPostProps {
    allPosts: any;
    handleOpenCommentBox: (id: string,  url : string,  userId: string, postType : string,  currentLikes: number, createdAt: string) => void;
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
                                post.postImage.url,
                                post.authorId._id,
                                post.postImage.contentType,
                                post.postLike || 0,
                                post.createdAt
                            )
                        }
                    >

                        <img
                            src={post.postImage?.url}
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
