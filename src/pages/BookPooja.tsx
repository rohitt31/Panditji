import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";



const ritualTypes = [
  "Griha Pravesh Pooja",
  "Satyanarayan Katha",
  "Vivah Sanskar",
  "Astrology Consultation",
  "Rudrabhishek",
  "Mundan Sanskar",
  "Naamkaran Sanskar",
  "Pitra Dosh Pooja",
  "Sunderkand Path",
  "Ganga Aarti Reservation",
  "Others",
];

const BookPooja = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    ritual: "",
    date: "",
    location: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      name: form.name,
      phone: form.phone,
      email: form.email,
      service: form.ritual,
      date: form.date,
      location: form.location,
      message: form.message,
      status: "Pending"
    };

    try {
      const res = await fetch("/api/bookings/public", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Failed to submit");

      toast({
        title: "Request Received 🙏",
        description: "Pandit Ji will get back to you soon. Har Har Mahadev!",
      });
      setForm({
        name: "",
        phone: "",
        email: "",
        ritual: "",
        date: "",
        location: "",
        message: "",
      });
    } catch (err) {
      toast({
        title: "Something went wrong",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-muted/30 border border-border/50 text-foreground text-sm px-4 py-3 focus:outline-none focus:border-primary/50 transition-colors placeholder:text-muted-foreground/50 font-body";

  return (
    <Layout>
      <section className="py-24 lg:py-32 bg-cosmic-radial">
        <div className="container mx-auto px-4 lg:px-8 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <p className="font-serif italic text-primary/70 text-sm mb-3 tracking-wider">
              Begin Your Sacred Journey
            </p>
            <h1 className="font-heading text-4xl lg:text-5xl text-foreground mb-4">
              Book a <span className="text-gradient-gold">Pooja</span>
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Fill in your details below and Pandit Ji will personally connect with you
              to discuss your ceremony.
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="bg-card/30 border border-border/30 p-8 lg:p-12 space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs text-muted-foreground tracking-wider uppercase mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground tracking-wider uppercase mb-2">
                  Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+91 XXXXX XXXXX"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-muted-foreground tracking-wider uppercase mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs text-muted-foreground tracking-wider uppercase mb-2">
                Type of Ritual *
              </label>
              <div className="relative">
                <select
                  name="ritual"
                  required
                  value={form.ritual}
                  onChange={handleChange}
                  className="w-full appearance-none bg-muted/30 border border-border/50 text-foreground text-sm px-4 py-3 pr-10 rounded-md focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors cursor-pointer font-body"
                >
                  <option value="" disabled className="bg-popover text-muted-foreground">Select a ritual</option>
                  {ritualTypes.map((r) => (
                    <option key={r} value={r} className="bg-popover text-popover-foreground py-2">
                      {r}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-muted-foreground">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs text-muted-foreground tracking-wider uppercase mb-2">
                  Preferred Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground tracking-wider uppercase mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="City, Country"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-muted-foreground tracking-wider uppercase mb-2">
                Message
              </label>
              <textarea
                name="message"
                rows={4}
                value={form.message}
                onChange={handleChange}
                placeholder="Any specific details about the ceremony..."
                className={inputClass + " resize-none"}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-4 font-heading text-xs tracking-widest uppercase hover:bg-primary/90 transition-all duration-300 glow-saffron disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {loading ? "Submitting..." : "Submit Booking Request"}
            </button>

            <p className="text-center text-xs text-muted-foreground/60">
              We respect your privacy. Your information is kept confidential.
            </p>
          </motion.form>
        </div>
      </section>
    </Layout>
  );
};

export default BookPooja;
