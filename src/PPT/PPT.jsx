
import React, { useState, useEffect , useRef } from "react";
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

  // Light & Soft Tones    
  { name: "Ivory White", value: "ivory", color: "#F8F9FA" },    
  { name: "Cloud Gray", value: "cloud-gray", color: "#EAEAEA" },    
  { name: "Champagne Beige", value: "champagne", color: "#F7E7CE" },    
  { name: "Sky Mist", value: "sky-mist", color: "#E3F2FD" },    
  { name: "Lavender Haze", value: "lavender", color: "#E6E6FA" },    
  { name: "Powder Blue", value: "powder-blue", color: "#B0E0E6" },    
  { name: "Pearl White", value: "pearl-white", color: "#FAFAFA" },    
  { name: "Mint Cream", value: "mint-cream", color: "#F5FFFA" },    
  { name: "Pale Rose", value: "pale-rose", color: "#FFE4E1" },    
  { name: "Vanilla Yellow", value: "vanilla", color: "#FFF8DC" },    
  { name: "Baby Blue", value: "baby-blue", color: "#ADD8E6" },    
  { name: "Silk Peach", value: "silk-peach", color: "#FFDAB9" },    
  { name: "Ash Gray", value: "ash-gray", color: "#B2BEB5" },    
  { name: "Light Cyan", value: "light-cyan", color: "#E0FFFF" },    
  { name: "Snow White", value: "snow-white", color: "#FFFAFA" },    

  // Medium & Elegant Tones    
  { name: "Steel Blue", value: "steel-blue", color: "#4682B4" },    
  { name: "Teal Green", value: "teal-green", color: "#008080" },    
  { name: "Slate Gray", value: "slate-gray", color: "#708090" },    
  { name: "Sapphire Blue", value: "sapphire-blue", color: "#0F52BA" },    
  { name: "Emerald Green", value: "emerald-green", color: "#50C878" },    
  { name: "Charcoal Black", value: "charcoal-black", color: "#333333" },    
  { name: "Oxford Blue", value: "oxford-blue", color: "#002147" },    
  { name: "Deep Maroon", value: "deep-maroon", color: "#800000" },    
  { name: "Copper Brown", value: "copper-brown", color: "#B87333" },    
  { name: "Platinum Gray", value: "platinum-gray", color: "#E5E4E2" },    
  { name: "Royal Indigo", value: "royal-indigo", color: "#4B0082" },    
  { name: "Burnt Orange", value: "burnt-orange", color: "#CC5500" },    
  { name: "Graphite Gray", value: "graphite-gray", color: "#474A51" },    
  { name: "Warm Taupe", value: "warm-taupe", color: "#D2B48C" },    
];


const PPT = () => {
  const templateRef = useRef(null); // Add this line
  const slidesRef = useRef(null);   // New ref for scrolling to slides


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

  const removeSlideImage = (slideIndex) => {
    setSlides((prevSlides) => {
      const updatedSlides = [...prevSlides];
      updatedSlides[slideIndex] = { ...updatedSlides[slideIndex], image: "" };
      return updatedSlides;
    });
  };

  const handleImageUpload = (event, slideIndex) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSlides((prevSlides) => {
          const updatedSlides = [...prevSlides];
          updatedSlides[slideIndex] = { ...updatedSlides[slideIndex], image: e.target.result };
          return updatedSlides;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    fetchPreviousPPTs();
  }, []);

  const fetchPreviousPPTs = async () => {
    try {
      const response = await axios.get("https://falcon-ai-backend.vercel.app/get-previous-slides");
      if (response.data?.success) {
        setPreviousPPTs(response.data.previousSlides || []);
      } else {
        setPreviousPPTs([]);
      }
    } catch (error) {
      console.error("Error fetching previous PPTs:", error);
      setPreviousPPTs([]);
    }
  };

  const loadPreviousPPT = async (ppt) => {
    try {
      const response = await axios.get(`https://falcon-ai-backend.vercel.app/get-slides/${ppt.topic}`); 
      if (response.data?.success) {
        setSlides(response.data.slides || []);
        setSelectedPPT(ppt.topic);
        setTopic(ppt.topic);
      }
    } catch (error) {
      console.error("Error loading previous PPT:", error);
      setSlides([]);
    }
  };

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

      // Scroll to slides section after saving
      if (slidesRef.current) {
        slidesRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  } catch (error) {
    alert("Failed to save slides.");
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

    try {
      const response = await axios.post("https://falcon-ai-backend.vercel.app/generate-ppt", {
        topic,
        slidesCount: slideCount,
      });

      const formattedSlides = response.data.slides.map((slide) => ({
  title: slide.title.replace(/\*\*/g, "").trim(),
  content: slide.content.map((point) =>
    point
      .replace(/^[\-\•]\s*/, "") // remove leading '-' or '•' with optional space
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
      // Scroll to template section
setTimeout(() => {
  if (templateRef.current) {
    templateRef.current.scrollIntoView({ behavior: "smooth" });
  }
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

  return (
    <>
      <Navbar />

<div className="dashboard-container">                   <h2>AI Powered PPT Maker</h2>
<p className="subtext">Generate professional presentations instantly!</p>           <div className="previous-ppts">              
                    <FaHistory size={30} title="Previous PPTs" />              
                    <select onChange={(e) => loadPreviousPPT(JSON.parse(e.target.value))}>              
                        <option value="">Select Previous PPT</option>              
                        {previousPPTs.map((ppt, index) => (              
                            <option key={index} value={JSON.stringify(ppt)}>              
                                {ppt.topic}              
                            </option>              
                        ))}              
                    </select>              
                </div>        <div className="input-section">                
      <input                
        type="text"                
        placeholder="Enter topic..."                
        value={topic}                
        onChange={(e) => setTopic(e.target.value)}                
      />                
      <input                
        type="text"                
        placeholder="Slide count"                
        value={slideCount}                
        min={1}                
        max={20}                
        onChange={(e) => setSlideCount(Number(e.target.value))}                
      />                
      <button onClick={generateSlides} disabled={loading}>                
        {loading ? <span className="loading-spinner"></span> : "Generate Slides"}                
      </button>       

      <div style={{ margin: "1rem 0", backgroundColor: "#fff8e1", padding: "1rem", borderRadius: "8px", color: "#8d6e63", fontSize: "0.7rem" }}>
  <strong>Note:</strong> In some cases, the generated images may not be related to the topic. You can remove them or use your own custom images. Don’t worry about the slide arrangement — the content will auto-align.
</div>


    </div>          {error && <p className="error-message">{error}</p>}              {/* Horizontal Theme Selector */}  {/* Horizontal Theme Selector */}

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
        />
      );
    })}
  </div>
</div>
<div className="settings-panel">
  <div className="setting-group">
    <label htmlFor="titleColor" className="setting-label">Title Color</label>
    <input
      id="titleColor"
      type="color"
      value={titleColor}
      onChange={(e) => setTitleColor(e.target.value)}
      className="color-input"
    />
  </div>

  <div className="setting-group">
    <label htmlFor="contentColor" className="setting-label">Content Color</label>
    <input
      id="contentColor"
      type="color"
      value={contentColor}
      onChange={(e) => setContentColor(e.target.value)}
      className="color-input"
    />
  </div>

  <div className="setting-group toggle-group">
    <label htmlFor="imageToggle" className="setting-label">Include Images</label>
    <div className="toggle-wrapper">
      <input
        type="checkbox"
        id="imageToggle"
        checked={useImages}
        onChange={() => setUseImages((prev) => !prev)}
        className="toggle-checkbox"
      />
      <label htmlFor="imageToggle" className="toggle-slider"></label>
    </div>
  
</div>
           
</div>        {slides.length > 0 && (                
  <>                
    <h2>📝 Your Presentation:</h2>  
    <div style={{ margin: "1rem 0", backgroundColor: "#fff8e1", padding: "1rem", borderRadius: "8px", color: "#2d190ee0", fontSize: "0.6rem" }}> 
    You can easily edit slide content, including titles, text, and colors. If you don't want an image in a slide, you can remove it — it won't appear in the final PPT.
    </div>

    <div className="slide-grid">    {slides.map((slide, slideIndex) => {  
const theme = themes.find((t) => t.value === selectedTheme);  
const bgColor = theme?.color;  
const bgImage = theme?.image;  
const textColor = getContrastTextColor(bgColor || "#fff");  return (

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
  onBlur={(e) => {
  const updatedSlides = [...slides];
  
  // Clean the innerText properly
  const rawText = e.target.innerText.trim();
  const lines = rawText
    .split("\n")
    .map((line) => line.replace(/^🔹\s*/, "").trim())
    .filter((line) => line.length > 0);

  // Extra safety: ignore if last line is a duplicate of second last
  if (lines.length >= 2) {
    const last = lines[lines.length - 1];
    const secondLast = lines[lines.length - 2];
    if (last === secondLast) {
      lines.pop(); // Remove the duplicate line
    }
  }

  updatedSlides[slideIndex].content = lines;
  setSlides(updatedSlides);
}}
  className="slide-content-block"
>
 {slide.content
  .filter((point) => point.trim() !== "") // Remove empty points
  .map((point, index) => (
    <div key={index} className="bullet-line">
      {point}
    </div>
  ))}
</div>


  </div>            {/* Conditionally Show Image Section */}  
{useImages && (  <div className="image-container">              
  {slide.image && slide.image.trim() !== "" ? ( // Ensure empty strings don't count              
    <div className="image-wrapper">              
      <img src={slide.image} alt="Slide" className="slide-image" />              
      <button className="remove-image-btn" onClick={() => removeSlideImage(slideIndex)}>              
        ❌              
      </button>              
    </div>              
  ) : (              
   <label className="upload-image-label">              
  ➕  add image              
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
  );              
})}              
    </div>                
          </>                
        )}               
           <div class="new">        <button onClick={saveSlides} className="save-button">Save Slides</button>              
    </div>              
            <div class="down" ref={slidesRef}>          
              <Downloadppt topic={topic}  />   
           
</div>                    


</div>                
<Footer/>
    </>
  );
};

export default PPT;