import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Lenis from "lenis";

const SmoothScroll = () => {
    const { pathname } = useLocation();
    const lenisRef = useRef<Lenis | null>(null);

    useEffect(() => {
        // Determine if we should be using Lenis based on the path
        // We disable it on admin pages to avoid conflicts with data tables
        const isAdmin = pathname.startsWith("/admin");

        if (isAdmin) {
            // Clean up if we navigate to admin
            if (lenisRef.current) {
                lenisRef.current.destroy();
                lenisRef.current = null;
            }
            return;
        }

        // Initialize Lenis if not already active
        if (!lenisRef.current) {
            const lenis = new Lenis({
                duration: 1.5,
                easing: (t) => 1 - Math.pow(1 - t, 4), // easeOutQuart
                orientation: "vertical",
                gestureOrientation: "vertical",
                smoothWheel: true,
                wheelMultiplier: 1,
                touchMultiplier: 2,
            });
            lenisRef.current = lenis;

            // RAF loop
            let rafId: number;
            const raf = (time: number) => {
                lenis.raf(time);
                rafId = requestAnimationFrame(raf);
            };
            rafId = requestAnimationFrame(raf);

            // Cleanup function specifically for this effect instance
            const cleanup = () => {
                lenis.destroy();
                cancelAnimationFrame(rafId);
                lenisRef.current = null;
            };
            return cleanup;
        }
    }, [pathname.startsWith("/admin")]);

    // Handle scroll reset on route change
    useEffect(() => {
        // Use a small timeout to ensure DOM layout is ready before scrolling
        const timer = setTimeout(() => {
            if (lenisRef.current) {
                lenisRef.current.scrollTo(0, { immediate: true });
            } else {
                window.scrollTo(0, 0);
            }
        }, 0);

        return () => clearTimeout(timer);
    }, [pathname]);

    return null;
};

export default SmoothScroll;
