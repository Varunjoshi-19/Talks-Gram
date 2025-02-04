
import { useNavigate, useParams } from 'react-router-dom'
import MenuOptions from './MenuOptions';
import styles from "../Styling/Messages.module.css";
import io from 'socket.io-client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faEdit, faInfoCircle, faSmile, faMicrophone, faImage, faHeart } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useRef, useState } from "react";
import { fetchProfileDetails, GenerateId, fetchChattedUserDetails , fetchCommunicationID } from "../Scripts/FetchDetails.ts";
import LoadingScreen from './LoadingScreen.tsx';

const BACKEND_URL = 'http://localhost:3000';
const socket = io(BACKEND_URL, {
    transports: ["websocket"],
    withCredentials: true,
  });


interface ProfileProps {

    _id: string | any,
    fullname: string,
    username: string,
    followers: number,
    following: number,
    bio: string
}

export interface ChattedUserInfo {

    chatId: string | any,
    userId: string,
    otherUserId: string,
    username: string,
    chat: string

}

interface Chat {
    userId: string | any,
    otherUserId: string | any,
    chatId: string | any;
    username: string;
    initateTime: string;
    chat: string;
}


function Chatting() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [messageInputValue, setMessageInputValue] = useState<string>("");
    const [otherUserDetails, setUserDetails] = useState<ProfileProps | any>();
    const [myProfileDetails, setMyProfileDetails] = useState<ProfileProps  | any>();
    const [AllChattedUsers, setChattedUsers] = useState<ChattedUserInfo[]>([]);
    const [AllChats, setAllChats] = useState<Chat[]>([]);
    const [chatId, setChatId] = useState<string | any>("");
    const [commId , setCommId] = useState<string | any>("");
    const lastMessageRef = useRef<HTMLDivElement | null>(null);


    const leftBackground = "rgba(124, 121, 121, 0.534)";
    const rightBackground = "#1877F2";




    useEffect(() => {
        async function fetchAllData() {
            try {
                const [myDetails, otherDetailsResponse] = await Promise.all([
                    fetchProfileDetails(),
                    fetch(`http://localhost:3000/Personal-chat/fetchUser/${id}`)

                ]);

                const otherDetails = await otherDetailsResponse.json();


                if (otherDetailsResponse.ok) {
                    setMyProfileDetails(myDetails);

                    setUserDetails(otherDetails.userProfile);
                } else {
                    navigate("/error");
                    return;
                }

                const otherProfileId = otherDetails.userProfile?._id;
                const sortedUsers = [myDetails?._id, otherProfileId].sort();
                const combinedString = `${sortedUsers[0]}_${sortedUsers[1]}`;
                const generatedId = await GenerateId(combinedString);
                const fetchId = await fetchCommunicationID(otherProfileId);
                setChatId(generatedId);
                setCommId(fetchId);

            } catch (error) {
                console.error("Error fetching data:", error);
                // navigate("/PageNotFound");
            }
        }

        fetchAllData();
    }, [id]);


    useEffect(() => {



        async function fetchChatsFromDatabase() {

            setAllChats([]);
            const response = await fetch(`${BACKEND_URL}/personal-chat/fetch-all-personal-chats/${chatId}`, {
                method: "POST",
            });

            const result = await response.json();

            if (response.ok) {
              
                setAllChats(result);

            }

        }

        fetchChatsFromDatabase();

    }, [chatId]);



    useEffect(() => {

        if (lastMessageRef.current) {
            lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
        }

  
        socket.on("connect" , () =>  {
            console.log("connnected socket");
        } )

        socket.emit('seen-chat', chatId, myProfileDetails?.username);

        socket.on('chat-receive', (info) => {

            const ChatInfo: Chat = {
                userId: myProfileDetails?._id,
                otherUserId: otherUserDetails?._id,
                chatId: info.chatId,
                username: info.username,
                initateTime: Date.now().toString(),
                chat: info.chat

            }
            setAllChats((prevChats) => [...prevChats, ChatInfo]);
        });




        return () => {
            socket.off('chat-receive');
        };
    }, [chatId, myProfileDetails?.username, AllChats]);


    useEffect(() => {

        async function fetchChattedUser() {
            const users = await fetchChattedUserDetails(myProfileDetails?._id);
            setChattedUsers(users);
        }

        fetchChattedUser();

    }, [myProfileDetails]);





// ------ other functions -------

    function handleSendMessage() {

        if (messageInputValue.trim()) {

            socket.emit('new-chat', {
                chat: messageInputValue,
                username: myProfileDetails?.username,
                chatId: chatId,
                commId : commId
            });

            const ChatInfo: Chat = {
                userId: myProfileDetails?._id,
                otherUserId: otherUserDetails?._id,
                chatId: chatId,
                username: myProfileDetails?.username || '',
                initateTime: Date.now().toString(),
                chat: messageInputValue
            };


            savedChatToDatabases(ChatInfo);

            setMessageInputValue('');
        }
    }

    async function savedChatToDatabases(chat: Chat) {

      await fetch(`${BACKEND_URL}/personal-chat/save-personal-chats`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(chat),
        });


    }

    function handleEnableMessageTab(value: string) {
        const user = JSON.parse(value);
        navigate(`/Personal-chat/${user.userId}`);
    }

    function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {

        if (event.key == "Enter") {
            handleSendMessage();
        }
    }



    return (
        <>
            {!myProfileDetails && !otherUserDetails ? <LoadingScreen /> : <div>

                <MenuOptions profile={myProfileDetails}/>

                <div className={styles.allMessages} >

                    <div className={styles.usernameAndIcon} >
                        <p>{myProfileDetails?.username}</p>
                        <FontAwesomeIcon icon={faEdit} />
                    </div>


                    <div className={styles.notes}>
                        <div id={styles.addNewNote}>
                            +
                        </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", padding: "20px 20px" }} >
                        <p>Messages</p>
                        <p>Requests</p>
                    </div>

                    <div style={{ gap: "20px" }} className={styles.MessagesContainer}>

                        {AllChattedUsers &&

                            AllChattedUsers.map((user, index) => (
                                <div key={index} onClick={() => handleEnableMessageTab(JSON.stringify(user))} style={{ gap: "20px" }} id={styles.userMessage}>
                                    <div id={styles.userIcon}>
                                        <img src={`http://localhost:3000/accounts/profileImage/${user.userId}`} width="100%" height="100%" alt="_image" />
                                    </div>

                                    <div>
                                        <p>{user.username}</p>
                                        <p>{user.chat}</p>
                                    </div>

                                </div>

                            ))
                        }

                    </div>

                </div>



                <>
                    <div style={{ gap: "10px" }} className={styles.chatMessage}>

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>

                            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>

                                <div id={styles.profileIcon}>
                                    <img src={`http://localhost:3000/accounts/profileImage/${id}`} height="100%" width="100%" alt="profile" />
                                </div>

                                <p>{otherUserDetails?.username}</p>
                            </div>

                            <FontAwesomeIcon icon={faInfoCircle} style={{ fontSize: "1.24rem" }} />

                        </div>

                    </div>

                    <div className={styles.ChatMessageContainer}>

                        <div style={{
                            position: "relative", top: "10%",
                            display: "flex", flexDirection: "column", gap: "10px",
                            alignItems: "center"
                        }}>
                            <div id={styles.profileIcon} style={{ width: "90px", height: "90px" }} >
                                <img src={`http://localhost:3000/accounts/profileImage/${id}`} height="100%" width="100%" alt="profile" />
                            </div>
                            <p>{otherUserDetails?.fullname}</p>
                            <button onClick={() => navigate(`/userProfile/${otherUserDetails?._id}`)} style={{
                                padding: "5px 5px", border: "none",
                                borderRadius: "5px", color: "white", backgroundColor: "rgba(124, 121, 121, 0.534)",
                                fontWeight: "bolder", cursor: "pointer"
                            }}>View Profile</button>



                        </div>





                        {AllChats &&
                            AllChats.map((chat, index) => (
                                <div
                                    key={index}
                                    className={
                                        chat.username === myProfileDetails?.username
                                            ? styles.rightSideMessages
                                            : styles.leftSideMessages
                                    }
                                >
                                    <p
                                        style={{
                                            position: "relative",
                                            padding: "10px 10px",
                                            borderRadius: "15px",

                                            backgroundColor:
                                                chat.username === myProfileDetails?.username
                                                    ? rightBackground
                                                    : leftBackground,
                                            alignSelf:
                                                chat.username === myProfileDetails?.username ? "flex-end" : "flex-start",
                                            color: "white", // Ensure consistent text color
                                            maxWidth: "70%", // Adjust width to fit messages
                                        }}
                                    >
                                        {chat.chat}

                                    </p>
                                </div>


                            ))}

                        <div ref={lastMessageRef}></div>
                        <div ref={lastMessageRef}></div>



                        <div className={styles.messageInputBox}>

                            <FontAwesomeIcon icon={faSmile} style={{ fontSize: "1rem" }} />

                            <input onKeyDown={handleKeyDown} placeholder="Message..." value={messageInputValue} onChange={(e) => setMessageInputValue(e.target.value)}
                                type="text" style={{
                                    width: "80%", position: "relative",
                                    backgroundColor: "transparent", border: "none", outline: "none", color: "white", fontSize: "1.05rem"
                                }} />

                            {messageInputValue.length > 0 ?

                                <button onClick={handleSendMessage} id={styles.sendMessageButton} style={{
                                    left: "10px", border: "none",
                                    display: "flex", justifyContent: "right",
                                    padding: "5px 17px", gap: "10px",
                                    backgroundColor: "transparent",
                                    fontWeight: "bolder", cursor: "pointer"
                                }}
                                >Send</button>
                                :
                                <div style={{
                                    position: "relative", left: "10px", display: "flex",
                                    alignItems: "center", justifyContent: "center",
                                    gap: "5px", fontSize: "1rem"
                                }} >
                                    <FontAwesomeIcon icon={faMicrophone} />
                                    <FontAwesomeIcon icon={faHeart} />
                                    <FontAwesomeIcon icon={faImage} />
                                </div>
                            }
                        </div>

                    </div>

                </>


            </div>}


        </>
    )
}

export default Chatting
