import { useLocation, Link } from "react-router";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { useEffect, useState, useRef } from "react";
import { getLocalUserInfo } from "../utils/userUtils";
import { fade, scrollFromRight } from "../animations/pageAnimations";
import { useOverlay } from "../contexts/TimerOverlayProvider";
import ButtonPageBack from "../components/buttons/ButtonPageBack";
import { HiStar } from "react-icons/hi";
import { Trophy, RefreshCcw } from "lucide-react";
import ButtonSupport from "../components/buttons/ButtonSupport";
import ButtonSuccess from "../components/buttons/ButtonSuccess";
import RankingList from "../components/RankingList";
import CounterAnimation from "../animations/components/CounterAnimation"
import LettersPullUpAnimation from "../animations/components/LettersPullUpAnimation"
import { Howl } from "howler";

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

    const correctAnswers = location.state?.correctAnswers ?? 0;
    const wrongAnswers = location.state?.wrongAnswers ?? 0;
    
    const finalScore = correctAnswers - wrongAnswers;

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
    }, [location.state?.showConfetti]);

    return (
        <>
            <motion.div
                variants={fade}
                initial="initial"
                animate="animate"
                exit="exit"
            >
                <ButtonPageBack to="/" replace={true} absolute={true}>
                    Tela inicial
                </ButtonPageBack>

                <main className="flex max-w-6xl gap-6 p-6 pt-20 md:p-10 lg:gap-24 md:mx-auto md:h-screen items-center">
                    
                    <div className="flex flex-col items-center justify-center w-full gap-8 md:w-1/2 lg:w-2/3">
                        <div className="flex flex-col items-center gap-2">
                            <LettersPullUpAnimation text="Tempo Esgotado!" initialDelay={1} className="mb-2 text-4xl font-black leading-8 text-center text-darkPurple" />
                              
                            
                            {/* Bloco da Pontuação Final em destaque */}
                            <div className="flex flex-col items-center justify-center mt-2 p-6 bg-surface border-2 border-borderColor rounded-2xl w-full max-w-sm shadow-sm">
                                <span className="text-lg font-medium text-darkGray mb-1">
                                    Pontuação Final
                                </span>
                                <CounterAnimation value={finalScore} initialDelay={1} className={`text-6xl font-black ${finalScore < 0 ? 'text-redColor' : 'text-darkPurple'}`} />
                            </div>
                        </div>
                        
                        {/* Detalhamento de Acertos e Erros */}
                        <div className="flex items-center justify-center gap-10">
                            <div className="flex items-center gap-2">
                                <img
                                    src={greenHappyFace}
                                    alt={`${greenHappyFace}'s image`}
                                    className="pointer-events-none select-none h-20 max-sm:h-20 max-[580px]:h-16"
                                />
                                <div className="flex flex-col">
                                    <span className="text-greenColor font-extrabold text-4xl leading-6 max-[580px]:text-xl max-[580px]:leading-3">
                                        {correctAnswers}
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
                                    className="pointer-events-none select-none h-20 max-sm:h-20 max-[580px]:h-16"
                                />
                                <div className="flex flex-col">
                                    <span className="text-redColor font-extrabold text-4xl leading-6 max-[580px]:text-xl max-[580px]:leading-3">
                                        {wrongAnswers}
                                    </span>
                                    <span className="font-medium text-darkGray text-lg max-[580px]:text-base">
                                        Erros
                                    </span>
                                </div>
                            </div>
                        </div>

                        <p className="flex items-center justify-center align-middle gap-1 text-lg text-darkGray">
                            <HiStar className="w-6 h-6 relative bottom-[1px]" />
                            Maior pontuação: {getLocalUserInfo().maxScore || 0}
                        </p>

                        <div className="flex gap-2 w-full justify-center max-[480px]:flex-col max-[480px]:items-center">
                            {windowWidth < 768 && (
                                <Link
                                    to="/ranking"
                                    className="md:max-w-[200px] w-full"
                                >
                                    <ButtonSupport>
                                        <Trophy className="w-6 h-6" strokeWidth={1.5} />
                                        Ranking
                                    </ButtonSupport>
                                </Link>
                            )}
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
                    </div>

                    {windowWidth >= 768 && <RankingList />}
                    
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