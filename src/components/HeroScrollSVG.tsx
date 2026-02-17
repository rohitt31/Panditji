import { useRef, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface HeroScrollSVGProps {
    scrollHeight?: number;
}

// Generate deterministic star positions
const generateStars = (count: number) => {
    const stars: { cx: number; cy: number; r: number; delay: number }[] = [];
    for (let i = 0; i < count; i++) {
        // Use sine-based pseudo-random for deterministic positions
        const seed = i * 7919;
        const cx = ((seed * 13) % 1920);
        const cy = ((seed * 17) % 1080);
        const r = (i % 3 === 0) ? 1.5 : (i % 2 === 0) ? 1 : 0.6;
        const delay = (i % 8) * 0.5;
        stars.push({ cx, cy, r, delay });
    }
    return stars;
};

const HeroScrollSVG = ({ scrollHeight = 3 }: HeroScrollSVGProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const stars = useMemo(() => generateStars(80), []);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });

    // === Scroll-driven transforms ===

    // Stars
    const starsOpacity = useTransform(scrollYProgress, [0, 0.1, 0.7, 0.9], [0.2, 0.8, 0.6, 0]);

    // OM Symbol
    const omScale = useTransform(scrollYProgress, [0, 0.15, 0.5, 0.85], [0.6, 1, 1.4, 1.8]);
    const omOpacity = useTransform(scrollYProgress, [0, 0.1, 0.6, 0.85], [0.3, 1, 0.9, 0]);
    const omGlow = useTransform(scrollYProgress, [0, 0.2, 0.5, 0.8], [0, 20, 40, 10]);

    // Mandala rings
    const ring1Rotate = useTransform(scrollYProgress, [0, 1], [0, 180]);
    const ring2Rotate = useTransform(scrollYProgress, [0, 1], [0, -120]);
    const ring3Rotate = useTransform(scrollYProgress, [0, 1], [0, 90]);
    const ringsOpacity = useTransform(scrollYProgress, [0.05, 0.2, 0.7, 0.88], [0, 1, 0.8, 0]);
    const ring1Scale = useTransform(scrollYProgress, [0.05, 0.3, 0.6], [0.5, 1, 1.15]);
    const ring2Scale = useTransform(scrollYProgress, [0.1, 0.35, 0.65], [0.4, 1, 1.1]);
    const ring3Scale = useTransform(scrollYProgress, [0.15, 0.4, 0.7], [0.3, 1, 1.05]);

    // Energy rays
    const raysOpacity = useTransform(scrollYProgress, [0.15, 0.35, 0.65, 0.85], [0, 0.7, 0.5, 0]);
    const raysScale = useTransform(scrollYProgress, [0.15, 0.5, 0.8], [0.3, 1, 1.3]);
    const raysRotate = useTransform(scrollYProgress, [0, 1], [0, 45]);

    // Trishul
    const trishulOpacity = useTransform(scrollYProgress, [0.3, 0.5, 0.7, 0.88], [0, 0.6, 0.5, 0]);
    const trishulY = useTransform(scrollYProgress, [0.3, 0.55], [60, 0]);
    const trishulScale = useTransform(scrollYProgress, [0.3, 0.55], [0.8, 1]);

    // Lotus petals
    const lotusOpacity = useTransform(scrollYProgress, [0.2, 0.4, 0.7, 0.88], [0, 0.5, 0.4, 0]);
    const lotusScale = useTransform(scrollYProgress, [0.2, 0.5], [0.3, 1]);
    const lotusRotate = useTransform(scrollYProgress, [0, 1], [0, 60]);

    // Central aura glow
    const auraScale = useTransform(scrollYProgress, [0, 0.3, 0.6, 0.85], [0.2, 0.8, 1.2, 1.5]);
    const auraOpacity = useTransform(scrollYProgress, [0, 0.2, 0.6, 0.88], [0, 0.3, 0.15, 0]);

    // Sacred triangle
    const triangleOpacity = useTransform(scrollYProgress, [0.25, 0.45, 0.7, 0.88], [0, 0.5, 0.4, 0]);
    const triangleScale = useTransform(scrollYProgress, [0.25, 0.5], [0.5, 1]);
    const triangleRotate = useTransform(scrollYProgress, [0, 1], [0, -30]);

    // Overall darkening vignette
    const vignetteOpacity = useTransform(scrollYProgress, [0.6, 0.9], [0, 0.7]);

    const goldColor = "hsl(38, 72%, 55%)";
    const goldSoft = "hsl(38, 72%, 55%)";
    const copperColor = "hsl(25, 55%, 45%)";

    return (
        <div
            ref={containerRef}
            className="relative"
            style={{ height: `${scrollHeight * 100}vh` }}
        >
            <div className="sticky top-0 w-full h-screen overflow-hidden bg-background">
                <svg
                    viewBox="0 0 1920 1080"
                    className="absolute inset-0 w-full h-full"
                    preserveAspectRatio="xMidYMid slice"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        {/* Golden radial glow */}
                        <radialGradient id="aura-glow" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor={goldColor} stopOpacity="0.15" />
                            <stop offset="30%" stopColor={goldColor} stopOpacity="0.06" />
                            <stop offset="60%" stopColor={copperColor} stopOpacity="0.02" />
                            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                        </radialGradient>

                        {/* OM glow filter */}
                        <filter id="om-glow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="8" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        {/* Soft glow for rings */}
                        <filter id="ring-glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        {/* Star twinkle filter */}
                        <filter id="star-glow" x="-100%" y="-100%" width="300%" height="300%">
                            <feGaussianBlur stdDeviation="2" />
                        </filter>
                    </defs>

                    {/* ===== LAYER 1: STAR FIELD ===== */}
                    <motion.g style={{ opacity: starsOpacity }}>
                        {stars.map((star, i) => (
                            <circle
                                key={i}
                                cx={star.cx}
                                cy={star.cy}
                                r={star.r}
                                fill={i % 5 === 0 ? goldColor : "hsl(38, 25%, 85%)"}
                                opacity={i % 3 === 0 ? 0.6 : 0.3}
                                className="animate-pulse"
                                style={{ animationDelay: `${star.delay}s`, animationDuration: `${3 + (i % 4)}s` }}
                            />
                        ))}
                        {/* A few brighter accent stars with glow */}
                        {stars.filter((_, i) => i % 12 === 0).map((star, i) => (
                            <circle
                                key={`glow-${i}`}
                                cx={star.cx}
                                cy={star.cy}
                                r={star.r * 4}
                                fill={goldColor}
                                opacity={0.08}
                                filter="url(#star-glow)"
                            />
                        ))}
                    </motion.g>

                    {/* ===== LAYER 2: CENTRAL AURA GLOW ===== */}
                    <motion.ellipse
                        cx="960"
                        cy="540"
                        rx="500"
                        ry="500"
                        fill="url(#aura-glow)"
                        style={{ scale: auraScale, opacity: auraOpacity }}
                    />

                    {/* ===== LAYER 3: ENERGY RAYS ===== */}
                    <motion.g
                        style={{
                            opacity: raysOpacity,
                            scale: raysScale,
                            rotate: raysRotate,
                            originX: "50%",
                            originY: "50%",
                        }}
                    >
                        {Array.from({ length: 12 }).map((_, i) => {
                            const angle = (i * 30) * Math.PI / 180;
                            const x1 = 960 + Math.cos(angle) * 60;
                            const y1 = 540 + Math.sin(angle) * 60;
                            const x2 = 960 + Math.cos(angle) * 450;
                            const y2 = 540 + Math.sin(angle) * 450;
                            return (
                                <line
                                    key={i}
                                    x1={x1}
                                    y1={y1}
                                    x2={x2}
                                    y2={y2}
                                    stroke={i % 2 === 0 ? goldColor : copperColor}
                                    strokeWidth={i % 3 === 0 ? "1.5" : "0.8"}
                                    opacity={i % 2 === 0 ? 0.3 : 0.15}
                                />
                            );
                        })}
                    </motion.g>

                    {/* ===== LAYER 4: SACRED TRIANGLES (Sri Yantra inspired) ===== */}
                    <motion.g
                        style={{
                            opacity: triangleOpacity,
                            scale: triangleScale,
                            rotate: triangleRotate,
                            originX: "50%",
                            originY: "50%",
                        }}
                    >
                        {/* Upward triangle */}
                        <polygon
                            points="960,380 1080,600 840,600"
                            fill="none"
                            stroke={goldColor}
                            strokeWidth="1"
                            opacity="0.35"
                            filter="url(#ring-glow)"
                        />
                        {/* Downward triangle */}
                        <polygon
                            points="960,650 1080,430 840,430"
                            fill="none"
                            stroke={copperColor}
                            strokeWidth="1"
                            opacity="0.25"
                            filter="url(#ring-glow)"
                        />
                    </motion.g>

                    {/* ===== LAYER 5: MANDALA RINGS ===== */}
                    {/* Ring 1 — outer, dashed */}
                    <motion.circle
                        cx="960"
                        cy="540"
                        r="320"
                        fill="none"
                        stroke={goldColor}
                        strokeWidth="0.8"
                        strokeDasharray="8 16 2 16"
                        style={{
                            opacity: ringsOpacity,
                            scale: ring1Scale,
                            rotate: ring1Rotate,
                            originX: "50%",
                            originY: "50%",
                        }}
                        filter="url(#ring-glow)"
                    />

                    {/* Ring 2 — middle, dotted */}
                    <motion.circle
                        cx="960"
                        cy="540"
                        r="220"
                        fill="none"
                        stroke={goldSoft}
                        strokeWidth="1"
                        strokeDasharray="3 12"
                        style={{
                            opacity: ringsOpacity,
                            scale: ring2Scale,
                            rotate: ring2Rotate,
                            originX: "50%",
                            originY: "50%",
                        }}
                        filter="url(#ring-glow)"
                    />

                    {/* Ring 3 — inner, solid thin */}
                    <motion.circle
                        cx="960"
                        cy="540"
                        r="130"
                        fill="none"
                        stroke={goldColor}
                        strokeWidth="0.6"
                        strokeDasharray="4 8 1 8"
                        style={{
                            opacity: ringsOpacity,
                            scale: ring3Scale,
                            rotate: ring3Rotate,
                            originX: "50%",
                            originY: "50%",
                        }}
                    />

                    {/* Small decorative circles at ring intersections */}
                    <motion.g style={{ opacity: ringsOpacity }}>
                        {Array.from({ length: 8 }).map((_, i) => {
                            const angle = (i * 45) * Math.PI / 180;
                            return (
                                <circle
                                    key={i}
                                    cx={960 + Math.cos(angle) * 220}
                                    cy={540 + Math.sin(angle) * 220}
                                    r="3"
                                    fill={goldColor}
                                    opacity="0.4"
                                />
                            );
                        })}
                    </motion.g>

                    {/* ===== LAYER 6: LOTUS PETALS ===== */}
                    <motion.g
                        style={{
                            opacity: lotusOpacity,
                            scale: lotusScale,
                            rotate: lotusRotate,
                            originX: "50%",
                            originY: "50%",
                        }}
                    >
                        {Array.from({ length: 8 }).map((_, i) => {
                            const angle = i * 45;
                            return (
                                <ellipse
                                    key={i}
                                    cx="960"
                                    cy="540"
                                    rx="18"
                                    ry="65"
                                    fill="none"
                                    stroke={goldColor}
                                    strokeWidth="0.7"
                                    opacity="0.3"
                                    transform={`rotate(${angle} 960 540)`}
                                />
                            );
                        })}
                    </motion.g>

                    {/* ===== LAYER 7: TRISHUL SILHOUETTE ===== */}
                    <motion.g
                        style={{
                            opacity: trishulOpacity,
                            y: trishulY,
                            scale: trishulScale,
                            originX: "50%",
                            originY: "50%",
                        }}
                    >
                        {/* Simplified trishul shape */}
                        <g transform="translate(960, 540) scale(0.9)">
                            {/* Center prong */}
                            <line x1="0" y1="80" x2="0" y2="-120" stroke={goldColor} strokeWidth="2" opacity="0.5" />
                            <line x1="0" y1="-120" x2="0" y2="-160" stroke={goldColor} strokeWidth="1.5" opacity="0.4" />
                            {/* Center prong tip */}
                            <path d="M0,-160 L-8,-130 L0,-140 L8,-130 Z" fill={goldColor} opacity="0.35" />
                            {/* Left prong */}
                            <path d="M0,-80 Q-40,-100 -35,-145" fill="none" stroke={goldColor} strokeWidth="1.5" opacity="0.4" />
                            <path d="M-35,-145 L-43,-120 L-32,-132 L-25,-118 Z" fill={goldColor} opacity="0.3" />
                            {/* Right prong */}
                            <path d="M0,-80 Q40,-100 35,-145" fill="none" stroke={goldColor} strokeWidth="1.5" opacity="0.4" />
                            <path d="M35,-145 L43,-120 L32,-132 L25,-118 Z" fill={goldColor} opacity="0.3" />
                            {/* Base circle */}
                            <circle cx="0" cy="80" r="6" fill="none" stroke={goldColor} strokeWidth="1" opacity="0.3" />
                        </g>
                    </motion.g>

                    {/* ===== LAYER 8: OM SYMBOL ===== */}
                    <motion.g
                        style={{
                            scale: omScale,
                            opacity: omOpacity,
                            originX: "50%",
                            originY: "50%",
                        }}
                    >
                        <motion.text
                            x="960"
                            y="558"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill={goldColor}
                            fontSize="120"
                            fontFamily="serif"
                            style={{
                                filter: `drop-shadow(0 0 ${omGlow}px hsl(38, 72%, 55%))`,
                            }}
                        >
                            ॐ
                        </motion.text>
                    </motion.g>
                </svg>

                {/* CSS gradient overlays for depth */}
                {/* Bottom fade */}
                <div
                    className="absolute bottom-0 left-0 right-0 pointer-events-none"
                    style={{
                        height: "45%",
                        background: "linear-gradient(to top, hsl(240 8% 4%) 0%, hsl(240 8% 4% / 0.7) 35%, transparent 100%)",
                    }}
                />
                {/* Top fade for navbar blending */}
                <div
                    className="absolute top-0 left-0 right-0 pointer-events-none"
                    style={{
                        height: "15%",
                        background: "linear-gradient(to bottom, hsl(240 8% 4% / 0.4) 0%, transparent 100%)",
                    }}
                />
                {/* Vignette */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: "radial-gradient(ellipse at center, transparent 35%, hsl(240 8% 4% / 0.5) 100%)",
                    }}
                />
                {/* Darkening overlay for scroll end */}
                <motion.div
                    className="absolute inset-0 pointer-events-none bg-background"
                    style={{ opacity: vignetteOpacity }}
                />
            </div>
        </div>
    );
};

export default HeroScrollSVG;
