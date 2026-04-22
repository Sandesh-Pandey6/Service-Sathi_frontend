import React, { useState, useEffect, useRef } from 'react';
import { chatApi } from '@/lib/api';
import { getSocket } from '@/lib/socket';
import { useAuth } from '@/hooks/useAuth';
import type { Conversation as ConversationType } from '@/types';
import toast from 'react-hot-toast';
import { Search, Send, Paperclip, FileText, MessageCircle, Check, CheckCheck, Loader2 } from 'lucide-react';

/* ── Helpers ── */
const formatTime = (d: string) =>
  new Date(d).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

const formatDateLabel = (d: string) => {
  const date = new Date(d);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000);
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  return date.toLocaleDateString([], { day: 'numeric', month: 'short' });
};

const formatSidebarTime = (d: string) => {
  const date = new Date(d);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'now';
  if (diffMins < 60) return `${diffMins}m`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs}h`;
  const diffDays = Math.floor(diffHrs / 24);
  if (diffDays < 7) return `${diffDays}d`;
  return date.toLocaleDateString([], { day: 'numeric', month: 'short' });
};

/* ── Types ── */
// Use the shared Conversation type from @/types/message.ts
// which clearly documents that other_party is always the OTHER user
type Conversation = ConversationType;

interface UserInfo {
  id: string;
  full_name: string;
  profile_image: string | null;
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

/* ── Color Palette ── */
const AVATAR_COLORS = [
  { bg: '#dc2626', text: '#fff' },
  { bg: '#7c3aed', text: '#fff' },
  { bg: '#2563eb', text: '#fff' },
  { bg: '#059669', text: '#fff' },
  { bg: '#d97706', text: '#fff' },
  { bg: '#ec4899', text: '#fff' },
];

function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

/* ── Main Component ── */
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const socket = getSocket();

  useEffect(() => { fetchConversations(); }, []);

  useEffect(() => {
    if (activeConvId) {
      fetchMessages(activeConvId);
      socket.emit('join_conversation', { booking_id: activeConvId });
      setConversations(prev => prev.map(c =>
        c.id === activeConvId ? { ...c, unread_count: 0 } : c
      ));
    }
  }, [activeConvId]);

  useEffect(() => {
    const handleNewMessage = (msg: Message & { booking_id?: string }) => {
      const bookingId = msg.booking_id;
      if (bookingId === activeConvId) {
        setMessages(prev => {
          // Deduplicate — avoid adding if already present (from REST refetch)
          if (prev.some(m => m.id === msg.id)) return prev;
          // Also remove any optimistic temp messages for this text
          const filtered = prev.filter(m => !m.id.startsWith('temp-'));
          return [...filtered, msg].sort((a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        });
        if (msg.sender_id !== user?.id) {
          chatApi.markAsRead(msg.id).catch(console.error);
          socket.emit('message_read', { message_id: msg.id });
        }
      }
      fetchConversations();
    };

    const handleMessageRead = (data: { message_id: string }) => {
      setMessages(prev => prev.map(m =>
        m.id === data.message_id ? { ...m, is_read: true } : m
      ));
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

  // Sync total unread count with sidebars instantly
  useEffect(() => {
    const totalUnread = conversations.reduce((sum, c) => sum + (c.unread_count || 0), 0);
    window.dispatchEvent(new CustomEvent('chatCountUpdated', { detail: totalUnread }));
  }, [conversations]);

  const fetchConversations = async () => {
    try {
      const res = await chatApi.getConversations();
      setConversations(res.data.conversations || []);
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
      const unread = res.data.messages.filter((m: Message) => !m.is_read && m.sender_id !== user?.id);
      
      // Use REST API for reliable persistence, then optionally emit for real-time sync to the other party
      for (const m of unread) {
        chatApi.markAsRead(m.id).catch(console.error);
        socket.emit('message_read', { message_id: m.id });
      }

      // Update local conversation state to clear the unread badge instantly
      if (unread.length > 0) {
        setConversations(prev => prev.map(c => 
          c.id === bookingId ? { ...c, unread_count: Math.max(0, (c.unread_count || 0) - unread.length) } : c
        ));
      }
    } catch {
      toast.error('Failed to load messages');
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || !activeConvId) return;
    const activeConv = conversations.find(c => c.id === activeConvId);
    if (!activeConv) return;

    const messageText = inputText.trim();
    setInputText('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    // Optimistic UI — show instantly
    const tempMsg: Message = {
      id: `temp-${Date.now()}`,
      message_text: messageText,
      attachments: [],
      sender_id: user?.id || '',
      sender_role: role,
      receiver_id: activeConv.other_party.id,
      is_read: false,
      created_at: new Date().toISOString(),
      sender: { id: user?.id || '', full_name: user?.full_name || '', profile_image: null },
    };
    setMessages(prev => [...prev, tempMsg]);

    try {
      // Send via REST API (reliable)
      await chatApi.sendMessage({
        booking_id: activeConv.id,
        receiver_id: activeConv.other_party.id,
        message_text: messageText,
        sender_role: role,
        attachments: [],
      });
      // Refetch to get the real DB record
      await fetchMessages(activeConvId);
      fetchConversations();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to send message');
      // Remove optimistic message on failure
      setMessages(prev => prev.filter(m => m.id !== tempMsg.id));
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeConvId) return;
    if (file.size > 10 * 1024 * 1024) { toast.error('File must be under 10MB'); return; }

    const activeConv = conversations.find(c => c.id === activeConvId);
    if (!activeConv) return;

    try {
      setIsUploading(true);

      // 1. Upload the file
      const fd = new FormData();
      fd.append('file', file);
      fd.append('booking_id', activeConvId);
      const uploadRes = await chatApi.uploadAttachment(fd);
      const url = uploadRes.data.url;

      // 2. Send the message with the attachment via REST
      await chatApi.sendMessage({
        booking_id: activeConv.id,
        receiver_id: activeConv.other_party.id,
        message_text: `Shared: ${file.name}`,
        sender_role: role,
        attachments: [url],
      });

      // 3. Refetch messages to show properly
      await fetchMessages(activeConvId);
      fetchConversations();
      toast.success('File sent');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Upload failed');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const filteredConversations = conversations.filter(c =>
    c.other_party.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.service.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderAttachment = (url: string) => {
    const isImage = url.match(/\.(jpeg|jpg|gif|png|webp)$/i) || url.includes('/image/upload/');
    if (isImage) {
      return (
        <a href={url} target="_blank" rel="noopener noreferrer" className="block mt-2">
          <img src={url} alt="Attachment" style={{
            maxWidth: '220px', maxHeight: '180px', borderRadius: '12px',
            objectFit: 'cover', border: '2px solid rgba(255,255,255,0.2)',
          }} />
        </a>
      );
    }
    return (
      <a href={url} target="_blank" rel="noopener noreferrer"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          marginTop: '8px', padding: '8px 14px', borderRadius: '10px',
          background: 'rgba(0,0,0,0.08)', fontSize: '13px', fontWeight: 600,
          color: 'inherit', textDecoration: 'none',
        }}>
        <FileText size={16} />
        View File
      </a>
    );
  };

  const activeConversation = conversations.find(c => c.id === activeConvId);

  /* ── Loading ── */
  if (loading) {
    return (
      <div style={{ display: 'flex', height: 'calc(100vh - 120px)', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={32} className="animate-spin" style={{ color: '#dc2626' }} />
      </div>
    );
  }

  /* ── Render ── */
  return (
    <div style={{
      display: 'flex', height: 'calc(100vh - 140px)', background: '#fff',
      borderRadius: '20px', overflow: 'hidden',
      border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>

      {/* ════════ SIDEBAR ════════ */}
      <div style={{
        width: '300px', flexShrink: 0, borderRight: '1px solid #f1f5f9',
        display: 'flex', flexDirection: 'column', background: '#fafbfc',
      }}>
        {/* Sidebar Header */}
        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid #f1f5f9', background: '#fff' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: '0 0 12px 0' }}>Messages</h2>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: '#f8fafc', borderRadius: '10px', padding: '8px 12px',
          }}>
            <Search size={15} style={{ color: '#94a3b8', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1, border: 'none', outline: 'none', background: 'transparent',
                fontSize: '13px', color: '#334155', fontWeight: 500, fontFamily: 'inherit',
              }}
            />
          </div>
        </div>

        {/* Conversation List */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {filteredConversations.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: '#94a3b8', fontSize: '13px', fontWeight: 500 }}>
              No conversations yet
            </div>
          ) : (
            filteredConversations.map(conv => {
              const isActive = activeConvId === conv.id;
              const color = getAvatarColor(conv.other_party.full_name);
              const initials = getInitials(conv.other_party.full_name);
              return (
                <button
                  key={conv.id}
                  onClick={() => setActiveConvId(conv.id)}
                  style={{
                    width: '100%', textAlign: 'left', padding: '14px 20px',
                    display: 'flex', gap: '12px', alignItems: 'center',
                    borderBottom: '1px solid #f8fafc', cursor: 'pointer',
                    background: isActive ? '#fef2f2' : 'transparent',
                    borderLeft: isActive ? '3px solid #dc2626' : '3px solid transparent',
                    transition: 'all 0.15s ease', border: 'none',
                    borderRight: 'none', borderTop: 'none',
                    fontFamily: 'inherit',
                  }}
                  onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = '#f8fafc'; }}
                  onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                >
                  {/* Avatar */}
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '50%', flexShrink: 0,
                    background: color.bg, color: color.text,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: '14px', letterSpacing: '0.5px',
                  }}>
                    {conv.other_party?.profile_image ? (
                      <img src={conv.other_party.profile_image} alt="" style={{
                        width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover',
                      }} />
                    ) : initials}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                      <span style={{
                        fontSize: '13px', fontWeight: conv.unread_count > 0 ? 800 : 700,
                        color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        maxWidth: '130px',
                      }}>
                        {conv.other_party.full_name}
                      </span>
                      {conv.last_message && (
                        <span style={{ fontSize: '11px', fontWeight: 500, color: '#94a3b8', flexShrink: 0 }}>
                          {formatSidebarTime(conv.last_message.created_at)}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: '#dc2626', marginBottom: '3px' }}>
                      {conv.service.title}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{
                        fontSize: '12px', fontWeight: conv.unread_count > 0 ? 600 : 500,
                        color: conv.unread_count > 0 ? '#334155' : '#94a3b8',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        maxWidth: '160px',
                      }}>
                        {conv.last_message ? (
                          <>
                            {conv.last_message.sender_name === user?.full_name ? 'You: ' : ''}
                            {conv.last_message.message_text}
                          </>
                        ) : 'Start a conversation'}
                      </span>
                      {conv.unread_count > 0 && (
                        <span style={{
                          background: '#dc2626', color: '#fff', fontSize: '10px', fontWeight: 700,
                          padding: '2px 7px', borderRadius: '10px', flexShrink: 0,
                        }}>
                          {conv.unread_count}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* ════════ CHAT AREA ════════ */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fafbfc' }}>
        {activeConversation ? (
          <>
            {/* Chat Header */}
            <div style={{
              height: '64px', borderBottom: '1px solid #f1f5f9', background: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '0 24px', flexShrink: 0,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
                  background: getAvatarColor(activeConversation.other_party.full_name).bg,
                  color: getAvatarColor(activeConversation.other_party.full_name).text,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: '14px',
                }}>
                  {activeConversation.other_party?.profile_image ? (
                    <img src={activeConversation.other_party.profile_image} alt="" style={{
                      width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover',
                    }} />
                  ) : getInitials(activeConversation.other_party.full_name)}
                </div>
                <div>
                  <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: 0, lineHeight: 1.2 }}>
                    {activeConversation.other_party.full_name}
                  </h3>
                  <p style={{ fontSize: '12px', fontWeight: 500, color: '#94a3b8', margin: 0 }}>
                    {activeConversation.service.title} · {activeConversation.booking_number}
                  </p>
                </div>
              </div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                fontSize: '12px', fontWeight: 600, color: '#10b981',
              }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981' }} />
                Online
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
              {messages.length === 0 ? (
                <div style={{
                  height: '100%', display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', opacity: 0.4,
                }}>
                  <MessageCircle size={48} strokeWidth={1} style={{ color: '#94a3b8', marginBottom: '12px' }} />
                  <p style={{ fontSize: '14px', color: '#94a3b8', fontWeight: 500 }}>No messages yet. Say hello!</p>
                </div>
              ) : (
                (() => {
                  let lastDateLabel = '';
                  return messages.map((msg, index) => {
                    const isMe = msg.sender_id === user?.id;
                    const prevMsg = index > 0 ? messages[index - 1] : null;
                    const isSameSender = prevMsg && prevMsg.sender_id === msg.sender_id;
                    const showHeader = !isSameSender;

                    // Date separator
                    const dateLabel = formatDateLabel(msg.created_at);
                    let showDateSep = false;
                    if (dateLabel !== lastDateLabel) {
                      showDateSep = true;
                      lastDateLabel = dateLabel;
                    }

                    return (
                      <React.Fragment key={msg.id}>
                        {showDateSep && (
                          <div style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '20px 0', gap: '12px',
                          }}>
                            <div style={{ flex: 1, maxWidth: '100px', height: '1px', background: '#e2e8f0' }} />
                            <span style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8' }}>{dateLabel}</span>
                            <div style={{ flex: 1, maxWidth: '100px', height: '1px', background: '#e2e8f0' }} />
                          </div>
                        )}

                        <div style={{
                          display: 'flex', flexDirection: 'column',
                          alignItems: isMe ? 'flex-end' : 'flex-start',
                          marginTop: showHeader ? '16px' : '4px',
                        }}>
                          {/* Bubble */}
                          <div style={{
                            maxWidth: '65%', padding: '12px 16px',
                            borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                            background: isMe ? '#dc2626' : '#ffffff',
                            color: isMe ? '#fff' : '#1e293b',
                            border: isMe ? 'none' : '1px solid #f1f5f9',
                            boxShadow: isMe ? '0 2px 8px rgba(220,38,38,0.15)' : '0 1px 3px rgba(0,0,0,0.04)',
                          }}>
                            <p style={{
                              margin: 0, fontSize: '14px', lineHeight: 1.6,
                              fontWeight: 500, whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                            }}>
                              {msg.message_text}
                            </p>
                            {msg.attachments && msg.attachments.length > 0 && (
                              <div>{msg.attachments.map((url, i) => <React.Fragment key={i}>{renderAttachment(url)}</React.Fragment>)}</div>
                            )}
                          </div>

                          {/* Timestamp + Read Receipt */}
                          <div style={{
                            display: 'flex', alignItems: 'center', gap: '4px',
                            marginTop: '4px', padding: '0 4px',
                          }}>
                            <span style={{ fontSize: '11px', fontWeight: 500, color: '#94a3b8' }}>
                              {formatDateLabel(msg.created_at) !== 'Today'
                                ? `${formatDateLabel(msg.created_at)}, ${formatTime(msg.created_at)}`
                                : formatTime(msg.created_at)
                              }
                            </span>
                            {isMe && (
                              msg.is_read
                                ? <CheckCheck size={13} style={{ color: '#3b82f6' }} />
                                : <Check size={13} style={{ color: '#94a3b8' }} />
                            )}
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  });
                })()
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div style={{
              padding: '16px 24px', background: '#fff',
              borderTop: '1px solid #f1f5f9', flexShrink: 0,
            }}>
              <div style={{
                display: 'flex', alignItems: 'flex-end', gap: '8px',
                background: '#fafbfc', border: '1.5px solid #e2e8f0',
                borderRadius: '16px', padding: '6px 8px',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#dc2626'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(220,38,38,0.08)'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  accept=".jpg,.jpeg,.png,.webp,.pdf,.doc,.docx"
                  onChange={handleFileUpload}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  style={{
                    padding: '8px', background: 'none', border: 'none', cursor: 'pointer',
                    color: '#94a3b8', borderRadius: '8px', display: 'flex', alignItems: 'center',
                    transition: 'color 0.15s', flexShrink: 0,
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#dc2626'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8'; }}
                >
                  {isUploading ? <Loader2 size={20} className="animate-spin" /> : <Paperclip size={20} />}
                </button>

                <textarea
                  ref={textareaRef}
                  value={inputText}
                  onChange={(e) => {
                    setInputText(e.target.value);
                    // Auto-resize
                    e.target.style.height = 'auto';
                    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Type a message..."
                  rows={1}
                  style={{
                    flex: 1, border: 'none', outline: 'none', background: 'transparent',
                    resize: 'none', fontSize: '14px', color: '#334155', fontWeight: 500,
                    fontFamily: 'inherit', padding: '8px 4px', minHeight: '36px', maxHeight: '120px',
                    lineHeight: '1.4',
                  }}
                />

                <button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim()}
                  style={{
                    padding: '10px', background: inputText.trim() ? '#dc2626' : '#fca5a5',
                    color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s', flexShrink: 0,
                    boxShadow: inputText.trim() ? '0 2px 8px rgba(220,38,38,0.25)' : 'none',
                  }}
                  onMouseEnter={(e) => { if (inputText.trim()) e.currentTarget.style.background = '#b91c1c'; }}
                  onMouseLeave={(e) => { if (inputText.trim()) e.currentTarget.style.background = '#dc2626'; }}
                >
                  <Send size={18} style={{ transform: 'translateX(1px) rotate(-5deg)' }} />
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Empty State */
          <div style={{
            height: '100%', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: '16px',
          }}>
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%',
              background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <MessageCircle size={36} style={{ color: '#fca5a5' }} strokeWidth={1.5} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#334155', margin: 0 }}>Your Messages</h3>
            <p style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 500, maxWidth: '260px', textAlign: 'center', lineHeight: 1.6 }}>
              Select a conversation from the sidebar to view messages and share files.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
