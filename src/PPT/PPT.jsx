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
  const [isSaved, setIsSaved] = useState(false); // ✅ NEW STATE

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
        setIsSaved(true); // ✅ SHOW DOWNLOAD BUTTON

        if (slidesRef.current) {
          slidesRef.current.scrollIntoView({ behavior: "smooth" });
        }
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
    setIsSaved(false); // ✅ Reset download state when new slides generated

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

  const loadPreviousPPT = async (ppt) => {
    try {
      const response = await axios.get(`https://falcon-ai-backend.vercel.app/get-slides/${ppt.topic}`);
      if (response.data?.success) {
        setSlides(response.data.slides || []);
        setSelectedPPT(ppt.topic);
        setTopic(ppt.topic);
        setIsSaved(true); // ✅ Enable download button for previous
      }
    } catch (error) {
      console.error("Error loading previous PPT:", error);
      setSlides([]);
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

      {/* your UI here (input, slides etc.) */}

      <div className="new">
        <button onClick={saveSlides} className="save-button">
          Save Slides
        </button>
      </div>

      {/* ✅ Conditionally Show Download Option */}
      {isSaved && (
        <div className="down" ref={slidesRef}>
          <Downloadppt topic={topic} />
        </div>
      )}

      <Footer />
    </>
  );
};

export default PPT;