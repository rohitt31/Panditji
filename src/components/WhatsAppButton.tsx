import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

const WhatsAppButton = () => {
  return (
    <motion.a
      href="https://wa.me/919876543210"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-13 h-13 rounded-full bg-[#25D366] text-white shadow-xl shadow-[#25D366]/20 hover:shadow-[#25D366]/30 transition-shadow duration-300"
      style={{ width: 52, height: 52 }}
    >
      <MessageCircle className="w-5 h-5" />
    </motion.a>
  );
};

export default WhatsAppButton;
