import React, { useState } from "react";
import axios from "axios";
import "./Downloadppt.css";
import Navbar from "../Navbar/Navbar.jsx";

const DownloadPPT = ({ topic }) => {
  const [loading, setLoading] = useState(false);

  const downloadPPT = async () => {
    try {
      setLoading(true);

      const url = `https://falcon-ai-backend.vercel.app/download-ppt/${topic}`;
      const response = await axios.get(url, { responseType: "blob" });

      if (response.status !== 200) throw new Error("PPT file not found");

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${topic.replace(/\s/g, "_")}.pptx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading PPT:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="download-container">
        <h3 className="download-heading">📥 Download PPT</h3>
        
        <p className="intro-text">
          Get a professionally structured PowerPoint presentation for your topic in just one click.
          Download and modify it as needed for your presentations!
        </p>

        <button
          className="download-button"
          onClick={downloadPPT}
          disabled={loading}
        >
          {loading ? "Downloading..." : "Download PPTX"}
        </button>

        <p className="convert-info">
          For PDF format, after downloading the PPT, convert it using:
        </p>
        <a
          href="https://www.ilovepdf.com/powerpoint_to_pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="convert-link"
        >
          Convert to PDF
        </a>

        <p className="closing-text">
          🎉 Happy Learning! Make your presentations more effective with our AI-powered content generation.
        </p>
      </div>
    </>
  );
};

export default DownloadPPT;