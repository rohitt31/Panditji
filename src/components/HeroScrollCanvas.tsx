import { useEffect, useRef, useState, useCallback } from "react";

const TOTAL_FRAMES = 192;
const FRAME_STEP = 3;  // Use every 3rd frame for ultra-lightweight scrolling (64 frames)
const FRAME_COUNT = Math.ceil(TOTAL_FRAMES / FRAME_STEP); // = 64 frames

interface HeroScrollCanvasProps {
    scrollHeight?: number;
}

const HeroScrollCanvas = ({ scrollHeight = 2.5 }: HeroScrollCanvasProps) => { // Reduced scroll height even more
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const imagesRef = useRef<HTMLImageElement[]>([]);
    const currentFrameRef = useRef(0);
    const rafRef = useRef<number>(0);
    const [isLoading, setIsLoading] = useState(true);
    const [loadProgress, setLoadProgress] = useState(0);

    // Optimized image preloading
    useEffect(() => {
        let loadedCount = 0;
        const images: HTMLImageElement[] = new Array(FRAME_COUNT);
        let cancelled = false;

        const loadImage = (index: number): Promise<void> => {
            return new Promise((resolve) => {
                const actualIndex = index * FRAME_STEP;
                const frameNum = String(actualIndex).padStart(3, "0");
                const img = new Image();

                // Simple fallback logic
                const tryLoad = (suffixes: string[]) => {
                    if (suffixes.length === 0) {
                        resolve();
                        return;
                    }
                    img.src = `/hero-frames/frame_${frameNum}_delay-${suffixes[0]}.webp`;
                    img.onload = () => {
                        if (!cancelled) {
                            images[index] = img;
                            loadedCount++;
                            setLoadProgress(Math.round((loadedCount / FRAME_COUNT) * 100));
                        }
                        resolve();
                    };
                    img.onerror = () => tryLoad(suffixes.slice(1));
                };

                tryLoad(["0.04s", "0.05s"]);
            });
        };

        const loadAllImages = async () => {
            // Load key frames first (0, 10, 20...) for quicker initial render feeling
            await loadImage(0);
            if (!cancelled && images[0]) {
                imagesRef.current = images;
            }

            // Load the rest in chunks to not block main thread
            const batchSize = 8;
            for (let i = 1; i < FRAME_COUNT; i += batchSize) {
                if (cancelled) return;
                const batchPromises = [];
                for (let j = i; j < Math.min(i + batchSize, FRAME_COUNT); j++) {
                    batchPromises.push(loadImage(j));
                }
                await Promise.all(batchPromises);
                // Tiny yield to keep UI responsive
                await new Promise(r => setTimeout(r, 0));
            }

            if (!cancelled) {
                imagesRef.current = images;
                setIsLoading(false);
            }
        };

        loadAllImages();

        return () => {
            cancelled = true;
        };
    }, []);

    // Draw frame on canvas with high-performance cover logic
    const drawFrame = useCallback((frameIndex: number) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d", { alpha: false }); // Disable alpha for perf
        const img = imagesRef.current[frameIndex];

        if (!canvas || !ctx || !img || !containerRef.current) return;

        const dpr = window.devicePixelRatio || 1;
        const width = containerRef.current.clientWidth;
        const height = window.innerHeight; // Keep height full viewport

        // Resize only if needed
        if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
            canvas.width = width * dpr;
            canvas.height = height * dpr;

            canvas.style.width = `100%`;
            canvas.style.height = `100%`;
            ctx.scale(dpr, dpr);
        }

        const imgRatio = img.naturalWidth / img.naturalHeight;
        const canvasRatio = width / height;

        let drawWidth, drawHeight, offsetX, offsetY;

        if (canvasRatio > imgRatio) {
            drawWidth = width;
            drawHeight = width / imgRatio;
            offsetX = 0;
            offsetY = (height - drawHeight) / 2;
        } else {
            drawHeight = height;
            drawWidth = height * imgRatio;
            offsetX = (width - drawWidth) / 2;
            offsetY = 0;
        }

        // Use fast clearing
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    }, []);

    // Scroll handling decoupled from frame rate
    useEffect(() => {
        if (isLoading && !imagesRef.current[0]) return;

        drawFrame(0);

        const handleScroll = () => {
            if (!containerRef.current) return;

            // Use requestAnimationFrame for smooth visuals
            if (rafRef.current) cancelAnimationFrame(rafRef.current);

            rafRef.current = requestAnimationFrame(() => {
                const container = containerRef.current;
                if (!container) return;

                const rect = container.getBoundingClientRect();
                const scrollableHeight = rect.height - window.innerHeight;

                // If rect.top is > 0, we haven't started scrolling into it (pinned)
                // If rect.top is < -scrollableHeight, we passed it
                const scrolled = -rect.top;

                // Clamp progress
                const rawProgress = scrolled / scrollableHeight;
                const progress = Math.max(0, Math.min(1, rawProgress));

                const frameIndex = Math.min(
                    FRAME_COUNT - 1,
                    Math.floor(progress * FRAME_COUNT)
                );

                if (frameIndex !== currentFrameRef.current && imagesRef.current[frameIndex]) {
                    currentFrameRef.current = frameIndex;
                    drawFrame(frameIndex);
                }
            });
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("resize", () => drawFrame(currentFrameRef.current));

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", () => drawFrame(currentFrameRef.current));
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [isLoading, drawFrame]);

    return (
        <div
            ref={containerRef}
            className="relative"
            style={{ height: `${scrollHeight * 100}vh` }}
        >
            <div className="sticky top-0 w-full h-screen overflow-hidden bg-background">
                {isLoading && (
                    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background text-primary">
                        <div className="text-4xl animate-pulse mb-4">ॐ</div>
                        <div className="w-32 h-1 bg-muted rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary transition-all duration-300"
                                style={{ width: `${loadProgress}%` }}
                            />
                        </div>
                    </div>
                )}

                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Gradient Overlays */}
                {!isLoading && (
                    <>
                        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />
                        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background/40 to-transparent pointer-events-none" />
                    </>
                )}
            </div>
        </div>
    );
};

export default HeroScrollCanvas;
