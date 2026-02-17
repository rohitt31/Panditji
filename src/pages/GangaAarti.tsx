import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { Flame, Star, Quote, Calendar, Clock, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const GangaAarti = () => {
    return (
        <Layout>
            <div className="relative overflow-hidden bg-background">
                {/* Background Effects - Subtle & Elegant */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[80vh] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background opacity-70" />
                </div>

                {/* Hero Banner Area - Tall, Elegant, Centered */}
                <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20 pb-10">
                    <div className="container mx-auto px-6 relative z-10 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="max-w-4xl mx-auto"
                        >
                            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass-sacred border border-primary/10 mb-12 backdrop-blur-md mx-auto">
                                <Flame className="w-3 h-3 text-primary/80 animate-pulse" />
                                <span className="text-[10px] uppercase tracking-[0.3em] text-primary/80 font-medium">Sacred Ritual of Light</span>
                            </div>

                            <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl mb-10 text-foreground leading-[1.1] tracking-tight">
                                Ganga Maha <span className="text-secondary font-serif italic font-light ml-2">Aarti</span>
                            </h1>

                            <p className="text-lg md:text-xl text-muted-foreground/80 max-w-2xl mx-auto font-light leading-loose mb-14">
                                Experience the divine cosmic energy on the Ghats of Varanasi. An offering of light, sound, and devotion to Mother Ganga, performed daily at sunset.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                                <Link to="/book" className="btn-divine-primary px-10 py-4 text-base tracking-widest shadow-xl shadow-primary/10 hover:shadow-primary/20 transition-all duration-500">
                                    Reserve Spot
                                </Link>
                                <Link to="/contact" className="group flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300 border-b border-transparent hover:border-primary/50 pb-1">
                                    <span>Contact for Groups</span>
                                </Link>
                            </div>
                        </motion.div>
                    </div>

                    {/* Scroll Indicator */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5, duration: 1 }}
                        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground/30"
                    >
                        <span className="text-[10px] tracking-[0.2em] uppercase">Scroll</span>
                        <div className="w-[1px] h-12 bg-gradient-to-b from-current to-transparent" />
                    </motion.div>
                </section>

                {/* Introduction / About the Ritual - More spacing */}
                <section className="py-24 lg:py-40 relative">
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none opacity-50" />

                    <div className="container mx-auto px-6 lg:px-12">
                        <div className="grid lg:grid-cols-2 gap-20 lg:gap-32 items-center">
                            {/* Text Content */}
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.8 }}
                                className="relative"
                            >
                                <h2 className="font-heading text-4xl lg:text-5xl mb-10 leading-tight">
                                    The <span className="text-primary font-serif italic">Eternity</span> of Devotion
                                </h2>
                                <div className="prose prose-invert prose-lg text-muted-foreground/80 font-body font-light space-y-8">
                                    <p className="leading-relaxed">
                                        The Ganga Aarti is not formerly just a ritual; it is a bridge between the human and the divine. Performed every evening at the Dashashwamedh Ghat, it creates an atmosphere charged with spiritual vibrations.
                                    </p>
                                    <p className="leading-relaxed">
                                        As an official member of this sacred ceremony, I have the unique privilege of conducting this offering with precise Vedic mantras, Conch shells (Shankh), and heavy brass lamps (Deepams).
                                    </p>
                                </div>

                                <div className="mt-12 pl-6 border-l border-primary/20">
                                    <p className="text-xl font-serif italic text-foreground/80 leading-relaxed">
                                        "When thousands of lamps are raised to the sky... time stands still. It is a moment of pure connection."
                                    </p>
                                </div>

                                {/* Event Details - Clean Row */}
                                <div className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-white/5">
                                    <div className="flex items-center gap-3">
                                        <Clock className="w-4 h-4 text-primary/60" />
                                        <span className="text-sm font-medium tracking-wide">Daily at Sunset</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <MapPin className="w-4 h-4 text-primary/60" />
                                        <span className="text-sm font-medium tracking-wide">Dashashwamedh Ghat</span>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Visual Grid - Elegant Frame */}
                            <motion.div
                                className="relative mt-8 lg:mt-0"
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 1 }}
                            >
                                <div className="relative aspect-[3/4] max-w-md mx-auto">
                                    <div className="absolute inset-0 border border-primary/20 rounded-full translate-x-4 translate-y-4" />
                                    <div className="absolute inset-0 bg-secondary/10 rounded-full -translate-x-4 -translate-y-4" />

                                    <div className="relative h-full rounded-full overflow-hidden shadow-2xl shadow-primary/5 grayscale hover:grayscale-0 transition-all duration-1000">
                                        <img
                                            src="/images/HariomPanditJi.png"
                                            alt="Pandit Ji at Ganga Aarti"
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
                                    </div>

                                    {/* Floating Elegant Badge */}
                                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 glass-sacred px-8 py-4 rounded-full border border-white/10 shadow-lg flex items-center gap-3 whitespace-nowrap">
                                        <Star className="w-4 h-4 text-primary fill-current" />
                                        <span className="text-xs uppercase tracking-widest font-medium">Official Member</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Booking CTA - Elegant & Minimal */}
                <section className="py-32 relative overflow-hidden">
                    <div className="container mx-auto px-6 text-center max-w-3xl relative z-10">
                        <h2 className="font-heading text-4xl lg:text-5xl mb-8">Witness the <span className="text-secondary font-serif italic">Divine</span></h2>
                        <p className="text-muted-foreground mb-12 text-lg font-light max-w-xl mx-auto leading-relaxed">
                            Secure a premium spot to experience the Aarti or perform a special Sankalp for your family.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
                            <Link
                                to="/book"
                                className="btn-divine-primary px-12 py-4 shadow-xl hover:translate-y-[-2px] transition-all duration-300"
                            >
                                Reserve Your Spot
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </Layout>
    );
};

export default GangaAarti;
