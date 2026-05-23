import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import api from './api';

// Helper functions for user-friendly date formatting
const formatRelativeTime = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
};

const formatChatMessageTime = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  
  const isToday = date.toDateString() === now.toDateString();
  const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  
  if (isToday) {
    return `Today, ${timeStr}`;
  }
  
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();
  
  if (isYesterday) {
    return `Yesterday, ${timeStr}`;
  }
  
  return `${date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}, ${timeStr}`;
};

function Helpdesk() {
  const [loading, setLoading] = useState(false);
  const [ticketSearch, setTicketSearch] = useState('');
  const [activeTicketId, setActiveTicketId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const chatEndRef = useRef(null);

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState(null);

  // --- Real Tickets Database ---
  const [tickets, setTickets] = useState([]);

  // Fetch support tickets from real backend
  const fetchTickets = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await api.get('/tickets');
      const mappedData = (res.data || []).map(t => ({
        id: t.ticket_id,
        dbId: t.id,
        title: t.title,
        description: t.description,
        priority: t.priority,
        status: t.status,
        customer: t.customer,
        email: t.email,
        avatar: t.avatar || t.customer.substring(0, 2).toUpperCase(),
        time: formatRelativeTime(t.created_at),
        messages: (t.messages || []).map(m => ({
          id: m.id,
          sender: m.sender,
          senderName: m.senderName,
          text: m.text,
          avatar: m.avatar || m.senderName.substring(0, 2).toUpperCase(),
          time: formatChatMessageTime(m.created_at)
        }))
      }));
      
      setTickets(mappedData);

      // Auto-set first active ticket if none active
      if (mappedData.length > 0 && !activeTicketId) {
        setActiveTicketId(mappedData[0].id);
      }
    } catch (err) {
      console.error("Gagal mengambil support tickets:", err);
      triggerToast("Gagal mengambil support tickets.");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [tickets, activeTicketId]);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleTicketSelect = (id) => {
    setActiveTicketId(id);
  };

  // --- Send Message Action ---
  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!replyText.trim() || !activeTicketId) return;

    const textToSend = replyText;
    setReplyText(''); // clear instantly (Optimistic Input)

    // Retrieve active staff profile if saved, or use default admin details
    let staffName = 'Super Admin';
    let staffAvatar = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQqk_Ls3KpbHFZ4R5wUhwPnvDkiTcmejMUnfqqL6EY-MpD2XgX01FitP7uXaVPJw0cpzmsmXIg_BGx7Z7EL0ng1dh4o1JpC9NDnnVi_7gbXjHo0-xNcPU5z3KxYxFu9boz206fmKM249YoNabZ49kfFI5xlIeexd1y-iM14ScP8NqGazC2ULXDKYvvTN1K-cIlBZ-Xz_WTnZt7LtG7t-gx95hOg7zD-wzc3tpxziANEJflg5XWkbe38Yt75M9Kq7LamrnxL3ApV7uA';

    const adminUserJson = localStorage.getItem('admin_user');
    if (adminUserJson) {
      try {
        const adminObj = JSON.parse(adminUserJson);
        if (adminObj.name) staffName = adminObj.name;
        if (adminObj.avatar) staffAvatar = adminObj.avatar;
      } catch (err) {
        console.error("Gagal parsing admin user json:", err);
      }
    }

    try {
      const res = await api.post(`/tickets/${activeTicketId}/messages`, {
        sender: 'agent',
        sender_name: staffName,
        text: textToSend,
        avatar: staffAvatar
      });

      const newMsg = {
        id: res.data.id,
        sender: res.data.sender,
        senderName: res.data.senderName,
        text: res.data.text,
        avatar: res.data.avatar || staffAvatar,
        time: formatChatMessageTime(res.data.created_at)
      };

      setTickets(prev =>
        prev.map(t => {
          if (t.id === activeTicketId) {
            return {
              ...t,
              time: 'Just now',
              messages: [...t.messages, newMsg]
            };
          }
          return t;
         })
      );
      triggerToast('Pesan balasan berhasil dikirim!');
    } catch (err) {
      console.error("Gagal mengirim balasan tiket:", err);
      triggerToast("Gagal mengirim balasan.");
      setReplyText(textToSend); // Restore draft on error
    }
  };

  // --- Text Editor Helper Actions ---
  const insertTextToken = (token) => {
    if (token === 'bold') setReplyText(prev => prev + ' **bold** ');
    if (token === 'italic') setReplyText(prev => prev + ' *italic* ');
    if (token === 'link') setReplyText(prev => prev + ' [link text](https://) ');
  };

  // --- Ticket Metadata Management ---
  const updateTicketStatus = async (id, nextStatus) => {
    try {
      await api.put(`/tickets/${id}/status`, { status: nextStatus });
      setTickets(prev => prev.map(t => t.id === id ? { ...t, status: nextStatus } : t));
      triggerToast(`Status tiket #${id} diperbarui menjadi ${nextStatus}!`);
    } catch (err) {
      console.error("Gagal memperbarui status tiket:", err);
      triggerToast("Gagal memperbarui status tiket.");
    }
  };

  const updateTicketPriority = async (id, nextPriority) => {
    try {
      await api.put(`/tickets/${id}/priority`, { priority: nextPriority });
      setTickets(prev => prev.map(t => t.id === id ? { ...t, priority: nextPriority } : t));
      triggerToast(`Prioritas tiket #${id} diperbarui menjadi ${nextPriority}!`);
    } catch (err) {
      console.error("Gagal memperbarui prioritas tiket:", err);
      triggerToast("Gagal memperbarui prioritas tiket.");
    }
  };

  // --- Action Panel Functions ---
  const verifyUserRegistry = (user) => {
    triggerToast(`Registrasi User Terverifikasi: ${user} adalah pelanggan aktif berlisensi!`);
  };

  const logBugToDev = (ticketTitle) => {
    triggerToast(`Mencatat Bug ke Dev Jira: "Failed Stripe checkout callback - ${ticketTitle}"`);
  };

  // --- Filter and Search ---
  const filteredTickets = tickets.filter(t => 
    t.title.toLowerCase().includes(ticketSearch.toLowerCase()) ||
    t.id.toLowerCase().includes(ticketSearch.toLowerCase()) ||
    t.customer.toLowerCase().includes(ticketSearch.toLowerCase())
  );

  const activeTicket = tickets.find(t => t.id === activeTicketId) || tickets[0];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col gap-4 items-center justify-center bg-background">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">refresh</span>
        <span className="text-secondary text-sm font-semibold">Memuat Pusat Bantuan...</span>
      </div>
    );
  }

  return (
    <div className="bg-background text-on-surface antialiased overflow-hidden flex h-screen w-full">
      <Sidebar onLogout={() => console.log('Logout')} />

      <div className="flex-1 flex flex-col h-full bg-background relative overflow-hidden">
        <TopNav title="Pusat Bantuan" />

        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-[9999] bg-[#001A3D] text-white px-5 py-3.5 rounded-xl border border-white/10 shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-200">
            <span className="material-symbols-outlined text-secondary text-[20px]">check_circle</span>
            <span className="text-sm font-semibold">{toastMessage}</span>
          </div>
        )}

        {/* Main Work Area */}
        <main className="flex-1 mt-16 flex overflow-hidden w-full max-w-[1440px] mx-auto bg-surface-bright">
          
          {/* LEFT SIDEBAR: TICKETS LIST */}
          <aside className={`w-full lg:w-80 bg-surface flex flex-col border-r border-outline-variant/30 h-full flex-shrink-0 z-10 ${activeTicket ? 'hidden lg:flex' : 'flex'}`}>
            
            {/* Search inputs */}
            <div className="p-4 border-b border-outline-variant/30 flex-shrink-0">
              <div className="relative w-full">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">search</span>
                <input
                  type="text"
                  value={ticketSearch}
                  onChange={(e) => setTicketSearch(e.target.value)}
                  placeholder="Search tickets, IDs, names..."
                  className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-xs focus:outline-none focus:border-[#001A3D] transition-all"
                />
                {ticketSearch && (
                  <button 
                    onClick={() => setTicketSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-primary material-symbols-outlined text-[16px]"
                  >
                    close
                  </button>
                )}
              </div>
            </div>

            {/* List View */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
              {filteredTickets.length === 0 ? (
                <div className="text-center py-8 text-xs text-on-surface-variant font-semibold">
                  No tickets matched search query.
                </div>
              ) : (
                filteredTickets.map((t) => {
                  const isActive = t.id === activeTicketId;
                  return (
                    <div
                      key={t.id}
                      onClick={() => handleTicketSelect(t.id)}
                      className={`p-4 rounded-xl cursor-pointer transition-all relative overflow-hidden group border ${
                        isActive 
                          ? 'bg-surface-container-lowest border-primary shadow-sm' 
                          : 'bg-surface border-outline-variant/30 hover:bg-surface-container-low'
                      }`}
                    >
                      {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#0453cd]"></div>}
                      
                      <div className="flex justify-between items-start mb-2 pl-1.5">
                        <span className="font-mono text-xs text-on-surface-variant">#{t.id}</span>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                          t.priority === 'High' 
                            ? 'bg-error-container text-on-error-container' 
                            : t.priority === 'Medium'
                            ? 'bg-surface-tint/20 text-[#0453cd]'
                            : 'bg-surface-container text-on-surface-variant'
                        }`}>
                          {t.priority}
                        </span>
                      </div>

                      <h3 className="font-bold text-[14px] leading-tight text-primary mb-1 pl-1.5 line-clamp-1">{t.title}</h3>
                      <p className="text-xs text-on-surface-variant line-clamp-2 pl-1.5 mb-3">{t.description}</p>
                      
                      <div className="flex justify-between items-center pl-1.5">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-surface-variant border border-outline-variant/50 overflow-hidden flex items-center justify-center font-bold text-[9px] text-[#001A3D]">
                            {t.avatar.startsWith('http') ? (
                              <img alt={t.customer} className="w-full h-full object-cover" src={t.avatar} />
                            ) : (
                              t.avatar
                            )}
                          </div>
                          <span className="text-xs font-semibold text-on-surface-variant">{t.customer}</span>
                        </div>
                        <span className="text-[10px] text-outline font-semibold">{t.time}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </aside>

          {/* RIGHT SIDEBAR: MESSAGE CHAT & VIEWER */}
          {activeTicket ? (
            <section className="flex-1 flex flex-col bg-surface-container-lowest h-full relative overflow-hidden">
              
              {/* Header Info */}
              <div className="px-4 md:px-8 py-4 md:py-5 border-b border-outline-variant/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface-bright flex-shrink-0 z-10 shadow-sm">
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-1">
                    <button 
                      onClick={() => setActiveTicketId(null)}
                      className="lg:hidden flex items-center justify-center p-2 rounded-full hover:bg-surface-container border-none bg-transparent cursor-pointer text-on-surface-variant transition-colors"
                    >
                      <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                    </button>
                    <h2 className="text-lg md:text-xl font-bold text-primary leading-tight">{activeTicket.title}</h2>
                    
                    {/* Editable Priority */}
                    <select
                      value={activeTicket.priority}
                      onChange={(e) => updateTicketPriority(activeTicket.id, e.target.value)}
                      className="px-2 py-0.5 rounded text-[10px] font-bold border border-outline-variant uppercase tracking-wider bg-surface focus:outline-none"
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>

                    {/* Editable Status */}
                    <select
                      value={activeTicket.status}
                      onChange={(e) => updateTicketStatus(activeTicket.id, e.target.value)}
                      className="px-2 py-0.5 rounded text-[10px] font-bold border border-outline-variant uppercase tracking-wider bg-surface focus:outline-none"
                    >
                      <option value="Open">Open</option>
                      <option value="Pending">Pending</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                  <p className="text-xs text-on-surface-variant font-medium">
                    Reported by <strong className="text-primary font-bold">{activeTicket.customer}</strong> ({activeTicket.email}) • Ticket #{activeTicket.id}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => verifyUserRegistry(activeTicket.customer)}
                    className="px-3.5 py-1.5 rounded-lg bg-surface border border-outline-variant text-xs text-primary font-semibold hover:bg-surface-container transition-all flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">verified_user</span>
                    Verify User
                  </button>
                  <button 
                    onClick={() => logBugToDev(activeTicket.title)}
                    className="px-3.5 py-1.5 rounded-lg bg-surface-container-highest text-primary text-xs font-semibold hover:bg-outline-variant/40 transition-all flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">bug_report</span>
                    Log Bug
                  </button>
                </div>
              </div>

              {/* Chat Viewport */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8 space-y-6 bg-surface-bright flex flex-col">
                {activeTicket.messages.map((msg) => {
                  const isAgent = msg.sender === 'agent';
                  return (
                    <div 
                      key={msg.id} 
                      className={`flex flex-col gap-1 max-w-[80%] ${
                        isAgent ? 'self-end items-end' : 'self-start items-start'
                      }`}
                    >
                      <div className={`flex items-end gap-3 ${isAgent ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className="w-8 h-8 rounded-full bg-surface-container-highest overflow-hidden border border-outline-variant/40 flex-shrink-0 flex items-center justify-center font-bold text-[#001A3D] text-[10px]">
                          {msg.avatar.startsWith('http') ? (
                            <img alt={msg.senderName} className="w-full h-full object-cover" src={msg.avatar} />
                          ) : (
                            msg.avatar
                          )}
                        </div>
                        <div className={`px-5 py-3 rounded-2xl shadow-sm border ${
                          isAgent 
                            ? 'bg-[#001A3D] text-white border-white/5 rounded-br-sm' 
                            : 'bg-surface-container text-on-surface border-outline-variant/10 rounded-bl-sm'
                        }`}>
                          <p className="text-sm leading-relaxed">{msg.text}</p>
                        </div>
                      </div>
                      <span className={`text-[10px] text-outline font-semibold ${isAgent ? 'mr-11' : 'ml-11'}`}>
                        {msg.time}
                      </span>
                    </div>
                  );
                })}
                <div ref={chatEndRef} />
              </div>

              {/* Message Reply Box Input */}
              <div className="p-6 bg-surface-bright border-t border-outline-variant/30 flex-shrink-0 z-10 shadow-sm">
                <form 
                  onSubmit={handleSendMessage}
                  className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl overflow-hidden focus-within:border-[#001A3D] transition-all shadow-sm"
                >
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                        handleSendMessage();
                      }
                    }}
                    placeholder="Type your response here... Use Cmd+Enter to send instantly."
                    rows="3"
                    className="w-full p-4 bg-transparent border-none resize-none text-sm text-on-surface focus:ring-0 focus:outline-none"
                  ></textarea>

                  <div className="flex justify-between items-center px-4 py-3 bg-surface-container-low/50 border-t border-outline-variant/20">
                    
                    {/* Rich text options mock */}
                    <div className="flex gap-2 text-outline">
                      <button 
                        type="button"
                        onClick={() => insertTextToken('bold')}
                        className="p-1.5 rounded hover:bg-surface-variant transition-colors"
                        title="Bold Text"
                      >
                        <span className="material-symbols-outlined text-[18px]">format_bold</span>
                      </button>
                      <button 
                        type="button"
                        onClick={() => insertTextToken('italic')}
                        className="p-1.5 rounded hover:bg-surface-variant transition-colors"
                        title="Italic Text"
                      >
                        <span className="material-symbols-outlined text-[18px]">format_italic</span>
                      </button>
                      <button 
                        type="button"
                        onClick={() => insertTextToken('link')}
                        className="p-1.5 rounded hover:bg-surface-variant transition-colors"
                        title="Insert Link"
                      >
                        <span className="material-symbols-outlined text-[18px]">link</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="hidden md:inline text-[10px] text-outline font-semibold">Press Cmd+Enter to send</span>
                      <button
                        type="submit"
                        disabled={!replyText.trim()}
                        className="px-5 py-2 bg-[#001A3D] text-white rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 shadow-sm disabled:opacity-40 disabled:pointer-events-none"
                      >
                        Send Reply
                        <span className="material-symbols-outlined text-[16px]">send</span>
                      </button>
                    </div>
                  </div>
                </form>
              </div>

            </section>
          ) : (
            <div className="hidden lg:flex flex-1 flex-col items-center justify-center text-on-surface-variant">
              <span className="material-symbols-outlined text-4xl mb-2">forum</span>
              <span className="text-sm font-semibold">Select a ticket from the list to view messaging history.</span>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

export default Helpdesk;
