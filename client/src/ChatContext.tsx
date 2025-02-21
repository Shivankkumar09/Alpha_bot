import { createContext, useContext, useState } from "react";
import { deleteUserChats, getUserChats } from "./helper/api";
import toast from "react-hot-toast";

const ChatContext = createContext();

import { ReactNode } from "react";

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [chatMessages, setChatMessages] = useState([]);

  // Load Chats
  const loadChats = async () => {
    try {
      toast.loading("Loading Chats...", { id: "loadchats" });
      const data = await getUserChats();
      if (data?.chats) {
        setChatMessages(data.chats);
        toast.success("Chats loaded successfully", { id: "loadchats" });
      } else {
        toast.error("No chat data found", { id: "loadchats" });
      }
    } catch (error) {
      console.error("Error loading chats:", error);
      toast.error("Failed to load chats", { id: "loadchats" });
    }
  };

  // Delete All Chats
  const handleDeleteChats = async () => {
    try {
      toast.loading("Deleting Chats...", { id: "deletechats" });
      setChatMessages([]); // Clear immediately before API call
      await deleteUserChats();
      toast.success("Chats deleted successfully", { id: "deletechats" });
    } catch (error) {
      console.error("Error deleting chats:", error);
      toast.error("Failed to delete chats", { id: "deletechats" });
    }
  };

  return (
    <ChatContext.Provider value={{ chatMessages, setChatMessages, handleDeleteChats, loadChats }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  return useContext(ChatContext);
};
