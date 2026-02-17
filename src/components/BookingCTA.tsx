import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import FloatingParticles from "./FloatingParticles";

const BookingCTA = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Maroon Theme BG */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-950/40 via-background to-red-950/40 opacity-80" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.08),transparent_70%)]" />
      <div className="section-divider-top" />

      {/* Aurora glow behind CTA */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="absolute w-[600px] h-[600px] rounded-full animate-pulse-glow"
          style={{
            background: "radial-gradient(ellipse at center, hsl(38 72% 55% / 0.04), transparent 60%)",
          }}
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute w-[450px] h-[450px] rounded-full border border-primary/[0.03]"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
          className="absolute w-[300px] h-[300px] rounded-full border border-primary/[0.04]"
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute w-[150px] h-[150px] rounded-full border border-primary/[0.05]"
        />
      </div>

      <FloatingParticles count={15} maxSize={2} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 container mx-auto px-6 lg:px-10 text-center"
      >
        <p className="font-serif italic text-primary/40 text-base mb-4 tracking-wider">
          Begin Your Sacred Journey
        </p>
        <h2 className="font-heading text-4xl lg:text-6xl xl:text-7xl text-foreground mb-7 leading-[1.08]">
          Ready to Book a{" "}
          <span className="text-gradient-gold">Sacred Ceremony?</span>
        </h2>
        <p className="text-muted-foreground/50 text-base lg:text-lg max-w-lg mx-auto leading-relaxed mb-12 font-body font-light">
          Whether it's a pooja, wedding, or spiritual consultation — Pandit Ji
          is here to guide you with devotion and authenticity.
        </p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Link to="/book" className="btn-divine-primary text-sm glow-saffron-strong">
            Book Now
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8"
        >
          <span className="inline-block glass-sacred px-6 py-2.5 text-[11px] tracking-[0.22em] uppercase text-foreground/30 font-body">
            Trusted by 5000+ families
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default BookingCTA;
