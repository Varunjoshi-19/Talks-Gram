import { useUserAuthContext } from '../../Context/UserContext'

interface PostInfoProps {
    format: "row" | "column",
    gap  : string;
}


function PostInfo({ format , gap }: PostInfoProps) {

    const { profile } = useUserAuthContext();

    return (
        <>
            {profile &&

                <div style={{ display: "flex", width: "90%", justifyContent: "space-between", alignItems: "center", gap: "5px" }} >
                    <div style={{ display: "flex", flexDirection: `${format}`, alignItems: "center", gap: `${gap}` }} >
                        <span style={{ fontWeight: "bolder" }} >{profile.post}</span>
                        <span style={{ color: "gray" }} >posts</span>
                    </div>

                    <div style={{ display: "flex", flexDirection: `${format}`, alignItems: "center", gap: `${gap}`}} >
                        <span style={{ fontWeight: "bolder" }} >{profile.followers}</span>
                        <span style={{ color: "gray" }} >followers</span>
                    </div>


                    <div style={{ display: "flex",flexDirection: `${format}`, alignItems: "center", gap: `${gap}` }} >
                        <span style={{ fontWeight: "bolder" }} >{profile.following}</span>
                        <span style={{ color: "gray" }} >following</span>
                    </div>
                </div>
            }

        </>
    )
}

export default PostInfo
