import { useAuth } from "../context/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    AiOutlineDelete,
    AiOutlineLogin,
    AiOutlineLogout,
    AiOutlineUserAdd,
} from "react-icons/ai";
import { useChat } from "../context/ChatContext";

const Header = () => {
    const auth = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const isChatPage = location.pathname === "/chat";

    const { handleDeleteChats } = useChat() || {}; // Avoid destructuring error, provide default

    const handleLogout = () => {
        auth?.logout?.(); // Logs the user out
        localStorage.removeItem("token"); // Remove token from storage
        sessionStorage.removeItem("token"); // Ensure session is cleared
        navigate("/login"); // Redirect to login page
    };

    // Function to generate user initials
    const getUserInitials = () => {
        if (auth?.user?.name) {
            return auth.user.name
                .split(" ")
                .map((word) => word[0])
                .join("")
                .toUpperCase();
        }
        return "";
    };

    return (
        <div className="bg-zinc-800 h-20 w-screen flex justify-between items-center px-4 md:px-7 overflow-hidden relative z-50">
            {/* Logo + Alphabot Name */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
                <div className="h-12 w-12 cursor-pointer">
                    <img
                        src="/bot-image.png"
                        alt="logo"
                        className="object-cover h-full w-full"
                    />
                </div>
                <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-purple-400 relative">
                    Alphabot
                </span>
            </Link>

            {/* Right Section */}
            <div className="flex items-center gap-4 md:gap-5 flex-shrink-0">
                {/* User Initials (Only if Logged In) */}
                {auth?.user?.name && (
                    <div className="h-10 w-10 rounded-full bg-gray-200 text-black flex items-center justify-center text-lg font-bold">
                        {getUserInitials()}
                    </div>
                )}

                {/* Delete Button (Only on /chat page for small screens) */}
                {isChatPage && auth?.isLoggedIn && handleDeleteChats && (
                    <button
                        onClick={handleDeleteChats}
                        className="text-red-500 text-2xl cursor-pointer md:hidden" // Hide on medium and larger screens
                    >
                        <AiOutlineDelete />
                    </button>
                )}

                {/* Login/Signup (Icons on small, Buttons on large) */}
                {!auth?.isLoggedIn && (
                    <div className="flex items-center gap-4 md:gap-3">
                        {/* Icons for small screens */}
                        <Link to="/login" className="text-white text-2xl md:hidden">
                            <AiOutlineLogin />
                        </Link>
                        <Link to="/signup" className="text-white text-2xl md:hidden">
                            <AiOutlineUserAdd />
                        </Link>

                        {/* Buttons for large screens */}
                        <Link
                            to="/login"
                            className="hidden md:block bg-zinc-700 text-white px-4 py-2 rounded-lg"
                        >
                            Login
                        </Link>
                        <Link
                            to="/signup"
                            className="hidden md:block bg-white text-black px-4 py-2 rounded-lg"
                        >
                            Signup
                        </Link>
                    </div>
                )}

                {/* Logout (Icon for small screens, Button for large) */}
                {auth?.isLoggedIn && (
                    <>
                        {/* Icon for small screens */}
                        <button
                            onClick={handleLogout}
                            className="text-red-600 text-2xl md:hidden"
                        >
                            <AiOutlineLogout />
                        </button>

                        {/* Button for large screens */}
                        <button
                            onClick={handleLogout}
                            className="hidden md:block bg-white text-black px-4 py-2 rounded-lg"
                        >
                            Logout
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default Header;
