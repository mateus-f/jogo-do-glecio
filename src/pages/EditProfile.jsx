import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { scrollFromRight } from "../animations/pageAnimations";
import ButtonPageBack from "../components/buttons/ButtonPageBack";
import ButtonSuccess from "../components/buttons/ButtonSuccess";
import Input from "../components/Input";
import Select from "../components/Select";
import AvatarSelector from "../components/AvatarSelector";
import {
    getAvatarsList,
    getCoursesList,
    updateUser,
} from "../services/userService";
import { getLocalUserInfo } from "../utils/userUtils";
import { SquareArrowOutUpRight } from "lucide-react";
import { Link } from "react-router";

function EditProfile() {
    document.title = "Editar perfil · Jogo do Glécio";

    const [userInfo, setUserInfo] = useState({});

    const [avatarsList, setAvatarsList] = useState([]);
    const [coursesList, setCoursesList] = useState([]);
    const [buttonIsLoading, setButtonIsLoading] = useState(false);

    const [userData, setUserData] = useState({
        avatar_id: 1,
        name: "",
        course_id: 1,
    });

    useEffect(() => {
        const info = getLocalUserInfo();
        setUserInfo(info);

        // Atualiza userData com os dados obtidos do usuário
        setUserData((prev) => ({
            ...prev,
            name: info.name || "",
            avatar_id: Number(info.avatarId) || 1,
            course_id: Number(info.courseId) || 1,
        }));
    }, []);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const courses = await getCoursesList();
                setCoursesList(courses);
            } catch (error) {
                toast.error(
                    error.message ||
                        "Ocorreu um erro ao carregar a lista de cursos",
                    {
                        className: "bg-surface",
                    }
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
                    }
                );
            }
        };

        fetchCourses();
        fetchAvatars();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setButtonIsLoading(true);

        try {
            const response = await updateUser(userData);
            if (response.status_code === 200) {
                toast.success(response.message, { className: "bg-surface" });
            }
        } catch (error) {
            toast.error(
                error.message ||
                    "Ocorreu um erro ao atualizar suas informações. Tente novamente mais tarde.",
                {
                    className: "bg-surface",
                }
            );
        }

        setButtonIsLoading(false);
    };

    /** PERGUNTA: COMO SERÁ A SELEÇÃO DE AVATAR NESTA PÁGINA ????????? */

    return (
        <motion.div
            variants={scrollFromRight()}
            initial="initial"
            animate="animate"
            exit="exit"
        >
            <ButtonPageBack to={-1} replace={true} absolute={true}>
                Retornar
            </ButtonPageBack>
            <main className="flex flex-col max-w-2xl gap-6 p-6 pt-24 lg:gap-16 sm:mx-auto">
                <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                    {/*<img
                        src={userInfo.avatarDefault}
                        alt={`${userInfo.name ?? "Anônimo"}'s avatar`}
                        className="rounded-full w-28 bg-skeletonLoadingBase"
                    />*/}
                    <AvatarSelector
                        label="Avatar"
                        avatarsList={avatarsList}
                        selectedAvatarIndex={userData.avatar_id}
                        onSelect={(avatarId) =>
                            setUserData((prev) => ({
                                ...prev,
                                avatar_id: avatarId,
                            }))
                        }
                    />

                    <Input
                        label="Nome"
                        name="name"
                        type="text"
                        value={userData.name}
                        onChange={(e) => {
                            setUserData((prev) => ({
                                ...prev,
                                name: e.target.value,
                            }));
                        }}
                    />

                    <Select
                        label="Turma"
                        name="courses"
                        values={coursesList}
                        selectedValue={userData.course_id}
                        onSelect={(courseId) => {
                            setUserData((prev) => ({
                                ...prev,
                                course_id: courseId,
                            }));
                        }}
                    />

                    <Link to="/edit-profile/password" className="text-darkPurple flex gap-2 items-center p-3 bg-surface border border-darkPurple rounded-lg justify-between">
                        Alterar sua senha
                        <SquareArrowOutUpRight
                            className="w-5 h-5"
                            strokeWidth={1.8}
                        />
                    </Link>

                    <ButtonSuccess
                        type="submit"
                        isLoading={buttonIsLoading}
                        disabled={
                            userData.name != userInfo.name ||
                            userData.course_id != userInfo.courseId ||
                            userData.avatar_id != userInfo.avatarId
                                ? false
                                : true
                        }
                    >
                        Salvar Alterações
                    </ButtonSuccess>
                </form>
            </main>
        </motion.div>
    );
}

export default EditProfile;
