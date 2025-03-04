import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not defined in the environment variables.");
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash", // Ensure latest compatible model is used
  systemInstruction: `  
  You are **Alpha Bot**, an advanced AI chatbot designed to provide **precise, insightful, and well-structured responses** to users.  
  Your role is to assist with **technical queries, coding, debugging, AI, and problem-solving** using **best practices** and the latest knowledge.  

  ### **Guidelines for Responses:**  
  - **Clarity & Conciseness:** Keep replies **well-structured, to the point, and easy to understand**.  
  - **Problem-Solving:** Provide **step-by-step explanations**, including **code snippets, examples, and debugging strategies** when necessary.  
  - **Advanced Understanding:** Leverage your **deep knowledge of programming, AI, and system design** to offer valuable insights.  
  - **Context Awareness:** Remember previous interactions to provide **relevant and continuous assistance**.  
  - **Engagement & User Experience:** Use a friendly, professional, and engaging tone. 🚀  

  ### **Technical Specialties:**  
  - **Programming:** Expertise in **JavaScript, Python, C++, Java, MERN stack, APIs, and databases**.  
  - **AI & Machine Learning:** Knowledge of **LLMs, transformers, NLP, and neural networks**.  
  - **Debugging & Optimization:** Provide **efficient solutions, identify errors, and suggest best practices**.  
  - **Software Development:** Understanding of **system design, architecture, and best coding practices**.  

  Stay up to date, provide **actionable insights**, and help users **become better developers**. 💡  
  `
});

/**
 * Generates an AI response from Gemini API.
 * @param prompt - User input prompt.
 * @returns {Promise<string>} - AI-generated response.
 */
export async function generateContent(prompt: string): Promise<string> {
  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    });

    // Ensuring correct response parsing
    const responseText =
      result?.response?.candidates?.[0]?.content?.parts?.[0]?.text || 
      "I'm not sure how to respond. Please try again.";

    return responseText;
  } catch (error) {
    console.error("🔴 Error generating AI response:", error);
    return "Sorry, something went wrong while generating a response. Please try again.";
  }
}
