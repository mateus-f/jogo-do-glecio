import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { fade } from "../animations/pageAnimations";
import AvatarSelector from "../components/AvatarSelector";
import ButtonPrimary from "../components/buttons/ButtonPrimary";
import Input from "../components/Input";
import Select from "../components/Select";
import { createUser } from "../services/authService";
import { getAvatarsList, getCoursesList } from "../services/userService";
import { toast } from "react-toastify";
import ButtonPageBack from "../components/buttons/ButtonPageBack";
import Cookies from "js-cookie";

function Register() {
    document.title = "Criar perfil · Jogo do Glécio";

    const [avatarsList, setAvatarsList] = useState([]);
    const [coursesList, setCoursesList] = useState([]);

    const [buttonIsLoading, setButtonIsLoading] = useState(false);
    const [inputError, setInputError] = useState({});
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const [userData, setUserData] = useState({
        avatar_id: 1,
        name: null,
        course_id: null,
        email: null,
        password: null,
    });

    const navigate = useNavigate();

    useEffect(() => {
        if (Cookies.get("token")) {
            navigate("/", { replace: true });
        }
    }, [navigate]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const courses = await getCoursesList();
                setCoursesList(courses);

                if (courses.length > 0) {
                    setUserData((prev) => ({
                        ...prev,
                        course_id: courses[0].id,
                    }));
                }
            } catch (error) {
                toast.error(
                    error.message ||
                        "Ocorreu um erro ao carregar a lista de cursos",
                    {
                        className: "bg-surface",
                    },
                );
            }
        };

        const fetchAvatars = async () => {
            try {
                const avatars = await getAvatarsList();
                setAvatarsList(avatars);
            } catch (error) {
                toast.error(
                    error.message || "Ocorreu um erro ao carregar os avatares",
                    {
                        className: "bg-surface",
                    },
                );
            }
        };

        fetchAvatars();
        fetchCourses();
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setButtonIsLoading(true);
        setInputError({});

        try {
            if (userData.password.length < 4) {
                const error = new Error(
                    "A senha deve conter no mínimo 4 caracteres.",
                );
                error.statusCode = 406;

                throw error;
            }

            const response = await createUser(userData);
            console.log(response);

            if (response.access_token) {
                navigate("/", { replace: true, state: { newUser: true } });

                toast.success("Perfil criado com sucesso!", {
                    className: "bg-surface",
                });
            }
        } catch (error) {
            const statusCode = error?.statusCode;

            if (statusCode === 409) {
                console.log("caiu aqui");
                setInputError({
                    statusCode: 409,
                    message: error.message,
                });
            } else if (statusCode === 406) {
                setInputError({
                    statusCode: 406,
                    message: error.message,
                });
            } else {
                toast.error(error.message || "Erro ao criar perfil", {
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
                <div className="w-1/2 h-screen max-sm:hidden bg-gradient-to-b from-darkPurple to-purple"></div>
                <main className="flex items-center justify-center w-1/2 h-screen py-4 overflow-y-auto max-sm:w-full max-sm:items-start max-sm:py-6">
                    <div className="w-full max-w-md px-8 space-y-4 max-sm:space-y-6">
                        <ButtonPageBack
                            to="/login"
                            replace={true}
                            altColor={windowWidth < 640 ? false : true}
                            absolute={windowWidth < 640 ? false : true}
                        >
                            Já possui um perfil?
                        </ButtonPageBack>
                        <div className="flex flex-col gap-1 mb-6">
                            <p className="text-4xl font-black text-transparent bg-gradient-to-b from-darkPurple to-purpleSecondary bg-clip-text">
                                Crie seu perfil
                            </p>
                            <span className="text-purpleDarkGray">
                                Informe os dados abaixo para a criar seu perfil.
                            </span>
                        </div>
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <AvatarSelector
                                label="Escolha um avatar"
                                avatarsList={avatarsList}
                                onSelect={(avatarId) =>
                                    setUserData((prev) => ({
                                        ...prev,
                                        avatar_id: avatarId,
                                    }))
                                }
                            />
                            <Input
                                label="Insira seu nome"
                                name="name"
                                type="text"
                                maxLength={25}
                                placeholder="Glécio Raimundo"
                                required={true}
                                onChange={(e) => {
                                    setUserData((prev) => ({
                                        ...prev,
                                        name: e.target.value,
                                    }));
                                }}
                            />
                            <Select
                                label="Escolha sua turma"
                                name="courses"
                                values={coursesList}
                                selectedValue={
                                    coursesList.length > 0
                                        ? coursesList[0]?.id
                                        : null
                                }
                                onSelect={(avatarId) => {
                                    setUserData((prev) => ({
                                        ...prev,
                                        course_id: avatarId,
                                    }));
                                }}
                            />
                            <Input
                                label="Insira seu e-mail"
                                name="email"
                                type="email"
                                placeholder="glecio@prof.ce.gov.br"
                                maxLength={45}
                                error={
                                    inputError.statusCode === 409
                                        ? inputError.message
                                        : null
                                }
                                required={true}
                                onChange={(e) =>
                                    setUserData((prev) => ({
                                        ...prev,
                                        email: e.target.value,
                                    }))
                                }
                            />
                            <Input
                                label="Crie sua senha"
                                name="password"
                                type="password"
                                maxLength={255}
                                error={
                                    inputError.statusCode === 406
                                        ? inputError.message
                                        : null
                                }
                                required={true}
                                onChange={(e) =>
                                    setUserData((prev) => ({
                                        ...prev,
                                        password: e.target.value,
                                    }))
                                }
                            />
                            <ButtonPrimary
                                disabled={coursesList.length === 0}
                                type="submit"
                                isLoading={buttonIsLoading}
                            >
                                Criar perfil
                            </ButtonPrimary>
                        </form>
                    </div>
                </main>
            </motion.div>
        </>
    );
}

export default Register;
