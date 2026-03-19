"use client";
import { motion, useInView } from "framer-motion";
import * as React from "react";

export default function LettersPullUpAnimation({ text, className = "", initialDelay = 0 } = {}) {
    const splittedText = text.split("");

    const pullupVariant = {
        initial: { y: 10, opacity: 0 },
        animate: (i) => ({
            y: 0,
            opacity: 1,
            transition: {
                delay: initialDelay + i * 0.05,
            },
        }),
    };
    const ref = React.useRef(null);
    const isInView = useInView(ref, { once: true });

    
    return (
        <div className="flex">
            {splittedText.map((current, i) => (
                <motion.div
                    key={i}
                    ref={ref}
                    variants={pullupVariant}
                    initial="initial"
                    animate={isInView ? "animate" : ""}
                    custom={i}
                    className={className}
                >
                    {current == " " ? <span>&nbsp;</span> : current}
                </motion.div>
            ))}
        </div>
    );
}
