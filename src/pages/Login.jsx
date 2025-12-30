import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAPI, setAuthToken } from "../api-helpers/login";

export default function Login() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);
    const [gphcNumber, setGphcNumber] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (!gphcNumber || !password) {
            setError("Please enter both GPHC number and password");
            setLoading(false);
            return;
        }

        const result = await loginAPI(gphcNumber, password);
        setLoading(false);

        if (result.success) {
            setAuthToken(result.data.token);
            localStorage.setItem("user", JSON.stringify(result.data.user));
            navigate("/dashboard");
        } else {
            setError(result.error || "Login failed. Please try again.");
        }
    };

    return (
        <div
            className="min-h-screen flex items-center bg-cover justify-center overflow-hidden relative px-4 sm:px-6 lg:px-8"
            style={{
                backgroundImage: "url('/img/login-bg.webp')",
            }}
        >
            {/* Animated background elements */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-10 left-10 w-32 h-32 sm:w-40 sm:h-40 bg-purple-500 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-32 h-32 sm:w-40 sm:h-40 bg-cyan-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "0.5s" }}></div>
                <div className="absolute top-1/2 right-10 w-24 h-24 sm:w-32 sm:h-32 bg-pink-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
            </div>

            <div className="w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-5xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative z-10">

                {/* LEFT SECTION */}
                <div className="w-full md:w-1/2 relative p-6 sm:p-8 md:p-10 flex flex-col justify-end text-white overflow-hidden group min-h-64 md:min-h-auto">

                    {/* VIDEO BACKGROUND */}
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    >
                        <source src="/video/aviae.mp4" type="video/mp4" />
                    </video>

                    {/* DARK OVERLAY with animation */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/50 group-hover:from-black/40 group-hover:to-black/60 transition-colors duration-700"></div>

                    {/* Animated orbs */}
                    <div className="absolute inset-0 overflow-hidden hidden sm:block">
                        <div className="absolute top-20 left-20 w-16 h-16 sm:w-20 sm:h-20 border-2 border-cyan-400 rounded-full animate-spin" style={{ animationDuration: "8s" }}></div>
                        <div className="absolute bottom-40 right-10 w-12 h-12 sm:w-16 sm:h-16 border-2 border-purple-400 rounded-full animate-spin" style={{ animationDuration: "6s", animationDirection: "reverse" }}></div>
                    </div>

                    <div className="relative z-10 space-y-2 sm:space-y-4 transform group-hover:translate-y-2 transition-transform duration-700">
                        <img src="/img/logo.svg" alt="Logo" className="h-8 sm:h-12 animate-bounce" />

                        <h1 className="text-2xl sm:text-3xl md:text-3xl font-extrabold leading-tight animate-pulse">
                            YOUR HEALTH <br /> YOUR CARE <br /> STARTS HERE ⚕️
                        </h1>

                        <p
                            className="text-xs sm:text-sm text-gray-200 max-w-md opacity-0 animate-fadeIn"
                            style={{ animationDelay: "0.5s" }}
                        >
                            Log in to connect with trusted doctors, track your health records, get medicine guidance, and continue your care journey — all in one place.
                        </p>

                        <p className="text-xs sm:text-sm font-medium opacity-0 animate-fadeIn" style={{ animationDelay: "1s" }}>
                            Your journey starts here.
                        </p>
                    </div>
                </div>

                {/* RIGHT SECTION */}
                <div className="w-full md:w-1/2 px-6 sm:px-8 md:px-12 py-12 sm:py-16 md:py-20 space-y-4 sm:space-y-6 flex flex-col justify-center relative" onMouseMove={handleMouseMove}>

                    {/* Floating glow effect - hidden on mobile */}
                    {isHovered && (
                        <div
                            className="absolute w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full blur-3xl opacity-10 pointer-events-none hidden sm:block"
                            style={{
                                left: `${mousePos.x - 128}px`,
                                top: `${mousePos.y - 128}px`,
                                transition: "all 0.1s ease-out",
                            }}
                        ></div>
                    )}

                    <div>
                        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 animate-slideIn">Welcome Back!</h2>
                        <p className="text-gray-500 text-xs sm:text-sm mt-1 animate-slideIn" style={{ animationDelay: "0.1s" }}>
                            Welcome back! Please enter your details.
                        </p>
                    </div>

                    <div className="space-y-3 sm:space-y-4" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
                        <div className="transform hover:scale-105 transition-transform duration-300">
                            <label className="text-xs sm:text-sm font-medium text-gray-700">GPHC Number</label>
                            <input
                                className="w-full px-3 sm:px-4 py-2 sm:py-3 mt-1 sm:mt-2 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 outline-none transition-all duration-300 hover:border-blue-400 text-sm sm:text-base"
                                placeholder="Enter your GPHC number"
                                type="text"
                                value={gphcNumber}
                                onChange={(e) => setGphcNumber(e.target.value)}
                            />
                        </div>

                        <div className="transform hover:scale-105 transition-transform duration-300">
                            <label className="text-xs sm:text-sm font-medium text-gray-700">Password</label>

                            <div className="relative group">
                                <input
                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 mt-1 sm:mt-2 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 outline-none transition-all duration-300 hover:border-blue-400 text-sm sm:text-base"
                                    placeholder="Password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <span
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 sm:right-4 top-3 sm:top-5 cursor-pointer text-lg sm:text-2xl select-none transition-all duration-300 transform hover:scale-125 active:scale-95"
                                    style={{
                                        animation: showPassword ? "eyeWiggle 0.5s ease-out" : "none",
                                    }}
                                >
                                    {showPassword ? (
                                        <span className="inline-block">👀</span>
                                    ) : (
                                        <span className="inline-block">👁️</span>
                                    )}
                                </span>
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm">
                                {error}
                            </div>
                        )}

                        <div className="flex justify-between items-center text-xs sm:text-sm">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" className="w-4 h-4 cursor-pointer accent-green-700" />
                                <span className="group-hover:text-green-700 transition-colors duration-300">Remember me</span>
                            </label>
                        </div>

                        {/* Sign In Button */}
                        <button 
                            onClick={handleLogin}
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-green-700 to-green-800 hover:from-green-800 hover:to-green-900 disabled:from-gray-500 disabled:to-gray-600 cursor-pointer text-white py-2.5 sm:py-3 rounded-lg text-base sm:text-lg font-semibold transform hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-2xl relative overflow-hidden group mt-2 sm:mt-4"
                        >
                            <span className="relative z-10">{loading ? "Signing in..." : "Sign in"}</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 group-hover:translate-x-full transition-transform duration-700"></div>
                        </button>

                        <a href="/admin" className="block text-center text-green-700 hover:text-green-900 text-xs sm:text-sm mt-2 sm:mt-3">
                            Admin Login
                        </a>
                    </div>

                </div>
            </div>

            <style>{`
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateX(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                @keyframes eyeWiggle {
                    0%, 100% { transform: scale(1) rotate(0deg); }
                    25% { transform: scale(1.2) rotate(-5deg); }
                    50% { transform: scale(1) rotate(5deg); }
                    75% { transform: scale(1.2) rotate(-5deg); }
                }

                .animate-slideIn {
                    animation: slideIn 0.6s ease-out;
                }

                .animate-fadeIn {
                    animation: fadeIn 1s ease-out forwards;
                }

                /* Mobile optimization */
                @media (max-width: 768px) {
                    .hover\:scale-105:hover {
                        transform: scale(1) !important;
                    }
                }
            `}</style>
        </div>
    );
}