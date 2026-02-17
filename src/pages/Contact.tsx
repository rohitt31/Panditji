import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";

const Contact = () => {
  return (
    <Layout>
      <section className="py-16 lg:py-32 bg-cosmic-radial">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <p className="font-serif italic text-primary/70 text-sm mb-3 tracking-wider">
              Reach Out
            </p>
            <h1 className="font-heading text-4xl lg:text-5xl text-foreground mb-6">
              <span className="text-gradient-gold">Contact</span> Pandit Ji
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              For booking enquiries, spiritual guidance, or any questions — Pandit Ji
              is just a message away.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
            {/* WhatsApp */}
            <motion.a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-card/40 border border-border/40 p-8 flex flex-col items-center text-center hover:border-primary/30 transition-all duration-300 group"
            >
              <MessageCircle className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-heading text-sm text-foreground tracking-wide mb-2">WhatsApp</h3>
              <p className="text-muted-foreground text-sm">Preferred for quick enquiries</p>
              <p className="text-primary text-sm mt-2">+91 98765 43210</p>
            </motion.a>

            {/* Phone */}
            <motion.a
              href="tel:+919876543210"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-card/40 border border-border/40 p-8 flex flex-col items-center text-center hover:border-primary/30 transition-all duration-300 group"
            >
              <Phone className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-heading text-sm text-foreground tracking-wide mb-2">Call</h3>
              <p className="text-muted-foreground text-sm">Speak directly with Pandit Ji</p>
              <p className="text-primary text-sm mt-2">+91 98765 43210</p>
            </motion.a>

            {/* Email */}
            <motion.a
              href="mailto:panditji@example.com"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-card/40 border border-border/40 p-8 flex flex-col items-center text-center hover:border-primary/30 transition-all duration-300 group"
            >
              <Mail className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-heading text-sm text-foreground tracking-wide mb-2">Email</h3>
              <p className="text-muted-foreground text-sm">For detailed enquiries</p>
              <p className="text-primary text-sm mt-2">panditji@example.com</p>
            </motion.a>

            {/* Location */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-card/40 border border-border/40 p-8 flex flex-col items-center text-center"
            >
              <MapPin className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-heading text-sm text-foreground tracking-wide mb-2">Location</h3>
              <p className="text-muted-foreground text-sm">Based in Varanasi, serving worldwide</p>
              <p className="text-primary text-sm mt-2">Dashashwamedh Ghat, Varanasi</p>
            </motion.div>
          </div>

          <div className="text-center">
            <p className="font-serif italic text-muted-foreground text-sm">
              "सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः" — May all be happy, may all be free from illness.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
