# 🤖 Alpha Bot - AI Chatbot (MERN Stack)

Alpha Bot is a full-stack AI chatbot built using the MERN stack, integrated with Google's Generative AI (Gemini API). It allows users to have intelligent conversations, manage chats, and enjoy a modern UI/UX experience.

## 🚀 Live Demo

https://alpha-bot-alpha.vercel.app/

---

## 🧰 Tech Stack

### 🖥️ Frontend

Built with **React 19**, **Tailwind CSS 4**, and various modern libraries:

- `react-router-dom` – Routing and navigation  
- `axios` – API requests  
- `framer-motion` & `motion` – Smooth animations  
- `react-hot-toast` – Toast notifications  
- `react-type-animation` – Typing effect  
- `react-icons`, `@tabler/icons-react` – Iconography  
- `react-syntax-highlighter` – Syntax highlighting for code responses  
- `tailwind-merge`, `clsx` – Tailwind utility management  
- `@radix-ui/react-label` – Accessible labels  

### ⚙️ Backend

Developed using **Express**, **MongoDB**, and integrated with **Google's Generative AI API**:

- `express`, `cors`, `helmet`, `compression` – RESTful API and middleware  
- `mongoose` – MongoDB ODM  
- `jsonwebtoken`, `bcrypt` – Authentication and security  
- `express-validator` – Validation middleware  
- `cookie-parser`, `dotenv`, `morgan` – Utilities and logging  
- `@google/generative-ai` – Gemini API integration  

#### TypeScript Support

Includes complete type safety using TypeScript and relevant `@types` packages.

---

## 📂 Project Structure

```
alpha-bot/
├── client/             # Frontend (React + Tailwind)
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       └── ...
├── server/             # Backend (Express + MongoDB)
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── ...
├── .env                # Environment variables
├── package.json
└── README.md
```

---

## 🔐 Features

- ✨ Real-time AI Chatbot using Gemini API  
- 🔒 JWT-based Authentication  
- 🧠 Chat context management  
- 💬 Persistent chat history (MongoDB)  
- 🎨 Clean and responsive UI (mobile-friendly)  
- ⚙️ Type-safe backend with TypeScript  

---

## ⚡ Getting Started

### Prerequisites

- Node.js & npm  
- MongoDB (local or cloud)  
- Google Generative AI API Key  

### Clone the Repository

```bash
git clone https://github.com/your-username/alpha-bot.git
cd alpha-bot
```

### Setup Backend

```bash
cd server
npm install
cp .env.example .env   # Add your MONGO_URI and API key here
npm run dev
```

### Setup Frontend

```bash
cd client
npm install
npm run dev
```

---

## 🌐 Environment Variables

Create a `.env` file in the `server/` directory with the following:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_API_KEY=your_google_gemini_api_key
```

## 🧑‍💻 Author

**Shivank Kumar**

- [LinkedIn](https://www.linkedin.com/in/shivank-kumar-17a884254/)
- [GitHub](https://github.com/Shivankkumar09)

---


