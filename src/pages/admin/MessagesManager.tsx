import { useState, useEffect } from "react";
import { Trash2, Loader2, RefreshCw, Mail, Search, Phone } from "lucide-react";
import logger from "@/lib/logger";

interface Message {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    subject: string;
    message: string;
    createdAt: string;
}

const MessagesManager = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const token = localStorage.getItem("adminToken");
    const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/messages");
            const data = await res.json();
            setMessages(
                Array.isArray(data)
                    ? data.sort((a: Message, b: Message) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    : []
            );
        } catch (err) {
            logger.error("Failed to fetch messages", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const deleteMessage = async (id: string) => {
        if (!confirm("Are you sure you want to delete this message?")) return;
        try {
            const res = await fetch(`/api/messages/${id}`, { method: "DELETE", headers });
            if (res.ok) {
                setMessages(prev => prev.filter(m => m.id !== id));
            }
        } catch (err) {
            logger.error("Failed to delete message", err);
        }
    };

    const filtered = messages.filter(m =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                        Messages & Feedback
                    </h1>
                    <p className="text-white/40 text-sm mt-1">
                        {messages.length} total messages
                    </p>
                </div>
                <button
                    onClick={fetchMessages}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 text-sm text-white/70 transition-colors"
                >
                    <RefreshCw className="w-4 h-4" /> Refresh
                </button>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                    type="text"
                    placeholder="Search by name, email, or subject..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white text-sm placeholder:text-white/25 focus:border-primary/50 focus:outline-none transition-colors"
                />
            </div>

            <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
                {loading ? (
                    <div className="flex justify-center py-20 text-white/50">
                        <Loader2 className="animate-spin w-8 h-8" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20 text-white/30 italic">
                        No messages found.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-black/90 backdrop-blur-sm">
                                <tr className="border-b border-white/10">
                                    <th className="text-left px-6 py-4 text-white/40 font-medium text-xs uppercase">Date</th>
                                    <th className="text-left px-6 py-4 text-white/40 font-medium text-xs uppercase">Sender</th>
                                    <th className="text-left px-6 py-4 text-white/40 font-medium text-xs uppercase">Subject</th>
                                    <th className="text-right px-6 py-4 text-white/40 font-medium text-xs uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((msg) => (
                                    <>
                                        <tr
                                            key={msg.id}
                                            onClick={() => setExpandedId(expandedId === msg.id ? null : msg.id)}
                                            className="border-b border-white/5 hover:bg-white/[0.03] cursor-pointer transition-colors"
                                        >
                                            <td className="px-6 py-4 text-white/50 text-xs">
                                                {new Date(msg.createdAt).toLocaleDateString("en-IN", {
                                                    day: "numeric", month: "short", year: "numeric"
                                                })}
                                            </td>
                                            <td className="px-6 py-4 text-white font-medium">
                                                {msg.name}
                                                <div className="text-xs text-white/40 font-normal mt-0.5">
                                                    {msg.email || msg.phone}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-white/80">{msg.subject}</td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        deleteMessage(msg.id);
                                                    }}
                                                    className="p-2 text-white/30 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                        {expandedId === msg.id && (
                                            <tr className="bg-white/[0.02] border-b border-white/5">
                                                <td colSpan={4} className="px-6 py-6">
                                                    <div className="max-w-3xl">
                                                        <h4 className="text-xs uppercase tracking-wider text-white/40 mb-2">Message Content</h4>
                                                        <p className="text-white/80 leading-relaxed whitespace-pre-wrap">{msg.message}</p>

                                                        <div className="mt-6 flex gap-4">
                                                            {msg.email && (
                                                                <a href={`mailto:${msg.email}`} className="text-primary text-xs hover:underline flex items-center gap-1">
                                                                    <Mail className="w-3 h-3" /> Reply via Email
                                                                </a>
                                                            )}
                                                            {msg.phone && (
                                                                <a href={`tel:${msg.phone}`} className="text-primary text-xs hover:underline flex items-center gap-1">
                                                                    <Phone className="w-3 h-3" /> Call {msg.phone}
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MessagesManager;
