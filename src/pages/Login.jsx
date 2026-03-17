import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { fade } from "../animations/pageAnimations";
import Input from "../components/Input";
import ButtonPrimary from "../components/buttons/ButtonPrimary";
import { loginUser } from "../services/authService";
import Cookies from 'js-cookie';

function Login() {
    document.title = "Login · Jogo do Glécio";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [buttonIsLoading, setButtonIsLoading] = useState(false);

    const [inputError, setInputError] = useState({});

    const navigate = useNavigate();

    useEffect(() => {
        if (Cookies.get("token")) {
            navigate("/", { replace: true });
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setButtonIsLoading(true);

        setInputError({});

        try {
            const response = await loginUser({ email, password });

            if (response.access_token) {
                navigate("/", { replace: true });
            }
        } catch (error) {
            const statusCode = error.statusCode;

            if (statusCode === 404) {
                setInputError({
                    statusCode: 404,
                    message: error.message,
                });
            } else if (statusCode === 401) {
                setInputError({
                    statusCode: 401,
                    message: error.message,
                });
            } else {
                toast.error(error.message || "Erro ao fazer login", {
                    className: "bg-surface",
                });
            }
        }

        setButtonIsLoading(false);
    };

    return (
        <>
            <motion.div
                className="flex"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={fade()}
            >
                <main className="flex items-center justify-center w-1/2 h-screen max-sm:w-full max-sm:items-start">
                    <div className="w-full max-w-md p-8 space-y-16 max-sm:space-y-8">
                        <div className="flex flex-col gap-1">
                            <p className="text-4xl font-black text-transparent bg-gradient-to-b from-darkPurple to-purpleSecondary bg-clip-text">
                                Bem-vindo de volta
                            </p>
                            <span className="text-purpleDarkGray">
                                Por favor, insira suas credenciais.
                            </span>
                        </div>
                        <form className="space-y-12" onSubmit={handleSubmit}>
                            <div className="space-y-3">
                                <Input
                                    label="E-mail"
                                    type="email"
                                    name="email"
                                    required={true}
                                    maxLength={50}
                                    error={
                                        inputError.statusCode === 404
                                            ? inputError.message
                                            : null
                                    }
                                    placeholder="Insira seu email"
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <Input
                                    label="Senha"
                                    type="password"
                                    name="password"
                                    error={
                                        inputError.statusCode === 401
                                            ? inputError.message
                                            : null
                                    }
                                    maxLength={255}
                                    placeholder="Insira sua senha"
                                    required={true}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <ButtonPrimary
                                    type="submit"
                                    isLoading={buttonIsLoading}
                                >
                                    Acessar
                                </ButtonPrimary>
                                <Link
                                    to="/forgot-password"
                                    className="self-end text-sm text-purpleDarkGray"
                                >
                                    Esqueceu sua senha?
                                </Link>
                            </div>
                        </form>
                        <span className="block mt-4 text-center text-purpleDarkGray">
                            Não possui um perfil?{" "}
                            <Link
                                to="/register"
                                className="font-medium text-darkPurple"
                            >
                                Crie aqui.
                            </Link>
                        </span>
                    </div>
                </main>

                <div className="w-1/2 h-screen max-sm:hidden bg-gradient-to-b from-darkPurple to-purple"></div>
            </motion.div>
        </>
    );
}

export default Login;
