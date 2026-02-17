import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { Award, BookOpen, Heart, Star } from "lucide-react";

const milestones = [
  { icon: BookOpen, label: "Vedic Education", desc: "Trained in traditional Gurukul system from age 8" },
  { icon: Award, label: "Ganga Maha Aarti", desc: "Official member of the sacred Aarti at Dashashwamedh Ghat" },
  { icon: Star, label: "20+ Years", desc: "Two decades of performing sacred rituals across India & abroad" },
  { icon: Heart, label: "5000+ Ceremonies", desc: "From weddings to Griha Pravesh — each performed with devotion" },
];

const About = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="py-24 lg:py-32 bg-cosmic-radial">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <p className="font-serif italic text-primary/70 text-sm mb-3 tracking-wider">
              The Sacred Path
            </p>
            <h1 className="font-heading text-4xl lg:text-5xl text-foreground mb-6">
              About <span className="text-gradient-gold">Pandit Ji</span>
            </h1>
            <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Born and raised in the spiritual heart of Varanasi, Pandit Ji carries forward a lineage
              of Vedic scholars dedicated to preserving the authenticity of Sanatan Dharma.
            </p>
          </motion.div>

          {/* Story */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="prose prose-invert max-w-none mb-20"
          >
            <div className="bg-card/30 border border-border/30 p-8 lg:p-12 space-y-6 text-muted-foreground leading-relaxed text-sm">
              <p>
                From the ancient ghats of Kashi to homes across the world, Pandit Ji's journey
                has been one of unwavering devotion to the Vedic tradition. Initiated into
                priesthood through the traditional Gurukul system, he received his education
                in Sanskrit, Vedic chanting, Jyotish Shastra (Vedic Astrology), and the complete
                system of Hindu Samskaras.
              </p>
              <p>
                As an official member of the prestigious Ganga Maha Aarti at Dashashwamedh Ghat,
                Varanasi, Pandit Ji stands as a custodian of one of the most sacred evening
                rituals in Hinduism — an honour that reflects his deep connection to the
                spiritual traditions of Kashi.
              </p>
              <p>
                His approach blends the depth of ancient wisdom with a gentle, accessible manner.
                Whether performing a grand wedding ceremony or a quiet home prayer, every ritual
                is conducted with complete sincerity, proper Vedic pronunciation, and a calm
                presence that puts devotees at ease.
              </p>
              <p className="font-serif italic text-primary/80 text-base">
                "My role is not just to perform rituals, but to help devotees feel the divine
                presence in their own lives. Every mantra carries meaning, and I ensure that
                meaning reaches the heart."
              </p>
            </div>
          </motion.div>

          {/* Milestones */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {milestones.map((m, index) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex items-start gap-4 bg-card/30 border border-border/30 p-6"
              >
                <m.icon className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-heading text-sm text-foreground tracking-wide mb-1">
                    {m.label}
                  </h3>
                  <p className="text-muted-foreground text-sm">{m.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
