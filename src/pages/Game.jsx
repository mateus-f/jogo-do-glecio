import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Delete } from "lucide-react";
import { useEffect, useState } from "react";
import { HiMiniChevronLeft } from "react-icons/hi2";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { fade, scrollFromRight } from "../animations/pageAnimations";
import { getLocalUserInfo, setMaxScore } from "../utils/userUtils";
import Modal from "../components/Modal";
import { useOverlay } from "../contexts/TimerOverlayProvider";
import { setRanking } from "../services/rankingService";
import { Howl } from "howler";
import ContainerFadeAnimation from "../animations/components/ContainerFadeAnimation";

import greenHappyFace from "../assets/images/elements/green-happy-face.svg";
import redSadFace from "../assets/images/elements/red-sad-face.svg";
import correctSound from "../assets/sounds/correct.mp3";
import wrongSound from "../assets/sounds/wrong.mp3";
import timerSound from "../assets/sounds/timer.mp3";
import alarmSound from "../assets/sounds/alarm.mp3";

function Game() {
    document.title = "Tabuada · Jogo do Glécio";

    const [showModal, setShowModal] = useState(false);
    const [showConfettiInResultPage, setShowConfettiInResultPage] =
        useState(false);

    const [progress, setProgress] = useState(100);
    const [isRunning, setIsRunning] = useState(true);

    const navigate = useNavigate();

    const [userResponse, setUserResponse] = useState("");
    const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
    const [wrongAnswersCount, setWrongAnswersCount] = useState(0);
    const [currentMultiplication, setCurrentMultiplication] = useState({
        multiplication: "0 x 0",
    });

    const [timerSoundPlayed, setTimerSoundPlayed] = useState(false);

    const correctSoundEffect = new Howl({
        src: [correctSound],
        volume: 0.5,
    });
    const wrongSoundEffect = new Howl({
        src: [wrongSound],
        volume: 0.5,
    });
    const timerSoundEffect = new Howl({
        src: timerSound,
        volume: 0.8,
    });
    const alarmSoundEffect = new Howl({
        src: alarmSound,
        volume: 0.8,
    });

    const { showTimerOverlay } = useOverlay();

    const handleModalConfirm = () => {
        navigate("/", { replace: true });
    };

    const checkIfUserIsCorrect = () => {
        if (parseInt(userResponse) === currentMultiplication.result) {
            setCorrectAnswersCount((prev) => prev + 1);
            correctSoundEffect.play();
        } else {
            wrongSoundEffect.play();
            if (navigator.vibrate) {
                navigator.vibrate(100);
            }
            setWrongAnswersCount((prev) => prev + 1);
        }

        generateNewMultiplication();
        setUserResponse("");
    };

    const generateNewMultiplication = () => {
        let firstNumber, secondNumber;
        let newMultiplication;

        do {
            firstNumber = Math.floor(Math.random() * 8) + 2;
            secondNumber = Math.floor(Math.random() * 9) + 1;
            newMultiplication = `${firstNumber} x ${secondNumber}`;
        } while (newMultiplication === currentMultiplication?.multiplication);

        setCurrentMultiplication({
            multiplication: newMultiplication,
            result: firstNumber * secondNumber,
        });
    };

    const handleNumericButtonClick = (num) => {
        if (userResponse.length < 4) {
            setUserResponse((prev) => `${prev}${num}`);
        }
    };

    const setRankingScore = async (score) => {
        try {
            score = Math.max(score, 0);
            const response = await setRanking(score);

            if (response.status_code === 201) {
                console.info("Pontos enviados para o ranking");
            }
        } catch (error) {
            toast.error(
                error.message || "Erro ao enviar pontos para o ranking",
                {
                    className: "bg-surface",
                },
            );
        }
    };

    useEffect(() => {
        let timer;

        if (isRunning && !showModal && progress > 0) {
            timer = setInterval(() => {
                setProgress((prev) => Math.max(prev - 1.67, 0));
            }, 1000);
        }

        return () => clearInterval(timer);
    }, [progress, showModal, isRunning]);

    useEffect(() => {
        if (progress === 0) {
            showTimerOverlay();
            alarmSoundEffect.play();

            if (
                correctAnswersCount >
                parseInt(getLocalUserInfo().maxScore || "0")
            ) {
                setMaxScore(correctAnswersCount);
                setShowConfettiInResultPage(true);
            }

            const timer = setTimeout(() => {
                navigate("/results", {
                    state: {
                        correctAnswers: correctAnswersCount,
                        wrongAnswers: wrongAnswersCount,
                        showConfetti: showConfettiInResultPage,
                    },
                });
            }, 1000);

            setRankingScore(correctAnswersCount - wrongAnswersCount);

            return () => clearTimeout(timer);
        }
    }, [
        progress,
        showTimerOverlay,
        correctAnswersCount,
        wrongAnswersCount,
        showConfettiInResultPage,
        navigate,
    ]);

    useEffect(() => {
        if (progress <= 10 && progress > 0 && !timerSoundPlayed) {
            timerSoundEffect.play();
            setTimerSoundPlayed(true);
        }
    }, [progress, timerSoundPlayed]);

    useEffect(() => {
        const handleVisibilityChange = () => {
            setIsRunning(!document.hidden);
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () =>
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange,
            );
    }, []);

    useEffect(() => {
        const handleKeyDown = (e) => {
            const numberKey = parseInt(e.key);

            if (progress != 0) {
                if (!isNaN(numberKey)) {
                    setUserResponse((prev) => `${prev}${numberKey}`);
                }

                if (e.key === "Enter") {
                    checkIfUserIsCorrect();
                }

                if (e.key === "Backspace") {
                    setUserResponse((prev) => prev.slice(0, -1));
                }
            }
        };

        document.body.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.removeEventListener("keydown", handleKeyDown);
        };
    }, [checkIfUserIsCorrect, userResponse, progress]);

    useEffect(() => {
        generateNewMultiplication();
    }, []);

    return (
        <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={fade}
        >
            <span
                onClick={() => setShowModal(true)}
                className="flex cursor-pointer text-darkPurple items-center font-medium absolute top-8 left-14 max-sm:left-4 max-sm:top-4 z-10"
            >
                <HiMiniChevronLeft size={24} />
                Sair
            </span>

            {/* main mantém as classes originais pro desktop. No mobile, usamos min-h-[100dvh] e flex-col para forçar os itens pro fundo */}
            <main className="pt-20 p-6 max-w-6xl mx-auto max-[580px]:pt-16 max-[580px]:p-4 max-[580px]:flex max-[580px]:flex-col max-[580px]:min-h-[100dvh]">
                {/* Barra de progresso */}
                <div className="w-full h-5 mb-20 bg-skeletonLoadingBase rounded-full max-[580px]:mb-4 max-[580px]:shrink-0 overflow-hidden">
                    <div
                        className="h-5 bg-darkPurple rounded-full"
                        style={{
                            width: `${progress}%`,
                            transition: "width 1s linear",
                        }}
                    ></div>
                </div>

                {/* Conteúdo: Mantém justify-between row no desktop, e vira uma coluna que preenche o espaço restante (flex-1) no celular */}
                <div className="flex justify-between gap-10 max-lg:gap-5 max-[580px]:flex-col max-[580px]:flex-1 max-[580px]:gap-2">
                    {/* Multiplicação e acertos/erros */}
                    <div className="flex flex-col justify-between w-[480px] max-[580px]:w-full max-[580px]:flex-1">
                        {/* A Conta: No mobile usamos flex-1 para ela crescer o máximo possível, empurrando Acertos/Erros para baixo */}

                        <div
                            className={`text-[192px] font-black text-darkPurple text-center max-lg:text-[160px] max-[810px]:text-9xl max-sm:text-8xl h-full aling max-[580px]:flex-1 max-[580px]:flex max-[580px]:items-center max-[580px]:justify-center max-[580px]:mb-2 transition-scale duration-150 ease-in-out`}
                        >
                            <ContainerFadeAnimation
                                key={currentMultiplication.multiplication}
                            >
                                <span>
                                    {currentMultiplication.multiplication}
                                </span>
                            </ContainerFadeAnimation>
                        </div>

                        <div className="flex justify-evenly gap-4 max-[580px]:justify-between max-[580px]:pb-2">
                            <div className="flex gap-2 items-center">
                                <img
                                    src={greenHappyFace}
                                    alt={`${greenHappyFace}'s image`}
                                    className="pointer-events-none select-none h-16 max-sm:h-12 max-[580px]:h-10"
                                />
                                <div className="flex flex-col">
                                    <span className="text-greenColor font-extrabold text-2xl leading-4 max-[580px]:text-xl max-[580px]:leading-3">
                                        {correctAnswersCount}
                                    </span>
                                    <span className="font-medium text-darkGray text-lg max-[580px]:text-base">
                                        Acertos
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-2 items-center">
                                <img
                                    src={redSadFace}
                                    alt={`${redSadFace}'s image`}
                                    className="pointer-events-none select-none h-16 max-sm:h-12 max-[580px]:h-10"
                                />
                                <div className="flex flex-col">
                                    <span className="text-redColor font-extrabold text-2xl leading-4 max-[580px]:text-xl max-[580px]:leading-3">
                                        {wrongAnswersCount}
                                    </span>
                                    <span className="font-medium text-darkGray text-lg max-[580px]:text-base">
                                        Erros
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="max-w-[450px] max-[580px]:max-w-full max-[580px]:w-full max-[580px]:pb-6 max-[580px]:shrink-0">
                        <input
                            className="w-full text-lg text-purpleDarkGray bg-surface drop-shadow-md font-medium p-4 border border-grayColor outline-none rounded-xl mb-2 max-[580px]:p-3"
                            disabled
                            type="text"
                            maxLength={3}
                            value={userResponse}
                        />
                        {/* Reduzi o auto-rows no mobile de 9vh para 8.5vh para dar uma margem de segurança contra cortes */}
                        <div className="grid grid-cols-[repeat(3,112px)] auto-rows-[72px] gap-2 max-md:grid-cols-[repeat(3,80px)] max-md:auto-rows-[64px] max-[580px]:grid-cols-[repeat(3,1fr)] max-[580px]:auto-rows-[8.5vh]">
                            {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map(
                                (num) => (
                                    <button
                                        key={num}
                                        className="w-full h-full bg-darkPurple drop-shadow-md rounded-xl text-surface dark:text-purpleDarkGray font-semibold text-4xl shadow-sm md:hover:scale-95 active:scale-90 touch-manipulation select-none transition-all ease-in-out"
                                        onPointerDown={(e) => {
                                            e.preventDefault();
                                            handleNumericButtonClick(num);
                                        }}
                                    >
                                        {num}
                                    </button>
                                ),
                            )}
                            <button
                                className="w-full h-full bg-redColor rounded-xl text-surface dark:text-purpleDarkGray flex items-center justify-center shadow-sm md:hover:scale-95 active:scale-90 touch-manipulation select-none transition-all ease-in-out"
                                onPointerDown={(e) => {
                                    e.preventDefault();
                                    setUserResponse((prev) =>
                                        prev.slice(0, -1),
                                    );
                                }}
                            >
                                <Delete className="w-10 h-10" />
                            </button>
                            <button
                                className="w-full h-full bg-darkPurple rounded-xl text-surface dark:text-purpleDarkGray font-semibold text-4xl shadow-sm md:hover:scale-95 active:scale-90 touch-manipulation select-none transition-all ease-in-out"
                                onPointerDown={(e) => {
                                    e.preventDefault();
                                    handleNumericButtonClick("0");
                                }}
                            >
                                0
                            </button>
                            <button
                                className="w-full h-full bg-greenColor rounded-xl text-surface dark:text-purpleDarkGray flex items-center justify-center shadow-sm hover:scale-95 active:scale-90 touch-manipulation select-none transition-all ease-in-out"
                                onPointerDown={(e) => {
                                    e.preventDefault();
                                    checkIfUserIsCorrect();
                                }}
                            >
                                <ArrowRight className="w-10 h-10" />
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <AnimatePresence mode="wait">
                {showModal && (
                    <Modal
                        title="Tem certeza que deseja sair?"
                        message="Todo seu progresso será perdido."
                        confirmText="Sair"
                        onConfirm={handleModalConfirm}
                        onCancel={() => setShowModal(false)}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
}
export default Game;
