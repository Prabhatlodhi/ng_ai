import { Link, useLocation } from "react-router-dom";
import { assets } from "../../assets/assets";
import { Logout } from "../../utils/Logout";
import "./Navbar.css";
// import { Tooltip } from 'react-tooltip'

const Navbar = () => {
  const location = useLocation();
  const auth = JSON.parse(localStorage.getItem("AUTH"));
  const profilePicture = auth?.profile_picture || assets.Student;
  return (
    <div className="nav">
      <div className="nav-options">
        <Link to="/mcq" style={{ textDecoration: "none" }}>
          <span className={location.pathname === "/mcq" ? "active" : ""}>MCQ</span>
        </Link>
        <Link to="/project" style={{ textDecoration: "none" }}>
          <span className={location.pathname === "/project" ? "active" : ""}>PROJECT</span>
        </Link>
        {/* <Link to={"/main"} style={{textDecoration:"none"}}><span>G-ni</span></Link> */}
        {/* <Link to={"/Experi"} style={{textDecoration:"none"}}><span>Experi</span></Link> */}
      </div>
      <div className="profile-picture" >
        {/* <Tooltip id="my-tooltip" /> */}
        <img src={profilePicture} alt="Student" onClick={Logout} />
      </div>
    </div>
  );
};

export default Navbar;
