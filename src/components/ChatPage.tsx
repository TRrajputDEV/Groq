'use client';
import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { Stethoscope, Upload, Send, FileText, Check, ArrowLeft, Sun, Moon, FileUp, AlertCircle, X } from 'lucide-react';
import Link from 'next/link';
import { queryGroqAI, extractTextFromDocument } from '@/lib/groq-api';

interface Message {
  id: number;
  text: string;
  type: 'user' | 'assistant' | 'system';
  fileInfo?: { name: string; size: string; type: string };
}

interface ErrorToast {
  show: boolean;
  message: string;
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
  const [errorToast, setErrorToast] = useState<ErrorToast>({ show: false, message: '' });
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

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

  const showError = (message: string) => {
    setErrorToast({ show: true, message });
    setTimeout(() => setErrorToast({ show: false, message: '' }), 5000);
  };

  const sendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMsg: Message = { id: Date.now(), text: inputMessage, type: 'user' };
    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsProcessing(true);

    try {
      const res = await queryGroqAI({ message: userMsg.text });
      setMessages((prev) => [...prev, { id: Date.now(), text: res.text, type: 'assistant' }]);
    } catch (error) {
      console.error("Error querying Groq:", error);
      showError("Failed to get a response. Please try again.");
      setMessages((prev) => [...prev, { 
        id: Date.now(), 
        text: "Sorry, I encountered an error processing your request. Please try again later.", 
        type: 'assistant' 
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await processFile(e.target.files[0]);
    }
  };

  const processFile = async (file: File) => {
    // Check file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      showError("File is too large. Please upload a file smaller than 10MB.");
      return;
    }

    // Check file type
    const validTypes = ['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      showError("Invalid file type. Please upload a PDF, text, Word document, or image file.");
      return;
    }

    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    
    const sysMsg: Message = {
      id: Date.now(),
      text: `File uploaded: ${file.name}`,
      type: 'system',
      fileInfo: { 
        name: file.name, 
        size: (file.size / 1024).toFixed(1) + ' KB', 
        type: file.type 
      },
    };
    setMessages((prev) => [...prev, sysMsg]);
    setIsAnalyzing(true);

    try {
      // Extract and analyze
      const text = await extractTextFromDocument(file);
      
      // Provide user feedback about extraction
      if (text.includes("issue reading") || text.includes("trouble reading")) {
        setMessages((prev) => [...prev, { 
          id: Date.now(), 
          text: text, 
          type: 'assistant' 
        }]);
        setIsAnalyzing(false);
        return;
      }
      
      const res = await queryGroqAI({ 
        message: 'Analyze this medical report and explain in simple terms what it means, key findings, and any important recommendations.', 
        reportContent: text 
      });
      
      setMessages((prev) => [...prev, { id: Date.now(), text: res.text, type: 'assistant' }]);
    } catch (error) {
      console.error("Error analyzing file:", error);
      showError("Error analyzing file. Please try a different format.");
      setMessages((prev) => [...prev, { 
        id: Date.now(), 
        text: "I had trouble analyzing this file. The file might be corrupt, password-protected, or in a format I can't read. Could you try uploading a different file or describing your medical concerns directly?", 
        type: 'assistant' 
      }]);
    } finally {
      setIsAnalyzing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Background gradient style
  const gradientStyle = {
    background: `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, rgba(14,165,233,0.15) 0%, transparent 50%)`,
  };

  return (
    <div 
      className="min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-b from-base-100 to-base-200"
      onDragEnter={handleDrag}
    >
      {/* Interactive Background */}
      <div className="absolute inset-0 transition-all duration-500" style={gradientStyle} />
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/5 w-64 h-64 rounded-full bg-blue-500/30 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-purple-500/20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-2/3 left-1/3 w-72 h-72 rounded-full bg-orange-500/20 blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header */}
      <header className="fixed top-0 w-full bg-base-100/80 backdrop-blur-md shadow-md z-20 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/" className="p-2 rounded-full hover:bg-base-200 transition-colors"><ArrowLeft size={20} /></Link>
            <Stethoscope className="h-6 w-6 text-blue-500" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">DocToc</h1>
          </div>
          <div className="flex items-center space-x-2">
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-base-200 transition-colors">
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Drag & Drop Overlay */}
      {dragActive && (
        <div 
          className="absolute inset-0 bg-blue-500/20 backdrop-blur-sm z-30 flex items-center justify-center"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="bg-base-100 p-8 rounded-2xl shadow-xl flex flex-col items-center">
            <FileUp size={48} className="text-blue-500 mb-4" />
            <h3 className="text-xl font-bold">Drop your medical file</h3>
            <p className="text-base-content/70 mt-2">PDF, Word or text files accepted</p>
          </div>
        </div>
      )}

      {/* Chat Area */}
      <main 
        ref={chatContainerRef}
        className="flex-1 pt-24 pb-28 px-4 md:px-6 overflow-y-auto max-w-4xl mx-auto w-full"
        onDragEnter={handleDrag}
      >
        <div className="space-y-6">
          {messages.map((m) => (
            <div key={m.id} className={`${m.type === 'user' ? 'justify-end' : 'justify-start'} flex w-full`}>
              <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${
                m.type === 'user'
                  ? 'bg-blue-500 text-white self-end shadow-blue-500/20'
                  : m.type === 'assistant'
                  ? 'bg-base-200 text-base-content'
                  : 'bg-base-300/50 text-base-content/90 italic text-sm'
              }`}>
                {m.text}
                {m.fileInfo && (
                  <div className="mt-3 p-3 bg-base-100 rounded-lg text-sm flex items-center">
                    <FileText size={16} className="mr-2 text-blue-500" />
                    <div>
                      <p className="font-medium">{m.fileInfo.name}</p>
                      <p className="text-xs text-base-content/70">{m.fileInfo.size} • {m.fileInfo.type.split('/')[1].toUpperCase()}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          {(isAnalyzing || isProcessing) && <LoadingIndicator isAnalyzing={isAnalyzing} />}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <footer className="fixed bottom-0 w-full bg-base-100/90 backdrop-blur-md border-t py-4 px-6 z-20">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={sendMessage} className="flex items-center space-x-3">
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()} 
              className="p-3 bg-base-200 rounded-full hover:bg-base-300 transition-colors flex-shrink-0"
              title="Upload medical report"
            >
              <Upload size={20} />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg" 
              className="hidden" 
              onChange={handleFileSelect} 
            />
            <div className="relative flex-1">
              <input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your health question..."
                disabled={isAnalyzing || isProcessing}
                className="w-full py-3 px-4 rounded-full border bg-base-100/50 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
              />
              <button
                type="submit"
                disabled={isAnalyzing || isProcessing || !inputMessage.trim()}
                className="absolute right-1 top-1 p-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                <Send size={18} />
              </button>
            </div>
          </form>
        </div>
        
        {/* Success Toast */}
        {showToast && <SuccessToast message="File uploaded successfully!" />}
        
        {/* Error Toast */}
        {errorToast.show && <ErrorToast message={errorToast.message} onClose={() => setErrorToast({show: false, message: ''})} />}
      </footer>
    </div>
  );
}

function LoadingIndicator({ isAnalyzing }: { isAnalyzing: boolean }) {
  return (
    <div className="flex items-center justify-center p-4 bg-base-200/50 rounded-full max-w-xs mx-auto">
      <div className="flex space-x-1">
        <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" />
        <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0.2s' }} />
        <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0.4s' }} />
      </div>
      <span className="ml-3 text-sm text-base-content/80 font-medium">
        {isAnalyzing ? 'Analyzing your medical report...' : 'Processing your request...'}
      </span>
    </div>
  );
}

function SuccessToast({ message }: { message: string }) {
  return (
    <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center animate-fade-in-up">
      <Check size={16} />
      <span className="ml-2 text-sm">{message}</span>
    </div>
  );
}

function ErrorToast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center animate-fade-in-up">
      <AlertCircle size={16} />
      <span className="ml-2 text-sm">{message}</span>
      <button onClick={onClose} className="ml-3 p-1 hover:bg-red-600 rounded-full">
        <X size={14} />
      </button>
    </div>
  );
}