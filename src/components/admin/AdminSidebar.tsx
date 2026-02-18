import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Sparkles,
    MessageSquare,
    Image as ImageIcon,
    Calendar,
    Grid,
    LogOut,
    Settings,
    Mail
} from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/services", label: "Services", icon: Sparkles },
    { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquare },
    { href: "/admin/gallery", label: "Gallery", icon: ImageIcon },
    { href: "/admin/cards", label: "Content Cards", icon: Grid },
    { href: "/admin/bookings", label: "Bookings", icon: Calendar },
    { href: "/admin/messages", label: "Messages", icon: Mail },
    { href: "/admin/settings", label: "Settings", icon: Settings },
];

const AdminSidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("adminUser");
        navigate("/admin/login");
    };

    return (
        <aside className="w-64 glass-sidebar border-r border-white/5 h-screen flex flex-col p-6 fixed inset-y-0 left-0 bg-black/40 backdrop-blur-xl">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-10 px-2 pointer-events-none">
                <span className="text-3xl text-primary font-heading">ॐ</span>
                <span className="text-xl font-heading text-white">Pandit Ji</span>
            </div>

            {/* Nav */}
            <nav className="space-y-2 flex-1">
                {links.map((link) => {
                    const isActive = location.pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            to={link.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300",
                                isActive
                                    ? "bg-primary/20 text-primary border border-primary/20 shadow-[0_0_15px_rgba(255,215,0,0.1)]"
                                    : "text-white/60 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <link.icon className="w-5 h-5" />
                            <span className="font-medium tracking-wide">{link.label}</span>
                        </Link>
                    )
                })}
            </nav>

            {/* Logout/Footer */}
            <div className="border-t border-white/5 pt-4 mt-auto space-y-3">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium tracking-wide">Logout</span>
                </button>
                <p className="text-xs text-center text-white/30 font-mono">Admin v2.0 (Secured)</p>
            </div>
        </aside>
    );
};

export default AdminSidebar;
