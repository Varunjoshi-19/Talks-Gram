import { useNavigate, useParams } from 'react-router-dom'
import styles from "../Styling/Messages.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faInfoCircle, faSmile, faPause, faMicrophone, faImage, faHeart, faImages, faPlay } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useRef, useState } from "react";
import { fetchAllData, fetchUserOnlineStatus } from "../Scripts/FetchDetails.ts";
import LoadingScreen from './LoadingScreen.tsx';
import {
    ProfileProps, InfoDataType, BufferedDataType, AdditionalDataType,
    ShowFile, AudioData, Chat,
} from "../Scripts/GetData.ts";
import { MAIN_BACKEND_URL } from '../Scripts/URL.ts';
import { useSocketContext } from '../Context/SocketContext.tsx';
import CommentBox from './CommentBox.tsx';
import LocalImagesAndVideos from '../modules/LocalImagesAndVideos.tsx';
import { Play } from 'lucide-react';
import { useUserAuthContext } from '../Context/UserContext.tsx';
import { useToogle } from '../Context/ToogleContext.tsx';
import defaultImage from "../assets/default.png";



function Chatting() {

    const { id } = useParams();


    const navigate = useNavigate();
    const { profile } = useUserAuthContext();
    const { newUserToogled } = useToogle();

    const videoExtension = ["mp4", "video/mp4", "webm", "ogg"];
    const imageExtension = ["jpg", "image/png", "image/jpg", "image/jpeg", "jpeg", "png", "gif", "webp"];
    const audioExtension = ["mp3", "wav", "audio/wav", "ogg"];

    const { socket } = useSocketContext();
    const [messageInputValue, setMessageInputValue] = useState<string>("");
    const [otherUserDetails, setUserDetails] = useState<ProfileProps | any>();
    const [AllChats, setAllChats] = useState<Chat[]>([]);
    const [chatId, setChatId] = useState<string | any>("");
    const [chatLoaded, setChatLoaded] = useState<boolean>(false);
    const [chatSkip, setChatSkip] = useState<number>(0);
    const [disableFetchMess, setDisableFetchMessage] = useState<boolean>(false);
    const inputMessageRef = useRef<HTMLInputElement>(null);
    const sendMessageButtonRef = useRef<HTMLButtonElement>(null);
    const lastMessageRef = useRef<HTMLDivElement | null>(null);



    // video and image stuff
    const [showMultipleItems, setShowMultipleItems] = useState<ShowFile[]>([]);
    const [multipleItemSelected, setMultipleItemsSelected] = useState<File[]>([]);
    const fileRef = useRef<HTMLInputElement>(null);
    const [bufferedData, setBufferedData] = useState<BufferedDataType[]>([]);
    // video and image stuff



    // recorder stuff
    const maxTimeOfRecording = 3 * 60;
    const [mediaRecoder, setMediaRecoder] = useState<MediaRecorder | null>(null);
    const [recording, setRecording] = useState<boolean>(false);
    const [audioUrl, setAudioUrl] = useState<any | null>(null);
    const [audioFileBlob, setAudioFileBlob] = useState<Blob | null>(null);
    const [runningTimer, setRunningTimer] = useState<number>(0);
    const [audioDataInfo, setAudioDataInfo] = useState<AudioData | null>();
    const recoderDivRef = useRef<HTMLDivElement>(null);
    const [progress, setProgress] = useState(0);
    const [playOrPause, setPlayOrPause] = useState<boolean>(false);
    const [toogleCommentBox, setCommentBox] = useState<boolean>(false);
    const [postId, setPostId] = useState<string>("");
    const [selectedPostUsername, setSelectedPostUsername] = useState<string>("");
    const [userId, setUserId] = useState<string>("");
    const [currentPostLikes, setCurrentPostLikes] = useState<number>(0);
    const [currentPostDate, setCurrentPostDate] = useState<string>("");
    const [selectedItem, setItem] = useState<string>("");
    const [displaySelectedItem, setSelectedItem] = useState<boolean>(false);
    const [typeOfItem, setTypeOfItem] = useState<string>("");
    const [userOnlineStatus, setUserOnlineStatus] = useState<boolean>(false);
    const [postType, setPostType] = useState<string>("");
    const [postUrl, setPostUrl] = useState<string | null>(null);
    const [profileUrl, setProfileUrl] = useState<string>("null");
    const [showMain, setShowMain] = useState<boolean>(false);
    const recordedAudioRef = useRef<HTMLAudioElement>(null);
    let audioChunks: Blob[] = [];
    let stream;
    let recorder;
    let recoderIntervalId: any;
    let recorderTimeout: any;
    // recorder stuff


    const chatContainerRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
        ResetEverythingOnDom();
    }, [newUserToogled])


    useEffect(() => {

        socket.on("user-online", (userId) => {
            if (userId === id) {

                setUserOnlineStatus(true);
            }

        });

        socket.on("online", (userId) => {
            if (userId === id) {
                setUserOnlineStatus(true);
            }
        })

        socket.on("offline", (userId) => {
            if (userId === id) {
                setUserOnlineStatus(false);
            }
        })

        return () => {
            socket.off("online");
            socket.off("user-online");
            socket.off("offline");
        };

    }, [id, socket]);


    useEffect(() => {


        if (lastMessageRef.current) {

            lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
        }


        socket.emit('seen-chat', chatId, profile?.username);

        socket.on('chat-receive', (info) => {

            const ChatInfo: Chat = {
                userId: profile?._id,
                otherUserId: otherUserDetails?._id,
                chatId: info.chatId,
                senderUsername: info.senderUsername,
                receiverUsername: otherUserDetails.username,
                initateTime: Date.now().toString(),

            }
            if (info.chat) {
                ChatInfo.chat = info.chat;
            }

            if (info.audioData && info.audioData.blobFile) {
                const blob = new Blob([info.audioData.blobFile], { type: `audio/${info.audioData.extension}` });
                const url = URL.createObjectURL(blob);

                const tempData: ShowFile = {
                    actualBlob: url,
                    extensionName: info.audioData.extension
                };

                // Ensure `temporaryAddData` exists
                ChatInfo.temporaryAddData = ChatInfo.temporaryAddData || [];
                ChatInfo.temporaryAddData.push(tempData);
            }

            if (info.sharedContent) {
                ChatInfo.sharedContent = info.sharedContent;
            }

            if (info.AdditionalInfoData) {


                const tempData: ShowFile[] = info.AdditionalInfoData.map((each: BufferedDataType) => {
                    const blob = new Blob([each.file], { type: each.extension })
                    const url = URL.createObjectURL(blob);

                    return {
                        actualBlob: url,
                        extensionName: each.extension
                    }
                })
                ChatInfo.temporaryAddData = tempData;

            }

            setAllChats((prevChats) => [...prevChats, ChatInfo]);
        });




        return () => {
            socket.off('chat-receive');
        };
    }, [chatId, profile, AllChats]);


    useEffect(() => {

        if (!mediaRecoder) return;

        recoderIntervalId = setInterval(() => {
            setRunningTimer((prev) => prev + 1);
            setProgress((prev) => Math.min(prev + (100 / maxTimeOfRecording), 100));
        }, 1000);


        const recorderTimeout = setTimeout(() => {
            clearInterval(recoderIntervalId);
        }, maxTimeOfRecording * 1000);

        mediaRecoder.ondataavailable = (event: BlobEvent) => {
            audioChunks.push(event.data);
        }

        mediaRecoder.onstop = () => {

            const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
            setAudioDataInfo({ blobFile: audioBlob, extension: "wav" });
            const audioUrl = URL.createObjectURL(audioBlob);
            setAudioFileBlob(audioBlob);
            setAudioUrl(audioUrl);
            audioChunks = [];

            if (recoderDivRef.current) recoderDivRef.current.style.transition = "none";
            setRunningTimer(0);
            setProgress(0);
            clearInterval(recoderIntervalId);
            clearTimeout(recorderTimeout);
        }


        return () => {
            clearInterval(recoderIntervalId);
            clearTimeout(recorderTimeout);
        };


    }, [mediaRecoder]);


    useEffect(() => {

        document.body.style.overflowY = "hidden";

        async function fetchAllBothUserData() {
            const data = await fetchAllData(profile, id!);
            const { success, receiverDetails, chatId } = data;
            if (!success) {
                navigate("/error");
                return;
            }

            setUserDetails(receiverDetails);
            setChatId(chatId);

        }

        async function handleGetOnlineStatus() {
            const status = await fetchUserOnlineStatus(id!);
            setUserOnlineStatus(status);
        }


        fetchAllBothUserData();
        handleGetOnlineStatus();
    }, [id]);


    useEffect(() => {
        fetchChatsFromDatabase();
    }, [chatId]);


    useEffect(() => {
        const timer = setTimeout(() => {
            setShowMain(true);
        }, 500);

        return () => clearTimeout(timer);
    }, []);



    // ------ other handling functions -------  // 

    function handleSendMessage() {

        if (!profile) return;

        if (messageInputValue.length > 0) {

            if (messageInputValue.trim()) {

                // for others 
                const InfoData: InfoDataType = {
                    chat: messageInputValue,
                    senderUsername: profile?.username,
                    receiverUsername: otherUserDetails.username,
                    chatId: chatId,


                }
                // for local me 
                const ChatInfo: Chat = {
                    userId: profile?._id,
                    otherUserId: otherUserDetails?._id,
                    chatId: chatId,
                    senderUsername: profile?.username || '',
                    receiverUsername: otherUserDetails.username || '',
                    initateTime: Date.now().toString(),
                    chat: messageInputValue,
                };

                socket.emit('new-chat', InfoData);
                savedChatToDatabases(ChatInfo);



                if (multipleItemSelected.length > 0) {

                    const MInfoData: InfoDataType = {
                        AdditionalInfoData: bufferedData,
                        senderUsername: profile?.username,
                        receiverUsername: otherUserDetails.username,
                        chatId: chatId,

                    }

                    const MChatInfo: Chat = {
                        userId: profile?._id,
                        otherUserId: otherUserDetails?._id,
                        chatId: chatId,
                        senderUsername: profile?.username || '',
                        receiverUsername: otherUserDetails.username || '',
                        initateTime: Date.now().toString(),
                        AdditionalData: multipleItemSelected
                    };

                    socket.emit('new-chat', MInfoData);
                    saveAdditionalInfo(MChatInfo);

                }


                setMessageInputValue('');
                setMultipleItemsSelected([]);
                setShowMultipleItems([]);
                setBufferedData([]);

            }

        }

        else if (multipleItemSelected.length > 0) {


            const InfoData: InfoDataType = {
                AdditionalInfoData: bufferedData,
                senderUsername: profile?.username,
                receiverUsername: otherUserDetails.username,
                chatId: chatId,

            }

            const ChatInfo: Chat = {
                userId: profile?._id,
                otherUserId: otherUserDetails?._id,
                chatId: chatId,
                senderUsername: profile?.username || '',
                receiverUsername: otherUserDetails.username || '',
                initateTime: Date.now().toString(),
                AdditionalData: multipleItemSelected
            };

            socket.emit('new-chat', InfoData);

            saveAdditionalInfo(ChatInfo);
            setMessageInputValue('');
            setMultipleItemsSelected([]);
            setShowMultipleItems([]);
            setBufferedData([]);


        }

        else if (audioFileBlob) {

            const InfoData: InfoDataType = {

                audioData: audioDataInfo,
                senderUsername: profile?.username,
                receiverUsername: otherUserDetails.username,
                chatId: chatId,


            }

            const ChatInfo: Chat = {
                userId: profile?._id,
                otherUserId: otherUserDetails?._id,
                chatId: chatId,
                senderUsername: profile?.username || '',
                receiverUsername: otherUserDetails.username || '',
                initateTime: Date.now().toString(),
                AdditionalData: audioDataInfo
            };




            socket.emit('new-chat', InfoData);

            saveAudioDataInfo(ChatInfo);
            setMessageInputValue('');
            ResetEverythingOnDom();
            setMultipleItemsSelected([]);
            setShowMultipleItems([]);
            setBufferedData([]);
        }

        if (profile._id === otherUserDetails._id) {
            return;
        }

        const reelTimeData = {
            senderId: profile._id,
            receiverId: otherUserDetails._id,
            userId: profile._id,
            chatId: chatId,
            yourMessage: false,
            checkName: profile.username,
            username: profile.username,
            seenStatus: false,
            initateTime: Date.now() - 2 * 1000,
            recentChat: messageInputValue || null,
            unseenCount: 0

        }
        socket.emit("new-message", reelTimeData);


    }

    async function fetchChatsFromDatabase() {

        setChatLoaded(false);
        setTimeout(() => {

        }, 4000);
        const response = await fetch(`${MAIN_BACKEND_URL}/Personal-chat/fetch-all-personal-chats/${chatId}?chatSkip=${chatSkip}`, {
            method: "POST",
        });

        const result = await response.json();


        if (response.ok && response.status == 202) {
            if (!result.messageAvaliable) {
                setDisableFetchMessage(true);
                setChatLoaded(true);
                return;
            }
        }

        if (response.ok) {
            console.log(result);
            if (chatSkip > 0) {

                setAllChats(prevChats => [...result, ...prevChats]);
                setChatSkip(prev => prev + 10);

            }
            else {

                setAllChats(result);
                setChatSkip(prev => prev + 10);
            }

        }


        setChatLoaded(true);
    }

    async function savedChatToDatabases(chat: Chat) {
        await fetch(`${MAIN_BACKEND_URL}/personal-chat/save-personal-chats`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(chat),
        });


    }

    async function saveAdditionalInfo(AdditionalInfo: Chat) {


        const formData = new FormData();

        formData.append("allData", JSON.stringify(AdditionalInfo));

        AdditionalInfo.AdditionalData?.forEach((file: any) => {
            formData.append("files", file);
        })


        await fetch(`${MAIN_BACKEND_URL}/personal-chat/additionalInfo-message`, {
            method: "POST",
            body: formData
        });


    }

    async function saveAudioDataInfo(ChatInfo: Chat) {

        const audioFile = ChatInfo.AdditionalData.blobFile;
        const formData = new FormData();

        formData.append("audioData", JSON.stringify(ChatInfo));
        formData.append("audioFile", audioFile);

        await fetch(`${MAIN_BACKEND_URL}/personal-chat/audioDataInfo-message`, {
            method: "POST",
            body: formData
        });

    }

    function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {

        if (event.key == "Enter") {
            handleSendMessage();
        }
    }

    function handleSelectedFile(e: React.ChangeEvent<HTMLInputElement>) {

        const file = e.target.files?.[0];

        if (file) {
            const extension = file.name.split(".")[1];

            if (extension == "mp4" || extension == "jpeg" || extension == "jpg" || extension == "png") {


                const fileReader = new FileReader();

                fileReader.onload = function (e) {
                    const arrayBuffer = e.target?.result;

                    setBufferedData(prev => [...prev, { file: arrayBuffer, extension: extension }]);
                }

                fileReader.readAsArrayBuffer(file);

                setMultipleItemsSelected(prev => [...prev, file]);
                const showFile = URL.createObjectURL(file);
                setShowMultipleItems(prev => [...prev, { extensionName: extension, actualBlob: showFile }]);
            }


        }
    }

    function handleDiscardButton() {

        ResetEverythingOnDom();
    }

    async function handleRecordAudio() {
        setRecording(true);

        if (sendMessageButtonRef.current) sendMessageButtonRef.current.disabled = true;


        if (inputMessageRef.current) inputMessageRef.current.disabled = true;
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioChunks = [];
        recorder = new MediaRecorder(stream);
        setMediaRecoder(recorder);
        recorder.start();


    }

    function handleStopRecording() {
        if (sendMessageButtonRef.current) sendMessageButtonRef.current.hidden = false;
        audioChunks = [];
        setPlayOrPause(true);
        mediaRecoder?.stop();
        setMediaRecoder(null);
    }

    function PlayRecorderAudio() {

        audioChunks = [];
        if (recordedAudioRef.current && recordedAudioRef.current.paused) {
            setPlayOrPause(false);
            recordedAudioRef.current.play();
        }
        else {
            setPlayOrPause(true);
            recordedAudioRef.current?.pause();
        }

    }

    function ResetEverythingOnDom() {


        if (inputMessageRef.current) inputMessageRef.current.disabled = false;

        if (sendMessageButtonRef.current) sendMessageButtonRef.current.hidden = false;

        if (recordedAudioRef.current) {
            recordedAudioRef.current.remove();
        }

        setMediaRecoder(null);
        setDisableFetchMessage(false);
        setChatSkip(0);
        setAudioFileBlob(null);
        setAudioDataInfo(null);
        clearInterval(recoderIntervalId);
        clearTimeout(recorderTimeout);
        setMessageInputValue("");
        setMultipleItemsSelected([]);
        setShowMultipleItems([]);
        audioChunks = [];
        recorder = null;
        stream = null;
        setAudioUrl(null);
        setRecording(false);
        setPlayOrPause(false);
        setRunningTimer(0);
        setProgress(0);
    }

    async function handleGetPost(chat: Chat) {

        const { postId, userId } = chat.sharedContent!;

        const { postImage: { url: postUrl }, postLike, _id: postIdValue, createdAt } = postId;
        const { _id: userIdValue, profileImage: { url: userProfileUrl } } = userId;

        console.log(postIdValue, userIdValue, postUrl, postLike, createdAt);

        handleOpenCommentBox(postIdValue, userProfileUrl, postUrl, userIdValue, "image/png", postLike, createdAt);
    }

    function handleOpenCommentBox(id: string, userProfileUrl: string, postUrl: string, userId: string, type: string, totalLikes: number, date: string) {

        setPostId(id);
        setProfileUrl(userProfileUrl);
        setPostUrl(postUrl);
        setPostType(type);
        setCurrentPostLikes(totalLikes);
        setSelectedPostUsername(otherUserDetails.username);
        setCurrentPostDate(date);
        setUserId(userId);
        setCommentBox(true);

    }

    function closeCommentInfoBox() {
        setCommentBox(false);
        setPostId("");
    }

    function ProvideInfoToCommentBox() {
        const info = {
            userId: userId,
            username: selectedPostUsername
        }

        return info;
    }


    if (!showMain || !profile) {
        return <LoadingScreen />
    }


    return (
        <>
            {!profile && !otherUserDetails ? <LoadingScreen /> : <div>


                {displaySelectedItem && <LocalImagesAndVideos item={selectedItem} type={typeOfItem} setCloseImage={setSelectedItem} />}

                {toogleCommentBox && postUrl && postType && currentPostDate && currentPostLikes &&
                    <CommentBox id={postId}
                        userImageUrl={profileUrl}
                        postUrl={postUrl}
                        postType={postType}
                        toogleBox={closeCommentInfoBox}
                        userInfoF={ProvideInfoToCommentBox}
                        currentLikes={currentPostLikes}
                        createdAt={currentPostDate} />}



                <div className={styles.bothProfileAndMessages} >

                    <div style={{ gap: "10px" }} className={styles.chatMessage}>

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>

                            <div style={{
                                display: "flex", gap: "10px", alignItems: "center", position: "relative"
                            }}>

                                <div id={styles.profileIcon}>
                                    <img src={otherUserDetails?.profileImage?.url || defaultImage} height="100%" width="100%" alt="profile" />
                                </div>

                                <p>{otherUserDetails?.username}</p>
                                <span style={{ backgroundColor: `${userOnlineStatus ? "rgb(18, 255, 18)" : "rgba(71, 71, 71, 1)"}` }} className={styles.toogleStatus}></span>
                            </div>

                            <FontAwesomeIcon icon={faInfoCircle} style={{ fontSize: "1.24rem" }} />

                        </div>

                    </div>



                    <div className={styles.ChatMessageContainer}>


                        {/*  OTHER USER PROFILE */}
                        <div style={{

                            position: "relative", top: "0%", padding: "10px",
                            display: "flex", flexDirection: "column", gap: "10px",
                            alignItems: "center"
                        }}>
                            <div id={styles.profileIcon} style={{ width: "90px", height: "90px" }} >
                                <img src={otherUserDetails?.profileImage?.url || defaultImage} height="100%" width="100%" alt="profile" />
                            </div>
                            <p>{otherUserDetails?.fullname}</p>
                            <button onClick={() => navigate(`/userProfile/${otherUserDetails?._id}`)} style={{
                                padding: "5px 5px", border: "none",
                                borderRadius: "5px", color: "white", backgroundColor: "rgba(124, 121, 121, 0.534)",
                                fontWeight: "bolder", cursor: "pointer"
                            }}>View Profile</button>



                        </div>


                        {/*  LOAD MORE CHATS AND SPINNER */}
                        <div style={{
                            WebkitTapHighlightColor: "transparent",
                            display: disableFetchMess ? "none" : "flex",
                            alignItems: "center", justifyContent: "center", cursor: "pointer"
                        }} >


                            {
                                chatLoaded ?

                                    <span onClick={fetchChatsFromDatabase}
                                        className={styles.NewMessageAdd}>+</span>
                                    :

                                    <div className={styles.MessageLoader}></div>
                            }

                        </div>




                        {/*  ALL CHATS RENDERING */}

                        {AllChats ?

                            AllChats.map((chat, index) => (
                                <div ref={chatContainerRef}
                                    key={index}
                                    className={`${styles.message} ${chat.senderUsername === profile?.username ? styles.me : styles.other
                                        }`}
                                >

                                    {/* This is the TEXT MESSAGE */}
                                    {chat.chat &&

                                        <>
                                            <p
                                                className={
                                                    chat.senderUsername === profile?.username ? styles.myTextMessage : styles.otherMessage
                                                }
                                            >
                                                {chat.chat}

                                            </p>



                                        </>

                                    }

                                    {/* This is the TEMPORARY MESSAGE USING SOCKET DATA AT REAL TIME  */}

                                    {chat.temporaryAddData &&


                                        <div style={{ display: "flex", padding: "3px", margin: "3px", width: "auto", maxWidth: "500px", gap: "8px", flexWrap: "wrap", justifyContent: `${chat.senderUsername === profile?.username ? "flex-end" : "flex-start"}` }} >

                                            {chat.temporaryAddData?.map((each) => {
                                                if (videoExtension.includes(each.extensionName)) {

                                                    return (
                                                        <div style={{
                                                            display: "flex", justifyContent: "flex-end", borderRadius: "10px", position: "relative",
                                                            width: "250px", marginBottom: "4px", cursor: "pointer"
                                                        }}>
                                                            <video key={each.actualBlob} src={each.actualBlob}
                                                                id={`eachVideo-${chat._id}`} onClick={() => {
                                                                    setTypeOfItem("video");
                                                                    setItem(each.actualBlob);
                                                                    setSelectedItem(prev => !prev);
                                                                }}
                                                                style={{ width: "100%", objectFit: "cover", }}
                                                            />
                                                            <span style={{ position: "absolute", top: "15px", right: "15px" }}>
                                                                <Play fill='white' />
                                                            </span>
                                                        </div>
                                                    );
                                                } else if (audioExtension.includes(each.extensionName)) {

                                                    return (
                                                        <audio key={each.actualBlob} src={each.actualBlob} controls
                                                        />
                                                    );
                                                } else if (imageExtension.includes(each.extensionName)) {

                                                    return (
                                                        <img onClick={() => {
                                                            setTypeOfItem("image");
                                                            setItem(each.actualBlob);
                                                            setSelectedItem(prev => !prev);
                                                        }} key={each.actualBlob} src={each.actualBlob} alt="image"
                                                            style={{ borderRadius: "10px", width: "300px", objectFit: "contain", objectPosition: "center", cursor: "pointer" }}
                                                        />
                                                    );
                                                }
                                                return null;
                                            })}
                                        </div>





                                    }

                                    {/* This is the AUDIO , VIDEO AND IMAGE DATA RECEIVED FROM BACKEND WHEN USER FETCH  */}

                                    {

                                        chat.AdditionalData &&


                                        <div style={{ display: "flex", width: "auto", maxWidth: "500px", gap: "8px", flexWrap: "wrap", justifyContent: `${chat.senderUsername === profile?.username ? "flex-end" : "flex-start"}` }} >
                                            {chat.AdditionalData?.map((each: AdditionalDataType) => {
                                                if (videoExtension.includes(each.contentType)) {
                                                    return (
                                                        <div
                                                            style={{
                                                                display: "flex", justifyContent: "flex-end", borderRadius: "10px", position: "relative",
                                                                width: "250px", marginBottom: "4px", cursor: "pointer",
                                                            }}
                                                        >
                                                            <video
                                                                key={each.url}
                                                                src={each.url}
                                                                id={`eachVideo-${each._id}`} onClick={() => {
                                                                    setTypeOfItem("video");
                                                                    setSelectedItem(prev => !prev);
                                                                    setItem(each.url)

                                                                }}


                                                                style={{ width: "100%", objectFit: "cover", }}
                                                            />
                                                            <span style={{ position: "absolute", top: "15px", right: "15px" }}>
                                                                <Play fill='white' />
                                                            </span>
                                                        </div>
                                                    );
                                                } else if (audioExtension.includes(each.contentType)) {
                                                    return (
                                                        <audio
                                                            key={each._id}
                                                            src={each.url}
                                                            controls
                                                            style={{ width: "200px", objectFit: "contain", objectPosition: "center" }}
                                                        />
                                                    );
                                                } else if (imageExtension.includes(each.contentType)) {
                                                    return (
                                                        <img onClick={() => {
                                                            setTypeOfItem("image");
                                                            setItem(each.url)
                                                            setSelectedItem(true);
                                                        }}
                                                            key={each._id}
                                                            src={each.url}
                                                            alt="image"
                                                            style={{ margin: "3px", borderRadius: "10px", width: "300px", objectFit: "contain", objectPosition: "center", cursor: "pointer" }}

                                                        />
                                                    );
                                                }

                                                return null;
                                            })}
                                        </div>


                                    }

                                    {/* SHARED ITEMS OVER HERE */}

                                    {

                                        chat.sharedContent &&

                                        <div className={styles.sharedContent}>

                                            <div className={styles.innerSharedItem}>
                                                <div style={{ display: "flex", alignItems: "center", gap: '10px', padding: "5px" }} >
                                                    <img width="40px" height="40px"
                                                        style={{ borderRadius: "50%" }}
                                                        src={chat.sharedContent.userId.profileImage?.url || defaultImage} alt="" />
                                                    <span>{chat.sharedContent.userId.username}</span>
                                                </div>
                                                <img onClick={() => handleGetPost(chat)} src={chat.sharedContent.postId.postImage.url}
                                                    style={{ width: "100%", height: "100%", objectFit: 'contain' }}
                                                    alt="Image" />

                                                <div style={{ padding: "5px" }} >
                                                    <span>Shared Post!</span>
                                                </div>
                                            </div>

                                        </div>

                                    }


                                    <div ref={lastMessageRef} ></div>
                                    <div ref={lastMessageRef} ></div>

                                </div>
                            ))

                            :
                            <div>
                                loading....
                            </div>
                        }


                        {/* MESSAGE INPUT BOX   */}

                        <div className={styles.messageInputBox}>



                            {recording &&

                                <div id="audioContainer" className={styles.AudioRecorder}>
                                    <div ref={recoderDivRef}
                                        style={{
                                            position: "absolute",
                                            left: "0px",
                                            width: `${progress}%`,
                                            height: "30px",
                                            zIndex: "1",
                                            backgroundColor: "red",
                                            transition: "width 1s linear"
                                        }}
                                        id={styles.timerDiv}></div>
                                    <span>
                                        {String(Math.floor(runningTimer / 60)).padStart(2, "0")}:
                                        {String(runningTimer % 60).padStart(2, "0")}
                                    </span>
                                    <button id={styles.playOrPauseButton} onClick={audioUrl ? PlayRecorderAudio : handleStopRecording} >
                                        <FontAwesomeIcon icon={playOrPause ? faPlay : faPause} />
                                    </button>
                                    <audio src={audioUrl} ref={recordedAudioRef}
                                        hidden={true}
                                        controls ></audio>
                                </div>

                            }



                            {multipleItemSelected.length > 0 &&

                                <div className={styles.selectedItems}  >

                                    <input type="file" ref={fileRef} onChange={handleSelectedFile} hidden={true} />
                                    <div onClick={() => fileRef.current?.click()} id={styles.anotherFileSelection} >
                                        <FontAwesomeIcon icon={faImages} />
                                    </div>

                                    <div style={{ display: "flex", gap: "10px" }} >
                                        {showMultipleItems.map((each) => (
                                            each.extensionName == "mp4"
                                                ?
                                                <video src={each.actualBlob} loop={true} controls autoPlay={true} muted
                                                    style={{ border: "1px solid rgba(27, 27, 27, 0.926)", borderRadius: "5px", width: "200px", objectFit: "contain", flexShrink: "0" }} />
                                                :
                                                <img src={each.actualBlob} alt="" style={{
                                                    border: "1px solid rgba(27, 27, 27, 0.926)",
                                                    borderRadius: "10px",
                                                    width: "200px", objectFit: "contain", flexShrink: "0"
                                                }} />
                                        ))}

                                    </div>

                                </div>

                            }


                            <>

                                <FontAwesomeIcon icon={faSmile} id={styles.fontAwButtons} />

                                <input ref={inputMessageRef} onKeyDown={handleKeyDown} placeholder="Message..." value={messageInputValue} onChange={(e) => setMessageInputValue(e.target.value)}
                                    type="text" style={{
                                        width: "70%", position: "relative",
                                        backgroundColor: "transparent", border: "none", outline: "none", color: "white", fontSize: "1.05rem"
                                    }} />

                                {messageInputValue.length > 0 || multipleItemSelected.length > 0 || recording ?

                                    <>

                                        <button ref={sendMessageButtonRef} onClick={handleSendMessage} id={styles.sendMessageButton} style={{
                                            left: "10px", border: "none",
                                            display: "flex", justifyContent: "right",
                                            padding: "5px 17px", gap: "10px",
                                            backgroundColor: "transparent", width: "100px",
                                            fontWeight: "bolder", cursor: "pointer"
                                        }}
                                        >Send</button>

                                        {multipleItemSelected.length > 0 || recording ?
                                            <button onClick={handleDiscardButton} id={styles.sendMessageButton} style={{
                                                border: "none",
                                                display: "flex", justifyContent: "right",
                                                padding: "5px 17px", gap: "10px",
                                                backgroundColor: "transparent",
                                                fontWeight: "bolder", cursor: "pointer"
                                            }} >Discard</button>

                                            :
                                            null

                                        }

                                    </>

                                    :
                                    <div style={{
                                        position: "relative", left: "5px", display: "flex",
                                        alignItems: "center", justifyContent: "center",
                                        gap: "5px", width: "100px"
                                    }} >

                                        <FontAwesomeIcon onClick={handleRecordAudio} id={styles.fontAwButtons} icon={faMicrophone} />
                                        <FontAwesomeIcon id={styles.fontAwButtons} icon={faHeart} />
                                        <FontAwesomeIcon onClick={() => fileRef.current?.click()} id={styles.fontAwButtons} icon={faImage} />
                                        <input type="file" hidden={true}
                                            ref={fileRef}
                                            onChange={handleSelectedFile}
                                        />
                                    </div>
                                }

                            </>




                        </div>

                    </div>

                </div>


            </div>
            }


        </>
    )
}

export default Chatting
