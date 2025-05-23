import { useState  , useEffect} from "react";
import styles from "../Styling/Notification.module.css";
import { MAIN_BACKEND_URL } from "../Scripts/URL";


interface NotificationProps {
    AllNotifications: {
      userId: string;
      userIdOf: string;
      usernameOf: string;
    }[];
  
    setAllNotifications: (notifications: {
      userId: string;
      userIdOf: string;
      usernameOf: string;
    }[]) => void;
 
   
    setNotiCount: React.Dispatch<React.SetStateAction<number>>;
  }
  

const Notification : React.FC<NotificationProps> = ({AllNotifications , setAllNotifications   , setNotiCount}) =>  {

  const[message  ,setMessage] = useState<string | null>(null);


useEffect(() => {


function clearUi() {

setTimeout(() => {

setMessage(null);

} , 1500); 

}
clearUi();

} , [message]);


    async function handleAcceptRequest(item: string) {

        const parsedItem  = JSON.parse(item);

      const response = await fetch(`${MAIN_BACKEND_URL}/Personal-chat/AcceptedRequest`, {
            method: "POST",
             headers: {
                "Content-Type": "application/json"
            },
            body: item
        });

        
       if(response.ok) {
           setMessage(`Request accepted of ${parsedItem?.usernameOf}`);
           setNotiCount(count => count -1);
           setAllNotifications(AllNotifications.filter((each) => {
                 
            return each.userId != parsedItem?.userId;
       }));
      


          
    }
       else { 
        setMessage(`failed to accepted request `);
       }

    }

    async function handleRejectRequest(item: string) {
     
        const parsedItem  = JSON.parse(item);

     const response = await fetch(`${MAIN_BACKEND_URL}/Personal-chat/removeFromRequested`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },

            body: item

        });

       
        if(response.ok) {
            setMessage(`Request rejected of ${parsedItem?.usernameOf}`);
            setNotiCount(count => count -1);
            setAllNotifications(AllNotifications.filter((each) => {
                 
                return each.userId != parsedItem?.userId;
           }));
    
        }
        else { 
         setMessage(`failed to rejected request `);
        }

    }


    return (
        <div style={{ gap: "30px" }} className={styles.NotificationContainer} >

            <p style={{ padding: "20px 20px", fontWeight: "bolder", fontSize: "1.25rem" }}>Notification</p>

            <div className={styles.AllNotifications} >

                {AllNotifications.length > 0 ?


                    AllNotifications.map((item, index) => (


                        <div key={index} className={styles.eachNotification}>

                            <div id={styles.profileImage}>
                                <img src={`${MAIN_BACKEND_URL}/accounts/profileImage/${item.userIdOf}`} width="100%" height="100%" alt="" />
                            </div>

                            <p>
                                {item.usernameOf}
                            </p>

                            <div style={{ display: "flex", gap: "10px", marginLeft: "0%" }} >
                                <button onClick={() => handleAcceptRequest(JSON.stringify(item))} style={{
                                    padding: "5px 5px", fontSize: "15px", color: "white",
                                    fontWeight: "bolder", backgroundColor: "#1877F2", border: 'none'
                                    , borderRadius: "5px", cursor: "pointer"
                                }} >Accept</button>

                                <button onClick={() => handleRejectRequest(JSON.stringify(item))} style={{
                                    padding: "5px 5px", fontSize: "15px", color: "white",
                                    fontWeight: "bolder", backgroundColor: "rgba(112, 112, 112, 0.507)", border: 'none'
                                    , borderRadius: "5px", cursor: "pointer"
                                }} >Reject</button>
                            </div>

                        </div>

                    ))


                    :

                    <div>No notification</div>
                }

            </div>

          { message && <p>{message}</p> }
        </div>
    );
}

export default Notification;
