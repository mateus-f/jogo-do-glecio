import { motion } from "framer-motion";
import { X } from "lucide-react";
import { fade } from "../animations/pageAnimations";
import ButtonDanger from "./buttons/ButtonDanger";

function Modal({
    title,
    message,
    onConfirm,
    onCancel,
    confirmText,
    isLoading,
}) {
    return (
        <motion.div
            variants={fade()}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed top-0 left-0 flex items-center justify-center w-screen h-screen px-5 backdrop-blur-sm z-40"
        >
            <div className="flex flex-col p-4 bg-surface border border-borderColor shadow-md rounded-2xl max-w-[380px] min-h-[200px] justify-center">
                <div className="flex flex-col">
                    <h3 className="text-xl font-bold text-purpleGray">
                        <X
                            strokeWidth={1.5}
                            className="ml-auto right-2 transition-all ease-in-out cursor-pointer hover:scale-110"
                            onClick={onCancel}
                        />
                        {title}
                    </h3>
                </div>
                <p className="mt-1">{message}</p>
                <div className="flex mt-4">
                    <ButtonDanger
                        type="button"
                        onClick={onConfirm}
                        isLoading={isLoading}
                    >
                        {confirmText}
                    </ButtonDanger>
                </div>
            </div>
        </motion.div>
    );
}

export default Modal;
