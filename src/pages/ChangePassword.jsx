import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { fade, scrollFromLeft } from "../animations/pageAnimations";
import ButtonPageBack from "../components/buttons/ButtonPageBack";
import ButtonSuccess from "../components/buttons/ButtonSuccess";
import Input from "../components/Input";
import { updateUserPassword } from "../services/userService";

function ChangePassword() {
    document.title = "Alterar senha · Jogo do Glécio"

    const navigate = useNavigate();

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const [buttonIsLoading, setButtonIsLoading] = useState(false);
    const [inputError, setInputError] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        setButtonIsLoading(true);

        try {
            if (newPassword.length < 4) {
                const error = new Error(
                    "A nova senha deve conter no mínimo 4 caracteres."
                );
                error.statusCode = 406;

                throw error;
            }

            const response = await updateUserPassword({
                old_password: oldPassword,
                new_password: newPassword,
            });

            if (response.status_code === 200) {
                navigate("/edit-profile", { replace: true });

                toast.success(response.message, { className: "bg-surface" });
            }
        } catch (error) {
            const statusCode = error?.statusCode;

            if (statusCode === 401) {
                setInputError({
                    statusCode: 401,
                    message: error.message,
                });
            } else if (statusCode === 406) {
                setInputError({
                    statusCode: 406,
                    message: error.message,
                });
            } else {
                toast.error(error.message || "Erro ao alterar senha", {
                    className: "bg-surface",
                });
            }
        }

        setButtonIsLoading(false);
    };

    return (
        <motion.div
            variants={fade}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col h-screen"
        >
            <ButtonPageBack to="/edit-profile" replace={true} absolute={true}>
                Retornar
            </ButtonPageBack>
            <div className="flex items-center justify-center flex-grow max-sm:items-start max-sm:mt-24">
                <main className="max-w-sm max-[405px]:max-w-[86%] max-sm:p-4 p-8 rounded-lg sm:border-2 border-borderColor sm:bg-surface w-full sm:drop-shadow-lg">
                    <div className="space-y-2">
                        <p className="text-4xl font-black text-darkPurple">
                            Altere sua senha
                        </p>
                        <p className="text-purpleGray">
                            Digite sua senha antiga e sua nova senha para
                            alterá-la.
                        </p>
                    </div>
                    <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                        <Input
                            label="Senha atual"
                            type="old_password"
                            name="old_password"
                            required={true}
                            error={
                                inputError.statusCode === 401
                                    ? inputError.message
                                    : null
                            }
                            onChange={(e) => setOldPassword(e.target.value)}
                        />
                        <Input
                            label="Nova senha"
                            type="new_password"
                            name="new_password"
                            required={true}
                            error={
                                inputError.statusCode === 406
                                    ? inputError.message
                                    : null
                            }
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <ButtonSuccess isLoading={buttonIsLoading}>
                            Confirmar
                        </ButtonSuccess>
                    </form>
                </main>
            </div>
        </motion.div>
    );
}
export default ChangePassword;
