import { createContext, useContext, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlarmClock } from "lucide-react";

const OverlayContext = createContext();

export const TimerOverlayProvider = ({ children }) => {
    const [showOverlay, setShowOverlay] = useState(false);

    const showTimerOverlay = () => setShowOverlay(true);
    const hideTimerOverlay = () => setShowOverlay(false);

    const fade = () => ({
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
    });

    return (
        <OverlayContext.Provider value={{ showTimerOverlay, hideTimerOverlay }}>
            {children}
            <AnimatePresence mode="wait">
                {showOverlay && (
                    <motion.section
                        variants={fade}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 bg-black/80 text-surface flex items-center justify-center z-50"
                    >
                        <div className="flex flex-col items-center">
                            <AlarmClock className="w-10 h-10 animate-tilt-shaking" />
                            <span className="text-surface dark:text-purpleDarkGray text-4xl font-black">
                                Seu tempo acabou!
                            </span>
                        </div>
                    </motion.section>
                )}
            </AnimatePresence>
        </OverlayContext.Provider>
    );
};

export const useOverlay = () => useContext(OverlayContext);
