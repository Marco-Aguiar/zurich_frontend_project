import React from "react";
import { useNavigate, NavLink } from "react-router-dom";

const Header: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const navClass = ({ isActive }: { isActive: boolean }) =>
        `px-4 py-2 rounded-md transition-all hover:bg-blue-100 ${
            isActive ? "bg-blue-200 font-semibold text-blue-800" : "text-gray-700"
        }`;

    return (
        <header className="bg-white shadow sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
                <NavLink to="/" className="text-xl font-bold text-blue-600">
                    📚 BookReader
                </NavLink>

                <nav className="flex space-x-4">
                    <NavLink to="/" className={navClass}>Home</NavLink>
                    <NavLink to="/search" className={navClass}>Search</NavLink>
                    <NavLink to="/recommendations" className={navClass}>Recommendations</NavLink>
                </nav>

                <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full font-medium shadow-sm transition"
                >
                    Logout
                </button>
            </div>
        </header>
    );
};

export default Header;
