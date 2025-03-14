import React, { useState } from 'react';
import './App.css';
import { setTextRange } from 'typescript';

function App() {
  const [url, setUrl] = useState<string>();
  const [downloadStatus, setDownloadStatus] = useState("Download");
  const [textEnabled, setTextEnabled] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUrl(event.target.value);
  }

  const handleDownloadClick = () => {
    setDownloadStatus("Downloading...");
    setTextEnabled(true);
    if (!url) {
      alert("No URL provided");
      return;
    }
    fetch(`http://localhost:5000/convert?url=${url}`)
      .then((response) => response.blob())
      .then((blob) => {
        setDownloadStatus("Downloaded!");
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'video.mp4';
        a.click();
        window.URL.revokeObjectURL(url);
        setTextEnabled(false);
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
    </div>
  );
}

export default App;