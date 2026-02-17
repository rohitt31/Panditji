import { useEffect, useRef } from "react";

interface FloatingParticlesProps {
    count?: number;
    color?: string;
    maxSize?: number;
    className?: string;
}

const FloatingParticles = ({
    count = 20,
    color = "38, 72%, 55%",
    maxSize = 3,
    className = "",
}: FloatingParticlesProps) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Clear existing particles
        container.innerHTML = "";

        for (let i = 0; i < count; i++) {
            const particle = document.createElement("div");
            const size = Math.random() * maxSize + 0.5;
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const duration = Math.random() * 12 + 6;
            const delay = Math.random() * 8;
            const opacity = Math.random() * 0.3 + 0.1;

            particle.style.cssText = `
        position: absolute;
        left: ${x}%;
        top: ${y}%;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: hsl(${color} / ${opacity});
        box-shadow: 0 0 ${size * 3}px hsl(${color} / ${opacity * 0.5});
        animation: float-particle ${duration}s ease-in-out ${delay}s infinite;
        pointer-events: none;
      `;

            container.appendChild(particle);
        }

        return () => {
            container.innerHTML = "";
        };
    }, [count, color, maxSize]);

    return (
        <div
            ref={containerRef}
            className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
            style={{ zIndex: 1 }}
            aria-hidden="true"
        />
    );
};

export default FloatingParticles;
