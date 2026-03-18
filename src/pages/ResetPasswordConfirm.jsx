import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import ButtonSuccess from "../components/buttons/ButtonSuccess";
import ButtonPageBack from "../components/buttons/ButtonPageBack";
import Input from "../components/Input";
import { resetPasswordConfirm } from "../services/authService";
import { isValidJWT } from "../utils/authUtils";

function ResetPasswordConfirm() {
    document.title = "Resetar senha · Jogo do Glécio";

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [buttonIsLoading, setButtonIsLoading] = useState(false);
    const [inputError, setInputError] = useState({});

    const navigate = useNavigate();

    const { token } = useParams();

    useEffect(() => {
        if (!isValidJWT(token)) {
            navigate("/login", { replace: true });
        }
    }, [navigate, token]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setButtonIsLoading(true);

        try {
            if (newPassword !== confirmPassword) {
                const error = new Error("As senhas não correspondem");
                error.statusCode = 406;

                throw error;
            }

            if (newPassword.length < 4) {
                const error = new Error(
                    "A nova senha deve conter no mínimo 4 caracteres."
                );
                error.statusCode = 407;

                throw error;
            }

            const response = await resetPasswordConfirm(token, newPassword);

            if (response.status_code == 200) {
                toast.success(response.message, {
                    className: "bg-surface",
                });

                navigate("/login", { replace: true });
            }
        } catch (error) {
            const statusCode = error?.statusCode;

            if (statusCode === 406) {
                setInputError({
                    statusCode: 406,
                    message: error.message,
                });
            } else if (statusCode === 407) {
                setInputError({
                    statusCode: 407,
                    message: error.message,
                });
            } else {
                toast.error(
                    error.message ||
                        "Erro ao resetar senha. Tente novamente mais tarde.",
                    {
                        className: "bg-surface",
                    }
                );
            }
        }
        setButtonIsLoading(false);
    };

    return (
        <div className="flex flex-col h-screen">
            <ButtonPageBack to="/login" replace={true} absolute={true}>
                Retornar para login
            </ButtonPageBack>
            <div className="flex items-center justify-center flex-grow max-sm:items-start max-sm:mt-24">
                <main className="max-w-sm max-[405px]:max-w-[86%] max-sm:p-4 p-8 rounded-lg sm:border-2 border-borderColor sm:bg-surface w-full sm:drop-shadow-lg">
                    <div className="space-y-2">
                        <p className="text-4xl font-black text-darkPurple">
                            Resete sua senha
                        </p>
                        <p className="text-purpleGray">
                            Digite sua nova senha abaixo para alterá-la. Só não
                            vai esquecer de novo, viu?
                        </p>
                    </div>
                    <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                        <Input
                            label="Nova senha"
                            type="password"
                            name="new_password"
                            required={true}
                            error={
                                inputError.statusCode === 406
                                    ? inputError.message
                                    : inputError.statusCode === 407
                                    ? inputError.message
                                    : null
                            }
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <Input
                            label="Confirmar senha"
                            type="password"
                            name="new_password_confirm"
                            required={true}
                            error={
                                inputError.statusCode === 406
                                    ? inputError.message
                                    : null
                            }
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <ButtonSuccess isLoading={buttonIsLoading}>
                            Confirmar
                        </ButtonSuccess>
                    </form>
                </main>
            </div>
        </div>
    );
}
export default ResetPasswordConfirm;
