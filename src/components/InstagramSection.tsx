import { motion } from "framer-motion";
import { Instagram, ExternalLink } from "lucide-react";
import FloatingParticles from "./FloatingParticles";

import { useState, useEffect } from "react";
import logger from "@/lib/logger";

const InstagramSection = () => {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/gallery")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setPosts(data);
      })
      .catch(err => logger.error('Failed to fetch gallery', err));
  }, []);
  return (
    <section className="py-28 lg:py-40 relative overflow-hidden">
      {/* Maroon Theme Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-950/20 via-background to-red-950/20" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-red-900/10 blur-[150px] rounded-full pointer-events-none" />
      <FloatingParticles count={6} maxSize={1.5} />
      <div className="section-divider-top" />

      <div className="container mx-auto px-6 lg:px-10 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <p className="font-serif italic text-primary/40 text-base mb-4 tracking-wider">
            Sacred Moments
          </p>
          <h2 className="font-heading text-4xl lg:text-6xl text-foreground mb-7">
            From Our <span className="text-gradient-gold">Ceremonies</span>
          </h2>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 glass-sacred px-6 py-3 text-xs tracking-[0.2em] uppercase font-body text-primary/50 hover:text-primary/80 transition-colors duration-400"
          >
            <Instagram className="w-4 h-4" />
            Follow on Instagram
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-5 max-w-6xl mx-auto">
          {posts.map((post, index) => (
            <motion.a
              key={post.id}
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="glass-card glass-reflection glass-shine aspect-square relative group overflow-hidden rounded-xl border-0"
            >
              {/* Image Background */}
              <div className="absolute inset-0 bg-secondary/10"> {/* Fallback/Loading background */}
                <img
                  src={post.image}
                  alt={post.caption}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                  onError={(e) => {
                    // Hide broken images gracefully, user will just see glass card
                    (e.target as HTMLImageElement).style.opacity = '0';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
              </div>

              {/* Icon Overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 z-10">
                <div className="w-12 h-12 rounded-full glass-sacred flex items-center justify-center text-primary shadow-lg transform scale-50 group-hover:scale-100 transition-transform duration-500">
                  <Instagram className="w-6 h-6" />
                </div>
              </div>

              {/* Caption Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 z-10">
                <p className="text-[11px] text-white/90 text-center leading-tight font-body drop-shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  {post.caption}
                </p>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InstagramSection;
