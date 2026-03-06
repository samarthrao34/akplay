import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2, Paperclip, Film } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import ReactMarkdown from 'react-markdown';

let ai: GoogleGenAI | null = null;
try {
  if (process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
} catch {
  // API key missing or invalid – chatbot will show a graceful error
}

const SYSTEM_INSTRUCTION = `You are the official AI assistant for AKPLAY, a professional streaming platform by AK Production House.
Your primary role is to help users discover content, answer questions about the platform, analyze videos, and provide support.

Key Information:
- Platform Name: AKPLAY
- Tagline: Stream Your World
- Current Content: We are currently preparing for our launch. Our first original web series, "UNDELETED" (Season 1), is coming soon.
- Leadership Team: When anyone asks about the team, founders, people behind AK Production House, or who runs the company, you MUST mention ALL three names:
  - Kundan Kumar: CEO of AK Production House
  - Amarjeet Singh: President of AK Production House
  - Samarth Rao: Vice President and Technical Head of AK Production House
  These are the main people behind the making of this production company. Always list all three when asked about the team.
- Creator: If asked specifically who created this platform or the chatbot, say "Samarth Rao, the Vice President and Technical Head, built this platform and its AI assistant."
- Contact: If users want to get in touch, tell them they can reach out to us at contact@akproductionhouse.in or through our community page.

Rules:
- ONLY answer questions related to AKPLAY, its content, streaming, video analysis, and related topics.
- If a user asks about something completely unrelated, politely decline and steer the conversation back to AKPLAY.
- If the user uploads a video, analyze it carefully and provide the requested information.
- Maintain a professional, enthusiastic, and helpful tone.
- CRITICAL: Keep your responses EXTREMELY short, crisp, and concise. Do not write long paragraphs. Aim for 1-3 short sentences maximum unless absolutely necessary for a complex video analysis.
`;

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string; video?: string }[]>([
    { role: 'model', text: 'Hi there! Welcome to AKPLAY. How can I help you today? You can also upload a video for me to analyze!' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Maintain conversation history for the model
  const [history, setHistory] = useState<any[]>([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('video/')) {
        setSelectedVideo(file);
      } else {
        alert('Please select a valid video file.');
      }
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          const base64 = reader.result.split(',')[1];
          resolve(base64);
        } else {
          reject(new Error('Failed to convert file to base64'));
        }
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleSend = async () => {
    if (!input.trim() && !selectedVideo) return;

    const userMessage = input.trim();
    const videoFile = selectedVideo;
    
    setInput('');
    setSelectedVideo(null);
    
    const newMessage: any = { role: 'user', text: userMessage };
    if (videoFile) {
      newMessage.video = URL.createObjectURL(videoFile);
    }
    
    setMessages(prev => [...prev, newMessage]);
    setIsTyping(true);

    try {
      const userParts: any[] = [];
      if (userMessage) {
        userParts.push({ text: userMessage });
      } else if (videoFile) {
        userParts.push({ text: "Please analyze this video." });
      }

      if (videoFile) {
        const base64Video = await fileToBase64(videoFile);
        userParts.push({
          inlineData: {
            mimeType: videoFile.type,
            data: base64Video
          }
        });
      }

      const newHistory = [...history, { role: 'user', parts: userParts }];

      if (!ai) {
        throw new Error('AI service not configured');
      }
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: newHistory,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
        }
      });

      const modelText = response.text || '';
      newHistory.push({ role: 'model', parts: [{ text: modelText }] });
      setHistory(newHistory);
      
      setMessages(prev => [...prev, { role: 'model', text: modelText }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I encountered an error. Please try again later.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-[#E62429] text-white rounded-full flex items-center justify-center shadow-lg shadow-[#E62429]/30 hover:bg-[#ff333a] hover:scale-105 transition-all z-50 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-6 right-6 w-80 sm:w-96 bg-[#141414] border border-[#2a2a2a] rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 z-50 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}
        style={{ height: '500px', maxHeight: 'calc(100vh - 48px)' }}
      >
        {/* Header */}
        <div className="bg-[#1a1a1a] border-b border-[#2a2a2a] p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#E62429] to-orange-500 flex items-center justify-center">
              <span className="text-white font-bold text-xs">AK</span>
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">AKPLAY Assistant</h3>
              <p className="text-green-500 text-[10px] flex items-center">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></span>
                Online
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div
                className={`max-w-[85%] rounded-3xl px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-[#E62429] text-white rounded-br-sm'
                    : 'bg-[#2a2a2a] text-gray-200 rounded-bl-sm'
                }`}
              >
                {msg.video && (
                  <div className="mb-2 rounded-xl overflow-hidden border border-white/20">
                    <video src={msg.video} className="w-full max-h-32 object-contain bg-black" controls />
                  </div>
                )}
                {msg.text && (
                  <div className="text-sm prose prose-invert prose-p:leading-relaxed prose-pre:bg-black/50 prose-a:text-blue-400">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex items-start">
              <div className="bg-[#2a2a2a] text-gray-200 rounded-3xl rounded-bl-sm px-5 py-4 flex items-center space-x-1.5 h-10">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-3 bg-[#1a1a1a] border-t border-[#2a2a2a]">
          {selectedVideo && (
            <div className="mb-2 flex items-center justify-between bg-[#2a2a2a] px-3 py-1.5 rounded-lg">
              <div className="flex items-center space-x-2 overflow-hidden">
                <Film className="w-4 h-4 text-[#E62429] shrink-0" />
                <span className="text-xs text-gray-300 truncate">{selectedVideo.name}</span>
              </div>
              <button 
                onClick={() => setSelectedVideo(null)}
                className="text-gray-400 hover:text-white ml-2 shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
          <div className="flex items-end space-x-2">
            <div className="flex-1 bg-[#0a0a0a] border border-[#333] rounded-xl flex items-center focus-within:border-[#E62429] transition-colors overflow-hidden">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-gray-400 hover:text-white transition-colors shrink-0"
                title="Attach Video"
              >
                <Paperclip className="w-4 h-4" />
              </button>
              <input
                type="file"
                accept="video/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about AKPLAY..."
                className="flex-1 bg-transparent text-sm text-white px-2 py-2.5 focus:outline-none"
              />
            </div>
            <button
              onClick={handleSend}
              disabled={(!input.trim() && !selectedVideo) || isTyping}
              className="bg-[#E62429] text-white p-2.5 rounded-xl hover:bg-[#ff333a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
