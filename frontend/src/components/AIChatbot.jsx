import React, { useState } from "react";
import axios from "axios";
import "../style/Popup.css";

const AIChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleSend = async () => {
    if (!input.trim()) return;
  
    const userMsg = { role: "user", content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
  
    try {
      const res = await axios.post("http://localhost:3005/chat", {
        messages: [userMsg],
      });
  
      const botMsg = {
        role: "assistant", // Đảm bảo sử dụng 'model' cho bot response
        content: res.data.reply || "Không có phản hồi.",
      };
      setMessages([...newMessages, botMsg]);
    } catch (err) {
      const errorMsg = {
        role: "model",
        content: "Lỗi máy chủ: " + err.message,
      };
      setMessages([...newMessages, errorMsg]);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="chat-wrapper">
      {open ? (
        <div className="chat-box">
          <div className="chat-header">
            <span>💬 Trợ lý ảo</span>
            <button onClick={() => setOpen(false)}>✖</button>
          </div>
          <div className="chat-body">
            {messages.map((msg, index) => (
              <div key={index} className={`msg-box ${msg.role}`}>
                {msg.role === "assistant" && <div className="msg-title">🤖 Trợ lý:</div>}
                <div className={`msg ${msg.role}`}>{msg.content}</div>
              </div>
            ))}
            {loading && <div className="msg assistant">Đang trả lời...</div>}
          </div>
          <div className="chat-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Nhập câu hỏi..."
            />
            <button onClick={handleSend}>Gửi</button>
          </div>
        </div>
      ) : (
        <button className="chat-toggle" onClick={() => setOpen(true)}>
          💬 AI Chat
        </button>
      )}
    </div>
  );
};

export default AIChatBot;
