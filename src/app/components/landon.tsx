'use client';
import { useState, useEffect } from "react";
import { Stethoscope, Calendar, Bell, Mail } from "lucide-react";

export default function ComingSoonPage() {
    const [theme, setTheme] = useState("light");
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [email, setEmail] = useState("");
    const [isSubscribed, setIsSubscribed] = useState(false);
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") ||
            (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

        setTheme(savedTheme);
        document.documentElement.setAttribute("data-theme", savedTheme);
    }, []);

    // Track mouse position for the gradient effect
    useEffect(() => {
        const handleMouseMove = (e: { clientX: number; clientY: number; }) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    // Toggle theme
    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);
    };

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            // Here you would typically send this to your backend
            console.log("Subscribing email:", email);
            setIsSubscribed(true);
            setTimeout(() => setIsSubscribed(false), 3000);
            setEmail("");
        }
    };

    const gradientStyle = {
        background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(14, 165, 233, 0.15) 0%, rgba(14, 165, 233, 0) 50%)`
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-b from-base-100 to-base-200">
            {/* Interactive background */}
            <div
                className="absolute inset-0 transition-all duration-500 ease-out z-0"
                style={gradientStyle}
            />

            {/* Animated background shapes */}
            <div className="absolute top-0 left-0 w-full h-full z-0 opacity-20">
                <div className="absolute top-1/4 left-1/5 w-64 h-64 rounded-full bg-blue-500/30 blur-3xl animate-pulse" />
                <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-purple-500/20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-2/3 left-1/3 w-72 h-72 rounded-full bg-orange-500/20 blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            {/* Theme toggle button */}
            <button
                onClick={toggleTheme}
                className="absolute top-6 right-6 z-10 p-3 rounded-full shadow-lg backdrop-blur-md bg-base-100/30 text-base-content hover:bg-base-100/50 transition-all duration-300"
            >
                {theme === "light" ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
                    </svg>
                ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
                    </svg>
                )}
            </button>

            {/* Main content with logo */}
            <div className="z-10 flex flex-col items-center justify-center px-4 max-w-3xl mx-auto">
                {/* Logo animation container */}
                <div className="relative mb-4 animate-float">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 opacity-30 blur rounded-full" />
                    <div className="relative bg-base-100 p-4 rounded-full shadow-lg">
                        <Stethoscope className="h-12 w-12 text-blue-500" />
                    </div>
                </div>

                {/* Brand name with modern styling */}
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-2"
                    style={{
                        background: 'linear-gradient(to right, #0ea5e9, #8b5cf6)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        animation: 'fadeIn 1.5s ease-out forwards'
                    }}>
                    DocToc
                </h1>

                {/* Tagline with animation */}
                <div className="h-8 mb-6">
                    <p className="text-base-content/70 font-light text-lg md:text-xl tracking-widest uppercase text-center"
                        style={{ animation: 'fadeIn 1.5s ease-out forwards', animationDelay: '0.5s' }}>
                        AI Health Assistant
                    </p>
                </div>

                {/* Coming Soon message */}
                <div className="mb-12 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-base-content animate-fadeInUp">
                        Something Big Is Coming
                    </h2>
                    <p className="text-base-content/80 text-lg max-w-md mx-auto animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
                        We're putting the finishing touches on DocToc, your personal AI health companion. Stay tuned for the revolution in healthcare assistance.
                    </p>
                </div>

                {/* Email Notification Form */}
                <div className="w-full max-w-md mb-12 animate-fadeInUp" style={{ animationDelay: '0.9s' }}>
                    <form onSubmit={handleSubscribe} className="relative">
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" size={18} />
                            <input
                                type="email"
                                placeholder="Enter your email for updates"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-32 py-3 rounded-full border border-base-300 bg-base-100/50 backdrop-blur-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base-content"
                                required
                            />
                            <button
                                type="submit"
                                className="absolute right-1 top-1 bottom-1 px-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full font-medium transition-all hover:shadow-lg"
                            >
                                Notify Me
                            </button>
                        </div>
                        {isSubscribed && (
                            <div className="absolute mt-2 text-sm text-green-500 flex items-center">
                                <Bell size={16} className="mr-1" />
                                We'll notify you when we launch!
                            </div>
                        )}
                    </form>
                </div>

                {/* Features preview */}
                {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl animate-fadeInUp" style={{ animationDelay: '1.2s' }}>
                    <div className="backdrop-blur-md bg-base-100/30 rounded-xl p-6 shadow-lg transform transition-all hover:-translate-y-1 hover:shadow-xl">
                        <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
                            <Stethoscope className="h-6 w-6 text-blue-500" />
                        </div>
                        <h3 className="text-lg font-bold mb-2 text-base-content">AI Diagnostics</h3>
                        <p className="text-base-content/70 text-sm">Get preliminary insights about your symptoms from our advanced AI system.</p>
                    </div>
                    <div className="backdrop-blur-md bg-base-100/30 rounded-xl p-6 shadow-lg transform transition-all hover:-translate-y-1 hover:shadow-xl">
                        <div className="h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
                            <Calendar className="h-6 w-6 text-purple-500" />
                        </div>
                        <h3 className="text-lg font-bold mb-2 text-base-content">Health Tracking</h3>
                        <p className="text-base-content/70 text-sm">Monitor and track your health metrics over time with intuitive dashboards.</p>
                    </div>
                    <div className="backdrop-blur-md bg-base-100/30 rounded-xl p-6 shadow-lg transform transition-all hover:-translate-y-1 hover:shadow-xl">
                        <div className="h-12 w-12 rounded-full bg-orange-500/20 flex items-center justify-center mb-4">
                            <Bell className="h-6 w-6 text-orange-500" />
                        </div>
                        <h3 className="text-lg font-bold mb-2 text-base-content">Smart Reminders</h3>
                        <p className="text-base-content/70 text-sm">Never miss a medication or appointment with customized alerts.</p>
                    </div>
                </div> */}
            </div>

            {/* Footer signature */}
            <div className="absolute bottom-6 text-base-content/50 text-sm z-10 flex flex-col items-center">
                <p>Powered by Groq AI</p>
                <p className="mt-1">© {new Date().getFullYear()} DocToc. All rights reserved.</p>
            </div>

            {/* CSS Animations */}
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes fadeInUp {
                    from { 
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to { 
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                    100% { transform: translateY(0px); }
                }
                
                .animate-fadeInUp {
                    opacity: 0;
                    animation: fadeInUp 1s ease-out forwards;
                }
                
                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }
                
                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                    100% { transform: scale(1); }
                }
            `}</style>
        </div>
    );
}