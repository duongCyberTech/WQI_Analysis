require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const { GoogleGenAI } = require("@google/genai");

const PORT = 3005;
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const app = express();
app.use(cors({
  origin: '*', // Allow all origins (adjust for production)
  methods: 'PUT,GET, POST, DELETE, PATCH, OPTIONS', // Allow specific methods
  allowedHeaders: ['Content-Type', 'Authorization'] // Allow specific headers, including Content-Type
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello from Gemini-powered Node.js server!");
});

// app.post("/predict", async (req, res) => {
//   try {
//     const response = await axios.post("http://localhost:8000/test", req.body);
//     res.json(response.data);
//   } catch (error) {
//     console.error("FastAPI Error:", error.message);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

function normalizeMessages(messages) {
  return messages.map((message, index) => {
    if (index % 2 === 0) {
      // Vị trí chẵn sẽ là của người dùng (user)
      return {
        role: "user",
        content: message,
      };
    } else {
      // Vị trí lẻ sẽ là của mô hình (model)
      return {
        role: "model",
        content: message,
      };
    }
  });
}



app.post("/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    
    // Chuẩn hóa messages
    const normalizedMessages = messages.map((m) => ({
      parts: [{
        role: m.role,  // role user/model
        text: m.content,  // text cần là chuỗi
      }],
    }));

    // Sử dụng normalizedMessages cho API Gemini
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: normalizedMessages,
      config: { temperature: 0.7 },
    });

    res.json({ reply: response.text });
  } catch (err) {
    console.error("Gemini API lỗi:", err);
    res.status(500).json({ error: err.message });
  }
});



app.listen(PORT, () => {
  console.log(`Server chạy tại http://chatbot-service:${PORT}`);
});
