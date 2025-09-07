
import styles from "../Styling/UserReels.module.css";

interface UserReelProps {
    allReels: any;
    handleOpenReel: (id: string,  url : string, userId: string,  postType : string, currentLikes: number, createdAt: string) => void;
}

function UserReels({ allReels, handleOpenReel }: UserReelProps) {

    return (
        <>
            {allReels.map((reel: any) => (
                <div
                    key={reel._id}
                    className={styles.eachReel}
                    onClick={() =>
                        handleOpenReel(
                            reel._id,
                            reel.reelVideo.url,
                            reel.authorUserId._id,
                            reel.reelVideo.contentType,
                            reel.reelLike,
                            reel.createdAt
                        )
                    }
                >
                    <video
                        src={reel.reelVideo.url}
                        className={styles.reelVideo}
                        controls={false}
                        preload="metadata"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        poster={reel.thumbnailUrl || undefined}
                        tabIndex={-1}
                        playsInline
                        muted
                    />
                </div>
            ))}
        </>
    );
}

export default UserReels;
