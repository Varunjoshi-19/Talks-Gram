import styles from "../Styling/Thought.module.css";
import profileStyles from "../Styling/Profile.module.css";
import React from "react";
interface props {
    thought: string;
    toogleBox: React.Dispatch<React.SetStateAction<boolean>>;
}
function Thought({ thought, toogleBox }: props) {
    return (
        <div onClick={() => toogleBox(prev => !prev)} >
            <div
                style={{ top: "-40px", fontSize: "10px", width: "auto" }}
                className={profileStyles.activeNote}  >
                <span>{thought.substring(0, 20)}...</span>

            </div>
            <div className={styles.smallCircle} ></div>
            <div className={styles.mediumCircle}></div>
            <div className={styles.bigCircle}></div>
        </div>
    )
}

export default Thought
