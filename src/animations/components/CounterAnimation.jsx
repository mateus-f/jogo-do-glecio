import { useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

export default function CounterAnimation({ value, className }) {
    const count = useMotionValue(0);

    const rounded = useTransform(count, (latest) => Math.floor(latest));

    useEffect(() => {
        const controls = animate(count, value, {
            duration: 1.5,
            ease: "easeOut",
        });

        return controls.stop;
    }, [value]);

    return <motion.span className={className}>{rounded}</motion.span>;
}
