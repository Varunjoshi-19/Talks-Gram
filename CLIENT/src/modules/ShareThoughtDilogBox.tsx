import { Smile, X } from "lucide-react";
import styles from "../Styling/ShareDilog.module.css";
import shareThoughtStyle from "../Styling/ShareThought.module.css"
import { ShareThoughtProps } from "../Interfaces";
import EmojiPicker from 'emoji-picker-react';
import { useEffect, useRef, useState } from "react";
import { MAIN_BACKEND_URL } from "../Scripts/URL";
import LineLoader from "./LineLoader";


function ShareThoughtDilogBox({ userId, closeDilogBox, imageSrc }: ShareThoughtProps) {

    const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState<string>("");
    const inputRef = useRef<HTMLTextAreaElement | null>(null);
    const [showLimiter, setShowLimiter] = useState<boolean>(false);
    const [sharingLoader, setSharingLoader] = useState<boolean>(false);
    const [message, setMessage] = useState<string | null>(null);
    

    function handleOnEmojiClick(emojiData: any) {

        setInputValue(prev => {
            const newValue = prev + emojiData.emoji;
            if (newValue.length > 20) {
                setShowLimiter(true);
                return prev;

            }
            return newValue;

        });
        inputRef.current?.focus();
    }

    async function handleShareThought() {
        const stringValue = inputValue.trim();
        if (stringValue.length == 0 || !userId || userId == "") return;

        setSharingLoader(true);

        const formData = new FormData();

        const expiredAt = Date.now() + 60 * 60 * 1000;
        formData.append("userId", userId);
        formData.append("note", stringValue);
        formData.append("expiredAt", expiredAt.toString());

        const response = await fetch(`${MAIN_BACKEND_URL}/uploadPost/new-note`, {
            method: "POST",
            credentials: "include",
            body: formData
        });
        const result = await response.json();

        if (response.ok) {
            setTimeout(() => {
                closeDilogBox(prev => !prev);
            }, 1500);
            setInputValue("");
            setMessage(result.message);
        }
        if (!response.ok) {
            setTimeout(() => {
                closeDilogBox(prev => !prev);
            }, 1500);
            setMessage(result.message);
        }


        setSharingLoader(false);

    }


    useEffect(() => {

        const timer = setTimeout(() => {
            setSharingLoader(false);
            setMessage(null);
        }, 1500);


        return () => {
            clearTimeout(timer);
        }

    }, [message]);

    return (
        <div className={styles.blackBehindContainer} >

            <div className={shareThoughtStyle.centerBoxContainer}>

                <div className={shareThoughtStyle.crossButton}
                    onClick={() => closeDilogBox(prev => !prev)}
                    title="Close">
                    <X />
                </div>

                <span style={{
                    position: "absolute", left: "40%", cursor: "pointer",
                    top: "20px", fontSize: "1.2rem", fontWeight: "bolder"
                }}>
                    New note
                </span>

                <button disabled={inputValue.length > 0 ? false : true}
                    onClick={handleShareThought}
                    style={{
                        background: "transparent", border: "none", outline: "none",
                        position: "absolute", right: "15px", cursor: `${inputValue.length > 0 ? "pointer" : "default"}`,
                        opacity: `${inputValue.length > 0 ? "1" : "0.5"}`,
                        top: "20px", fontSize: "14px", color: "blue"
                    }}>
                    Share
                </button>



                <div className={shareThoughtStyle.centerThoughtContainer} >

                    <div className={shareThoughtStyle.inputShareThought}>
                        <textarea ref={inputRef}
                            placeholder="Share a thought" value={inputValue} onChange={(e) => {
                                if (e.target.value.length == 20) {
                                    setShowLimiter(true);
                                }
                                if (e.target.value.length <= 10) {
                                    setShowLimiter(false);
                                }
                                if (e.target.value.length > 20) return;


                                setInputValue(e.target.value);

                            }}
                            className={shareThoughtStyle.thoughtArea}></textarea>
                    </div>

                    <img src={imageSrc}
                        width={150}
                        style={{ objectFit: "contain", borderRadius: "50%" }}
                    />

                    <span style={{ cursor: "pointer" }} onClick={() => setShowEmojiPicker(prev => !prev)}>
                        <Smile />
                    </span>
                 
                    {showEmojiPicker &&

                        <div style={{ position: "absolute", height: "200px", top : "-200px" }}>
                            <EmojiPicker height={360}
                                onEmojiClick={handleOnEmojiClick}
                                style={{ overflow: "hidden" }} />
                        </div>

                    }
                    {showLimiter &&
                        <div>
                            <span style={{ color: "red" }}>{inputValue.length}/20</span>
                        </div>
                    }

                    <div style={{ height: "30px" }} >
                        {sharingLoader && <LineLoader />}
                        {message && <div>{message}</div>}
                    </div>
                </div>


            </div>



        </div>
    )


}

export default ShareThoughtDilogBox
