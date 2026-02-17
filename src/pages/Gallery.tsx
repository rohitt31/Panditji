import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { Instagram } from "lucide-react";

const galleryPosts = [
  { id: 1, caption: "Evening Aarti at Dashashwamedh Ghat", rotate: -3, size: "large" },
  { id: 2, caption: "Rudrabhishek ceremony", rotate: 2, size: "small" },
  { id: 3, caption: "Sacred Vivah Sanskar", rotate: -1, size: "medium" },
  { id: 4, caption: "Morning prayers by the Ganges", rotate: 3, size: "small" },
  { id: 5, caption: "Satyanarayan Katha in progress", rotate: -2, size: "medium" },
  { id: 6, caption: "Griha Pravesh blessings", rotate: 1, size: "large" },
  { id: 7, caption: "Mundan Sanskar ceremony", rotate: -2, size: "small" },
  { id: 8, caption: "Havan during auspicious occasion", rotate: 2, size: "medium" },
];

const sizeClasses: Record<string, string> = {
  small: "w-40 h-48 sm:w-44 sm:h-52",
  medium: "w-44 h-56 sm:w-52 sm:h-64",
  large: "w-48 h-60 sm:w-56 sm:h-72",
};

const Gallery = () => {
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
              Sacred Moments
            </p>
            <h1 className="font-heading text-4xl lg:text-5xl text-foreground mb-6">
              <span className="text-gradient-gold">Gallery</span>
            </h1>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary text-xs tracking-wider uppercase hover:text-primary/80 transition-colors"
            >
              <Instagram className="w-4 h-4" />
              Follow on Instagram
            </a>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 max-w-5xl mx-auto">
            {galleryPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, scale: 0.9, rotate: 0 }}
                whileInView={{ opacity: 1, scale: 1, rotate: post.rotate }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                whileHover={{ rotate: 0, scale: 1.05, zIndex: 10 }}
                className={`${sizeClasses[post.size]} bg-card/40 border border-border/30 flex flex-col items-center justify-center p-4 cursor-pointer transition-shadow duration-300 hover:glow-saffron relative`}
              >
                <div className="flex-1 w-full bg-muted/20 flex items-center justify-center mb-3">
                  <Instagram className="w-8 h-8 text-muted-foreground/20" />
                </div>
                <p className="text-[10px] text-muted-foreground text-center leading-tight">
                  {post.caption}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Gallery;
