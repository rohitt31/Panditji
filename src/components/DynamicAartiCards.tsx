import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, Flame } from "lucide-react";
import logger from "@/lib/logger";

interface Card {
    id: string;
    title: string;
    description: string;
    features: string[]; // Strings
    experience: string;
    image: string; // URL path
}

const DynamicAartiCards = () => {
    const [cards, setCards] = useState<Card[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/cards")
            .then((res) => res.json())
            .then((data) => {
                setCards(data);
                setLoading(false);
            })
            .catch((err) => {
                logger.error("Failed to fetch cards", err);
                setLoading(false);
            });
    }, []);

    if (loading || cards.length === 0) return null; // Hide if empty

    return (
        <section className="py-16 lg:py-24 relative overflow-hidden">
            <div className="container mx-auto px-6 lg:px-10 relative z-10">

                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="font-heading text-3xl lg:text-4xl text-foreground">
                        More <span className="text-gradient-gold">Sacred Experiences</span>
                    </h2>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
                    {cards.map((card, index) => (
                        <motion.div
                            key={card.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.8 }}
                            className="group relative"
                        >
                            {/* Card Container */}
                            <div className="glass-card p-6 lg:p-8 rounded-[2rem] hover:bg-white/5 transition-colors duration-500 border border-white/10">
                                <div className="grid lg:grid-cols-2 gap-8 items-center">

                                    {/* Image Side */}
                                    <div className="relative overflow-hidden rounded-2xl aspect-[4/5] lg:aspect-square">
                                        <img
                                            src={card.image || "/images/placeholder.jpg"}
                                            alt={card.title}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

                                        {/* Experience Badge */}
                                        {card.experience && (
                                            <div className="absolute bottom-4 right-4 glass-sacred px-4 py-2 rounded-lg backdrop-blur-md border-primary/20">
                                                <span className="block font-heading text-xl font-bold text-white">{card.experience}</span>
                                                <span className="text-[10px] uppercase tracking-widest font-body text-white/80">Years</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content Side */}
                                    <div>
                                        <h3 className="font-heading text-2xl text-foreground mb-4 leading-tight group-hover:text-primary transition-colors">
                                            {card.title}
                                        </h3>
                                        <p className="text-muted-foreground/80 font-body font-light text-sm leading-relaxed mb-6">
                                            {card.description}
                                        </p>

                                        {/* Features */}
                                        <div className="space-y-3">
                                            {card.features?.map((feature, idx) => (
                                                <div key={idx} className="flex gap-3 items-start">
                                                    <div className="w-5 h-5 rounded-full glass-sacred flex items-center justify-center text-primary mt-0.5 flex-shrink-0">
                                                        <Check className="w-3 h-3" />
                                                    </div>
                                                    <p className="text-xs font-body text-muted-foreground/70 leading-relaxed">
                                                        {feature}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default DynamicAartiCards;
