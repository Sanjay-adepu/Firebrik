import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Navbar from "../Nav/Nav.jsx";
import { Link } from "react-router-dom";
import { FaHistory } from "react-icons/fa";
import Downloadppt from "../Downloadppt/Downloadppt.jsx";
import Footer from "../Footer.jsx";
import "./PPT.css";

const PIXABAY_API_KEY = "49526041-48ed9dcb53d53a70abf899002";
const PIXABAY_API_URL = "https://pixabay.com/api/";

const getContrastTextColor = (bgColor) => {
  const hex = bgColor.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 128 ? "white" : "black";
};

const themes = [
  { name: "Theme 1", value: "theme1", image: "https://res.cloudinary.com/dppiuypop/image/upload/v1744567220/uploads/pswepd3udghnonjfrtlr.jpg" },
  { name: "Theme 2", value: "default", image: "https://res.cloudinary.com/dppiuypop/image/upload/v1744567248/uploads/ea6wlejnwiafahhedrnw.jpg" },
  { name: "Theme 3", value: "theme3", image: "https://res.cloudinary.com/dppiuypop/image/upload/v1744567353/uploads/jhqemev3z0r8vpykio6y.jpg" },
  { name: "Theme 5", value: "theme5", image: "https://res.cloudinary.com/dppiuypop/image/upload/v1744567417/uploads/phrtny0vrzzcslbzxre3.jpg" },
  { name: "Theme 8", value: "theme8", image: "https://res.cloudinary.com/dppiuypop/image/upload/v1744716430/uploads/un2yddnwzvcjeminjwra.jpg" },
  { name: "Theme 9", value: "theme9", image: "https://res.cloudinary.com/dppiuypop/image/upload/v1744716452/uploads/dorltnmwfnutwjsub08g.jpg" },
  { name: "Theme 10", value: "theme10", image: "https://res.cloudinary.com/dppiuypop/image/upload/v1744716478/uploads/q0yjbnxojw9horxsc9yc.jpg" },
  { name: "Ivory White", value: "ivory", color: "#F8F9FA" },
  { name: "Cloud Gray", value: "cloud-gray", color: "#EAEAEA" }
];

const PPT = () => {
  const templateRef = useRef(null);
  const slidesRef = useRef(null);

  const [topic, setTopic] = useState("");
  const [slideCount, setSlideCount] = useState(9);
  const [previousPPTs, setPreviousPPTs] = useState([]);
  const [selectedPPT, setSelectedPPT] = useState(null);
  const [slides, setSlides] = useState([]);
  const [imageCache, setImageCache] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("default");
  const [titleColor, setTitleColor] = useState("");
  const [contentColor, setContentColor] = useState("");
  const [useImages, setUseImages] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const saveSlides = async () => {
    try {
      const response = await axios.post("https://falcon-ai-backend.vercel.app/update-slides", {
        topic,
        slides: slides.map((slide) => {
          const selected = themes.find((t) => t.value === selectedTheme);
          const background = selected?.image || selected?.color || "#FFFFFF";
          return {
            title: slide.title,
            content: slide.content,
            theme: background,
            titleColor: titleColor || "#000000",
            contentColor: contentColor || "#000000",
            image: useImages ? slide.image || null : null,
          };
        }),
        useImages,
      });

      if (response.data.success) {
        alert("Slides saved successfully!");
        setIsSaved(true);
        slidesRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    } catch (error) {
      alert("Failed to save slides.");
      setIsSaved(false);
    }
  };

  const generateSlides = async () => {
    if (!topic.trim()) {
      setError("⚠️ Please enter a valid topic.");
      return;
    }
    setError("");
    setLoading(true);
    setSlides([]);
    setIsSaved(false);

    try {
      const response = await axios.post("https://falcon-ai-backend.vercel.app/generate-ppt", {
        topic,
        slidesCount: slideCount,
      });

      const formattedSlides = response.data.slides.map((slide) => ({
        title: slide.title.replace(/\*\*/g, "").trim(),
        content: slide.content.map((point) =>
          point
            .replace(/^[\-\•]\s*/, "")
            .replace(/[\*\*]/g, "")
            .replace(/[`\\/]/g, "")
        ),
        image: null,
      }));

      if (formattedSlides.length > 0) {
        formattedSlides[0] = {
          title: `📌 Topic: ${topic}`,
          content: ["Presented by : Enter Your Name "],
          image: null,
        };
      }

      setSlides(formattedSlides);
      fetchImages(topic, formattedSlides);

      setTimeout(() => {
        templateRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } catch (err) {
      console.error("Error generating slides:", err);
      setError("❌ Failed to generate slides. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchImages = async (query, slidesData) => {
    if (imageCache[query]) {
      updateSlidesWithImages(slidesData, imageCache[query]);
      return;
    }

    try {
      const response = await axios.get(PIXABAY_API_URL, {
        params: {
          key: PIXABAY_API_KEY,
          q: query,
          image_type: "photo",
          per_page: slidesData.length,
        },
      });

      const images = response.data.hits.map((hit) => hit.largeImageURL);
      setImageCache((prevCache) => ({ ...prevCache, [query]: images }));
      updateSlidesWithImages(slidesData, images);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const updateSlidesWithImages = (slidesData, images) => {
    const updatedSlides = slidesData.map((slide, index) => ({
      ...slide,
      image: images[index] || null,
    }));
    setSlides(updatedSlides);
  };

  const loadPreviousPPT = async (ppt) => {
    try {
      const response = await axios.get(`https://falcon-ai-backend.vercel.app/get-slides/${ppt.topic}`);
      if (response.data?.success) {
        setSlides(response.data.slides || []);
        setSelectedPPT(ppt.topic);
        setTopic(ppt.topic);
        setIsSaved(true);
      }
    } catch (error) {
      console.error("Error loading previous PPT:", error);
      setSlides([]);
    }
  };

  const removeSlideImage = (index) => {
    const updatedSlides = [...slides];
    updatedSlides[index].image = null;
    setSlides(updatedSlides);
  };

  const handleImageUpload = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      const updatedSlides = [...slides];
      updatedSlides[index].image = imageUrl;
      setSlides(updatedSlides);
    }
  };

  useEffect(() => {
    const fetchPreviousPPTs = async () => {
      try {
        const response = await axios.get("https://falcon-ai-backend.vercel.app/get-previous-slides");
        setPreviousPPTs(response.data.previousSlides || []);
      } catch (error) {
        console.error("Error fetching previous PPTs:", error);
        setPreviousPPTs([]);
      }
    };

    fetchPreviousPPTs();
  }, []);

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <h2>AI Powered PPT Maker</h2>
        <p className="subtext">Generate professional presentations instantly!</p>

        {/* Previous PPT Selector */}
        <div className="previous-ppts">
          <FaHistory size={30} title="Previous PPTs" />
          <select onChange={(e) => loadPreviousPPT(JSON.parse(e.target.value))}>
            <option value="">Select Previous PPT</option>
            {previousPPTs.map((ppt, index) => (
              <option key={index} value={JSON.stringify(ppt)}>
                {ppt.topic}
              </option>
            ))}
          </select>
        </div>

        {/* Input Fields */}
        <div className="input-section">
          <input
            type="text"
            placeholder="Enter topic..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <input
            type="number"
            placeholder="Slide count"
            value={slideCount}
            min={1}
            max={20}
            onChange={(e) => setSlideCount(Number(e.target.value))}
          />
          <button onClick={generateSlides} disabled={loading}>
            {loading ? <span className="loading-spinner"></span> : "Generate Slides"}
          </button>
          {error && <p className="error-message">{error}</p>}
        </div>

        {/* Theme Selector */}
        <p ref={templateRef}>Templates</p>
        <div className="theme-selector">
          <div className="theme-selector__list">
            {themes.map((theme) => {
              const isSelected = selectedTheme === theme.value;
              const backgroundStyle = theme.image
                ? {
                    backgroundImage: `url(${theme.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }
                : {
                    backgroundColor: theme.color,
                    color: getContrastTextColor(theme.color),
                  };

              return (
                <button
                  key={theme.value}
                  className={`theme-selector__button ${isSelected ? "theme-selector__button--active" : ""}`}
                  style={{
                    ...backgroundStyle,
                    color: theme.image ? "white" : backgroundStyle.color,
                    border: isSelected ? "2px solid #333" : "1px solid #ccc",
                  }}
                  onClick={() => setSelectedTheme(theme.value)}
                >
                  {theme.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Settings */}
        <div className="settings-panel">
          <div className="setting-group">
            <label htmlFor="titleColor">Title Color</label>
            <input
              id="titleColor"
              type="color"
              value={titleColor}
              onChange={(e) => setTitleColor(e.target.value)}
            />
          </div>
          <div className="setting-group">
            <label htmlFor="contentColor">Content Color</label>
            <input
              id="contentColor"
              type="color"
              value={contentColor}
              onChange={(e) => setContentColor(e.target.value)}
            />
          </div>
          <div className="setting-group toggle-group">
            <label htmlFor="imageToggle">Include Images</label>
            <input
              type="checkbox"
              id="imageToggle"
              checked={useImages}
              onChange={() => setUseImages(!useImages)}
            />
          </div>
        </div>

        {/* Slides */}
        {slides.length > 0 && (
          <>
            <h2>📝 Your Presentation:</h2>
            <div className="slide-grid">
              {slides.map((slide, slideIndex) => {
                const theme = themes.find((t) => t.value === selectedTheme);
                const bgColor = theme?.color;
                const bgImage = theme?.image;
                const textColor = getContrastTextColor(bgColor || "#fff");

                return (
                  <div
                    key={slideIndex}
                    className="slide-box"
                    style={{
                      backgroundColor: bgImage ? undefined : bgColor || "#fff",
                      backgroundImage: bgImage ? `url(${bgImage})` : undefined,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      color: textColor,
                    }}
                  >
                    <div className="slide-content-container">
                      <h3
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => {
                          const updatedSlides = [...slides];
                          updatedSlides[slideIndex].title = e.target.innerText;
                          setSlides(updatedSlides);
                        }}
                        style={{ color: titleColor || textColor }}
                      >
                        {slide.title}
                      </h3>

                      <div
                        contentEditable
                        suppressContentEditableWarning
                        className="slide-content-block"
                        onBlur={(e) => {
                          const updatedSlides = [...slides];
                          const rawText = e.target.innerText.trim();
                          const lines = rawText
                            .split("\n")
                            .map((line) => line.replace(/^🔹\s*/, "").trim())
                            .filter((line) => line.length > 0);
                          updatedSlides[slideIndex].content = lines;
                          setSlides(updatedSlides);
                        }}
                      >
                        {slide.content
                          .filter((point) => point.trim() !== "")
                          .map((point, index) => (
                            <div key={index} className="bullet-line">
                              {point}
                            </div>
                          ))}
                      </div>

                      {useImages && (
                        <div className="image-container">
                          {slide.image ? (
                            <div className="image-wrapper">
                              <img src={slide.image} alt="Slide" className="slide-image" />
                              <button className="remove-image-btn" onClick={() => removeSlideImage(slideIndex)}>
                                ❌
                              </button>
                            </div>
                          ) : (
                            <label className="upload-image-label">
                              ➕ add image
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, slideIndex)}
                                className="hidden-file-input"
                              />
                            </label>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Save and Download */}
        <div className="new">
          <button onClick={saveSlides} className="save-button">
            Save Slides
          </button>
        </div>

        {isSaved && (
          <div className="down" ref={slidesRef}>
            <Downloadppt topic={topic} />
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default PPT;