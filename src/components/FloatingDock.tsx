import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Sun, ScrollText, Flower, Flame, MessageCircle, Aperture, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

const links = [
    { path: "/", icon: Sun, label: "Home" }, // Surya
    { path: "/about", icon: ScrollText, label: "About" }, // Scriptures
    { path: "/services", icon: Flower, label: "Services" }, // Offerings/Lotus
    { path: "/gallery", icon: Aperture, label: "Darshan" }, // Lens/Vision
    { path: "/book", icon: Flame, label: "Book Pooja" }, // Agni/Fire
    { path: "/ganga-aarti", icon: Sparkles, label: "Ganga Aarti" }, // Cosmic
    { path: "/contact", icon: MessageCircle, label: "Contact" }, // Connection
];

const FloatingDock = () => {
    const location = useLocation();
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    // Scroll detection to hide in Hero section
    useEffect(() => {
        const handleScroll = () => {
            // Show dock only after scrolling 80% of the viewport (past the hero text)
            const heroThreshold = window.innerHeight * 0.8;
            setIsVisible(window.scrollY > heroThreshold);
        };

        // Initial check
        handleScroll();

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const getScale = (index: number) => {
        if (hoveredIndex === null) return 1;
        const distance = Math.abs(hoveredIndex - index);
        if (distance === 0) return 1.5;
        if (distance === 1) return 1.25;
        return 1;
    };

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none">

            {/* Brand Label - Only appears when idle */}
            <AnimatePresence>
                {isVisible && hoveredIndex === null && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="px-4 py-1.5 rounded-full text-[10px] tracking-[0.3em] uppercase text-primary/60 mb-2 pointer-events-auto drop-shadow-lg font-light backdrop-blur-sm bg-black/20"
                    >
                        Pandit Ji <Sparkles className="w-2.5 h-2.5 inline ml-1 text-gold/80 animate-pulse" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* The Dock - Only visible after hero */}
            <AnimatePresence>
                {isVisible && (
                    <motion.nav
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        className="pointer-events-auto flex items-end gap-2 sm:gap-4 px-6 py-2 rounded-full glass-elevated border border-white/10 shadow-2xl"
                        // Deep maroon backdrop for the dock to match the new theme
                        style={{
                            background: "linear-gradient(to bottom, rgba(50, 10, 10, 0.6), rgba(20, 0, 0, 0.9))",
                            backdropFilter: "blur(12px)"
                        }}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        {links.map((link, index) => {
                            const isActive = location.pathname === link.path;
                            const Icon = link.icon;
                            const scale = getScale(index);

                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onMouseEnter={() => setHoveredIndex(index)}
                                    className="relative group flex flex-col items-center justify-end transition-all duration-200"
                                    style={{ transformOrigin: "bottom center" }}
                                >
                                    <div
                                        className="relative flex items-center justify-center transition-all duration-200 ease-out p-3 rounded-full hover:bg-white/10 active:scale-95"
                                        style={{
                                            transform: `scale(${scale}) translateY(${scale > 1 ? -12 : 0}px)`,
                                        }}
                                    >
                                        {/* Spiritual Aura */}
                                        {(isActive || hoveredIndex === index) && (
                                            <motion.div
                                                layoutId="dock-aura"
                                                className="absolute inset-0 bg-primary/20 blur-xl rounded-full"
                                                transition={{ duration: 0.3 }}
                                            />
                                        )}

                                        {/* The Icon */}
                                        <Icon
                                            strokeWidth={1.2}
                                            className={`w-6 h-6 transition-all duration-500 ${isActive
                                                ? "text-primary drop-shadow-[0_0_10px_rgba(var(--primary),0.8)] stroke-[1.5px]"
                                                : "text-white/70 group-hover:text-primary/90"
                                                }`}
                                        />

                                        {/* Tiny active dot */}
                                        {isActive && (
                                            <div className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full shadow-[0_0_5px_var(--primary)]" />
                                        )}
                                    </div>

                                    {/* Tooltip Label */}
                                    <AnimatePresence>
                                        {hoveredIndex === index && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 5 }}
                                                animate={{ opacity: 1, y: -45 }}
                                                exit={{ opacity: 0, y: 5 }}
                                                transition={{ duration: 0.15 }}
                                                className="absolute bottom-full left-1/2 -translate-x-1/2 pointer-events-none mb-1"
                                            >
                                                <span
                                                    className="text-[10px] tracking-[0.2em] uppercase text-primary/90 whitespace-nowrap drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-light"
                                                    style={{ textShadow: "0 0 10px rgba(0,0,0,0.5)" }}
                                                >
                                                    {link.label}
                                                </span>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </Link>
                            );
                        })}
                    </motion.nav>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FloatingDock;
