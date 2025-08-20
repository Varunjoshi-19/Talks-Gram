import { X } from "lucide-react";
import { StoryDilogBoxProps } from "../Interfaces"
import { imageExtensions, videoExtensions } from "../Scripts/GetData";
import sharePostStyle from "../Styling/ShareDilog.module.css";
import shareThoughtStyle from "../Styling/ShareThought.module.css";
import { MAIN_BACKEND_URL } from "../Scripts/URL";
import { useState } from "react";
import LineLoader from "./LineLoader";


function ShareStoryDilog({ id, username, storyFile,
    storyDuration,
    itemUrl, type, closeDilogBox }: StoryDilogBoxProps) {


    const [loader, setLoader] = useState<boolean>(false);

    const handleShareStory = async () => {
        if (!storyFile || !id) {
            alert("not story file")
            return;
        }
        setLoader(true);
        const createdTime = new Date(Date.now());
        const expiredTime = new Date(Date.now() + 60 * 60 * 1000);

        const formData = new FormData();
        formData.append("userId", id);
        formData.append("username", username);
        formData.append("storyDuration", storyDuration.toString());
        formData.append("createdTime", createdTime.toString());
        formData.append("expiredAt", expiredTime.toString());
        formData.append("file", storyFile);


        const storyResponse = await fetch(`${MAIN_BACKEND_URL}/uploadPost/share-story`, {
            method: "POST",
            credentials: "include",
            body: formData
        });

        if (storyResponse.ok) {
            setTimeout(() => {
                closeDilogBox(null);
            }, 1500);
        }

        setLoader(true);
        return;


    }


    return (
        <div className={sharePostStyle.blackBehindContainer} >

            <div className={shareThoughtStyle.centerBoxContainer}
                style={{ width: "400px", height: "600px", padding: "25px 0px" }}>


                <div className={shareThoughtStyle.crossButton}
                    onClick={() => closeDilogBox(null)}
                    title="Close">
                    <X />
                </div>

                <span style={{
                    position: "absolute", left: "40%", cursor: "pointer",
                    top: "20px", fontSize: "1rem", fontWeight: "bolder"
                }}>
                    Share story
                </span>


                <div style={{

                    position: "absolute", right: "15px",
                    top: "10px",
                }}>
                    {
                        loader ?
                            <LineLoader />

                            :

                            <button onClick={handleShareStory} style={{
                                color: "blue", border: "none", cursor: `pointer`,
                                outline: "none", background: "transparent", fontSize: "14px",
                                display: "flex", alignItems: "center", justifyContent: "center", height: "40px"
                            }}
                            >
                                <span>
                                    Share
                                </span>
                            </button>
                    }

                </div>


                {imageExtensions.has(type) &&
                    <img src={itemUrl} alt="" style={{ width: "90%", height: "90%", objectFit: "contain" }} />
                }

                {videoExtensions.has(type) &&
                    <video src={itemUrl} autoPlay loop
                        style={{ width: "inherit", height: "90%", objectFit: "contain" }}
                    />
                }

            </div>
        </div>

    )
}

export default ShareStoryDilog
