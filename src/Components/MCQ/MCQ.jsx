import { useState, useEffect, useRef } from "react";
import Navbar from "../ReuseableCompo/Navbar";
import { assets } from "../../assets/assets";
import DisplayResult from "./DisplayResult";
import { ToastContainer, toast } from "react-toastify";
import Modal from "../ReuseableCompo/Modal/Modal";
import "react-toastify/dist/ReactToastify.css";
import "./MCQ.css";

const techLogos = [
  { logo: assets.ReactLogo, name: "React" },
  { logo: assets.AngularLogo, name: "Angular" },
  { logo: assets.VueLogo, name: "Vue" },
  { logo: assets.HTMLLogo, name: "HTML" },
  { logo: assets.ExpressLogo, name: "Express" },
  { logo: assets.NodeLogo, name: "Node" },
  { logo: assets.MongoLogo, name: "MongoDB" },
  { logo: assets.CustomLogo, name: "Postgre" },
  { logo: assets.ReactLogo, name: "Python" },
  { logo: assets.HTMLLogo, name: "Java" },
  { logo: assets.VueLogo, name: "Django" },
  { logo: assets.VueLogo, name: "C++" },
];

const MCQ = () => {
  const [topic, setTopic] = useState("");
  const [mcqNumber, setMcqNumber] = useState("");
  const [responses, setResponses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const apistopRef = useRef(false);

  useEffect(() => {
    if (localStorage.getItem("loginSuccess") === "true") {
      toast.success("Login Successful. Welcome to Curriculum-AI.", {});
      localStorage.removeItem("loginSuccess");
    }
    const auth = JSON.parse(localStorage.getItem("AUTH"));
    if (auth && auth.email) {
      setEmail(auth.email);
    }
  }, []);

  const handleCardClick = (techName) => {
    setTopic(techName);
    setMcqNumber(10);
  };

  const handleGenerateMCQ = () => {
    if (topic.length <= 1) {
      toast.error(
        "Please enter correct topic name or select from suggestion box."
      );
      return;
    }
    if (typeof topic === "number" || !isNaN(topic)) {
      toast.error("Topic name should not be a number.");
      return;
    }
    if (!topic || !mcqNumber) {
      toast.error("Please enter a topic and the number of questions");
      return;
    }
    if (!topic) {
      toast.error("Please enter topic name.");
      return;
    }
    if (mcqNumber > 500) {
      toast.error("MCQ limit is 500");
      return;
    }
    if (mcqNumber > 30) {
      setIsModalOpen(true);
    }
    setResponses((prevResponses) => [
      ...prevResponses,
      { topic, mcqNumber, response: null },
    ]);
    setTopic("");
    setMcqNumber("");
  };

  const updateResponse = (index, newResponse) => {
    setResponses((prevResponses) =>
      prevResponses.map((resp, i) =>
        i === index ? { ...resp, response: newResponse } : resp
      )
    );
  };

  

  return (
    <>
      <div className="outer-wrapper">
        <Navbar />
        <div className="main-container-experi">
          <div className="input-feed">
            <div className="input-field-wrapper">
              <div className="topic-name">
                <label htmlFor="text">Topic</label>
                <input
                  type="text"
                  placeholder="Ex. React"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>
              <div className="mcq-feed">
                <label htmlFor="number">MCQs</label>
                <input
                  type="number"
                  value={mcqNumber}
                  placeholder="Enter number of MCQ"
                  onChange={(e) => setMcqNumber(e.target.value)}
                />
              </div>
              <div className="btn-wrapper">
                <button
                  className="generate-mcq-btn"
                  onClick={handleGenerateMCQ}
                >
                  Generate MCQ
                </button>
              </div>
            </div>
            <hr className="hr-line" />

            <div className="suggestion-box">
              <h3>Quick Suggestion </h3>

              <div className="min-box-wrapper">
                {techLogos.map((tech, index) => (
                  <div
                    key={index}
                    className="single-box"
                    onClick={() => handleCardClick(tech.name)}
                  >
                    <img
                      src={tech.logo}
                      alt={tech.name}
                      className="smallCard-logo"
                    />
                    <h5>{tech.name}</h5>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="display-result">
            <div className="result">
            
              {responses.length > 0 ? (
                responses.map((response, index) => (
                  <DisplayResult
                    key={index}
                    topic={response.topic}
                    mcqNumber={response.mcqNumber}
                    response={response.response}
                    updateResponse={(newResponse) =>
                      updateResponse(index, newResponse)
                    }
                    apistopRef={apistopRef}
                  />
                ))
              ) : (
                <div>
                  <h2 style={{ textAlign: "center", margin: "10px" }}>
                    Enter topic name for generating MCQ
                  </h2>
                  <p
                    style={{
                      color: "white",
                      fontSize: "11px",
                      textAlign: "center",
                    }}
                  >
                    For more than 30 MCQs, you can receive the details via email
                    with downloadable PDFs.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <h2>Request MCQs via Email</h2>
          <br />
          <br />
          <p>You will receive the MCQs in your email - {email} shortly.</p>
          <br />
          <br />
        </Modal>
      )}
    </>
  );
};

export default MCQ;
