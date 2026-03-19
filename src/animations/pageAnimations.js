const screenSize = window.innerWidth;

export const scrollFromRight = {
    initial: { x: "100vw", opacity: 0 },
    animate: {
        x: 0,
        opacity: 1,
        transition: {
            duration: screenSize < 980 ? 0.28 : 0.5,
            ease: "easeInOut",
        },
        overflow: "hidden",
        onComplete: () => {
            document.body.classList.remove("no-scroll");
        },
    },
    exit: {
        x: "100vw",
        opacity: 0,
        transition: { duration: 0.26, ease: "easeInOut" },
    },
};

export const scrollFromLeft = {
    initial: { x: "-100vw", opacity: 0 },
    animate: {
        x: 0,
        opacity: 1,
        transition: {
            duration: screenSize < 980 ? 0.3 : 0.5,
            ease: "easeInOut",
        },
    },
    exit: {
        x: "-100vw",
        opacity: 0,
        transition: { duration: 0.26, ease: "easeInOut" },
    },
};

export default fade = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: {
        opacity: 0,
        transition: { duration: 0.3, ease: "easeInOut" },
    },
};

export const modalScale = {
    initial: {
        opacity: 0,
        scale: 0.8,
        y: 20,
    },
    animate: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            type: "spring",
            damping: 25,
            stiffness: 400,
        },
    },
    exit: {
        opacity: 0,
        scale: 0.8,
        y: 20,
        transition: { duration: 0.2, ease: "easeIn" },
    },
};
