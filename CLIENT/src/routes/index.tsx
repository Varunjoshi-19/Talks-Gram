
import { useRoutes } from "react-router-dom";
import DashboardLayout from "../Layouts/AppLayout";
import AppInterface from "../Components/AppInterface";
import Profile from "../Components/Profile";

const AppRoutes = () => {
    return useRoutes([
        {
            path: "/",
            element: <DashboardLayout />, 
            children: [
                { index: true, element: <AppInterface /> },
                { path: "profile", element: <Profile /> },
            ],
        },
    ]);
};

export default AppRoutes;
