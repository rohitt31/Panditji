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

          {/* Contact Form Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mt-16 bg-card/30 backdrop-blur-md border border-white/10 p-8 lg:p-12 rounded-2xl shadow-2xl relative overflow-hidden mb-16"
          >
            {/* Decorative bg */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="text-center mb-10">
              <h2 className="font-heading text-2xl lg:text-3xl mb-3">Send a Message</h2>
              <p className="text-white/50 text-sm">Have a specific question? Write to us directly.</p>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());
                const btn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
                const originalText = btn.innerText;

                try {
                  btn.disabled = true;
                  btn.innerText = "Sending...";

                  const res = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                  });

                  if (res.ok) {
                    alert('Message sent successfully! Pandit Ji will reply soon.');
                    form.reset();
                  } else {
                    const err = await res.json();
                    alert(err.error || 'Failed to send message.');
                  }
                } catch (err) {
                  console.error(err);
                  alert('Something went wrong. Please try again.');
                } finally {
                  btn.disabled = false;
                  btn.innerText = originalText;
                }
              }}
              className="space-y-6 relative z-10"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/40 mb-2">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary/50 focus:outline-none transition-colors"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/40 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary/50 focus:outline-none transition-colors"
                    placeholder="Example: 98765 43210"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-white/40 mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary/50 focus:outline-none transition-colors"
                  placeholder="name@example.com"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-white/40 mb-2">Subject</label>
                <input
                  type="text"
                  name="subject"
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary/50 focus:outline-none transition-colors"
                  placeholder="What is this regarding?"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-white/40 mb-2">Your Message</label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary/50 focus:outline-none transition-colors resize-none"
                  placeholder="Type your message here..."
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full btn-divine-primary py-4 text-black font-bold text-sm tracking-widest uppercase rounded-lg hover:scale-[1.01] active:scale-[0.99] transition-all"
                >
                  Send Message
                </button>
              </div>
            </form>
          </motion.div>

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
