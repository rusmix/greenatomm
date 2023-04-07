import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import "./App.css";

function App() {
  const [text, setText] = useState("");
  const [processedText, setProcessedText] = useState("");
  const [data, setData] = useState("");
  const [inputValues, setInputValues] = useState([""]);
  const [downloadLink, setDownloadLink] = useState("");
  const [status, setStatus] = useState("");
  // useEffect(() => {
  //   fetchData();
  // }, []);

  // async function fetchData() {
  //   try {
  //     const response = await fetch("http://localhost:4001/api/example");
  //     const data = await response.text();
  //     setData(data);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // }

  async function sendData(data) {
    setStatus("Creating document...");
    try {
      const response = await fetch("http://localhost:4001/api/generate-link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.text();
      console.log("AAAaaaAAAAaAAAAAAAA", result);
      setDownloadLink(result);
      setStatus("Download file");
      console.log("Response from server:", result);
    } catch (error) {
      console.error("Error sending data:", error);
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setProcessedText(e.target.value);
      sendData({ text: e.target.value });
    }
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <MainPage
              text={text}
              setText={setText}
              processedText={processedText}
              handleKeyDown={handleKeyDown}
              status={status}
              downloadLink={downloadLink}
            />
          }
        />
        <Route
          path="/jobs"
          element={
            <JobDetails
              inputValues={inputValues}
              setInputValues={setInputValues}
            />
          }
        />
      </Routes>
    </Router>
  );
}

function MainPage({
  text,
  setText,
  handleKeyDown,
  processedText,
  status,
  downloadLink,
}) {
  return (
    <div className="App">
      <h2>Должностная инструкция</h2>
      <input
        className="text-bar"
        type="text"
        placeholder="Введите запрос..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      {status === "Creating document..." && <p>{status}</p>}
      {status === "Download file" && (
        <a href={downloadLink} download="example.docx" className="download-button">Скачать</a>
      )}
      {/* <Link to="/jobs">
        <button className="plus-button
        ">+</button>
      </Link> */}
      {/* <p className="processed-text">{processedText}</p> */}
    </div>
  );
}

function JobDetails({ inputValues, setInputValues }) {
  const handleInputChange = (event, index) => {
    const newInputValues = [...inputValues];
    newInputValues[index] = event.target.value;
    setInputValues(newInputValues);
  };

  const handleButtonClick = () => {
    setInputValues([...inputValues, ""]);
  };

  return (
    <div className="job-details">
      <h2>Добавление должности</h2>
      <input className="job-input" type="text" placeholder={`Должность`} />
      <input className="job-input" type="text" placeholder={`Группа`} />
      <input className="job-input" type="text" placeholder={`Отдел`} />
      <input className="job-input" type="text" placeholder={`Центр`} />
      <input
        className="job-input"
        type="text"
        placeholder={`Генеральный директор`}
      />

      <h2>Цели должности</h2>
      {inputValues.map((inputValue, index) => (
        <div className="job-input-many" key={index}>
          <input
            type="text"
            value={inputValue}
            onChange={(event) => handleInputChange(event, index)}
            className="job-input-more"
            placeholder="Введите текст"
          />
          {index === inputValues.length - 1 && (
            <button onClick={handleButtonClick} className="add-job-button">
              +
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

function JobDetailsNewInput({ inputValues, setInputValues }) {
  const handleInputChange = (event, index) => {
    const newInputValues = [...inputValues];
    newInputValues[index] = event.target.value;
    setInputValues(newInputValues);
  };

  const handleButtonClick = () => {
    setInputValues([...inputValues, ""]);
  };

  return (
    <div>
      <h2>Цели должности</h2>
      {inputValues.map((inputValue, index) => (
        <div className="job-input-many" key={index}>
          <input
            type="text"
            value={inputValue}
            onChange={(event) => handleInputChange(event, index)}
            className="job-input-more"
            placeholder="Введите текст"
          />
          {index === inputValues.length - 1 && (
            <button onClick={handleButtonClick} className="add-job-button">
              +
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default App;
