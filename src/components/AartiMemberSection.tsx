import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Check, Flame } from "lucide-react";

const content = {
    title: "Official Ganga Aarti Member, Varanasi",
    description: "Honored to serve as an official member of the sacred Ganga Aarti ceremony at Dashashwamedh Ghat, one of the most revered spiritual rituals in Hinduism. With years of dedication to Vedic traditions and deep knowledge of ancient scriptures, I bring authentic spiritual guidance to devotees worldwide.",
    features: [
        {
            title: "Authentic Vedic Knowledge",
            desc: "Deep understanding of Sanskrit mantras and ancient rituals"
        },
        {
            title: "Traditional Lineage",
            desc: "Spiritual wisdom passed through generations of learned scholars"
        },
        {
            title: "Personalized Guidance",
            desc: "Tailored spiritual solutions for your unique life journey"
        }
    ]
};

const AartiMemberSection = () => {
    return (
        <section className="py-16 lg:py-24 relative overflow-hidden">
            {/* Deep Maroon/Cosmic Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-950/40 via-background to-background z-0 pointer-events-none" />

            {/* Decorative Glow */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-6 lg:px-10 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        {/* Sacred Divider Icon */}
                        <div className="flex items-center gap-4 mb-6 text-primary/60">
                            <div className="h-px w-12 bg-primary/30" />
                            <Flame className="w-6 h-6 animate-pulse" />
                            <div className="h-px w-12 bg-primary/30" />
                        </div>

                        <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-foreground mb-6 leading-tight">
                            Official <span className="text-gradient-gold">Ganga Aarti</span> Member, Varanasi
                        </h2>

                        <p className="text-muted-foreground/80 font-body font-light text-lg leading-relaxed mb-10">
                            {content.description}
                        </p>

                        {/* Feature List */}
                        <div className="space-y-6">
                            {content.features.map((feature, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.15, duration: 0.6 }}
                                    className="flex gap-5"
                                >
                                    <div className="flex-shrink-0 w-12 h-12 rounded-full glass-sacred flex items-center justify-center text-primary mt-1">
                                        <Check className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-heading text-xl text-foreground mb-1">{feature.title}</h4>
                                        <p className="text-sm font-body text-muted-foreground/60 leading-relaxed max-w-sm">
                                            {feature.desc}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right Image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        {/* Frame */}
                        <div className="glass-card p-2 rounded-[2rem] relative z-10 transform lg:rotate-2 hover:rotate-0 transition-transform duration-700">
                            <div className="overflow-hidden rounded-[1.5rem] aspect-[4/5] sm:aspect-[3/4] lg:aspect-square xl:aspect-[4/5] relative">
                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />

                                <img
                                    src="/images/HariomPanditJi.png"
                                    alt="Pandit Ji performing Ganga Aarti"
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                                />

                                {/* Book Now Overlay */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-500 z-20 bg-black/40 backdrop-blur-[2px]">
                                    <Link
                                        to="/book"
                                        className="px-8 py-3 bg-primary text-background font-bold tracking-widest uppercase rounded-full transform scale-90 hover:scale-100 transition-transform duration-300 shadow-[0_0_20px_rgba(253,185,49,0.4)]"
                                    >
                                        Book Now
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Background decorative elements */}
                        <div className="absolute -inset-4 border border-primary/20 rounded-[2.5rem] -z-10 rotate-[-3deg] scale-105 opacity-60" />
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default AartiMemberSection;
