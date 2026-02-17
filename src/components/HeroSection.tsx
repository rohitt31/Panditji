import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import HeroScrollCanvas from "./HeroScrollCanvas";
import FloatingParticles from "./FloatingParticles";
import { useRef, useState } from "react";

const HeroSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(true);

  // Track scroll progress
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Track visibility for conditional rendering
  const [showText, setShowText] = useState(true);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setIsInView(latest < 0.95);
    // Hard hide text after 85% to prevent overlap with next section
    setShowText(latest < 0.85);
  });

  // Fade out text earlier (starts at 50%, completely gone by 80%)
  const textOpacity = useTransform(scrollYProgress, [0.5, 0.8], [1, 0]);
  const textY = useTransform(scrollYProgress, [0.5, 0.8], [0, -50]);

  // Typewriter Variants
  const sentence = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.5,
        staggerChildren: 0.08, // Speed of typing
      },
    },
  };

  const letter = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <section ref={sectionRef} className="relative bg-black transition-colors duration-1000">
      {/* Import Premium Hindi Font */}
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Rozha+One&display=swap');`}
      </style>

      <HeroScrollCanvas scrollHeight={5} />

      {/* Particles */}
      {isInView && (
        <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 10 }}>
          <FloatingParticles count={25} maxSize={3} />
        </div>
      )}

      {/* Top Left Branding - Starts Visible, Fades out at end of scroll */}
      <motion.div
        style={{ opacity: useTransform(scrollYProgress, [0.85, 0.95], [1, 0]) }}
        className="fixed top-4 left-4 lg:top-8 lg:left-10 z-40 pointer-events-none safe-top safe-left"
      >
        <div className="flex flex-col">
          <div className="flex items-center gap-2 lg:gap-3">
            <span className="font-heading text-gold text-2xl lg:text-3xl tracking-wide font-semibold mt-0.5">Hari</span>
            <span className="text-gold text-2xl lg:text-3xl drop-shadow-[0_0_10px_rgba(253,185,49,0.3)]">ॐ</span>
            <span className="font-heading text-white/90 text-2xl lg:text-3xl tracking-wide mt-0.5">Pandit Ji</span>
          </div>
          <span className="text-[10px] lg:text-xs tracking-[0.4em] uppercase text-gold/60 font-body ml-1">
            Vedic Priest
          </span>
        </div>
      </motion.div>

      {/* --- MANTRA LAYERS --- */}
      {showText && (
        <motion.div
          style={{ opacity: textOpacity, y: textY }}
          className="fixed inset-x-0 bottom-[15%] z-20 pointer-events-none container mx-auto px-6 lg:px-16 flex flex-col lg:block items-center lg:items-stretch gap-8 lg:gap-0"
        >

          {/* LEFT MANTRA: Vasudhaiva Kutumbakam */}
          <div className="relative lg:absolute bottom-0 lg:left-16 text-center lg:text-left max-w-[80vw] lg:max-w-sm">
            <motion.h2
              className="text-2xl lg:text-3xl mb-2 lg:mb-3 leading-[1.4] bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#DAA520] bg-clip-text text-transparent opacity-90 drop-shadow-[0_0_15px_rgba(253,185,49,0.2)]"
              style={{ fontFamily: "'Rozha One', serif", fontWeight: 400 }}
              variants={sentence}
              initial="hidden"
              animate="visible"
            >
              {"वसुधैव कुटुम्बकम्".split("").map((char, index) => (
                <motion.span key={index} variants={letter}>
                  {char}
                </motion.span>
              ))}
            </motion.h2>

            <motion.div
              initial={{ width: 0 }} animate={{ width: 40 }} transition={{ delay: 1.5, duration: 1 }}
              className="h-px bg-gradient-to-r from-gold/60 to-transparent mb-2 lg:mb-3 mx-auto lg:mx-0"
            />

            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 1 }}
              className="font-serif italic text-white/50 text-xs lg:text-sm tracking-wide font-light"
            >
              "The whole world is one family."
            </motion.p>
          </div>

          {/* RIGHT MANTRA: Dharmo Rakshati Rakshitah */}
          <div className="relative lg:absolute bottom-0 lg:right-16 text-center lg:text-right max-w-[80vw] lg:max-w-sm flex flex-col items-center lg:items-end">
            <motion.h2
              className="text-2xl lg:text-3xl mb-2 lg:mb-3 leading-[1.4] bg-gradient-to-l from-[#FFD700] via-[#FDB931] to-[#DAA520] bg-clip-text text-transparent opacity-90 drop-shadow-[0_0_15px_rgba(253,185,49,0.2)]"
              style={{ fontFamily: "'Rozha One', serif", fontWeight: 400 }}
              variants={sentence}
              initial="hidden"
              animate="visible"
            >
              {"धर्मो रक्षति रक्षितः".split("").map((char, index) => (
                <motion.span key={index} variants={letter}>
                  {char}
                </motion.span>
              ))}
            </motion.h2>

            <motion.div
              initial={{ width: 0 }} animate={{ width: 40 }} transition={{ delay: 2.5, duration: 1 }}
              className="h-px bg-gradient-to-l from-gold/60 to-transparent mb-2 lg:mb-3"
            />

            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3, duration: 1 }}
              className="font-serif italic text-white/50 text-xs lg:text-sm tracking-wide font-light"
            >
              "Dharma protects those who protect it."
            </motion.p>
          </div>

        </motion.div>
      )}

      {/* Scroll indicator */}
      <motion.div
        style={{ opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]) }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10 pointer-events-none"
      >
        <span className="text-[10px] tracking-[0.3em] uppercase text-gold/50 font-body animate-pulse">
          Scroll
        </span>
        <ChevronDown className="w-4 h-4 text-gold/30 animate-bounce" />
      </motion.div>
    </section>
  );
};

export default HeroSection;
