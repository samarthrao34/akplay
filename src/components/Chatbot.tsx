import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Loader2, Paperclip, Film } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useSiteConfig } from '../context/SiteContext';

// Anime girl face SVG for Soni
const SoniAvatar = ({ size = 32 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="30" fill="#1a1a2e"/>
    <ellipse cx="32" cy="36" rx="18" ry="20" fill="#ffdab9"/>
    <ellipse cx="32" cy="58" rx="14" ry="6" fill="#E62429"/>
    <path d="M14 28C14 28 16 8 32 8C48 8 50 28 50 28L52 18C52 18 48 2 32 2C16 2 12 18 12 18L14 28Z" fill="#1a1a2e"/>
    <path d="M10 30C10 30 12 10 32 6C52 10 54 30 54 30L56 20C56 20 52 0 32 0C12 0 8 20 8 20L10 30Z" fill="#2d1b4e"/>
    <path d="M12 28C12 28 10 36 10 40" stroke="#2d1b4e" strokeWidth="3" strokeLinecap="round"/>
    <path d="M52 28C52 28 54 36 54 40" stroke="#2d1b4e" strokeWidth="3" strokeLinecap="round"/>
    <ellipse cx="24" cy="32" rx="5" ry="5.5" fill="white"/>
    <ellipse cx="40" cy="32" rx="5" ry="5.5" fill="white"/>
    <ellipse cx="25" cy="32" rx="3" ry="3.5" fill="#E62429"/>
    <ellipse cx="41" cy="32" rx="3" ry="3.5" fill="#E62429"/>
    <circle cx="25.5" cy="30.5" r="1.2" fill="white"/>
    <circle cx="41.5" cy="30.5" r="1.2" fill="white"/>
    <path d="M28 42C28 42 30 45 32 45C34 45 36 42 36 42" stroke="#c97878" strokeWidth="1.5" strokeLinecap="round"/>
    <ellipse cx="20" cy="38" rx="3" ry="1.5" fill="#ffb6c1" opacity="0.5"/>
    <ellipse cx="44" cy="38" rx="3" ry="1.5" fill="#ffb6c1" opacity="0.5"/>
    <path d="M18 26C18 26 20 24 26 25" stroke="#2d1b4e" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M46 26C46 26 44 24 38 25" stroke="#2d1b4e" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

function buildSystemInstruction(videoNames: string[], communityPostSummaries: string[]): string {
  const videoList = videoNames.length > 0
    ? `\n\nVideos currently available on the platform:\n${videoNames.map((v, i) => `${i + 1}. ${v}`).join("\n")}`
    : "\n\nNo videos are currently published yet, but our first web series \"UNDELETED\" Season 1 is coming soon.";

  const communityInfo = communityPostSummaries.length > 0
    ? `\n\nRecent community posts:\n${communityPostSummaries.map((p, i) => `${i + 1}. ${p}`).join("\n")}`
    : "\n\nThe community section is being set up. No posts yet.";

  return `Your name is Soni. You are the official AI assistant for AKPLAY, a professional streaming platform by AK Production House.
Your primary role is to help users discover content, answer questions about the platform, analyze videos, and provide support.
You should be friendly, cute, and enthusiastic — like a knowledgeable anime character who loves movies and shows!

Key Information:
- Your Name: Soni (AKPLAY's AI Assistant)
- Platform Name: AKPLAY
- Tagline: Stream Your World
- Current Content: We are currently preparing for our launch. Our first original web series, "UNDELETED" (Season 1), is coming soon.
- Subscription Plans: Basic (₹9/month, 720p, 1 device), Standard (₹49/month, 1080p, 3 devices, most popular), Premium (₹99/month, 4K, 5 devices)
- Subscriptions last 30 days and users need to renew after expiry.
- Leadership Team: When anyone asks about the team, founders, people behind AK Production House, or who runs the company, you MUST mention ALL three names:
  - Kundan Kumar: CEO of AK Production House
  - Amarjeet Singh: President of AK Production House
  - Samarth Rao: Vice President and Technical Head of AK Production House
  These are the main people behind the making of this production company. Always list all three when asked about the team.
- Creator: If asked specifically who created this platform or the chatbot, say "Samarth Rao, the Vice President and Technical Head, built this platform and me (Soni)!"
- Contact: If users want to get in touch, tell them they can reach out at contact@akproductionhouse.in or through the community page.
- Website sections: Home (featured content), Library (content catalog), Community (posts & updates), Subscription (plans), Account (profile management)
${videoList}
${communityInfo}

Rules:
- Introduce yourself as "Soni" when greeted.
- ONLY answer questions related to AKPLAY, its content, streaming, video analysis, and related topics.
- You know about every video and community post on the platform — share details when asked!
- If a user asks about something completely unrelated, politely decline and steer the conversation back to AKPLAY.
- If the user uploads a video, analyze it carefully and provide the requested information.
- Maintain a friendly, enthusiastic, and slightly playful anime-assistant tone.
- CRITICAL: Keep your responses EXTREMELY short, crisp, and concise. Do not write long paragraphs. Aim for 1-3 short sentences maximum unless absolutely necessary for a complex video analysis.
`;
}

export function Chatbot() {
  const { videos, communityPosts } = useSiteConfig();
  const videoNames = videos.filter(v => v.status === "published").map(v => `${v.title} — ${v.description}`);
  const communityPostSummaries = communityPosts.map(p => `${p.author}: "${p.text}" (${p.date})`);

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string; video?: string }[]>([
    { role: 'model', text: 'Hi there! I\'m Soni, your AKPLAY assistant! 🎬 How can I help you today? You can ask me about our content, plans, or even upload a video for analysis!' }
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

    const sendRequest = async (attempt: number): Promise<string> => {
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

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: buildSystemInstruction(videoNames, communityPostSummaries),
          contents: newHistory,
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || 'AI request failed');
      }

      const data = await response.json();
      const modelText = data.text || '';
      newHistory.push({ role: 'model', parts: [{ text: modelText }] });
      setHistory(newHistory);
      return modelText;
    };

    try {
      const reply = await sendRequest(1);
      setMessages(prev => [...prev, { role: 'model', text: reply }]);
    } catch (error) {
      // Retry once on failure
      try {
        await new Promise(r => setTimeout(r, 1000));
        const reply = await sendRequest(2);
        setMessages(prev => [...prev, { role: 'model', text: reply }]);
      } catch {
        console.error('Chat error after retry:', error);
        setMessages(prev => [...prev, { role: 'model', text: "I'm having a little trouble connecting right now. Could you try sending your message again in a moment?" }]);
      }
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open Chatbot"
        className={`fixed bottom-20 md:bottom-6 right-4 md:right-6 w-14 h-14 bg-[#E62429] text-white rounded-full flex items-center justify-center shadow-lg shadow-[#E62429]/30 hover:bg-[#ff333a] hover:scale-105 transition-all z-50 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
      >
        <SoniAvatar size={36} />
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-20 right-2 md:bottom-6 md:right-6 w-[calc(100vw-16px)] sm:w-96 bg-[#141414] border border-[#2a2a2a] rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 z-50 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}
        style={{ height: '450px', maxHeight: 'calc(100vh - 100px)' }}
      >
        {/* Header */}
        <div className="bg-[#1a1a1a] border-b border-[#2a2a2a] p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#E62429] to-orange-500 flex items-center justify-center overflow-hidden">
              <SoniAvatar size={32} />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Soni — AKPLAY Assistant</h3>
              <p className="text-green-500 text-[10px] flex items-center">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></span>
                Online
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close Chatbot"
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
                aria-label="Remove attached video"
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
                aria-label="Attach Video"
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
                placeholder="Ask Soni anything about AKPLAY..."
                className="flex-1 bg-transparent text-sm text-white px-2 py-2.5 focus:outline-none"
              />
            </div>
            <button
              onClick={handleSend}
              aria-label="Send message"
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
