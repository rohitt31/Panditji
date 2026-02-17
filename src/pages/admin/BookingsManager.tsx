import { useState, useEffect } from "react";
import { Trash2, Loader2, RefreshCw, Search, Filter } from "lucide-react";
import logger from "@/lib/logger";

interface Booking {
    id: string;
    name: string;
    phone: string;
    email?: string;
    service: string;
    date?: string;
    location?: string;
    message?: string;
    status: string;
    createdAt: string;
}

const statusOptions = ["Pending", "Confirmed", "Completed", "Cancelled"];

const BookingsManager = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const token = localStorage.getItem("adminToken");
    const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/bookings");
            const data = await res.json();
            setBookings(
                Array.isArray(data)
                    ? data.sort((a: Booking, b: Booking) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    : []
            );
        } catch (err) {
            logger.error("Failed to fetch bookings", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const updateStatus = async (id: string, newStatus: string) => {
        try {
            const res = await fetch(`/api/bookings/${id}`, {
                method: "PUT",
                headers: { ...headers, "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
            if (res.ok) {
                setBookings(prev =>
                    prev.map(b => (b.id === id ? { ...b, status: newStatus } : b))
                );
            }
        } catch (err) {
            logger.error("Failed to update status", err);
        }
    };

    const deleteBooking = async (id: string) => {
        if (!confirm("Are you sure you want to delete this booking?")) return;
        try {
            await fetch(`/api/bookings/${id}`, { method: "DELETE", headers });
            setBookings(prev => prev.filter(b => b.id !== id));
        } catch (err) {
            logger.error("Failed to delete booking", err);
        }
    };

    const statusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case "confirmed": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
            case "completed": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
            case "cancelled": return "bg-red-500/20 text-red-400 border-red-500/30";
            default: return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
        }
    };

    // Filter bookings
    const filtered = bookings.filter(b => {
        const matchesSearch =
            b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.phone.includes(searchQuery) ||
            b.service.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || b.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                        Manage Bookings
                    </h1>
                    <p className="text-white/40 text-sm mt-1">
                        {bookings.length} total · {bookings.filter(b => b.status === "Pending").length} pending
                    </p>
                </div>
                <button
                    onClick={fetchBookings}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 text-sm text-white/70 transition-colors"
                >
                    <RefreshCw className="w-4 h-4" /> Refresh
                </button>
            </div>

            {/* Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                        type="text"
                        placeholder="Search by name, phone, or service..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white text-sm placeholder:text-white/25 focus:border-primary/50 focus:outline-none transition-colors"
                    />
                </div>
                <div className="relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <select
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-lg pl-10 pr-8 py-2.5 text-white text-sm focus:border-primary/50 focus:outline-none transition-colors appearance-none cursor-pointer min-w-[160px]"
                    >
                        <option value="all">All Statuses</option>
                        {statusOptions.map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
                {loading ? (
                    <div className="flex justify-center py-20 text-white/50">
                        <Loader2 className="animate-spin w-8 h-8" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20 text-white/30 italic">
                        {searchQuery || statusFilter !== "all" ? "No bookings match your filters." : "No bookings yet."}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <div className="max-h-[70vh] overflow-y-auto">
                            <table className="w-full text-sm">
                                <thead className="sticky top-0 bg-black/90 backdrop-blur-sm z-10">
                                    <tr className="border-b border-white/10">
                                        <th className="text-left px-5 py-3.5 text-white/40 font-medium text-xs uppercase tracking-wider">#</th>
                                        <th className="text-left px-5 py-3.5 text-white/40 font-medium text-xs uppercase tracking-wider">Name</th>
                                        <th className="text-left px-5 py-3.5 text-white/40 font-medium text-xs uppercase tracking-wider">Phone</th>
                                        <th className="text-left px-5 py-3.5 text-white/40 font-medium text-xs uppercase tracking-wider hidden lg:table-cell">Email</th>
                                        <th className="text-left px-5 py-3.5 text-white/40 font-medium text-xs uppercase tracking-wider">Service</th>
                                        <th className="text-left px-5 py-3.5 text-white/40 font-medium text-xs uppercase tracking-wider hidden md:table-cell">Date</th>
                                        <th className="text-left px-5 py-3.5 text-white/40 font-medium text-xs uppercase tracking-wider hidden lg:table-cell">Location</th>
                                        <th className="text-left px-5 py-3.5 text-white/40 font-medium text-xs uppercase tracking-wider">Status</th>
                                        <th className="text-left px-5 py-3.5 text-white/40 font-medium text-xs uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((booking, index) => (
                                        <>
                                            <tr
                                                key={booking.id}
                                                className="border-b border-white/5 hover:bg-white/[0.03] transition-colors cursor-pointer"
                                                onClick={() => setExpandedId(expandedId === booking.id ? null : booking.id)}
                                            >
                                                <td className="px-5 py-4 text-white/30 font-mono text-xs">{index + 1}</td>
                                                <td className="px-5 py-4 text-white font-medium whitespace-nowrap">{booking.name}</td>
                                                <td className="px-5 py-4 text-white/60 whitespace-nowrap">
                                                    <a href={`tel:${booking.phone}`} className="hover:text-primary transition-colors">{booking.phone}</a>
                                                </td>
                                                <td className="px-5 py-4 text-white/50 hidden lg:table-cell">{booking.email || "—"}</td>
                                                <td className="px-5 py-4 text-white/70 whitespace-nowrap">{booking.service}</td>
                                                <td className="px-5 py-4 text-white/50 hidden md:table-cell whitespace-nowrap">{booking.date || "—"}</td>
                                                <td className="px-5 py-4 text-white/50 hidden lg:table-cell">{booking.location || "—"}</td>
                                                <td className="px-5 py-4">
                                                    <select
                                                        value={booking.status}
                                                        onChange={e => {
                                                            e.stopPropagation();
                                                            updateStatus(booking.id, e.target.value);
                                                        }}
                                                        onClick={e => e.stopPropagation()}
                                                        className={`text-xs px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none ${statusColor(booking.status)} bg-transparent`}
                                                    >
                                                        {statusOptions.map(s => (
                                                            <option key={s} value={s} className="bg-black text-white">{s}</option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <button
                                                        onClick={e => {
                                                            e.stopPropagation();
                                                            deleteBooking(booking.id);
                                                        }}
                                                        className="p-2 rounded-lg hover:bg-red-500/10 text-white/30 hover:text-red-400 transition-colors"
                                                        title="Delete booking"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                            {/* Expanded Row — shows message & details */}
                                            {expandedId === booking.id && (
                                                <tr key={`${booking.id}-detail`} className="border-b border-white/5 bg-white/[0.02]">
                                                    <td colSpan={9} className="px-5 py-4">
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                                            {booking.message && (
                                                                <div className="md:col-span-2">
                                                                    <span className="text-white/40 text-xs uppercase tracking-wider">Message</span>
                                                                    <p className="text-white/70 mt-1">{booking.message}</p>
                                                                </div>
                                                            )}
                                                            <div>
                                                                <span className="text-white/40 text-xs uppercase tracking-wider">Submitted</span>
                                                                <p className="text-white/70 mt-1">
                                                                    {new Date(booking.createdAt).toLocaleDateString("en-IN", {
                                                                        day: "numeric", month: "long", year: "numeric",
                                                                        hour: "2-digit", minute: "2-digit"
                                                                    })}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <span className="text-white/40 text-xs uppercase tracking-wider">Booking ID</span>
                                                                <p className="text-white/50 font-mono text-xs mt-1">{booking.id}</p>
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
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingsManager;
