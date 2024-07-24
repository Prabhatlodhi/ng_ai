import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom"; 
import Sidebar from "./Components/Sidebar/Sidebar";
import LoginPage from "./Pages/LoginPage/LoginPage";
import PrivateRoute from "./PrivateRoutes/PrivateRoutes"
import Project from "./Components/Project/Project";
import MCQ from "./Components/MCQ/MCQ"

const App = () => {
  const location = useLocation();
  const showSidebar = location.pathname !== "/";

  return (
    <div className="app" style={{  width:"100%"}} >
      {showSidebar && <Sidebar />}
      <div className={`main-content ${showSidebar ? 'with-sidebar' : ''}`}>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/mcq" element={<PrivateRoute element={MCQ} />} />
          {/* <Route path="/main" element={<PrivateRoute element={Main} />} />*/}
          <Route path="/project" element={<PrivateRoute element={Project} />} /> 
          {/* <Route path="/mcq" element={<PrivateRoute element={MCQ} />} /> */}
          {/* <Route path="/Experi" element={<PrivateRoute element={Experi} />} /> */}
        </Routes>
      </div>
    </div>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
