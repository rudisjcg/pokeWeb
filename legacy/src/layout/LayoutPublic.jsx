import { useSelector } from "react-redux";
import Navbar from "../components/Navbar.jsx";
import { Outlet } from "react-router";
import Banner from "../components/Banner";

function LayoutPublic() {
  const username = useSelector((state) => state.user.username);
  return (
    <>
      <div className="bg-primary h-full">
        <Navbar />
        <Outlet />
        {!username && <Banner />}
      </div>
    </>
  );
}

export default LayoutPublic;
