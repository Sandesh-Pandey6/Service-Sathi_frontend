import React, { useState, useEffect, useRef } from 'react';
import { chatApi } from '@/lib/api';
import { getSocket } from '@/lib/socket';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';
import { Search, Send, Paperclip, FileText, Bot, Check, CheckCheck, Loader2 } from 'lucide-react';

const formatTime = (dateStr: string) => {
  return new Date(dateStr).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
};


interface UserInfo {
  id: string;
  full_name: string;
  profile_image: string | null;
}

interface Conversation {
  id: string;
  booking_number: string;
  service: { id: string; title: string };
  other_party: UserInfo;
  last_message: { id: string; message_text: string; sender_name: string; created_at: string; is_read: boolean } | null;
  unread_count: number;
  total_messages: number;
  updated_at: string;
}

interface Message {
  id: string;
  message_text: string;
  attachments: string[];
  sender_id: string;
  sender_role: string;
  receiver_id: string;
  is_read: boolean;
  created_at: string;
  sender?: UserInfo;
}

interface ChatApplicationProps {
  role: 'CUSTOMER' | 'PROVIDER';
  queryBookingId?: string | null;
}

export default function ChatApplication({ role, queryBookingId }: ChatApplicationProps) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(queryBookingId || null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const socket = getSocket();

  // Initial load
  useEffect(() => {
    fetchConversations();
  }, []);

  // Fetch messages when active conversation changes
  useEffect(() => {
    if (activeConvId) {
      fetchMessages(activeConvId);
      socket.emit('join_conversation', { booking_id: activeConvId });
      
      // Clear unread count locally
      setConversations(prev => prev.map(c => 
        c.id === activeConvId ? { ...c, unread_count: 0 } : c
      ));
    }
  }, [activeConvId]);

  // Handle Socket Events
  useEffect(() => {
    const handleNewMessage = (msg: Message) => {
      if (msg.id === activeConvId || (msg as any).booking_id === activeConvId) {
        setMessages(prev => [...prev, msg].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()));
        
        if (msg.sender_id !== user?.id) {
          socket.emit('message_read', { message_id: msg.id });
        }
      }
      // Regardless, update conversations list
      fetchConversations();
    };

    const handleMessageRead = (data: { message_id: string; read_by: string; read_at: string }) => {
      setMessages(prev => prev.map(m => m.id === data.message_id ? { ...m, is_read: true } : m));
    };

    socket.on('new_message', handleNewMessage);
    socket.on('message_read', handleMessageRead);

    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('message_read', handleMessageRead);
    };
  }, [activeConvId, user?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const res = await chatApi.getConversations();
      setConversations(res.data.conversations || []);
      
      // Auto-select first if none selected
      if (!activeConvId && res.data.conversations?.length > 0 && !queryBookingId) {
        setActiveConvId(res.data.conversations[0].id);
      }
    } catch (err) {
      console.error('Failed to load conversations', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (bookingId: string) => {
    try {
      const res = await chatApi.getMessages(bookingId, { page: 1, limit: 100 });
      setMessages(res.data.messages);
      
      // Mark unread as read immediately
      const unread = res.data.messages.filter((m: Message) => !m.is_read && m.sender_id !== user?.id);
      unread.forEach((m: Message) => {
        socket.emit('message_read', { message_id: m.id });
      });
    } catch (err) {
      toast.error('Failed to load messages');
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || !activeConvId) return;
    
    const activeConv = conversations.find(c => c.id === activeConvId);
    if (!activeConv) return;
    
    const payload = {
      booking_id: activeConv.id,
      receiver_id: activeConv.other_party.id,
      message_text: inputText.trim(),
      sender_role: role,
      attachments: []
    };

    setInputText('');
    socket.emit('send_message', payload);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeConvId) return;
    
    // Prevent giant files
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be under 10MB');
      return;
    }

    const activeConv = conversations.find(c => c.id === activeConvId);
    if (!activeConv) return;

    try {
      setIsUploading(true);
      const fd = new FormData();
      fd.append('file', file);
      fd.append('booking_id', activeConvId);

      const res = await chatApi.uploadAttachment(fd);
      const url = res.data.url;

      socket.emit('send_message', {
        booking_id: activeConv.id,
        receiver_id: activeConv.other_party.id,
        message_text: `Attached a file: ${file.name}`,
        sender_role: role,
        attachments: [url]
      });

      toast.success('File sent');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to upload file');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const filteredConversations = conversations.filter(c => 
    c.other_party.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.booking_number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderFilePreview = (url: string) => {
    const isImage = url.match(/\.(jpeg|jpg|gif|png|webp)$/i) || url.includes('/image/upload/');
    if (isImage) {
      return (
        <a href={url} target="_blank" rel="noopener noreferrer">
          <img src={url} alt="Attachment" className="max-w-[200px] max-h-[200px] rounded-lg mt-2 object-cover border border-white/20 hover:opacity-90" />
        </a>
      );
    }
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-2 px-3 py-2 bg-black/10 rounded-lg hover:bg-black/20 transition-colors shrink-0">
        <FileText size={16} />
        <span className="text-sm font-medium underline underline-offset-2">View Attachment</span>
      </a>
    );
  };

  if (loading) {
    return <div className="flex h-[calc(100vh-100px)] w-full items-center justify-center"><Loader2 className="animate-spin text-slate-400" size={32} /></div>;
  }

  const activeConversation = conversations.find(c => c.id === activeConvId);

  return (
    <div className="flex h-[calc(100vh-120px)] bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Sidebar - Conversations List */}
      <div className="w-[320px] shrink-0 border-r border-slate-200 flex flex-col bg-slate-50/50">
        <div className="p-4 border-b border-slate-200 bg-white">
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Messages</h2>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search chats..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-[#00d4d4] outline-none" 
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto w-full">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">No conversations found.</div>
          ) : (
            filteredConversations.map(conv => (
              <button
                key={conv.id}
                onClick={() => setActiveConvId(conv.id)}
                className={`w-full text-left p-4 border-b border-slate-100 flex gap-3 transition-colors ${activeConvId === conv.id ? 'bg-[#00d4d4]/10 border-l-4 border-l-[#00d4d4]' : 'hover:bg-slate-50 border-l-4 border-l-transparent'}`}
              >
                <div className="w-12 h-12 shrink-0 rounded-full bg-slate-200 overflow-hidden border border-slate-200 flex items-center justify-center text-slate-400 font-bold">
                  {conv.other_party.profile_image ? (
                    <img src={conv.other_party.profile_image} className="w-full h-full object-cover" alt="" />
                  ) : (
                     conv.other_party.full_name.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-slate-800 truncate pr-2 text-sm">{conv.other_party.full_name}</h3>
                    {conv.last_message && (
                      <span className="text-[11px] text-slate-400 whitespace-nowrap mt-0.5">
                        {formatDate(conv.last_message.created_at)}
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-[#00d4d4] mb-1 truncate">{conv.service.title}</p>
                  
                  <div className="flex items-center justify-between">
                    <p className={`text-xs truncate max-w-[180px] ${conv.unread_count > 0 ? 'font-bold text-slate-800' : 'text-slate-500'}`}>
                      {conv.last_message ? (
                        <>
                          {conv.last_message.sender_name === user?.full_name ? 'You: ' : ''}
                          {conv.last_message.message_text}
                        </>
                      ) : (
                        'Started a conversation'
                      )}
                    </p>
                    {conv.unread_count > 0 && (
                      <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0">
                        {conv.unread_count}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-slate-50 relative">
        {activeConversation ? (
          <>
            {/* Chat Area Header */}
            <div className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 shrink-0 z-10 sticky top-0">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 shrink-0 rounded-full bg-slate-200 overflow-hidden border border-slate-200 flex items-center justify-center text-slate-400 font-bold">
                  {activeConversation.other_party.profile_image ? (
                    <img src={activeConversation.other_party.profile_image} className="w-full h-full object-cover" alt="" />
                  ) : (
                     activeConversation.other_party.full_name.charAt(0).toUpperCase()
                  )}
                </div>
                <div>
                  <h2 className="font-bold text-slate-800 leading-tight">{activeConversation.other_party.full_name}</h2>
                  <p className="text-xs text-slate-500 font-medium">Booking: {activeConversation.booking_number}</p>
                </div>
              </div>
            </div>

            {/* Messages Flow */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.length === 0 ? (
                 <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-3 opacity-50">
                    <Bot size={48} strokeWidth={1} />
                    <p>No messages yet. Say hello!</p>
                 </div>
              ) : (
                messages.map((msg, index) => {
                  const isMe = msg.sender_id === user?.id;
                  
                  // grouping logic
                  const prevMsg = index > 0 ? messages[index - 1] : null;
                  const isSameSenderAsPrev = prevMsg && prevMsg.sender_id === msg.sender_id;
                  const showHeader = !isSameSenderAsPrev;
                  
                  return (
                    <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} ${!showHeader ? '-mt-4' : ''}`}>
                      {showHeader && (
                        <div className="text-[11px] font-semibold text-slate-400 mb-1.5 mx-1 flex items-center gap-2">
                          {!isMe && msg.sender?.full_name}
                          <span className="font-normal opacity-70">{formatTime(msg.created_at)}</span>
                        </div>
                      )}
                      
                      <div className={`
                        max-w-[70%] px-4 py-3 rounded-2xl shadow-sm text-[15px]
                        ${isMe ? 'bg-[#00d4d4] text-white rounded-tr-sm' : 'bg-white text-slate-800 border border-slate-100 rounded-tl-sm'}
                      `}>
                        <p className="whitespace-pre-wrap leading-relaxed">{msg.message_text}</p>
                        
                        {msg.attachments && msg.attachments.length > 0 && (
                          <div className="mt-1 flex flex-col gap-2">
                            {msg.attachments.map((url, i) => <React.Fragment key={i}>{renderFilePreview(url)}</React.Fragment>)}
                          </div>
                        )}
                        
                        {isMe && (
                          <div className={`flex justify-end mt-1 mb-[-4px] ${isMe ? 'text-white/70' : 'text-slate-400'}`}>
                            {msg.is_read ? <CheckCheck size={14} /> : <Check size={14} />}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <div className="p-4 bg-white border-t border-slate-200 shrink-0">
              <div className="flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-xl p-2 focus-within:ring-2 focus-within:ring-[#00d4d4]/50 focus-within:border-[#00d4d4] transition-all">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept=".jpg,.jpeg,.png,.webp,.pdf,.doc,.docx" 
                  onChange={handleFileUpload}
                />
                
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="p-2 sm:p-3 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors shrink-0 disabled:opacity-50"
                >
                  {isUploading ? <Loader2 size={20} className="animate-spin" /> : <Paperclip size={20} />}
                </button>
                
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Type a message..."
                  className="flex-1 max-h-32 min-h-[44px] bg-transparent resize-none outline-none py-2.5 px-2 text-sm text-slate-700 placeholder:text-slate-400"
                  rows={1}
                />
                
                <button 
                  onClick={handleSendMessage}
                  disabled={!inputText.trim()}
                  className="p-3 bg-[#00d4d4] hover:bg-[#00baba] text-white rounded-lg transition-colors disabled:opacity-50 disabled:hover:bg-[#00d4d4] shrink-0 mb-0.5"
                >
                  <Send size={18} className="translate-x-[1px] translate-y-[-1px]" />
                </button>
              </div>
              <p className="text-[10px] text-center text-slate-400 mt-2 font-medium tracking-wide">
                Press Enter to send, Shift + Enter for new line. You can attach PDFs or Images.
              </p>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center">
               <Bot size={48} className="text-slate-300" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold text-slate-700 tracking-tight">Your Inbox</h3>
            <p className="max-w-xs text-center leading-relaxed">Select a conversation from the sidebar to view your messages or share files.</p>
          </div>
        )}
      </div>
    </div>
  );
}
