import { motion } from "framer-motion";
import { X } from "lucide-react";
import { fade, modalScale } from "../animations/pageAnimations";
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
            variants={fade}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed inset-0 flex items-center justify-center w-full h-full px-5 backdrop-blur-sm bg-black/40 z-50" // Escureci levemente o fundo para dar mais foco
            onClick={onCancel}
        >
            <motion.div
                variants={modalScale}
                initial="initial"
                animate="animate"
                exit="exit"
                onClick={(e) => e.stopPropagation()}
                className="flex flex-col p-8 bg-surface border border-borderColor shadow-2xl rounded-3xl max-w-[360px] w-full text-center"
            >
                <div className="relative mb-2">
                    <h3 className="text-xl font-bold text-purpleGray tracking-tight px-6">
                        {title}
                    </h3>
                    <button 
                        onClick={onCancel}
                        className="absolute -top-2 -right-2 p-2 hover:bg-black/5 rounded-full transition-colors"
                    >
                        <X strokeWidth={2.5} className="w-5 h-5 text-purpleGray/60" />
                    </button>
                </div>

                <p className="text-bodyColor leading-relaxed opacity-90">
                    {message}
                </p>

                <div className="flex mt-2 w-full">
                    <ButtonDanger
                        type="button"
                        onClick={onConfirm}
                        isLoading={isLoading}
                        className="w-full py-4 text-lg font-bold rounded-2xl" // Botão mais robusto para mobile
                    >
                        {confirmText}
                    </ButtonDanger>
                </div>
            </motion.div>
        </motion.div>
    );
}

export default Modal;