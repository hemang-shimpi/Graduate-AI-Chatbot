// GSU Themed AI Chatbot - Final Professional Version
// Fix: Center-align suggestion buttons with clean layout and settings panel
import ReactMarkdown from 'react-markdown';

import React, { useState, useRef, useEffect } from "react";
import {
  FaSmile,
  FaTrash,
  FaPaperPlane,
  FaDownload,
  FaMoon,
  FaSun,
  FaMicrophone,
  FaCog,
} from "react-icons/fa";
import pantherLogo from "./assets/logo.png";
import botAvatar from "./assets/pounce-bot.png";

const quickReplies = [
  "Requirements",
  "Course Waiver",
  "Apply to GRA",
  "Apply to GTA",
  "Changing research advisors",


];

const languages = ["English", "Spanish", "French", "Chinese"];

function Chatbot() {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [language, setLanguage] = useState("English");
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [showTools, setShowTools] = useState(false);

  const endRef = useRef(null);
  const emojiRef = useRef(null);

  const defaultWelcomeMessages = [
    {
      sender: "bot",
      text: "Hello! 👋 I'm Pounce, your GSU chatbot. How can I help you today?",
    },

  ];
  
  const [messages, setMessages] = useState(() => {
    const stored = localStorage.getItem("chat_messages");
    return stored ? JSON.parse(stored) : defaultWelcomeMessages;
  });
  

  useEffect(() => {
    const stored = localStorage.getItem("chat_messages");
    if (stored) {
      setMessages(JSON.parse(stored));
    } else {
      handleClear(); 
    }
  }, []);
  

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
    localStorage.setItem("chat_messages", JSON.stringify(messages));
  }, [messages]);
  

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiRef.current &&
        !emojiRef.current.contains(event.target) &&
        !event.target.closest("button[title='Emoji Picker']")
      ) {
        setShowEmoji(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const picker = emojiRef.current;
    if (picker) {
      const handleEmojiClick = (e) => {
        const emoji = e.detail.unicode;
        setInput((prev) => prev + emoji);
        setShowEmoji(false);
      };
      picker.addEventListener("emoji-click", handleEmojiClick);
      return () => picker.removeEventListener("emoji-click", handleEmojiClick);
    }

    endRef.current?.scrollIntoView({ behavior: "smooth" });
    localStorage.setItem("chat_messages", JSON.stringify(messages));

    const handleEmoji = (e) => {
      if (e.target.tagName === "EMOJI-PICKER") return;
      if (showEmoji && !emojiRef.current?.contains(e.target)) {
        setShowEmoji(false);
      }
    };

    document.addEventListener("click", handleEmoji);
    return () => document.removeEventListener("click", handleEmoji);
  }, [messages, showEmoji]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    setInput("");
    fetch("http://127.0.0.1:5000/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: input }),
    })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.json();
    })
    .then((data) => {
      const botReply = data.response || "Sorry, something went wrong.";
      setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
      if (ttsEnabled) speakText(botReply);
    })
    .catch((error) => {
      console.error("Error occurred:", error);
      setMessages((prev) => [...prev, { sender: "bot", text: "An error occurred: " + error.message }]);
    });
    
  };

  const handleVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Speech recognition not supported");
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput((prev) => prev + transcript);
    };
  };

  const simulateBotReply = (text) => {
    setIsTyping(true);
    setTimeout(() => {

      const responseText = typeof text === 'object' ? JSON.stringify(text) : text;
      setMessages((prev) => [...prev, { sender: "bot", text: responseText }]);
      if (ttsEnabled) speakText(text);
      setIsTyping(false);
    }, 1000);
  };

  const speakText = (text) => {
    const synth = window.speechSynthesis;
    if (!synth) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === "English" ? "en-US" : language;
    synth.speak(utterance);
  };

  const handleQuickReply = async (reply) => {
    setMessages((prev) => [...prev, { sender: "user", text: reply }]);

    console.log("Here");  // Debugging log

    // Update UI to reflect the user's message


    try {
        // Sending the reply (user's message) to the server
        const response = await fetch("http://localhost:5000/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ query: reply }) // Send the reply as the query
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        // Extract data from the response
        const data = await response.json();
        // Simulate a bot reply (Make sure this function is defined correctly elsewhere)
        simulateBotReply(data.response);

        // Assuming data.response contains the bot's message
    } catch (error) {
        console.error("Error fetching response:", error);
    }
};


  const handleClear = () => {
    setMessages([
      {
        sender: "bot",
        text: "Hello! 👋 I'm Pounce, your GSU chatbot. How can I help you today?",
      },
      {
        sender: "bot",
        text: "Which one would you like to learn about?",
      },
    ]);
    localStorage.removeItem("chat_messages");
  };

  const handleDownload = () => {
    const chatText = messages.map((m) => `${m.sender}: ${m.text}`).join("\n");
    const blob = new Blob([chatText], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "chat_history.txt";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-green-100 dark:from-gray-800 dark:via-gray-900 dark:to-black px-4 transition-all">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden relative">

          {/* Emoji Picker */}
          {showEmoji && (
            <div className="absolute bottom-32 right-6 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-300 dark:border-gray-700">
              <emoji-picker ref={emojiRef}></emoji-picker>
            </div>
          )}

          {/* Header */}
          <div className="bg-gradient-to-r from-blue-700 to-indigo-900 dark:from-gray-700 dark:to-gray-900 p-4 flex items-center justify-between relative">
            <div className="flex items-center gap-3">
              <img src={pantherLogo} alt="GSU Panther" className="h-10 w-10 drop-shadow-md" />
              <h1 className="text-white font-bold text-xl">Pounce</h1>
            </div>
            <div className="flex items-center gap-2 relative">
              {showTools && (
                <div className="absolute right-10 top-12 md:top-10 bg-white dark:bg-gray-800 p-2 rounded-xl shadow-md border border-gray-300 dark:border-gray-600 flex gap-2 z-50">
                  <button onClick={() => setDarkMode((d) => !d)} title="Toggle Theme">
                    {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-blue-400" />}
                  </button>
                  <button title="Emoji Picker" onClick={() => setShowEmoji(!showEmoji)}>
                    <FaSmile className="text-pink-400" />
                  </button>
                  <button onClick={() => setTtsEnabled(t => !t)} title="Toggle TTS">
                    {ttsEnabled ? "🔊" : "🔇"}
                  </button>
                  <button title="Download Chat" onClick={handleDownload}>
                    <FaDownload className="text-green-500" />
                  </button>
                  <button onClick={handleClear} title="New Chat">
                    <FaTrash className="text-red-500" />
                  </button>
                </div>
              )}
              <button
                onClick={() => {
                  setShowTools((prev) => !prev);
                  setShowEmoji(false);
                }}
                className="text-white text-lg transition-transform duration-300"
              >
                <FaCog className={`${showTools ? "animate-spin" : ""}`} />
              </button>
              <select
                className="bg-transparent outline-none text-white text-sm"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang} className="text-black">{lang}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Messages */}
          <div className="relative h-[440px] overflow-y-auto px-4 py-4 bg-gray-50 dark:bg-gray-900 space-y-3 text-sm">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className="flex items-start gap-2">
                {msg.sender === "bot" && (
                  <img
                    src={botAvatar}
                    alt="Pounce Bot"
                    className="h-8 w-8 rounded-none"
                  />
                )}
                  <div className={`px-4 py-2 rounded-2xl shadow ${msg.sender === "user" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white"}`}>
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                  {msg.sender === "user" && <div className="text-xl">👤</div>}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="text-gray-500 dark:text-gray-300 italic animate-pulseFast">Pounce is typing...</div>
            )}
            <div ref={endRef} />
          </div>

          {/* Suggestions - Now Centered & Aligned */}
          <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 pt-2 pb-3">
            <div className="flex flex-wrap justify-center gap-2">
              {quickReplies.map((text, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickReply(text)}
                  className="border border-blue-300 dark:border-blue-500 text-blue-600 dark:text-blue-300 px-3 py-1 rounded-md hover:bg-blue-50 dark:hover:bg-gray-700 transition text-xs"
                >
                  {text}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <form
            onSubmit={handleSend}
            className="flex items-center px-4 py-4 border-t bg-white dark:bg-gray-800 gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me a question..."
              className="flex-1 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
            <button
              type="button"
              onClick={handleVoiceInput}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-500 text-xl transition hover:scale-110"
            >
              <FaMicrophone />
            </button>
            <button
              type="submit"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-500 text-xl transition hover:scale-110"
            >
              <FaPaperPlane />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;