import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Loader2, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import logger from "@/lib/logger";

interface Service {
    id: string;
    title: string;
    subtitle?: string;
    description: string;
    image?: string;
    icon?: string;
    duration?: string;
    priceRange?: string;
    price?: string;
    features?: string[] | string;
}

const Services = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await fetch("/api/services");
                const data = await res.json();
                setServices(Array.isArray(data) ? data : []);
            } catch (error) {
                logger.error("Error fetching services", error);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    const getFeatures = (features?: string[] | string): string[] => {
        if (!features) return [];
        if (Array.isArray(features)) return features;
        if (typeof features === "string") {
            try { return JSON.parse(features); } catch { return features.split(",").map(f => f.trim()).filter(Boolean); }
        }
        return [];
    };

    if (loading) {
        return (
            <Layout>
                <section className="py-24 lg:py-32 bg-cosmic-gradient min-h-screen flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </section>
            </Layout>
        );
    }

    return (
        <Layout>
            <section className="py-24 lg:py-32 bg-cosmic-gradient">
                <div className="container mx-auto px-4 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <p className="font-serif italic text-primary/70 text-sm mb-3 tracking-wider">
                            Seva & Sadhana
                        </p>
                        <h1 className="font-heading text-4xl lg:text-5xl text-foreground mb-6">
                            Our <span className="text-gradient-gold">Sacred Services</span>
                        </h1>
                        <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            Every ritual is performed with complete devotion, proper Vedic mantras, and
                            authentic procedures passed down through generations.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 max-w-7xl mx-auto">
                        {services.map((service, index) => (
                            <motion.div
                                key={service.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.06 }}
                                className="group rounded-2xl overflow-hidden bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/[0.06] hover:border-primary/30 transition-all duration-500 hover:shadow-lg hover:shadow-primary/5"
                            >
                                {/* Image section */}
                                <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/40">
                                    {service.image ? (
                                        <img
                                            src={service.image}
                                            alt={service.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-5xl opacity-30">
                                            {service.icon || "🙏"}
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                                    {/* Icon badge */}
                                    {service.icon && (
                                        <div className="absolute bottom-3 left-3 w-9 h-9 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-base shadow-lg shadow-black/40 ring-2 ring-black/20">
                                            {service.icon}
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    <h3 className="font-heading text-base font-semibold text-foreground mb-1 truncate">
                                        {service.title}
                                    </h3>
                                    <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2 mb-4 min-h-[2rem]">
                                        {service.description}
                                    </p>

                                    {/* Duration + Price */}
                                    <div className="flex items-center justify-between pt-3 border-t border-white/5">
                                        <div className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
                                            <Clock className="w-3 h-3" />
                                            <span>{service.duration || "—"}</span>
                                        </div>
                                        <span className="text-primary text-xs font-medium tracking-wide">
                                            {service.priceRange || service.price || "On Request"}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="text-center mt-16"
                    >
                        <Link
                            to="/book"
                            className="btn-divine-primary inline-flex items-center gap-2"
                        >
                            Book a Pooja <ArrowRight className="w-4 h-4" />
                        </Link>
                    </motion.div>
                </div>
            </section>
        </Layout>
    );
};

export default Services;
