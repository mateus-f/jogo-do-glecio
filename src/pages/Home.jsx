import { AnimatePresence, motion } from "framer-motion";
import { Info, LogOut, Trophy, UserRoundPen } from "lucide-react";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { HiOutlinePlay, HiStar } from "react-icons/hi2";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { Link, useLocation, useNavigate } from "react-router";
import { fade } from "../animations/pageAnimations";
import ButtonPrimary from "../components/buttons/ButtonPrimary";
import ButtonSuccess from "../components/buttons/ButtonSuccess";
import ButtonSupport from "../components/buttons/ButtonSupport";
import RankingList from "../components/RankingList";
import { logoutUser } from "../services/authService";
import { getUser } from "../services/userService";
import { isTokenExpiringSoon } from "../utils/authUtils";
import { getLocalUserInfo } from "../utils/userUtils";
import { Howler } from "howler";
import Cookies from "js-cookie";

function Home() {
    document.title = "Início · Jogo do Glécio";

    const navigate = useNavigate();
    const location = useLocation();

    const [userInfo, setUserInfo] = useState({});
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);

    const [mobileDropDown, setMobileDropDown] = useState(false);

    useEffect(() => {
        const token = Cookies.get("token");

        if (!token || isTokenExpiringSoon(token)) {
            Cookies.remove("token");
            navigate("/login", { replace: true });
        }
    }, [navigate]);

    useEffect(() => {
        const info = getLocalUserInfo();
        setUserInfo(info);

        // Verificar última execução
        const lastCall = localStorage.getItem("lastGetUserCall");
        const now = Date.now();

        if (!lastCall || now - parseInt(lastCall) > 10 * 60 * 1000) {
            // 10 minutos = 10 * 60 * 1000ms
            getUser(info.id).then(() => {
                // Atualiza timestamp da última execução
                console.info("Request user info");
                localStorage.setItem("lastGetUserCall", now.toString());
            });
        }

        //esse código acima é de minha autoria (sem o uso de IA)
    }, []);

    useEffect(() => {
        const handleResize = () => {
            const viewportWidth =
                window.visualViewport?.width || window.innerWidth;
            setWindowWidth(viewportWidth);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <>
            <motion.main
                initial="initial"
                animate="animate"
                exit="exit"
                variants={fade()}
                className="flex max-w-6xl gap-6 p-6 md:p-10 lg:gap-24 md:mx-auto"
                onAnimationStart={() => {
                    const viewportWidth =
                        window.visualViewport?.width || window.innerWidth;
                    setWindowWidth(viewportWidth);
                }}
            >
                <div className="relative flex flex-col w-full gap-14 md:gap-32 md:w-1/2 lg:w-2/3">
                    {/* Profile header */}
                    <div className="flex items-center gap-8 md:gap-4 lg:gap-8">
                        {userInfo.avatarDefault ? (
                            <img
                                src={userInfo.avatarDefault}
                                alt={`${userInfo.name ?? "Anônimo"}'s avatar`}
                                className="right-0 z-30 rounded-full w-28 bg-skeletonLoadingBase max-sm:absolute max-sm:w-11 max-sm:top-0 max-sm:cursor-pointer sm:pointer-events-none"
                                onClick={() =>
                                    setMobileDropDown(!mobileDropDown)
                                }
                            />
                        ) : (
                            <SkeletonTheme
                                baseColor="var(--skeleton-loading-base)"
                                highlightColor="var(--skeleton-loading-highlight)"
                            >
                                <Skeleton
                                    circle={true}
                                    className="rounded-full w-28 h-28"
                                />
                            </SkeletonTheme>
                        )}

                        <div className="w-full max-sm:mt-14">
                            <p className="text-base text-purpleGray">
                                Seja bem-vindo(a),
                            </p>
                            <p className="text-3xl font-black leading-8 md:text-4xl text-darkPurple">
                                {userInfo.name ?? "Anônimo"}
                            </p>
                            <div className="flex items-center justify-between mt-3 text-darkGray">
                                <p className="flex items-center gap-1 text-sm">
                                    <HiStar className="w-5 h-5" />
                                    Maior pontuação: {userInfo.maxScore ?? "00"}
                                </p>
                                <div
                                    className={`flex z-30 items-center gap-2 text-purpleGray max-sm:absolute max-sm:w-40 max-sm:bg-white max-sm:shadow-md max-sm:border max-sm:rounded-xl max-sm:flex-col max-sm:items-start top-12 right-1 max-sm:gap-0 max-sm:divide-y-2 max-sm:${
                                        !mobileDropDown && "hidden"
                                    }`}
                                >
                                    <Link
                                        to="/edit-profile"
                                        title="Editar perfil"
                                        className="flex gap-2 max-sm:p-3 max-sm:w-full"
                                    >
                                        <UserRoundPen
                                            strokeWidth={1.8}
                                            className="w-5 h-5 transition-all ease-in-out hover:scale-110"
                                        />
                                        <span className="sm:hidden">
                                            Editar perfil
                                        </span>
                                    </Link>
                                    <span
                                        title="Sair"
                                        className="flex gap-2 cursor-pointer max-sm:p-3 max-sm:w-full"
                                        onClick={logoutUser}
                                    >
                                        <LogOut
                                            strokeWidth={1.8}
                                            className="w-5 h-5 transition-all ease-in-out cursor-pointer hover:scale-110"
                                        />
                                        <span className="select-none sm:hidden">
                                            Sair
                                        </span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Middle text */}
                    <div className="flex flex-col gap-5 md:gap-3">
                        <h1 className="text-4xl font-black leading-8 text-darkPurple">
                            Tabuada do Glécio
                        </h1>
                        <p className="text-base text-purpleGray">
                            Aprimore suas habilidades com nosso jogo de tabuada!
                            Teste seus conhecimentos, avance nos desafios e
                            aprenda de forma divertida. Ficamos muito felizes em
                            ter você aqui!
                        </p>
                        <div className="flex gap-3 max-sm:flex-col">
                            <ButtonSuccess
                                onClick={() => {
                                    if (
                                        Howler.ctx &&
                                        Howler.ctx.state === "suspended"
                                    ) {
                                        Howler.ctx.resume();
                                    }
                                    navigate("/play");
                                }}
                                invertedContent={true}
                            >
                                <HiOutlinePlay className="w-6 h-6" />
                                Jogar agora!
                            </ButtonSuccess>
                            {windowWidth < 768 && (
                                <Link to="/ranking" className="w-full">
                                    <ButtonSupport invertedContent={true}>
                                        <Trophy
                                            className="w-6 h-6"
                                            strokeWidth={1.5}
                                        />
                                        Ranking
                                    </ButtonSupport>
                                </Link>
                            )}
                            <Link to="/about" className="w-full">
                                <ButtonPrimary invertedContent={true}>
                                    <Info
                                        className="w-6 h-6"
                                        strokeWidth={1.6}
                                    />{" "}
                                    Saiba mais
                                </ButtonPrimary>
                            </Link>
                        </div>
                    </div>
                </div>
                {windowWidth >= 768 && <RankingList />}
            </motion.main>
            <AnimatePresence mode="wait">
                {mobileDropDown && (
                    <motion.div
                        className="absolute inset-0 z-0 w-screen h-screen backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.1 }}
                    />
                )}
            </AnimatePresence>
            {location.state?.newUser && (
                <Confetti
                    width={windowWidth}
                    height={windowHeight}
                    recycle={false}
                    numberOfPieces={280}
                    style={{
                        zIndex: 50,
                    }}
                />
            )}
        </>
    );
}

export default Home;
