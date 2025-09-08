import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion"
import shareDilogStyles from "../Styling/ShareDilog.module.css";
import React from "react";



interface BoxPayload {
    item: string;
    type: string;
    setCloseImage: React.Dispatch<React.SetStateAction<boolean>>;
}


function LocalImagesAndVideos({ item, type, setCloseImage }: BoxPayload) {
    return (
        <div
            className={shareDilogStyles.blackBehindContainer}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                background: "rgba(0,0,0,0.7)",
                zIndex: 2000,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}
        >
            <div className={shareDilogStyles.crossButton} style={{ position: "absolute", top: 20, right: 30, zIndex: 2100 }}>
                <X onClick={() => setCloseImage(prev => !prev)} />
            </div>
            <div
                style={{
                    width: "95vw",
                    maxWidth: "500px",
                    height: "80vh",
                    maxHeight: "700px",
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 2100,
                    background: "#222",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >
                <AnimatePresence>
                    {item && type === "image" ? (
                        <motion.img
                            style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: "10px", cursor: "pointer" }}
                            src={item}
                            alt="enlarged"
                            initial={{ scale: 0.3, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.3, opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            onClick={e => e.stopPropagation()}
                        />
                    ) : (
                        <motion.video
                            style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: "10px", cursor: "pointer" }}
                            src={item}
                            controls
                            autoPlay
                            initial={{ scale: 0.3, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.3, opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            onClick={e => e.stopPropagation()}
                        />
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

export default LocalImagesAndVideos
