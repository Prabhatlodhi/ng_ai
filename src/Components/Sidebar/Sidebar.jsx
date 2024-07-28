import "./Sidebar.css";
import { assets } from "../../assets/assets";
import { useContext, useState, useEffect } from "react";
// import { Context } from "../../context/Context";
import axios from "axios";
import Modal from "../ReuseableCompo/Modal/Modal";
// import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
// import AddIcon from "@mui/icons-material/Add";
// import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
// import AccessTimeIcon from "@mui/icons-material/AccessTime";
// import SettingsIcon from "@mui/icons-material/Settings";

const Sidebar = () => {
  const [extended, setExtended] = useState(false);
//   const { onSent, prevPrompts, setRecemtPrompt, newChat } = useContext(Context);
  const [topics, setTopics] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

//   const loadPrompt = async (prompt) => {
//     setRecemtPrompt(prompt);
//     await onSent(prompt);
//   };

  // useEffect(() => {
  //   const fetchHistory = async () => {
  //     try {
  //       const token = localStorage.getItem("token");
  //       const response = await axios.get(
  //         "https://mcq-curriculum-ai.navgurukul.org/mcq/getHistory",
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );

  //       if (response.data.status === "success") {
  //         const historyData = response.data.data.userHistoryData.history;
  //         const uniqueTopics = [
  //           ...new Set(historyData.map((item) => item.topic)),
  //         ];
  //         setTopics(uniqueTopics);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching history:", error);
  //     }
  //   };

  //   const fetchProjects = async () => {
  //     try {
  //       const token = localStorage.getItem("token");
  //       const response = await axios.get(
  //         "https://mcq-curriculum-ai.navgurukul.org/project/getHistory",
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );

  //       if (response.data.status === "success") {
  //         const projectData = response.data.data.userHistoryData.history;
  //         setProjects(projectData);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching projects:", error);
  //     }
  //   };

  //   fetchHistory();
  //   fetchProjects();
  // }, []);

  const handleProjectClick = async (project) => {
    setModalOpen(true);
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://mcq-curriculum-ai.navgurukul.org/project/detailedHistory?question_id=${project._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === "success") {
        setSelectedProject(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching project details:", error);
    }
    setLoading(false);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedProject(null);
  };

  return (
    <div className={`sidebar ${extended ? "extended" : ""} sidebar-wrapper`}>
      <div className="top">
        {/* <img
          src={assets.menu_icon}
          alt=""
          className="menu"
          onClick={() => setExtended((prev) => !prev)}
        /> */}
        {/* <DoubleArrowIcon /> */}
        <div className="new-chat" onClick={() => newChat()}>
          {/* <img src={assets.plus_icon} alt="" />
          {extended ? <p>New Chat</p> : null} */}
          {/* <AddIcon /> */}
        </div>

        {extended ? (
          <div className="recent">
            <p className="recent-title">Recent</p>
            {prevPrompts.map((item, index) => {
              return (
                <div
                  className="recent-entry"
                  key={index}
                  onClick={() => loadPrompt(item)}
                >
                  <img src={assets.message_icon} alt="" />
                  <p>{item.slice(0, 18)}...</p>
                </div>
              );
            })}
          </div>
        ) : null}

        {extended ? (
          <div className="topics">
            <p className="topics-title">Topics</p>
            {topics.map((topic, index) => (
              <div className="topic-entry" key={index}>
                <p>{topic}</p>
              </div>
            ))}
          </div>
        ) : null}

        {extended ? (
          <div className="previous-projects">
            <p className="projects-title">Previous Projects</p>
            <div className="projects-list">
              {projects.map((project, index) => (
                <div
                  className="project-entry"
                  key={index}
                  onClick={() => handleProjectClick(project)}
                >
                  <p className="project-topic">{project.topic}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
      <div className="bottom">
        <div className="bottom-item recent-entry">
          {/* <img src={assets.question_icon} alt="" /> */}
          {/* <QuestionMarkIcon  style={{marginRight:"25px",  }} /> */}
          {extended ? <p>Help</p> : null}
        </div>
        <div className="bottom-item recent-entry">
          {/* <img src={assets.history_icon} alt="" /> */}
          {/* <AccessTimeIcon /> */}
          {extended ? <p>Activity</p> : null}
        </div>
        <div className="bottom-item recent-entry">
          {/* <SettingsIcon /> */}
          {/* <img src={assets.setting_icon} alt="" /> */}
          {extended ? <p>Settings</p> : null}
        </div>
      </div>
      {modalOpen && (
        <Modal onClose={closeModal}>
          <div className="modal-content">
            {loading ? (
              <p>Loading data...</p>
            ) : (
              selectedProject && (
                <>
                  <h2>Project Details</h2>
                  <br />
                  <h5>{selectedProject.project_pdf[0].title}</h5>
                  <a
                    style={{ fontSize: "12px" }}
                    href={selectedProject.project_pdf[0].url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {selectedProject.project_pdf[0].url}
                  </a>
                </>
              )
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Sidebar;
