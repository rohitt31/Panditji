import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Services", path: "/services" },
  { label: "Gallery", path: "/gallery" },
  { label: "Book a Pooja", path: "/book" },
  { label: "Ganga Aarti", path: "/ganga-aarti" },
  { label: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Logic: 
    // - If on Homepage ("/"), show navbar ONLY after scrolling past hero.
    // - If on any other page, ALWAYS show navbar.

    const isHomePage = location.pathname === "/";

    if (!isHomePage) {
      setVisible(true);
      return; // No scroll listener needed for internal pages
    }

    // Homepage Scroll Logic
    const handleScroll = () => {
      // Hero scrollHeight = 5 (500vh). 
      // We show navbar after ~4.8 screens of scroll when the animation concludes.
      const heroAnimationHeight = window.innerHeight * 4.8;
      setVisible(window.scrollY > heroAnimationHeight);
    };

    // Initial check
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]); // Re-run effect when route changes

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed top-0 left-0 right-0 z-50 glass-elevated border-b border-white/5 shadow-sm"
        >
          <div className="container mx-auto px-6 lg:px-10">
            <div className="flex items-center justify-between h-16 lg:h-20">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-3 group">
                <span className="text-primary text-2xl transition-all duration-500 group-hover:rotate-12 group-hover:scale-110">
                  ॐ
                </span>
                <div className="flex flex-col">
                  <span className="font-heading text-foreground text-base lg:text-lg tracking-wider">
                    Pandit Ji
                  </span>
                  <span className="text-[9px] tracking-[0.35em] uppercase text-primary/35 font-body hidden sm:block">
                    Vedic Priest
                  </span>
                </div>
              </Link>

              {/* Desktop Nav */}
              <div className="hidden lg:flex items-center gap-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative text-xs tracking-[0.16em] uppercase font-body font-light transition-all duration-300 py-1 ${location.pathname === link.path
                      ? "text-primary"
                      : "text-foreground/50 hover:text-foreground/90"
                      }`}
                  >
                    {link.label}
                    {location.pathname === link.path && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute -bottom-0.5 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </Link>
                ))}
              </div>

              {/* CTA */}
              <div className="hidden lg:flex items-center gap-4">
                <a
                  href="tel:+919876543210"
                  className="flex items-center gap-2 text-xs tracking-wider font-body text-primary/60 hover:text-primary transition-colors duration-300"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Now</span>
                </a>
                <Link
                  to="/book"
                  className="text-[11px] tracking-[0.18em] uppercase font-body font-medium px-5 py-2.5 glass-sacred text-primary/80 hover:text-primary transition-all duration-500"
                >
                  Book Pooja
                </Link>
              </div>

              {/* Mobile Toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden text-foreground/70 p-2 hover:text-primary transition-colors duration-300"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu Overlay */}
          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "100vh" }}
                exit={{ opacity: 0, height: 0 }}
                className="fixed inset-0 top-[64px] z-40 bg-background/95 backdrop-blur-xl border-t border-white/5 lg:hidden overflow-hidden"
              >
                <div className="flex flex-col items-center justify-center h-full gap-8 pb-20">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileOpen(false)}
                      className="text-2xl font-heading text-foreground/80 hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                  <Link
                    to="/book"
                    onClick={() => setMobileOpen(false)}
                    className="mt-4 px-8 py-3 bg-primary text-background font-bold tracking-widest uppercase rounded-full"
                  >
                    Book Now
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>
      )}
    </AnimatePresence>
  );
};

export default Navbar;
