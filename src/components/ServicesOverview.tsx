import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, Heart, Home, Leaf, Book, Star, Flame } from "lucide-react";
import FloatingParticles from "./FloatingParticles";
import { useState, useEffect } from "react";
import logger from "@/lib/logger";

const FALLBACK_SERVICES = [
  {
    id: "1",
    title: "Griha Pravesh",
    subtitle: "House Warming",
    description: "Invite prosperity into your new home with authentic Vedic Griha Pravesh puja.",
    image: "/images/services/griha-pravesh.png",
    accent: "38 72% 55%",
    price: "₹11,000",
    duration: "4-5 hours",
    icon: Home
  },
  {
    id: "2",
    title: "Satyanarayan Katha",
    subtitle: "Prosperity Rituals",
    description: "Bring harmony and abundance to your family through the sacred Satyanarayan Swamy Katha.",
    image: "/images/services/satyanarayan.png",
    accent: "40 65% 52%",
    price: "₹5,100",
    duration: "3-4 hours",
    icon: Book
  },
  {
    id: "3",
    title: "Vivah Sanskar",
    subtitle: "Wedding Ceremony",
    description: "Complete Vedic Wedding ceremony conducting all rituals from Jaymala to Kanyadaan.",
    image: "/images/services/vivah.png",
    accent: "25 55% 45%",
    price: "On Request",
    duration: "Full Day",
    icon: Heart
  },
  {
    id: "4",
    title: "Mahamrityunjaya Jaap",
    subtitle: "Healing & Longevity",
    description: "Powerful healing mantra chanting for longevity, health, and overcoming fear of death.",
    image: "/images/services/rudrabhishek.png",
    accent: "40 65% 52%",
    price: "₹21,000",
    duration: "6-8 hours",
    icon: Leaf
  },
  {
    id: "5",
    title: "Rudrabhishek",
    subtitle: "Shiva Puja",
    description: "Sacred bathing of Shiva Lingam with Rudra chanting to remove negativity and fulfill desires.",
    image: "/images/services/rudrabhishek.png",
    accent: "40 65% 52%",
    price: "₹7,100",
    duration: "2-3 hours",
    icon: Flame
  },
  {
    id: "6",
    title: "Mundan Sanskar",
    subtitle: "First Haircut",
    description: "Traditional ceremony for child's purity and future growth.",
    image: "/images/services/mundan.png",
    accent: "25 55% 45%",
    price: "₹3,100",
    duration: "2-3 hours",
    icon: Star
  }
];

const ServicesOverview = () => {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/services")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setServices(data);
        } else {
          console.warn("API returned empty services, using fallback.");
          setServices(FALLBACK_SERVICES);
        }
        setLoading(false);
      })
      .catch(err => {
        logger.error('Failed to fetch services', err);
        setServices(FALLBACK_SERVICES); // Fallback on error
        setLoading(false);
      });
  }, []);
  return (
    <section className="py-20 lg:py-40 relative overflow-hidden">
      {/* Deep Maroon Theme Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-red-950/20 to-background z-0 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-900/10 blur-[150px] rounded-full pointer-events-none" />
      <FloatingParticles count={12} maxSize={2} />
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
            Seva & Sadhana
          </p>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-6xl text-foreground mb-6">
            Sacred <span className="text-gradient-gold">Services</span>
          </h2>
          <p className="text-muted-foreground/60 text-base max-w-lg mx-auto leading-relaxed font-body font-light">
            Each ritual is performed with complete devotion, following the
            authentic traditions of Sanatan Dharma.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {services.map((service, index) => {
            const IconComponent = typeof service.icon === 'function' ? service.icon : null;
            const iconEmoji = typeof service.icon === 'string' ? service.icon : null;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <Link
                  to="/book"
                  className="group block rounded-[1.5rem] bg-card/40 border border-white/5 overflow-hidden hover:bg-card/60 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 h-full flex flex-col"
                >
                  {/* Top: Image Section */}
                  <div className="relative h-56 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10 opacity-60" />
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />

                    {/* Floating Icon Badge */}
                    <div className="absolute -bottom-5 left-6 z-20">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg border border-white/10 backdrop-blur-md transition-transform duration-300 group-hover:scale-110"
                        style={{ background: service.accent ? `hsl(${service.accent})` : 'linear-gradient(135deg, hsl(38 72% 55%), hsl(25 55% 45%))' }}
                      >
                        {IconComponent ? (
                          <IconComponent className="w-5 h-5 text-white" />
                        ) : iconEmoji ? (
                          <span className="text-base">{iconEmoji}</span>
                        ) : (
                          <Flame className="w-5 h-5 text-white" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bottom: Content Section */}
                  <div className="pt-9 pb-6 px-6 flex-1 flex flex-col">
                    <p className="text-[10px] tracking-[0.2em] uppercase text-primary/60 font-body mb-2">
                      {service.subtitle || "Vedic Ritual"}
                    </p>
                    <h3 className="font-heading text-xl text-foreground mb-3 tracking-wide group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground/70 text-sm leading-relaxed mb-6 font-body font-light line-clamp-3">
                      {service.description}
                    </p>

                    <div className="mt-auto pt-5 border-t border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground/60">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{service.duration || "2-3 Hours"}</span>
                      </div>
                      <span className="text-primary font-bold text-sm">
                        {service.priceRange || service.price || "On Request"}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-16"
        >
          <Link to="/services" className="btn-divine-outline text-sm">
            View All Services
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesOverview;
