import { useEffect, useState } from "react";
import { Sparkles, MessageSquare, Image, Grid, CalendarCheck, Clock, Users, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import logger from "@/lib/logger";

interface Booking {
    id: string;
    name: string;
    phone: string;
    email?: string;
    service: string;
    date?: string;
    location?: string;
    status: string;
    createdAt: string;
}

const Dashboard = () => {
    const [counts, setCounts] = useState({ services: 0, testimonials: 0, gallery: 0, cards: 0, bookings: 0, pendingBookings: 0 });
    const [recentBookings, setRecentBookings] = useState<Booking[]>([]);

    useEffect(() => {
        Promise.all([
            fetch("/api/services").then(r => r.json()),
            fetch("/api/testimonials").then(r => r.json()),
            fetch("/api/gallery").then(r => r.json()),
            fetch("/api/cards").then(r => r.json()),
            fetch("/api/bookings").then(r => r.json())
        ]).then(([s, t, g, c, b]) => {
            const bookings = Array.isArray(b) ? b : [];
            setCounts({
                services: Array.isArray(s) ? s.length : 0,
                testimonials: Array.isArray(t) ? t.length : 0,
                gallery: Array.isArray(g) ? g.length : 0,
                cards: Array.isArray(c) ? c.length : 0,
                bookings: bookings.length,
                pendingBookings: bookings.filter((bk: Booking) => bk.status === "Pending").length
            });
            // Show latest 10 bookings sorted by creation date
            setRecentBookings(
                bookings
                    .sort((a: Booking, b: Booking) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .slice(0, 10)
            );
        }).catch(err => logger.error("Error fetching stats", err));
    }, []);

    const statusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case "confirmed": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
            case "completed": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
            case "cancelled": return "bg-red-500/20 text-red-400 border-red-500/30";
            default: return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
        }
    };

    const StatCard = ({ title, count, icon: Icon, link, color }: any) => (
        <Link to={link || "#"} className="glass-card p-6 rounded-2xl border border-white/10 hover:bg-white/5 hover:scale-105 transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${color} bg-opacity-20`}>
                    <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
                </div>
                {count > 0 && <span className="text-xs font-mono text-white/40">Active</span>}
            </div>
            <h3 className="text-3xl font-bold text-white mb-1 group-hover:text-primary transition-colors">{count}</h3>
            <p className="text-sm text-white/50">{title}</p>
        </Link>
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-heading text-gradient-gold">Admin Dashboard</h1>
                <p className="text-white/50">Welcome back, Pandit Ji. Here is a quick overview of your digital presence.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
                <StatCard title="Sacred Services" count={counts.services} icon={Sparkles} link="/admin/services" color="bg-yellow-500" />
                <StatCard title="Testimonials" count={counts.testimonials} icon={MessageSquare} link="/admin/testimonials" color="bg-purple-500" />
                <StatCard title="Gallery Photos" count={counts.gallery} icon={Image} link="/admin/gallery" color="bg-pink-500" />
                <StatCard title="Content Cards" count={counts.cards} icon={Grid} link="/admin/cards" color="bg-blue-500" />
                <StatCard title="Total Bookings" count={counts.bookings} icon={CalendarCheck} link="/admin/bookings" color="bg-emerald-500" />
            </div>

            {/* Pending Alert */}
            {counts.pendingBookings > 0 && (
                <div className="flex items-center gap-3 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                    <Clock className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                    <p className="text-yellow-300 text-sm">
                        You have <strong>{counts.pendingBookings}</strong> pending booking{counts.pendingBookings > 1 ? "s" : ""} awaiting confirmation.
                    </p>
                    <Link to="/admin/bookings" className="ml-auto text-yellow-400 hover:text-yellow-300 text-sm font-medium underline underline-offset-2">
                        View All →
                    </Link>
                </div>
            )}

            {/* Recent Bookings Table */}
            <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-primary" />
                        <h2 className="text-xl font-bold text-white">Recent Bookings</h2>
                    </div>
                    <Link to="/admin/bookings" className="text-xs text-primary/70 hover:text-primary flex items-center gap-1 transition-colors">
                        View All <ExternalLink className="w-3 h-3" />
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <div className="max-h-[400px] overflow-y-auto">
                        <table className="w-full text-sm">
                            <thead className="sticky top-0 bg-black/80 backdrop-blur-sm z-10">
                                <tr className="border-b border-white/5">
                                    <th className="text-left px-6 py-3 text-white/40 font-normal text-xs uppercase tracking-wider">Name</th>
                                    <th className="text-left px-6 py-3 text-white/40 font-normal text-xs uppercase tracking-wider">Phone</th>
                                    <th className="text-left px-6 py-3 text-white/40 font-normal text-xs uppercase tracking-wider">Service</th>
                                    <th className="text-left px-6 py-3 text-white/40 font-normal text-xs uppercase tracking-wider">Date</th>
                                    <th className="text-left px-6 py-3 text-white/40 font-normal text-xs uppercase tracking-wider">Status</th>
                                    <th className="text-left px-6 py-3 text-white/40 font-normal text-xs uppercase tracking-wider">Submitted</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentBookings.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center py-12 text-white/30 italic">No bookings yet.</td>
                                    </tr>
                                ) : (
                                    recentBookings.map((booking) => (
                                        <tr key={booking.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                            <td className="px-6 py-4 text-white font-medium">{booking.name}</td>
                                            <td className="px-6 py-4 text-white/60">{booking.phone}</td>
                                            <td className="px-6 py-4 text-white/70">{booking.service}</td>
                                            <td className="px-6 py-4 text-white/50">{booking.date || "—"}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-block px-2.5 py-1 text-xs rounded-full border ${statusColor(booking.status)}`}>
                                                    {booking.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-white/40 text-xs">
                                                {new Date(booking.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="glass-card p-6 rounded-2xl border border-white/10">
                <h2 className="text-lg font-bold mb-4 text-white/80">Quick Actions</h2>
                <div className="flex flex-wrap gap-3">
                    <Link to="/admin/bookings" className="px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-lg text-sm border border-white/10 transition-colors">
                        Manage Bookings
                    </Link>
                    <Link to="/admin/services" className="px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-lg text-sm border border-white/10 transition-colors">
                        Edit Services
                    </Link>
                    <Link to="/" target="_blank" className="px-5 py-2.5 bg-primary text-black font-bold rounded-lg text-sm hover:bg-primary/90 transition-colors">
                        Visit Live Website
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
