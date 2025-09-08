import { useNavigate } from "react-router-dom";
import { useChatContext } from "../Context/ChattedUserContext"
import { ChattedUserPayload, CountMessages, handleTimeFormating } from "../Scripts/GetData";
import styles from '../Styling/Messages.module.css';
import { useUserAuthContext } from "../Context/UserContext";
import { fetchUserNote, seenAllChats } from "../Scripts/FetchDetails";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import ShareThoughtDilogBox from "./ShareThoughtDilogBox";
import { useEffect, useState } from "react";
import profileStyles from "../Styling/Profile.module.css";
import ToMessage from "../Components/ToMessage";
import Thought from "../UI/Thought";
import { useToogle } from "../Context/ToogleContext";
import defaultImage from '../assets/default.png';

function ChattedUser() {

    const { AllChattedUsers, setChattedUsers, setMessageCount } = useChatContext();
    const [shareNote, setShareNote] = useState<boolean>(false);
    const [toogleButton, setToogleButton] = useState<boolean>(false);
    const { profile } = useUserAuthContext();

    const navigate = useNavigate();
    const [note, setNote] = useState<any>();
    const { setNewUserToogled } = useToogle();

    useEffect(() => {

        (async () => {
            if (profile) {
                const note = await fetchUserNote(profile._id);
                setNote(note);
            }
        })();

    }, [profile]);


    async function handleEnableMessageTab(_: string, value: string) {
        const user: any = JSON.parse(value);

        if (!profile) return;


        setNewUserToogled(`${user.userId}`);

        navigate(`/accounts/inbox/messages/Personal-chat/${user.userId}`);

        let iteratorCount = 0;
        setChattedUsers(prevChattedUser => {
            const newMap = new Map(prevChattedUser);
            if (user && user.userId) {
                const value = newMap.get(user.userId);
                if (value) {
                    iteratorCount = value.unseenCount;
                    value.unseenCount = 0;
                }
            }
            setMessageCount(CountMessages(newMap));
            return newMap;

        })



        if (user.yourMessage) {
            return;
        }


        const receiverId = profile._id;
        const senderId = user.userId;

        for (let i = 0; i < iteratorCount; i++) {
            setMessageCount(prevCount => prevCount - 1);
        }
        await seenAllChats(senderId, receiverId);

    }

    async function redirectToChattingPage(otherUserInfo: string) {
        const parsedOtherUserInfo = JSON.parse(otherUserInfo);
        setNewUserToogled(`${parsedOtherUserInfo._id}`);
        const otherProfileId = parsedOtherUserInfo._id;
        navigate(`/accounts/inbox/messages/Personal-chat/${otherProfileId}`);


    }

    if (!profile) return;


    return (
        <>

            {
                shareNote &&

                <ShareThoughtDilogBox
                    setNote={setNote}
                    userId={profile._id} closeDilogBox={setShareNote}
                    imageSrc={profile?.profileImage?.url || defaultImage} />
            }

            {toogleButton && <ToMessage toogleButton={setToogleButton} EnableMessageTab={redirectToChattingPage} />}

            <div className={styles.allMessages} >

                <div className={styles.usernameAndIcon} >
                    <p>{profile?.username}</p>
                    <FontAwesomeIcon onClick={() => setToogleButton(prev => !prev)}
                        icon={faEdit} style={{ cursor: "pointer" }} />
                </div>


                <div className={styles.notes}>
                    <div id={styles.addNewNote} >
                        {
                            note ?
                                <Thought thought={note.noteMessage} toogleBox={setShareNote} />
                                :

                                <div onClick={() => setShareNote(prev => !prev)}
                                    style={{ left: "0px", top: "-30px" }}
                                    className={profileStyles.shareANote} >
                                    <span style={{ opacity: "0.8" }} >Share a note</span>
                                </div>
                        }



                        <img
                            src={profile?.profileImage?.url || defaultImage}
                            style={{ borderRadius: "50%", objectFit: "contain", }}
                            alt="_profileImage" width="100%" height="100%" />
                    </div>

                    {/* other people posted notes will displayed over here */}



                </div>

                <div style={{ display: "flex", justifyContent: "space-between", padding: "20px 20px" }} >
                    <span>Messages</span>
                    <span>Requests</span>
                </div>



                <div style={{ gap: "20px" }} className={styles.MessagesContainer}>


                    {AllChattedUsers && AllChattedUsers.size > 0 &&

                        Array.from(AllChattedUsers).map(([key, value]: [key: string, value: ChattedUserPayload]) => (

                            <div key={key} onClick={() => handleEnableMessageTab(key, JSON.stringify(value))} style={{ gap: "20px" }} id={styles.userMessage}>
                                <div id={styles.userIcon}>
                                    <img src={value.profileImage || defaultImage} width="100%" height="100%" alt="_image" />
                                </div>

                                <div>
                                    <p style={{ opacity: "0.9" }}>{value.username}</p>
                                    {value.unseenCount > 0 ?


                                        <span style={{ fontWeight: "bolder", fontSize: "13px" }}>{value.unseenCount} unread message
                                            {value.initateTime && <span style={{ marginLeft: "4px", fontWeight: "lighter", fontSize: "12px" }}>• {handleTimeFormating(Number(value.initateTime))}</span>}
                                        </span>

                                        :

                                        <span style={{ opacity: "0.5" }}>{profile.username != value.checkName ? `${value.checkName}` : "You"}• {value.recentChat ? value.recentChat : "some attactment"}</span>
                                    }
                                </div>
                                {value.unseenCount > 0 &&
                                    <span
                                        style={{
                                            position: "absolute", right: "30px", width: "10px", height: "10px",
                                            backgroundColor: "blue", borderRadius: "50%"

                                        }}></span>}
                            </div>

                        ))

                    }




                </div>
            </div>

        </>

    )
}

export default ChattedUser
