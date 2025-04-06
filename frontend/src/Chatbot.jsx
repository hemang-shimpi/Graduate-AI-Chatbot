// GSU Themed AI Chatbot - Final Version
// Includes: Speech-to-text, avatars, auto-translation, dark mode, emoji picker (web component), text-to-speech

import React, { useState, useRef, useEffect } from "react";
import {
  FaSmile,
  FaTrash,
  FaPaperPlane,
  FaDownload,
  FaMoon,
  FaSun,
  FaMicrophone,
} from "react-icons/fa";
import pantherLogo from "./assets/logo.png";

const quickReplies = [
  "How to Apply",
  "Application Deadlines",
  "Other Deadlines",
  "Tuition and Fees",
  "Programs Available",
  "Courses Available",
  "Office Contacts",
];

const languages = ["English", "Spanish", "French", "Chinese"];

function Chatbot() {
  const [messages, setMessages] = useState(() => {
    const stored = localStorage.getItem("chat_messages");
    return stored
      ? JSON.parse(stored)
      : [
          {
            sender: "bot",
            text: "Hello! 👋 I'm Pounce, your GSU chatbot. How can I help you today?",
          },
          {
            sender: "bot",
            text: "Which one would you like to learn about?",
          },
        ];
  });

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [language, setLanguage] = useState("English");
  const [ttsEnabled, setTtsEnabled] = useState(false);

  const endRef = useRef(null);
  const emojiRef = useRef(null);

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
    simulateBotReply(`Great! Here's info about "${input}".`);
  };

  const simulateBotReply = async (text) => {
    setIsTyping(true);
    let reply = text;
    let translated = text;

    if (language !== "English") {
      setMessages((prev) => [...prev, { sender: "bot", text: "Translating..." }]);
      try {
        translated = await translateText(text, language);
      } catch (err) {
        console.error("Translation failed:", err);
      }
    }

    setMessages((prev) => prev.filter(m => m.text !== "Translating..."));
    setTimeout(() => {
      setMessages((prev) => [...prev, { sender: "bot", text: translated }]);
      if (ttsEnabled) speakText(translated);
      setIsTyping(false);
    }, 1200);
  };

  const translateText = async (text, targetLang) => {
  if (!targetLang || targetLang === "English") return text;
  try {
    const res = await fetch("https://libretranslate.de/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: text,
        source: "en",
        target: targetLang.toLowerCase().slice(0, 2),
        format: "text",
      }),
    });
    const data = await res.json();
    return data.translatedText;
  } catch (error) {
    console.error("Translation failed:", error);
    return text;
  }
};


   const speakText = (text) => {
    const synth = window.speechSynthesis;
    if (!synth) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === "English" ? "en-US" : language;
    synth.speak(utterance);
  };

  const handleQuickReply = (reply) => {
    setMessages((prev) => [...prev, { sender: "user", text: reply }]);
    simulateBotReply(`Here's some information about "${reply}".`);
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

  const handleVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput((prev) => prev + transcript);
    };
    recognition.onerror = (event) => {
      console.error("Speech recognition error", event);
    };
  };

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-100 dark:from-gray-800 dark:via-gray-900 dark:to-black px-4">
        <div className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden relative">
          {showEmoji && (
            <div
              ref={emojiRef}
              className="absolute bottom-20 left-1/2 -translate-x-1/2 z-50 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-300 dark:border-gray-600 animate-dropdown"
            >
              <emoji-picker
                class="w-72"
                style={{ height: "330px" }}
                
              ></emoji-picker>
            </div>
          )}

          {/* Header */}
          <div className="bg-gradient-to-r from-sky-600 to-blue-800 dark:from-gray-700 dark:to-gray-900 p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src={pantherLogo} alt="GSU Panther" className="h-8 w-8 drop-shadow-md" />
              <h1 className="text-white font-semibold text-lg">Pounce</h1>
            </div>
            <div className="flex items-center gap-2 text-white text-sm">
              <button onClick={() => setDarkMode((d) => !d)} title="Toggle Theme">{darkMode ? <FaSun /> : <FaMoon />}</button>
              <button title="Emoji Picker" onClick={() => setShowEmoji(!showEmoji)}><FaSmile /></button>
              <button onClick={() => setTtsEnabled(t => !t)} title="Toggle Text-to-Speech">
                {ttsEnabled ? "🔊" : "🔇"}
              </button>
              <button title="Download Chat" onClick={handleDownload}><FaDownload /></button>
              <button title="New Chat" onClick={handleClear} className="px-2 py-1 bg-blue-700 text-white text-xs rounded hover:bg-blue-800 transition">New Chat</button>
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
          <div className="h-[420px] overflow-y-auto px-4 py-3 bg-gray-50 dark:bg-gray-900 space-y-2 text-sm">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className="flex items-start gap-2">
                  {msg.sender === "bot" && <div className="text-xl">🤖</div>}
                  <div className={`px-4 py-2 rounded-lg shadow-sm ${msg.sender === "user" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white"}`}>
                    {msg.text}
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

          {/* Quick Replies */}
          <div className="px-4 pb-3 flex flex-col gap-2 bg-white dark:bg-gray-800">
            {quickReplies.map((text, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickReply(text)}
                className="border border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-300 px-3 py-2 text-sm rounded-md hover:bg-blue-50 dark:hover:bg-gray-700 transition"
              >
                {text}
              </button>
            ))}
          </div>

          {/* Input */}
          <form
            onSubmit={handleSend}
            className="flex items-center px-4 py-3 border-t bg-white dark:bg-gray-800 gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me a question"
              className="flex-1 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            />
            <button
              type="button"
              onClick={handleVoiceInput}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-500 text-lg transition transform hover:scale-110"
            >
              <FaMicrophone />
            </button>
            <button
              type="submit"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-500 text-lg transition transform hover:scale-110"
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
