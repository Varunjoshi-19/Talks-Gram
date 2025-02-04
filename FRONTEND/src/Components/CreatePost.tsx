import styles from "../Styling/CreatePost.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { useRef, useState } from "react";
import { fetchProfileDetails } from "../Scripts/FetchDetails";

interface CreatePostProps {
    s: () => void; // Define the prop type
}



const CreatePost: React.FC<CreatePostProps> = ({ s }) => {

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [selectedPostImage, setSelectedPostImage] = useState<string | null>(null);
    const [postImage, setPostImage] = useState<File | any>(null);
    const [error, setError] = useState<string | null>(null);
    const [message , setMessage] = useState<string | null>(null); 
    const [caption, setCaption] = useState<string>("");
    const [descriptionBar, setDescriptionBar] = useState<boolean>(false);
    const [imageWidth, setWidth] = useState<string>("100%");


    const [validExtension, setValidExtension] = useState<string | null>(null);

    function handleSelectFile(e: React.ChangeEvent<HTMLInputElement>) {

        const file = e?.target.files?.[0];
        if (file) {

            if (file.name.includes(".")) {

                const extension = file.name.split(".");
                if (extension[1] === "jpeg" || extension[1] === "jpg" || extension[1] === "png") {

                    setValidExtension(extension[1]);

                }
            }

            setPostImage(file);
            const imageUrl = URL.createObjectURL(file);
            setSelectedPostImage(imageUrl);
        
        }
    }

    function handleButtonClick() {

        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    }

    async function handlePostImage() {


        const profile = await fetchProfileDetails();
        if (!profile) {
            setError("Failed to Post");
            return;
        }

        if (profile && postImage) {
            const formData = new FormData();
            formData.append("profile", JSON.stringify(profile)); // Profile data
            formData.append("postImage", postImage); // File data
            formData.append("caption", caption); // set the description

            try {
                const response = await fetch("http://localhost:3000/uploadPost/newPost", {
                    method: "POST",
                    body: formData, // Directly pass FormData; do not set headers manually
                });

                const result = await response.json();

                if (response.ok) {
                    setMessage(result.message);
                   setTimeout(() => { 
                    s();
                   } , 1500);
                } else {
                    setError(result.error);
                }
            } catch (error) {
                console.error("Error posting image:", error);
                setError("Failed to Post");
            }
        } else {
            setError("No image selected");
        }
    }


    function EnableDescriptionBar() {
        setDescriptionBar(true);
        console.log(error);
        setWidth("60%");
    }

    return (
        <>
            <div className={styles.UploadPostContainer} >


            <button style={{
                    position: "absolute", right: "10px",
                    color: "white", fontSize: "2rem", backgroundColor: "transparent", border: "none",
                    cursor: "pointer"
                }} onClick={s}>✖</button>
            </div>

            <div id={styles.uploadPost}  >
                {selectedPostImage ?

                    <div style={{
                        width: "100%"

                    }} >
                        <div style={{
                            display: "flex", opacity: "1",
                            height: "10%", width: "100%",
                            borderTopLeftRadius: "10px", borderTopRightRadius: "10px", backgroundColor: "black",
                            alignItems: " center", justifyContent: "space-between"
                        }}>

                            <p style={{ fontWeight: "bolder", marginLeft: "4px" }} >Upload New Post</p>
                            <button disabled={validExtension ? false : true} onClick={EnableDescriptionBar} style={{
                                padding: "2px 5px", marginRight: "4px", border: "none", display: `${descriptionBar ? "none" : "flex"}`,
                                cursor: "pointer", fontWeight: "bolder", borderRadius: "2px",
                                color: "white", backgroundColor: "#1877F2", opacity: `${validExtension ? '1' : '0.2'}`
                            }} >Next</button>

                        </div>



                        <div style={{
                            width: "100%", height: "90%", borderBottomRightRadius: "10px", borderBottomLeftRadius: "10px", display: "flex",
                            alignItems: "center"
                        }} >

                            {validExtension ?
                                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center" }} >
                                    <img src={selectedPostImage} style={{ borderRight: "2px solid white" }} alt="_postImage" height="100%" width={imageWidth} />

                                    {descriptionBar && <div style={{
                                        alignItems: "center", flexDirection: "column",
                                        color: "white", height: "inherit", width: "40%", gap: "20px",
                                        display: `${validExtension ? "flex" : "none"}`
                                    }}>
                                        <p> Caption :</p>

                                        <textarea value={caption} onChange={(e) => setCaption(e.target.value)} style={{
                                            width: "95%", outline: "none", height: "50%",
                                            borderBottomRightRadius: "5px", borderBottomLeftRadius: "5px", border: "none", resize: "none"
                                        }} placeholder="about post...." />


                                        <button onClick={handlePostImage} style={{
                                            padding: "10px 10px", marginRight: "4px", border: "none",
                                            cursor: "pointer", fontWeight: "bolder", borderRadius: "5px",
                                            color: "white", backgroundColor: "#1877F2"
                                        }}>

                                            Post

                                        </button>

                                     <p style={{ color : "green" }}>{message}</p>
                                    </div>

                                    }


                                </div>
                                :

                                <div style={{
                                    width: "50%", height: "20%",
                                    display: "flex", justifyContent: "center", color: "red", fontWeight: "bolder"
                                }} >
                                    Invalid file Format
                                </div>

                            }

                        </div>

                    </div>


                    :


                    <>

                        <div style={{
                            display: "flex", opacity: "1", position: "relative",
                            height: "10%", width: "100%",
                            borderTopLeftRadius: "10px", borderTopRightRadius: "10px", backgroundColor: "black",
                            alignItems: " center", justifyContent: "center"
                        }}>

                            <p style={{ fontWeight: "bolder" }} >Create new Post</p>
                        </div>


                        <div style={{
                            display: "flex", flexDirection: 'column',
                            alignItems: "center", justifyContent: "center", position: "absolute",
                            gap: "10px", top: "40%", left: "23%"
                        }} >

                            <FontAwesomeIcon icon={faImage} size="3x" />
                            <p style={{ fontSize: "1.25rem" }}>Drag photos and videos here</p>
                            <button onClick={handleButtonClick} style={{
                                padding: "7px 7px", fontWeight: "bolder"
                                , backgroundColor: "#1877F2", border: "none",
                                cursor: "pointer", borderRadius: "5px", color: "white"
                            }} >Select From Computer</button>


                            <input type="file"
                                ref={fileInputRef}
                                onChange={handleSelectFile}
                                style={{ display: "none" }}
                            />
                        </div>


                    </>


                }



            </div>


        </>


    )
}

export default CreatePost
