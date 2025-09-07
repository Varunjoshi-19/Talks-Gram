import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useUserAuthContext } from "./Context/UserContext.tsx";
import { useEffect, useState } from "react";

import Login from "./Components/Login";
import SignUp from "./Components/SignUp";
import ResetPassword from "./Components/ResetPassword";
import Profile from "./Components/Profile.tsx";
import Messages from "./Components/Messages.tsx";
import Chatting from "./Components/Chatting.tsx";
import PageNotFound from "./Components/PageNotFound.tsx";
import UserProfile from "./Components/UserProfile.tsx";
import NotificationPage from "./Components/NotificationPage.tsx";
import ForgotPassword from "./Components/ForgotPassword.tsx";
import Reels from "./Components/Reels.tsx";
import LoadingScreen from "./Components/LoadingScreen.tsx";
import RenderSingleStory from "./modules/RenderSingleStory.tsx";
import AppLayout from "./Layouts/AppLayout.tsx";
import AppInterface from "./Components/AppInterface.tsx";
import MessageLayout from "./Layouts/MessageLayout.tsx";

function App() {
  const { profile } = useUserAuthContext();
  const [showMain, setShowMain] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMain(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (!showMain) {
    return <LoadingScreen />;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Auth pages (without sidebar) */}
        <Route path="/accounts/login" element={!profile ? <Login /> : <Navigate to="/" />} />
        <Route path="/accounts/signup" element={!profile ? <SignUp /> : <Navigate to="/" />} />
        <Route path="/accounts/password/reset" element={<ForgotPassword />} />
        <Route path="/rs/:id1/:id2" element={<ResetPassword />} />

        {/* Story/Reels pages (without sidebar) */}
        <Route path="/stories/:username/:id" element={<RenderSingleStory />} />

        {/* Protected pages with sidebar */}
        <Route
          path="/"
          element={profile ? <AppLayout /> : <Navigate to="/accounts/login" />}
        >
            <Route index element={<AppInterface />} />
          <Route path="accounts/inbox/messages" element={profile ? <MessageLayout /> : <Navigate to="/accounts/login" />} >
            <Route index element={<Messages />} />
            <Route path="Personal-chat/:id" element={<Chatting />} />

          </Route>

          <Route path="reels" element={<Reels />} />
          <Route path="accounts/profile" element={<Profile />} />
          <Route path="userProfile/:id" element={<UserProfile />} />
          <Route path="Notification" element={<NotificationPage />} />
        </Route>





        {/* 404 */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
