import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, Home, User, Settings, Image as ImageIcon, Calendar, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
    { label: "Home", path: "/", icon: Home },
    { label: "About", path: "/about", icon: User },
    { label: "Services", path: "/services", icon: Settings },
    { label: "Gallery", path: "/gallery", icon: ImageIcon },
    { label: "Book Pooja", path: "/book", icon: Calendar },
    { label: "Contact", path: "/contact", icon: Mail },
];

const Sidebar = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();
    const [hoveredLink, setHoveredLink] = useState<string | null>(null);

    // Mobile toggle
    const toggleMobile = () => setMobileOpen(!mobileOpen);

    return (
        <>
            {/* --- DESKTOP VERTICAL SIDEBAR (Glass Panel) --- */}
            <motion.aside
                initial={{ x: -100 }}
                animate={{ x: 0 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="hidden lg:flex fixed left-0 top-0 bottom-0 z-50 flex-col items-center py-10 w-28 glass-elevated border-r border-white/5"
                style={{ backdropFilter: "blur(20px)" }}
            >
                {/* Brand/Logo */}
                <Link to="/" className="mb-auto flex flex-col items-center gap-2 group">
                    <span className="text-primary text-4xl transition-all duration-500 group-hover:rotate-12 group-hover:scale-110 drop-shadow-md">
                        ॐ
                    </span>
                    <span className="text-[10px] tracking-widest uppercase text-foreground/60 font-body opacity-0 group-hover:opacity-100 transition-opacity duration-300 -mt-1">
                        Pandit Ji
                    </span>
                </Link>

                {/* Navigation Icons */}
                <div className="flex flex-col gap-9 items-center justify-center">
                    {navLinks.map((link) => {
                        const isActive = location.pathname === link.path;
                        const Icon = link.icon;

                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                onMouseEnter={() => setHoveredLink(link.path)}
                                onMouseLeave={() => setHoveredLink(null)}
                                className="relative group p-3 flex items-center justify-center"
                            >
                                {/* Active/Hover Background Glow */}
                                {(isActive || hoveredLink === link.path) && (
                                    <motion.div
                                        layoutId="sidebar-glow"
                                        className="absolute inset-0 bg-primary/10 rounded-xl blur-md"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}

                                {/* Icon */}
                                <Icon
                                    strokeWidth={1.5}
                                    className={`w-6 h-6 transition-all duration-300 relative z-10 ${isActive ? "text-primary scale-110" : "text-muted-foreground/60 group-hover:text-primary/80 group-hover:scale-105"
                                        }`}
                                />

                                {/* Vertical Label (Tooltip style) */}
                                <AnimatePresence>
                                    {hoveredLink === link.path && (
                                        <motion.div
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 45 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute left-0 pointer-events-none"
                                        >
                                            <div className="glass-sacred px-4 py-2 text-xs tracking-widest uppercase text-primary whitespace-nowrap">
                                                {link.label}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Active Indicator Dot */}
                                {isActive && (
                                    <motion.div
                                        layoutId="sidebar-dot"
                                        className="absolute -right-[18px] w-1 h-8 bg-primary rounded-l-full shadow-[0_0_10px_var(--primary)]"
                                    />
                                )}
                            </Link>
                        );
                    })}
                </div>

                {/* Bottom Booking Action */}
                <div className="mt-auto pt-8 flex flex-col items-center gap-6">
                    <div className="w-8 h-px bg-white/10" />
                    <Link
                        to="/book"
                        className="w-12 h-12 rounded-full glass-sacred flex items-center justify-center text-primary hover:scale-110 hover:shadow-[0_0_20px_rgba(255,165,0,0.3)] transition-all duration-500"
                        title="Book Pooja"
                    >
                        <Calendar className="w-5 h-5" />
                    </Link>
                </div>
            </motion.aside>


            {/* --- MOBILE NAVBAR (Top Horizontal) --- */}
            <motion.div
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className="lg:hidden fixed top-0 left-0 right-0 z-50 glass-elevated px-6 h-16 flex items-center justify-between"
            >
                <Link to="/" className="text-2xl text-primary">ॐ</Link>

                <button
                    onClick={toggleMobile}
                    className="text-foreground/80 p-2"
                >
                    {mobileOpen ? <X /> : <Menu />}
                </button>
            </motion.div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: "100%" }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: "100%" }}
                        transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                        className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl lg:hidden flex flex-col items-center justify-center gap-8"
                    >
                        <button
                            onClick={toggleMobile}
                            className="absolute top-5 right-6 text-foreground/60 p-2"
                        >
                            <X className="w-8 h-8" />
                        </button>

                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={toggleMobile}
                                className="text-2xl font-heading text-foreground/80 hover:text-primary transition-colors flex items-center gap-4"
                            >
                                <link.icon className="w-6 h-6 text-primary/50" />
                                {link.label}
                            </Link>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Sidebar;
