import { useAuth } from "../AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineDelete, AiOutlineLogin, AiOutlineLogout, AiOutlineUserAdd } from "react-icons/ai";
import { useChat } from "../ChatContext";

const Header = () => {
  const auth = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isChatPage = location.pathname === "/chat";

  const { handleDeleteChats } = useChat();

  const handleLogout = () => {
    auth.logout(); // Logs the user out
    localStorage.removeItem("token"); // Remove token from storage
    sessionStorage.removeItem("token"); // Ensure session is cleared
    navigate("/login"); // Redirect to login page
  };

  return (
    <div className="bg-zinc-800 h-20 w-screen flex justify-between items-center px-7 overflow-hidden relative z-50">
      {/* Bot Logo */}
      <Link to="/">
        <div className="h-14 w-14 cursor-pointer">
          <img src="/bot-image.png" alt="logo" className="object-cover h-full w-full" />
        </div>
      </Link>

      {/* Right Section (User Info + Delete Button + Auth Buttons) */}
      <div className="flex items-center gap-4">
        {/* User Initials (Only if Logged In) */}
        {auth?.user && (
          <div className="h-10 w-10 rounded-full bg-gray-200 text-black flex items-center justify-center text-lg font-bold">
            {auth.user.name
              .split(" ")
              .map((word) => word[0])
              .join("")
              .toUpperCase()}
          </div>
        )}

        {/* Delete Button (ONLY on small screens & ONLY on /chat page) */}
        {isChatPage && auth?.user && (
          <button onClick={handleDeleteChats} className="text-red-500 text-2xl cursor-pointer md:hidden">
            <AiOutlineDelete />
          </button>
        )}

        {/* Login/Signup (Icons on small, Buttons on large) */}
        {!auth?.isLoggedIn && (
          <div className="flex items-center gap-3">
            {/* Icons for small screens */}
            <Link to="/login" className="text-white text-2xl md:hidden">
              <AiOutlineLogin />
            </Link>
            <Link to="/signup" className="text-white text-2xl md:hidden">
              <AiOutlineUserAdd />
            </Link>

            {/* Buttons for large screens */}
            <Link to="/login" className="hidden md:block bg-zinc-700 text-white px-4 py-2 rounded-lg">
              Login
            </Link>
            <Link to="/signup" className="hidden md:block bg-white text-black px-4 py-2 rounded-lg">
              Signup
            </Link>
          </div>
        )}

        {/* Logout (Icon for small screens, Button for large) */}
        {auth?.isLoggedIn && (
          <>
            {/* Icon for small screens */}
            <button onClick={handleLogout} className="text-red-600 text-2xl md:hidden">
              <AiOutlineLogout />
            </button>

            {/* Button for large screens */}
            <button onClick={handleLogout} className="hidden md:block bg-white text-black px-4 py-2 rounded-lg">
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
