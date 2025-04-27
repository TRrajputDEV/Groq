'use client';
import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { Stethoscope, Upload, Send, FileText, Check, ArrowLeft, Sun, Moon } from 'lucide-react';
import Link from 'next/link';
import { queryGrokAI, extractTextFromDocument } from '@/lib/grok-api';

interface Message {
  id: number;
  text: string;
  type: 'user' | 'assistant' | 'system';
  fileInfo?: { name: string; size: string; type: string };
}

export default function MedicalChatPage() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi! I'm DocToc, your AI health assistant. Upload your medical report or ask me anything about your health.",
      type: 'assistant',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Theme initialization
  useEffect(() => {
    const saved = (localStorage.getItem('theme') as 'light' | 'dark') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(saved);
    document.documentElement.setAttribute('data-theme', saved);
  }, []);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Track mouse for background effect
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('theme', next);
    document.documentElement.setAttribute('data-theme', next);
  };

  const sendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMsg: Message = { id: Date.now(), text: inputMessage, type: 'user' };
    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsProcessing(true);

    const res = await queryGrokAI({ message: userMsg.text });
    setIsProcessing(false);
    setMessages((prev) => [...prev, { id: Date.now(), text: res.text, type: 'assistant' }]);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setShowToast(true);
    const sysMsg: Message = {
      id: Date.now(),
      text: `File uploaded: ${file.name}`,
      type: 'system',
      fileInfo: { name: file.name, size: (file.size / 1024).toFixed(1) + ' KB', type: file.type },
    };
    setMessages((prev) => [...prev, sysMsg]);
    setIsAnalyzing(true);

    // Extract and analyze
    const text = await extractTextFromDocument(file);
    const res = await queryGrokAI({ message: 'Analyze this medical report and explain in simple terms.', reportContent: text });

    setIsAnalyzing(false);
    setMessages((prev) => [...prev, { id: Date.now(), text: res.text, type: 'assistant' }]);

    // Reset input and toast
    setTimeout(() => setShowToast(false), 3000);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Background gradient style
  const gradientStyle = {
    background: `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, rgba(14,165,233,0.15) 0%, transparent 50%)`,
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-b from-base-100 to-base-200">
      {/* Interactive Background */}
      <div className="absolute inset-0 transition-all duration-500" style={gradientStyle} />
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/5 w-64 h-64 rounded-full bg-blue-500/30 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-purple-500/20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-2/3 left-1/3 w-72 h-72 rounded-full bg-orange-500/20 blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header */}
      <header className="fixed top-0 w-full bg-base-100/70 backdrop-blur-md shadow z-20 flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-3">
          <Link href="/" className="p-2 rounded-full hover:bg-base-200"><ArrowLeft size={20} /></Link>
          <Stethoscope className="h-6 w-6 text-blue-500" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">DocToc</h1>
        </div>
        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-base-200">
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </header>

      {/* Chat Area */}
      <main className="flex-1 pt-20 pb-24 px-4 overflow-y-auto space-y-4">
        {messages.map((m) => (
          <div key={m.id} className={`${m.type === 'user' ? 'justify-end' : 'justify-start'} flex w-full`}>
            <div className={`max-w-[75%] p-4 rounded-2xl ${
              m.type === 'user'
                ? 'bg-blue-500 text-white self-end'
                : m.type === 'assistant'
                ? 'bg-base-200 text-base-content'
                : 'bg-base-300 text-base-content italic'
            }`}>
              {m.text}
              {m.fileInfo && (
                <div className="mt-2 p-2 bg-base-100 rounded-lg text-sm flex items-center">
                  <FileText size={16} className="mr-2" />
                  <div>
                    <p>{m.fileInfo.name}</p>
                    <p className="text-xs text-base-content/70">{m.fileInfo.size}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {(isAnalyzing || isProcessing) && <LoadingDots color={isAnalyzing ? 'blue' : 'purple'} text={isAnalyzing ? 'Analyzing your report...' : 'Grok is thinking...'} />}
        <div ref={messagesEndRef} />
      </main>

      {/* Input */}
      <footer className="fixed bottom-0 w-full bg-base-100/70 backdrop-blur-md border-t py-4 px-6 z-20 flex items-center space-x-3">
        <button onClick={() => fileInputRef.current?.click()} className="p-3 bg-base-200 rounded-full hover:bg-base-300">
          <Upload size={20} />
        </button>
        <input type="file" ref={fileInputRef} accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" className="hidden" onChange={handleFileUpload} />
        <form onSubmit={sendMessage} className="flex-1 flex items-center space-x-2">
          <input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your health question..."
            disabled={isAnalyzing || isProcessing}
            className="flex-1 py-3 px-4 rounded-full border bg-base-100/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={isAnalyzing || isProcessing || !inputMessage.trim()}
            className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full hover:opacity-90 disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </form>
        {showToast && <Toast message="File uploaded successfully!" icon={<Check size={16} />} />}
      </footer>
    </div>
  );
}

/** Helper: LoadingDots */
function LoadingDots({ color, text }: { color: string; text: string }) {
  return (
    <div className="flex items-center justify-center py-2">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className={`w-2 h-2 rounded-full animate-pulse bg-${color}-500 mx-1`}
          style={{ animationDelay: `${i * 200}ms` }}
        />
      ))}
      <span className="ml-2 text-sm text-base-content/70">{text}</span>
    </div>
  );
}

/** Helper: Toast */
function Toast({ message, icon }: { message: string; icon: React.ReactNode }) {
  return (
    <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center">
      {icon}
      <span className="ml-2 text-sm">{message}</span>
    </div>
  );
}
