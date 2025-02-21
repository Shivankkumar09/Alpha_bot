import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../AuthContext"; // Import Auth Context

const Hero = () => {
  const navigate = useNavigate();
  const auth = useAuth(); // Access Auth Context

  const handleStartChat = () => {
    console.log("Auth Status:", auth?.user); // Debugging: Check user state

    if (auth?.user) {
      navigate("/chat"); // If logged in, go to Chat
    } else {
      navigate("/login"); // Otherwise, go to Login
    }
  };

  return (
    <div className="bg-zinc-900 min-h-[90vh] w-full flex flex-col items-center justify-center px-4 text-center relative overflow-hidden">
      {/* Background Animation */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-purple-500/10 blur-3xl z-0"
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      ></motion.div>

      {/* Bot Name */}
      <motion.h1
        className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-purple-400 z-10 relative"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Alpha-bot
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        className="text-xl md:text-2xl text-gray-300 z-10 relative max-w-xl lg:max-w-2xl mt-4"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        Your Digital Assistant, Right at Your Fingertips.
      </motion.p>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="relative z-20 mt-6"
      >
        <button
          className="px-5 py-2 md:px-6 md:py-3 text-lg font-semibold bg-teal-500 hover:bg-teal-600 text-white rounded-lg shadow-lg transition-all cursor-pointer"
          onClick={handleStartChat}
        >
          Start Chatting 🚀
        </button>
      </motion.div>
    </div>
  );
};

export default Hero;
