import React, { useState } from 'react';
import './App.css';

function App() {
  const [url, setUrl] = useState<string>();
  const [downloadStatus, setDownloadStatus] = useState("Download");
  const [textEnabled, setTextEnabled] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUrl(event.target.value);
  }

  async function updateProgress() {
    for(let i = 0; i<= 99; i++) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setProgress(i);
    }
  }

  const handleDownloadClick = () => {
    setDownloadStatus("Downloading...");
    updateProgress();
    setTextEnabled(true);
    if (!url) {
      alert("No URL provided");
      setTextEnabled(false);
      setDownloadStatus("Download");
      return;
    }
    fetch(`http://localhost:5000/convert?url=${url}`)
      .then((response) => response.blob())
      .then((blob) => {
        setProgress(100)
        setDownloadStatus("Downloaded!");
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'video.mp4';
        a.click();
        window.URL.revokeObjectURL(url);
        setTextEnabled(false);
        setProgress(0)
      })
      .catch((error) => {
        console.error(error); 
        alert("Failed to fetch video (Did you input the correct URL?)")
        setTextEnabled(false);
        setDownloadStatus("Download");
        setUrl("")
      });
  }

  return (
    <div className="App">
      <header>
        <h1 style={{color: "white"}}>Youtube to MP4 Converter</h1>
      </header>
      <textarea id="input" placeholder="https://youtube.com/" value={url} onChange={handleInputChange} disabled={textEnabled}></textarea>
      <button id="download" onClick={handleDownloadClick}>{downloadStatus}</button>
      <progress id="progress" value={progress} max="100" style={{display: (textEnabled) ? "block" : "none"}}></progress>
    </div>
  );
}

export default App;