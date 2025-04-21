'use client';
import { useState, useEffect } from "react";
import { Stethoscope } from "lucide-react";
import Link from "next/link";

export default function DocTocHomepage() {
    const [theme, setTheme] = useState("light");
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    // Initialize theme
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") ||
            (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

        setTheme(savedTheme);
        document.documentElement.setAttribute("data-theme", savedTheme);
    }, []);

    // Track mouse position for the gradient effect
    useEffect(() => {
        const handleMouseMove = (e: { clientX: any; clientY: any; }) => {
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
            <div className="z-10 flex flex-col items-center justify-center px-4">
                {/* Logo animation container */}
                <div className="relative mb-4">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 opacity-30 blur rounded-full" />
                    <div className="relative bg-base-100 p-4 rounded-full shadow-lg">
                        <Stethoscope className="h-12 w-12 text-blue-500" style={{ animation: 'pulse 3s infinite' }} />
                    </div>
                </div>

                {/* Brand name with modern styling */}
                <h1 className="text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-2"
                    style={{
                        background: 'linear-gradient(to right, #0ea5e9, #8b5cf6)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        animation: 'fadeIn 1.5s ease-out forwards'
                    }}>
                    DocToc
                </h1>

                {/* Tagline with animation */}
                <div className="h-8 mb-12">
                    <p className="text-base-content/70 font-light text-lg md:text-xl tracking-widest uppercase text-center"
                        style={{ animation: 'fadeIn 1.5s ease-out forwards', animationDelay: '0.5s', opacity: 100 }}
                        >
                        AI Health Assistant
                    </p>
                </div>

                {/* CTA Button */}
                <Link href="/app">
                    <div
                        className="mt-8 px-10 py-4 text-lg font-medium rounded-full shadow-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1"
                        style={{ animation: 'fadeIn 1.5s ease-out forwards', animationDelay: '1s', opacity: 100 }}
                    >
                        Coming soon
                    </div>
                
                </Link>
            </div>

            {/* Footer signature */}
            <div className="absolute bottom-6 text-base-content/50 text-sm z-10">
                Powered by Groq AI
            </div>
        </div>
    );
}