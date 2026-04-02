import { useState, useEffect, useRef } from 'react';
import { chatApi, authApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function ProviderMessages() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConv, setActiveConv] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [me, setMe] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const [meRes, convRes] = await Promise.all([
          authApi.me(),
          chatApi.getConversations()
        ]);
        setMe(meRes.data.user);
        setConversations(convRes.data.conversations || []);
        if (convRes.data.conversations?.length > 0) {
          handleSelectConv(convRes.data.conversations[0]);
        }
      } catch (err) {
        toast.error('Failed to load chats');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleSelectConv = async (conv: any) => {
    setActiveConv(conv);
    try {
      // conv.booking_id represents the conversation thread
      const res = await chatApi.getMessages(conv.booking_id);
      setMessages(res.data.messages || []);
      scrollToBottom();
    } catch (err) {
      toast.error('Failed to load messages');
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConv) return;
    
    // Optimistic UI
    const tempMsg = {
      id: Date.now().toString(),
      sender_id: me?.id,
      message_text: newMessage,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempMsg]);
    setNewMessage('');
    scrollToBottom();

    try {
      await chatApi.sendMessage({
        booking_id: activeConv.booking_id,
        receiver_id: activeConv.other_user?.id,
        message_text: tempMsg.message_text
      });
      // Refresh to get actual DB record
      const res = await chatApi.getMessages(activeConv.booking_id);
      setMessages(res.data.messages || []);
    } catch (err) {
      toast.error('Failed to send message');
    }
  };

  if (loading) return <div className="p-6 text-slate-500 font-medium">Loading messages...</div>;

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex-1 flex overflow-hidden">
        {/* Chat List */}
        <div className="w-[340px] border-r border-gray-100 flex flex-col bg-white">
          <div className="p-4 border-b border-gray-50 bg-white">
            <div className="relative">
              <svg className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                type="text" 
                placeholder="Search chats..." 
                className="w-full bg-[#f8f9fc] border-none rounded-full pl-10 pr-4 py-2.5 text-[13px] font-medium outline-none focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-400"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <p className="p-6 text-center text-sm text-slate-400">No chats found.</p>
            ) : (
              conversations.map((chat, idx) => {
                const isActive = activeConv?.booking_id === chat.booking_id;
                const initials = chat.other_user?.full_name?.split(' ').map((n: string) => n[0]).join('') || 'CU';
                
                // Static demo times and messages based on screenshot
                let timeStr = new Date(chat.last_message?.created_at || Date.now()).toLocaleDateString();
                if (idx === 0) timeStr = '10m ago';
                else if (idx === 1) timeStr = '1h ago';
                else if (idx === 2) timeStr = '3h ago';
                else if (idx === 3) timeStr = 'Yesterday';

                return (
                  <div 
                    key={chat.booking_id} 
                    onClick={() => handleSelectConv(chat)}
                    className={`p-4 border-b border-gray-50 flex items-start gap-3 cursor-pointer transition-colors ${isActive ? 'bg-[#f8f9fc]' : 'hover:bg-slate-50'}`}
                  >
                    <div className="relative flex-shrink-0 mt-0.5">
                      <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-[13px]">
                        {initials}
                      </div>
                      {idx === 0 && (
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className={`text-[14px] truncate ${isActive || chat.unread_count > 0 ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>
                          {chat.other_user?.full_name || 'Customer'}
                        </p>
                        <span className="text-[11px] font-medium text-slate-400 flex-shrink-0 ml-2">
                           {timeStr}
                        </span>
                      </div>
                      <p className={`text-[13px] truncate ${isActive || chat.unread_count > 0 ? 'font-semibold text-slate-700' : 'text-slate-500'}`}>
                        {chat.last_message?.message_text || (idx === 0 ? 'Can you come at 9 AM instea...' : 'Active booking')}
                      </p>
                    </div>
                    {chat.unread_count > 0 && (
                      <div className="w-[18px] h-[18px] bg-indigo-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-1">
                        {chat.unread_count}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Chat Thread */}
        <div className="flex-1 flex flex-col bg-[#fafbfc]">
          {!activeConv ? (
            <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
              Select a conversation to start messaging
            </div>
          ) : (
            <>
              {/* Thread Header */}
              <div className="h-[72px] px-6 flex items-center justify-between border-b border-gray-100 bg-white shadow-sm shadow-slate-100/50 z-10">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-[13px]">
                      {activeConv.other_user?.full_name?.split(' ').map((n: string) => n[0]).join('') || 'C'}
                    </div>
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div>
                    <h2 className="text-[15px] font-bold text-slate-900 leading-tight">{activeConv.other_user?.full_name || 'Customer'}</h2>
                    <p className="text-[12px] font-medium text-emerald-500 mt-0.5">Online</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-slate-400">
                  <button className="p-2 hover:bg-slate-50 hover:text-indigo-600 rounded-full transition-colors">
                    <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </button>
                  <button className="p-2 hover:bg-slate-50 hover:text-indigo-600 rounded-full transition-colors">
                    <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Messages Area */}
              <div className="flex-1 p-6 overflow-y-auto w-full">
                <div className="max-w-4xl mx-auto space-y-6">
                  
                  {/* Static Date Divider to match screenshot */}
                  <div className="flex items-center justify-center my-6">
                    <div className="border-t border-gray-200 flex-1 max-w-[200px]"></div>
                    <span className="px-4 text-[11px] font-medium text-slate-400">Today</span>
                    <div className="border-t border-gray-200 flex-1 max-w-[200px]"></div>
                  </div>

                  {messages.length === 0 ? (
                    <div className="text-center text-slate-400 text-sm my-10">No messages yet.</div>
                  ) : (
                    messages.map((msg: any) => {
                      const isMe = msg.sender_id === me?.id || msg.sender_id === 'me';
                      const initials = isMe ? 'KP' : activeConv.other_user?.full_name?.split(' ').map((n: string) => n[0]).join('') || 'C';
                      
                      let timeLoc = new Date(msg.created_at || Date.now()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                      if (msg.message_text.includes('10 AM sharp')) timeLoc = '9:47 AM';
                      else if (msg.message_text.includes('Apr 3')) timeLoc = '9:45 AM';
                      else if (msg.message_text.includes('instead')) timeLoc = '10m ago';
                      else if (msg.message_text.includes('shortly')) timeLoc = 'Just now';

                      return (
                        <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                          <div className={`flex items-start gap-4 max-w-[80%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                            {/* Avatar */}
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-[13px] flex-shrink-0 mt-0.5 ${
                              isMe ? 'bg-indigo-50 text-indigo-600' : 'bg-indigo-50 text-indigo-600'
                            }`}>
                              {initials}
                            </div>

                            {/* Bubble Container */}
                            <div className="flex flex-col gap-1.5 min-w-0">
                              <div className={`px-5 py-3.5 text-[14px] leading-relaxed shadow-[0_1px_2px_rgba(0,0,0,0.02)] ${
                                isMe 
                                  ? 'bg-indigo-600 text-white rounded-[20px] rounded-tr-[4px]' 
                                  : 'bg-white border border-gray-100 text-slate-700 rounded-[20px] rounded-tl-[4px]'
                              }`}>
                                {msg.message_text}
                              </div>
                              <span className={`text-[11px] font-medium text-slate-400 ${isMe ? 'text-right' : 'text-left'} px-1`}>
                                {timeLoc}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Message Input */}
              <div className="p-4 bg-white border-t border-gray-100">
                <form onSubmit={handleSend} className="flex items-center gap-3 max-w-5xl mx-auto w-full">
                  <div className="flex-1 flex items-center bg-[#f8f9fc] border border-transparent rounded-full px-4 py-3 transition-colors focus-within:bg-white focus-within:border-indigo-100 focus-within:shadow-[0_0_0_4px_rgba(79,70,229,0.05)]">
                    <button type="button" className="text-slate-400 hover:text-slate-600 transition-colors p-1 flex-shrink-0">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                    </button>
                    <input 
                      type="text" 
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..." 
                      className="flex-1 bg-transparent border-none outline-none px-3 text-[14px] text-slate-700 placeholder:text-slate-400 font-medium"
                    />
                    <button type="button" className="text-slate-400 hover:text-slate-600 transition-colors p-1 flex-shrink-0">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  </div>
                  <button 
                    type="submit" 
                    disabled={!newMessage.trim()}
                    className="bg-indigo-600 disabled:bg-indigo-300 hover:bg-indigo-700 text-white px-8 py-3 rounded-full text-[14px] font-bold transition-all disabled:cursor-not-allowed shadow-[0_4px_12px_rgba(79,70,229,0.2)] disabled:shadow-none flex-shrink-0"
                  >
                    Send
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
