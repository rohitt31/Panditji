import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import FloatingParticles from "./FloatingParticles";
import { useState, useEffect } from "react";
import logger from "@/lib/logger";

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/testimonials")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setTestimonials(data);
        }
      })
      .catch(err => logger.error('Failed to fetch testimonials', err));
  }, []);

  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      {/* Maroon Theme Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-red-950/30 to-background pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-red-800/10 blur-[120px] rounded-full pointer-events-none" />
      <FloatingParticles count={8} maxSize={1.5} />
      <div className="section-divider-top" />

      <div className="container mx-auto px-6 lg:px-10 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-20"
        >
          <p className="font-serif italic text-primary/40 text-base mb-4 tracking-wider">
            Devotee Experiences
          </p>
          <h2 className="font-heading text-4xl lg:text-6xl text-foreground mb-5">
            Words of <span className="text-gradient-gold">Gratitude</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.id || t.name || index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.7,
                delay: index * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="glass-elevated glass-reflection glass-shine p-8 lg:p-10 relative group"
            >
              {/* Large quote watermark */}
              <div className="absolute top-5 right-6 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-700">
                <Quote className="w-16 h-16 text-primary" />
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(t.rating || t.stars || 5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-3.5 h-3.5 fill-primary/60 text-primary/60"
                  />
                ))}
              </div>

              {/* Quote — bigger */}
              <p className="font-serif text-foreground/75 text-lg italic leading-relaxed mb-8">
                "{t.quote || t.text || "No review text provided."}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full glass-sacred flex items-center justify-center text-xs font-body font-medium text-primary/60 tracking-wider overflow-hidden">
                  {t.image ? (
                    <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
                  ) : (
                    t.initials || (t.name ? t.name.split(' ').map((n: any) => n[0]).join('').substring(0, 2).toUpperCase() : "?")
                  )}
                </div>
                <div>
                  <p className="text-[15px] text-foreground/90 font-body font-medium">
                    {t.name}
                  </p>
                  <p className="text-xs text-muted-foreground/40 font-body">
                    {t.location}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
