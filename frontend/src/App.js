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
  const [history, setHistory] = useState([]);
  // useEffect(() => {
  //   fetchData();
  // }, []);

  // async function fetchData() {
  //   try {
  //     const response = await fetch("http://localhost:4002/api/example");
  //     const data = await response.text();
  //     setData(data);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // }

  useEffect(() => {
    fetchHistory();
  }, []);

  async function fetchHistory() {
    try {
      const response = await fetch("http://localhost:4002/api/history");
      const data = await response.json();
      setHistory(data);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  }

  async function sendData(data) {
    setStatus("Создание документа...");
    try {
      const response = await fetch("http://localhost:4002/api/generate-link", {
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
  const handleSubmit = () => {
    setProcessedText(text);
    sendData({ text: text });
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
              handleSubmit={handleSubmit}
              status={status}
              downloadLink={downloadLink}
              history={history}
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
  handleSubmit,
  status,
  downloadLink,
  history,
}) {
  return (
    <div className="App">
      <h2>Должностная инструкция</h2>
      <div className="input-container">
        <input
          className="text-bar"
          type="text"
          placeholder="Введите запрос..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="submit-button" onClick={handleSubmit}>
          Отправить
        </button>
      </div>
      {status === "Создание документа..." && <p>{status}</p>}
      {status === "Download file" && downloadLink !== "error" && (
        <div>
          <a
            href={downloadLink.split(".").slice(0, -1).join(".") + ".docx"}
            download="example.docx"
            className="download-button"
          >
            Скачать docx
          </a>
          <a
            href={downloadLink.split(".").slice(0, -1).join(".") + ".pdf"}
            download="example.pdf"
            className="download-button"
          >
            Скачать pdf
          </a>
        </div>
      )}
      {status === "Download file" && downloadLink === "error" && <p>Ошибка</p>}
      {/* <Link to="/jobs">
        <button className="plus-button
        ">+</button>
      </Link> */}
      {/* <p className="processed-text">{processedText}</p> */}
      <div className="history-container">
        <h3>История запросов</h3>
        <ul>
          {history.map((item, index) => (
            <li key={index} className="history-item">
              <a
                className="history-button"
                href={`http://localhost:4002/api/history/${encodeURIComponent(
                  item
                )}`}
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
      </div>
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
