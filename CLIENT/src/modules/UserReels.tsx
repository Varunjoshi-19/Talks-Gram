
import styles from "../Styling/UserReels.module.css";
import { MAIN_BACKEND_URL } from "../Scripts/URL";

interface UserReelProps {
    allReels: any;
    handleOpenReel: (id: string, userId: string,  postType : string, currentLikes: number, createdAt: string) => void;
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
                            reel.author.userId,
                            reel.reelVideo.contentType,
                            reel.reelLike,
                            reel.createdAt
                        )
                    }
                >
                    <video
                        src={`${MAIN_BACKEND_URL}/uploadReel/render-reel/${reel._id}`}
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
