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
    <div className="h-full flex flex-col pt-6 px-6 pb-0">
      <div className="flex-shrink-0 mb-5">
        <h1 className="text-2xl font-extrabold text-slate-900">Messages</h1>
        <p className="text-sm text-slate-400 mt-0.5">Communicate directly with your customers</p>
      </div>

      <div className="flex-1 bg-white rounded-t-2xl shadow-sm border border-gray-100 flex overflow-hidden">
        {/* Chat List */}
        <div className="w-1/3 border-r border-gray-100 flex flex-col bg-gray-50/50">
          <div className="p-4 border-b border-gray-100">
            <input 
              type="text" 
              placeholder="Search conversations..." 
              className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-500/40 transition-all"
            />
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <p className="p-6 text-center text-sm text-slate-400">No active conversations.</p>
            ) : (
              conversations.map(chat => (
                <div 
                  key={chat.booking_id} 
                  onClick={() => handleSelectConv(chat)}
                  className={`p-4 border-b border-gray-50 flex items-center gap-3 cursor-pointer transition-colors ${activeConv?.booking_id === chat.booking_id ? 'bg-amber-50' : 'hover:bg-gray-100'}`}
                >
                  <img 
                    src={chat.other_user?.profile_image || `https://api.dicebear.com/9.x/avataaars/svg?seed=${chat.other_user?.full_name}`} 
                    alt={chat.other_user?.full_name} 
                    className="w-10 h-10 rounded-full border border-slate-200 bg-white" 
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className={`text-sm truncate ${chat.unread_count > 0 ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>
                        {chat.other_user?.full_name || 'Customer'}
                      </p>
                      <span className={`text-[10px] ${chat.unread_count > 0 ? 'text-amber-600 font-bold' : 'text-slate-400'}`}>
                        {new Date(chat.last_message?.created_at || Date.now()).toLocaleDateString()}
                      </span>
                    </div>
                    <p className={`text-xs truncate ${chat.unread_count > 0 ? 'font-semibold text-slate-700' : 'text-slate-500'}`}>
                      {chat.last_message?.message_text || 'Active booking'}
                    </p>
                  </div>
                  {chat.unread_count > 0 && (
                    <div className="w-5 h-5 bg-amber-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                      {chat.unread_count}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Thread */}
        <div className="flex-1 flex flex-col bg-white">
          {!activeConv ? (
            <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
              Select a conversation to start messaging
            </div>
          ) : (
            <>
              <div className="h-16 px-6 flex items-center justify-between border-b border-gray-100 bg-gray-50/30">
                <div className="flex items-center gap-3">
                  <img 
                    src={activeConv.other_user?.profile_image || `https://api.dicebear.com/9.x/avataaars/svg?seed=${activeConv.other_user?.full_name}`} 
                    className="w-9 h-9 border border-gray-200 bg-white rounded-full" 
                    alt="" 
                  />
                  <div>
                    <p className="text-sm font-bold text-slate-800 leading-tight">{activeConv.other_user?.full_name || 'Customer'}</p>
                    <p className="text-[10px] text-green-600 font-bold uppercase tracking-widest mt-0.5">Booking #{activeConv.booking?.booking_number}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-slate-400">
                  <button className="hover:text-amber-500 transition-colors">📞</button>
                  <button className="hover:text-amber-500 transition-colors">ℹ️</button>
                </div>
              </div>
              
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="space-y-4">
                  {messages.map((msg: any) => {
                    const isMe = msg.sender_id === me?.id;
                    return (
                      <div key={msg.id} className={`flex items-start gap-3 ${isMe ? 'justify-end' : ''}`}>
                        {!isMe && (
                          <img 
                            src={activeConv.other_user?.profile_image || `https://api.dicebear.com/9.x/avataaars/svg?seed=${activeConv.other_user?.full_name}`} 
                            className="w-8 h-8 rounded-full border border-gray-200 bg-gray-50" 
                            alt=""
                          />
                        )}
                        <div className={`text-sm px-4 py-3 max-w-sm shadow-sm ${
                          isMe 
                            ? 'bg-amber-500 text-white rounded-2xl rounded-tr-sm shadow-amber-500/20' 
                            : 'bg-gray-100 text-slate-700 rounded-2xl rounded-tl-sm'
                        }`}>
                          {msg.message_text}
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              <div className="p-4 border-t border-gray-100 bg-gray-50/30">
                <form onSubmit={handleSend} className="flex gap-2 relative">
                  <input 
                    type="text" 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..." 
                    className="flex-1 border border-slate-200 rounded-full px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-amber-500/40 transition-all font-medium"
                  />
                  <button 
                    type="submit" 
                    disabled={!newMessage.trim()}
                    className="w-11 h-11 bg-amber-500 disabled:bg-gray-300 disabled:shadow-none rounded-full flex items-center justify-center text-white hover:bg-amber-600 transition-colors shadow-md shadow-amber-500/30"
                  >
                    ↗
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
