import { useLocation, Link } from "react-router";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { useEffect, useState, useRef } from "react";
import { getLocalUserInfo } from "../utils/userUtils";
import { scrollFromRight } from "../animations/pageAnimations";
import { useOverlay } from "../contexts/TimerOverlayProvider";
import ButtonPageBack from "../components/buttons/ButtonPageBack";
import { HiStar } from "react-icons/hi";
import { Trophy, RefreshCcw } from "lucide-react";
import ButtonSupport from "../components/buttons/ButtonSupport";
import ButtonSuccess from "../components/buttons/ButtonSuccess";

import greenHappyFace from "../assets/images/elements/green-happy-face.svg";
import redSadFace from "../assets/images/elements/red-sad-face.svg";
import victorySoundEffect from "../assets/sounds/victory.mp3";

function Result() {
    document.title = "Resultados · Jogo do Glécio";

    const location = useLocation();

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);

    const [userInfo, setUserInfo] = useState({});

    const { hideTimerOverlay } = useOverlay();

    const victorySound = useRef(
        new Howl({
            src: [victorySoundEffect],
            volume: 0.4,
        }),
    );

    useEffect(() => {
        const info = getLocalUserInfo();
        setUserInfo(info);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            hideTimerOverlay();
        }, 1000);

        return () => clearTimeout(timer);
    }, [hideTimerOverlay]);

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

    useEffect(() => {
        if (location.state?.showConfetti) {
            victorySound.current.play();
        }
    }, []);

    return (
        <>
            <motion.div
                variants={scrollFromRight()}
                initial="initial"
                animate="animate"
                exit="exit"
            >
                <ButtonPageBack to="/" replace={true} absolute={true}>
                    Tela inicial
                </ButtonPageBack>
                <main className="md:content-center h-screen max-w-4xl p-6 pt-20 mx-auto space-y-8 gap-14 items-center">
                    <h2 className="mb-2 text-4xl font-black leading-8 text-center text-darkPurple">
                        Tempo Esgotado!
                    </h2>
                    <div className="flex items-center justify-center gap-10">
                        <div className="flex items-center gap-2">
                            <img
                                src={greenHappyFace}
                                alt={`${greenHappyFace}'s image`}
                                className="pointer-events-none select-none h-[100px] max-sm:h-20 max-[580px]:h-16"
                            />
                            <div className="flex flex-col">
                                <span className="text-greenColor font-extrabold text-4xl leading-6 max-[580px]:text-xl max-[580px]:leading-3">
                                    {location.state?.correctAnswers ?? "0"}
                                </span>
                                <span className="font-medium text-darkGray text-xl max-[580px]:text-base">
                                    Acertos
                                </span>
                            </div>
                        </div>
                        <span className="w-[2px] h-20 bg-grayColor rounded-full"></span>
                        <div className="flex items-center gap-2">
                            <img
                                src={redSadFace}
                                alt={`${redSadFace}'s image`}
                                className="pointer-events-none select-none h-[100px] max-sm:h-20 max-[580px]:h-16"
                            />
                            <div className="flex flex-col">
                                <span className="text-redColor font-extrabold text-4xl leading-6 max-[580px]:text-xl max-[580px]:leading-3">
                                    {location.state?.wrongAnswers ?? "0"}
                                </span>
                                <span className="font-medium text-darkGray text-lg max-[580px]:text-base">
                                    Erros
                                </span>
                            </div>
                        </div>
                    </div>
                    <p className="flex items-center justify-center gap-1 text-lg text-darkGray">
                        <HiStar className="w-6 h-6" />
                        Maior pontuação: {localStorage.getItem("MAX_SCORE")}
                    </p>
                    <div className="flex gap-2 w-full justify-center max-[480px]:flex-col max-[480px]:items-center">
                        <Link
                            to={windowWidth < 768 ? "/ranking" : "/"}
                            className="md:max-w-[200px] w-full"
                        >
                            <ButtonSupport>
                                <Trophy className="w-6 h-6" strokeWidth={1.5} />
                                Ranking
                            </ButtonSupport>
                        </Link>
                        <Link
                            to="/play"
                            replace={true}
                            className="md:max-w-[200px] w-full"
                        >
                            <ButtonSuccess>
                                <RefreshCcw strokeWidth={1.5} />
                                Reiniciar
                            </ButtonSuccess>
                        </Link>
                    </div>
                </main>
            </motion.div>

            {location.state?.showConfetti && (
                <Confetti
                    width={windowWidth}
                    height={windowHeight}
                    recycle={false}
                    numberOfPieces={280}
                    style={{
                        zIndex: 20,
                    }}
                />
            )}
        </>
    );
}

export default Result;
