import styles from "../Styling/Thought.module.css";
import React from "react";
interface props {
    thought: string;
    toogleBox: React.Dispatch<React.SetStateAction<boolean>>;
}
function Thought({ thought, toogleBox }: props) {
    return (
        <div onClick={() => toogleBox(prev => !prev)} >
            <div className={styles.center}>
                <div id={styles.cloud}>
                    <span style={{ zIndex : "1" , position : "absolute", left : "20%" }} >{thought}</span>
                </div>
            </div>
        </div>
    )
}

export default Thought
