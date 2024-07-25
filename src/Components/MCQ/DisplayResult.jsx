import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { assets } from "../../assets/assets";
import "./DisplayResult.css";

const DisplayResult = ({
  topic,
  mcqNumber,
  response,
  apistopRef,
  updateResponse, 
}) => {
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState(response || "");
  const [recentPrompt, setRecentPrompt] = useState("");
  const timerRef = useRef(null);

  useEffect(() => {
    if (topic && mcqNumber && !response && !apistopRef.current) {
      fetchData();
      apistopRef.current = true;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        apistopRef.current = false;
      }, 2000);
    }
  }, [topic, mcqNumber]);

  const delayPara = (index, nextWord) => {
    setTimeout(() => {
      setResultData((prev) => prev + nextWord);
    }, 75 * index);
  };

  const fetchData = async () => {
    setLoading(true);
    setRecentPrompt(`Generate ${mcqNumber} MCQ questions on ${topic}`);
    const payload = {
      topic,
      numQuestions: mcqNumber,
    };
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        "https://mcq-curriculum-ai.navgurukul.org/mcq/search",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const mcqOutput = response.data.data.mcq_output;
      let responseArray = mcqOutput.split("**");
      let newResponse = "";
      for (let i = 0; i < responseArray.length; i++) {
        if (i === 0 || i % 2 !== 1) {
          newResponse += responseArray[i];
        } else {
          newResponse += "<b>" + responseArray[i] + "</b>";
        }
      }

      let formattedResponse = newResponse.split("*").join("<br/>");
      formattedResponse = formattedResponse.replace(
        /\*\*\s*([0-9]+)\./g,
        "<br/>$1."
      );
      formattedResponse = formattedResponse.replace(/\n\n/g, "<br/><br/>");

      // Ensuring each option is on a new line
      formattedResponse = formattedResponse.replace(/\n/g, "<br/>");

      // Wrapping code blocks in a black box
      formattedResponse = formattedResponse.replace(
        /```([^`]+)```/g,
        '<div class="code-block">$1</div>'
      );

      let newResponseArray = formattedResponse.split(" ");
      setResultData("");
      for (let i = 0; i < newResponseArray.length; i++) {
        const nextWord = newResponseArray[i];
        delayPara(i, nextWord + " ");
      }
      updateResponse(formattedResponse);
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
            {mcqNumber > 30 ? (
              <p>You will receive the MCQs via email shortly.</p>
            ) : (
              <p dangerouslySetInnerHTML={{ __html: resultData }}></p>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default DisplayResult;