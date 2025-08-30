import styles from '../Styling/Messages.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { useState } from "react";
import ToMessage from "./ToMessage";
import { useNavigate } from "react-router-dom";
import { useUserAuthContext } from "../Context/UserContext.tsx";



function Messages() {

   const [ToMessagePopUp, setToMessagePopUp] = useState<boolean>(false);
   const { profile } = useUserAuthContext();
   const navigate = useNavigate();


   async function redirectToChattingPage(otherUserInfo: string) {

      const parsedOtherUserInfo = JSON.parse(otherUserInfo);
      const otherProfileId = parsedOtherUserInfo._id;

      navigate(`/accounts/inbox/messages/Personal-chat/${otherProfileId}`);;

   }


   if (!profile) {
      navigate("/");
      return;
   }


   return (
      <>
         {ToMessagePopUp && <ToMessage toogleButton={setToMessagePopUp} EnableMessageTab={redirectToChattingPage} />}


         <div className={styles.sendMessage}>

            <div id={styles.messageIcon} >
               <FontAwesomeIcon icon={faPaperPlane} size="2x" />
            </div>

            <p style={{ fontSize: "1.25rem", fontWeight: "bolder" }} >Your messages</p>
            <p style={{ fontSize: "15px", opacity: "0.5" }} >Send private photos and messages to a friend or group.</p>
            <button onClick={() => setToMessagePopUp(prev => !prev)} style={{
               padding: "5px 5px", fontSize: "15px", color: "white",
               fontWeight: "bolder", backgroundColor: "#1877F2", border: 'none'
               , borderRadius: "5px", cursor: "pointer"
            }} >Send message</button>

         </div>




      </>
   )
}

export default Messages
