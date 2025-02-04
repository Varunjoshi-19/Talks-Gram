import { useState, useRef } from 'react'
import MenuOptions from './MenuOptions'
import { useEffect } from "react";
import styles from "../Styling/reels.module.css";
import { ProfileInfo } from './AppInterface';

import video1 from "../video/1.mp4";

interface videoProps {

    video: string,
    refer: string
}



function Reels() {

    const [profileInfo, setProfileInfo] = useState<ProfileInfo | any>();

     const videos = [

       { 
        video : video1,
        refer : "",

       },


       { 
        video : video1,
        refer : "",
        
       }


     ]


    const reelContainer = useRef<HTMLDivElement | null>(null);
    const [isInViewport, setIsInViewport] = useState<boolean>(false);



    // useEffect(() => {
          

    //   vid


    // }, []);


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

        fetchProfileInformation();

    }, []);


    // const checkViewport = (index) => {
    //     if (videoRef.current) {
    //         const rect = videoRef[index].current.getBoundingClientRect();
    //         const container = reelContainer.current?.getBoundingClientRect();

    //         console.log("reel container ->", container?.top);
    //         console.log("each reel ->", rect?.top);
    //     }
    // };

    // const handlePlayClick = () => {
    //     if (videoRef.current) {
    //         videoRef.current.play();
    //         setIsInViewport(true);
    //     }
    // };


    return (
        <>


            <MenuOptions profile={profileInfo} />

            <div className={styles.reelsContainer}>

                <div ref={reelContainer} className={styles.reelsLayout}>



                    {/* {vidoes.map((video, index) => (

                        <div  onMouseEnter={}  key={index}  className={styles.eachReels}>


                            <video ref={videoRef} autoPlay={isInViewport}
                                muted
                                loop

                                src={video} width="100%" height="100%">
                            </video>

                            {!isInViewport && (
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        fontSize: '2rem',
                                        color: '#fff',
                                        cursor: 'pointer',
                                    }}
                                    onClick={handlePlayClick}
                                >
                                    ▶
                                </div>
                            )}


                        </div>
                    ))} */}




                </div>

            </div>




        </>
    )
}

export default Reels
