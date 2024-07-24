import { useState, useEffect } from "react";
import axios from "axios";
import { assets } from "../../assets/assets";
import "./ProjectGeneration.css";

const ProjectGeneration = ({ topic, numProjects, response, updateResponse }) => {
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState(response || "");
  const [recentPrompt, setRecentPrompt] = useState("");

  useEffect(() => {
    if (topic && numProjects && !response) {
      fetchData();
    }
  }, [topic, numProjects]);

  const delayPara = (index, nextWord) => {
    setTimeout(() => {
      setResultData((prev) => prev + nextWord);
    }, 75 * index);
  };

  const fetchData = async () => {
    setLoading(true);
    setRecentPrompt(`Generating ${numProjects} project idea on ${topic}`);
    const payload = {
      topic,
      numIdeas: numProjects,
    };
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        "https://mcq-curriculum-ai.navgurukul.org/project/generate",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const projects = response.data.data.Projects;
      const projectDescription = projects.map(proj => `
        <div>
          <h3>${proj.title.replace("## ", "")}</h3>
          <p>${proj.description}</p>
          <a href="${proj.url}" target="_blank">View Project Details</a>
        </div>
      `).join("");
      let newResponseArray = projectDescription.split(" ");
      setResultData("");
      for (let i = 0; i < newResponseArray.length; i++) {
        const nextWord = newResponseArray[i];
        delayPara(i, nextWord + " ");
      }
      updateResponse(projectDescription);
    } catch (error) {
      console.error("Error fetching data:", error);
      setResultData("An error occurred while fetching data.");
      updateResponse("An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  const auth = JSON.parse(localStorage.getItem("AUTH"));
  const profilePicture = auth?.profile_picture || assets.Student;

  return (
    <>
      <div className="result-title-MG">
        <img src={profilePicture} alt="Student" />
        <p>{recentPrompt}</p>
      </div>
      <div className="result-data">
        {loading ? (
          <>
            <img src={assets.NG_logo} alt="Loading" />
            <div className="loader">
              <hr />
              <hr />
              <hr />
            </div>
          </>
        ) : (
          <>
            <img src={assets.NG_logo} alt="React Logo" />
            <div dangerouslySetInnerHTML={{ __html: resultData }}></div>
          </>
        )}
      </div>
    </>
  );
};

export default ProjectGeneration;
