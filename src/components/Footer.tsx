import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Instagram, Youtube } from "lucide-react";
import FloatingParticles from "./FloatingParticles";

const Footer = () => {
  return (
    <footer className="relative border-t border-white/5 overflow-hidden">
      {/* Deep Maroon Footer Background */}
      <div className="absolute inset-0 bg-gradient-to-t from-red-950/60 via-background to-background pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(153,27,27,0.15),transparent_70%)] pointer-events-none" />
      <div className="section-divider-top" />
      <FloatingParticles count={6} maxSize={1} />

      <div className="relative z-10 py-20">
        <div className="container mx-auto px-6 lg:px-10">
          {/* Top area — glass panel with brand + columns */}
          <div className="glass-elevated p-6 md:p-10 lg:p-14" style={{ borderRadius: "var(--radius)" }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-14 lg:gap-20">
              {/* Brand */}
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-primary text-2xl">ॐ</span>
                  <div>
                    <span className="font-heading text-foreground text-base tracking-wider block">
                      Pandit Ji
                    </span>
                    <span className="text-[9px] tracking-[0.35em] uppercase text-primary/30 font-body">
                      Vedic Priest
                    </span>
                  </div>
                </div>
                <p className="text-muted-foreground/45 text-base leading-relaxed font-body font-light mb-6">
                  Serving devotees with authentic Vedic rituals rooted in Sanatan
                  Dharma. Official member of Ganga Maha Aarti, Varanasi.
                </p>
                {/* Social icons in glass circles */}
                <div className="flex gap-3">
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full glass-sacred flex items-center justify-center text-muted-foreground/35 hover:text-primary/80 transition-all duration-400"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full glass-sacred flex items-center justify-center text-muted-foreground/35 hover:text-primary/80 transition-all duration-400"
                  >
                    <Youtube className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-[11px] tracking-[0.3em] uppercase text-primary/30 font-body mb-6">
                  Quick Links
                </h4>
                <div className="flex flex-col gap-3">
                  {[
                    { label: "About", path: "/about" },
                    { label: "Services", path: "/services" },
                    { label: "Book a Pooja", path: "/book" },
                    { label: "Gallery", path: "/gallery" },
                    { label: "Ganga Aarti", path: "/ganga-aarti" },
                    { label: "Contact", path: "/contact" },
                  ].map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className="text-[15px] text-muted-foreground/40 hover:text-foreground/80 transition-colors duration-300 font-body font-light"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Contact */}
              <div>
                <h4 className="text-[11px] tracking-[0.3em] uppercase text-primary/30 font-body mb-6">
                  Reach Out
                </h4>
                <div className="flex flex-col gap-4">
                  <a
                    href="tel:+919876543210"
                    className="flex items-center gap-3 text-[15px] text-muted-foreground/40 hover:text-foreground/80 transition-colors duration-300 font-body font-light"
                  >
                    <Phone className="w-4 h-4 text-primary/30" />
                    +91 98765 43210
                  </a>
                  <a
                    href="mailto:panditji@example.com"
                    className="flex items-center gap-3 text-[15px] text-muted-foreground/40 hover:text-foreground/80 transition-colors duration-300 font-body font-light"
                  >
                    <Mail className="w-4 h-4 text-primary/30" />
                    panditji@example.com
                  </a>
                  <div className="flex items-start gap-3 text-[15px] text-muted-foreground/40 font-body font-light">
                    <MapPin className="w-4 h-4 text-primary/30 mt-0.5 shrink-0" />
                    Dashashwamedh Ghat, Varanasi, India
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 px-4">
            <p className="text-[11px] text-muted-foreground/20 font-body">
              © {new Date().getFullYear()} Pandit Ji. All rights reserved.
            </p>
            <p className="font-serif italic text-primary/15 text-sm">
              ॐ नमः शिवाय
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
