import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import "./Search.css";
import Navbar from "../Navbar/Navbar.jsx";
import { IoSend, IoChatbubblesOutline } from "react-icons/io5";
import { ImSpinner2 } from "react-icons/im";
import { v4 as uuidv4 } from "uuid";

const CodeBlock = ({ className, children, ...props }) => {
  const language = className ? className.replace("language-", "") : "";
  const code = String(children).trim();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="code-wrapper">
      <SyntaxHighlighter language={language} style={atomOneDark} PreTag="div" {...props}>
        {code}
      </SyntaxHighlighter>
      <button className="copy-btn" onClick={handleCopy}>
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
};

const Search = () => {
  const messagesEndRef = useRef(null);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sessionId, setSessionId] = useState(localStorage.getItem("sessionId") || uuidv4());
  const [showChatHistory, setShowChatHistory] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    localStorage.setItem("sessionId", sessionId);
  }, [sessionId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);

  const toggleChatHistory = () => {
    if (!showChatHistory) {
      const storedMessages = localStorage.getItem("chatHistory");
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      }
    }
    setShowChatHistory(!showChatHistory);
  };

  const handleMessageClick = (index) => {
    if (selectedMessage === index) {
      setSelectedMessage(null);
    } else {
      setSelectedMessage(index);
    }
  };

  const handleEdit = (index) => {
    setQuery(messages[index].text);
    setEditIndex(index);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".chat-message")) {
        setSelectedMessage(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    let updatedMessages = [...messages];

    if (editIndex !== null) {
      updatedMessages.splice(editIndex, 2);
      updatedMessages.splice(editIndex, 0, { sender: "user", text: query });
      setEditIndex(null);
    } else {
      updatedMessages.push({ sender: "user", text: query });
    }

    setMessages(updatedMessages);
    setQuery("");
    document.getElementById("chat-input").style.height = "auto"; // Reset textarea height

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("https://falcon-ai-backend.vercel.app/ai-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, sessionId }),
      });

      const data = await response.json();

      if (response.ok) {
        updatedMessages.push({ sender: "ai", text: data.response });
        setMessages(updatedMessages);
        localStorage.setItem("chatHistory", JSON.stringify(updatedMessages));
      } else {
        setError(data.error || "An error occurred");
      }
    } catch (err) {
      setError("An error occurred while fetching data");
    }

    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <div className="chat-container">
        <div className="chat-history-icon" onClick={toggleChatHistory}>
          <IoChatbubblesOutline size={28} />
        </div>

        <div className="chat-window">
          {messages.length === 0 && !loading && !error && (
            <div className="default-message">
              <p>👋 Hello! How can I assist you today?</p>
            </div>
          )}

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`chat-message ${msg.sender}-message`}
              ref={index === messages.length - 1 ? messagesEndRef : null}
              onClick={() => msg.sender === "user" && handleMessageClick(index)}
            >
              <div className="copy-container">
                {msg.sender === "ai" ? (
                  <div className="ai-message">
                    <ReactMarkdown
                      children={msg.text}
                      components={{
                        code({ inline, className, children, ...props }) {
                          return !inline ? (
                            <CodeBlock className={className} {...props}>{children}</CodeBlock>
                          ) : (
                            <code className="inline-code">{children}</code>
                          );
                        },
                      }}
                    />
                    <button className="copy-btn" onClick={() => navigator.clipboard.writeText(msg.text)}>
                      📋 Copy
                    </button>
                  </div>
                ) : (
                  <div className="chat-text">{msg.text}</div>
                )}
                {msg.sender === "user" && selectedMessage === index && (
                  <div className="message-options">
                    <button onClick={() => navigator.clipboard.writeText(msg.text)}>📋 Copy</button>
                    <button onClick={() => handleEdit(index)}>✏️ Edit Message</button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="loading-animation">
              <div className="loading-dot"></div>
              <div className="loading-dot"></div>
              <div className="loading-dot"></div>
            </div>
          )}
          {error && <p className="error-text">{error}</p>}
        </div>

        <form className="chat-input-container" onSubmit={handleSubmit}>
          <textarea
            id="chat-input"
            className="message-box"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              e.target.style.height = "auto"; // Reset height
              e.target.style.height = `${e.target.scrollHeight}px`; // Adjust dynamically
            }}
            placeholder="Send a message..."
            disabled={loading}
            rows={1}
          />
          <button id="send-button" className="submit-btn" type="submit" disabled={loading}>
            {loading ? <ImSpinner2 className="animate-spin text-xl" /> : <IoSend className="text-xl" />}
          </button>
        </form>
      </div>
    </>
  );
};

export default Search;