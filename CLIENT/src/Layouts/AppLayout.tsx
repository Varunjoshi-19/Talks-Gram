import { Outlet } from "react-router-dom";
import MenuOptions from "../Components/MenuOptions";
import { useUserAuthContext } from "../Context/UserContext";

const AppLayout = () => {

  const { profile } = useUserAuthContext();

  return (
    <div style={{ display: "flex", height: "100vh" }}>

      {profile && <MenuOptions profile={profile} />}

      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
