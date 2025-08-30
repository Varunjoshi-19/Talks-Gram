import { Outlet } from "react-router-dom";
import ChattedUsers from "../modules/ChattedUser";

const MessageLayout = () => {



    return (
        <div style={{ display: "flex", height: "100vh" }}>

            <ChattedUsers />
            <div style={{ flex: 1 }}>
                <Outlet />
            </div>
        </div>
    );
};

export default MessageLayout;
