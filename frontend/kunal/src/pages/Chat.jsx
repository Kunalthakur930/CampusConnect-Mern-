import { useState, useRef, useEffect } from "react";
import Layout from "../components/Layout";
import "./Chat.css";
import { Send, Bot, User, Sparkles, Loader2 } from "lucide-react";
import { API_URL } from "../config";
function Chat() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! I'm your Academic Assistant. Ask me anything about announcements, exams, or reminders.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      
      const response = await fetch(`${API_URL}/api/chat`
        , {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ message: userMessage.text }),
      });

      const data = await response.json();
      const botReply = { sender: "bot", text: data.reply };
      setMessages((prev) => [...prev, botReply]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Sorry, I'm having trouble connecting to the server. Please try again later.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <Layout>
      <div className="chat-page-wrapper">
        <div className="chat-header">
          <div className="ai-status">
            <div className="bot-icon-circle">
              <Bot size={24} />
            </div>
            <div>
              <h2>AI Campus Guide</h2>
              <p>
                <span className="online-dot"></span> Always Online
              </p>
            </div>
          </div>
          <Sparkles className="sparkle-icon" size={20} />
        </div>

        <div className="chat-messages-area">
          {messages.map((msg, index) => (
            <div key={index} className={`message-bubble ${msg.sender}`}>
              <div className="avatar">
                {msg.sender === "user" ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className="text-content">{msg.text}</div>
            </div>
          ))}
          {loading && (
            <div className="message-bubble bot typing">
              <div className="avatar">
                <Bot size={16} />
              </div>
              <div className="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          <div ref={bottomRef}></div>
        </div>

        <div className="chat-input-container">
          <div className="input-wrapper">
            <input
              type="text"
              placeholder="Ask about sem exams, holidays, or deadlines..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              className="send-btn"
              onClick={handleSend}
              disabled={loading || !input.trim()}
            >
              <Send size={18} />
            </button>
          </div>
          <p className="chat-hint">
            AI may provide information based on latest campus announcements.
          </p>
        </div>
      </div>
    </Layout>
  );
}

export default Chat;
