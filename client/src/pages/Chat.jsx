import { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";
import ChatItem from "../components/ChatItem";
import { useNavigate } from "react-router-dom";
import { sendChatRequest, getUserChats } from "../helper/api";
import toast from "react-hot-toast";
import ScaleLoader from "react-spinners/ScaleLoader";
import BounceLoader from "react-spinners/BounceLoader";
import { AiOutlineDelete } from "react-icons/ai";
import { useChat } from "../context/ChatContext";

const Chat = () => {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const chatContainerRef = useRef(null);
  const auth = useAuth();
  const { chatMessages, setChatMessages, handleDeleteChats } = useChat();
  const [loading, setLoading] = useState(false);
  const [chatsLoaded, setChatsLoaded] = useState(false);

  useEffect(() => {
    if (!auth?.user) {
      navigate("/login");
    }
  }, [auth, navigate]);

  useEffect(() => {
    if (auth?.user && !chatsLoaded) {
      setChatsLoaded(true);
      toast.loading("Loading Chats...", { id: "loadchats" });

      getUserChats()
        .then((data) => {
          if (data?.chats) {
            setChatMessages(data.chats);
            toast.success("Chats loaded successfully", { id: "loadchats" });
          } else {
            toast.error("No chat data found", { id: "loadchats" });
          }
        })
        .catch((err) => {
          console.error("Error loading chats:", err);
          toast.error("Failed to load chats", { id: "loadchats" });
        });
    }
  }, [auth?.user, chatsLoaded, setChatMessages]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages, loading]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const content = inputRef.current?.value?.trim();
    if (!content) return;

    if (inputRef.current) inputRef.current.value = "";
    setChatMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: "user",
        content,
        text: content,
        sender: "user",
      },
    ]);
    setLoading(true);

    try {
      const chatData = await sendChatRequest(content);
      if (chatData?.chats) {
        setChatMessages((prev) => [
          ...prev,
          {
            ...chatData.chats.slice(-1)[0],
            id: Date.now().toString(),
            text: chatData.chats.slice(-1)[0].content,
            sender: "assistant",
          },
        ]);
      }
    } catch (error) {
      console.error("Error sending chat:", error);
      toast.error("Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-zinc-900 flex flex-col overflow-hidden">
      <Header>
        <div className="flex items-center gap-4 md:hidden">
          <div className="h-10 w-10 rounded-full bg-gray-200 text-black flex items-center justify-center text-lg font-bold">
            {auth?.user?.name
              ? auth.user.name
                  .split(" ")
                  .map((word) => word[0])
                  .join("")
                  .toUpperCase()
              : "U"}
          </div>
          <button onClick={handleDeleteChats} className="text-red-500 text-2xl">
            <AiOutlineDelete />
          </button>
        </div>
      </Header>
      <div className="px-3 py-2 h-[88vh] gap-5 flex md:justify-between bg-zinc-900 w-screen">
        <div className="px-2 h-96 w-72 bg-zinc-800 flex-col justify-evenly rounded-lg items-center hidden md:flex">
          <div className="h-14 w-14 rounded-full bg-gray-200 text-black flex items-center justify-center text-xl font-bold">
            {auth?.user?.name
              ? auth.user.name
                  .split(" ")
                  .map((word) => word[0])
                  .join("")
                  .toUpperCase()
              : "U"}
          </div>
          <h3 className="text-white">You are talking to a ChatBOT</h3>
          <p className="text-white text-sm text-center">
            You can ask questions related to Knowledge, Business, Advice,
            Education, etc. But avoid sharing personal information.
          </p>
          <button
            onClick={handleDeleteChats}
            className="py-2.5 px-5 text-sm font-medium text-white bg-red-600 rounded-full hover:bg-red-700"
          >
            Clear Conversation
          </button>
        </div>
        <div className="flex-1 w-full md:w-[78.5vw] rounded-lg bg-zinc-800 flex flex-col relative z-20">
          <div
            className="flex-grow overflow-y-auto p-3 pb-3 relative z-30"
            ref={chatContainerRef}
          >
            {chatMessages.length > 0 ? (
              chatMessages.map((chat) => (
                <ChatItem
                  content={chat.content}
                  role={chat.role}
                  key={chat.id}
                />
              ))
            ) : (
              <p className="text-white text-center mt-48 text-xl">
                No chats yet. Start the conversation!
              </p>
            )}
            {loading && (
              <div className="flex items-center gap-4 p-4 rounded-lg my-2 bg-gray-200 text-black">
                <BounceLoader size={30} color="black" />
                <p className="ml-3 text-lg">Assistant is typing...</p>
              </div>
            )}
          </div>
          <div className="p-3 relative z-40 flex items-center gap-3">
            <input
              type="text"
              ref={inputRef}
              placeholder="Type a message..."
              className="flex-grow p-2 rounded-lg bg-zinc-700 text-white focus:outline-none"
              disabled={loading}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault(); // Prevents newline in input
                  onSubmit(e);
                }
              }}
            />
            <button
              onClick={onSubmit}
              className="px-4 py-2 bg-zinc-700 text-white rounded-lg flex items-center justify-center min-w-[80px]"
              disabled={loading}
            >
              {loading ? <ScaleLoader height={20} color="white" /> : "Send"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
