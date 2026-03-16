import { ImSpinner8 } from "react-icons/im";

const ButtonDanger = ({ children, type, disabled, isLoading, onClick }) => {
    return (
			<button
				type={type}
				onClick={onClick}
				disabled={disabled || isLoading}
				className={`relative block w-full p-[2px] drop-shadow-md rounded-lg bg-gradient-to-b hover:brightness-110 transition-all duration-300 from-red-500 to-red-600 ${
					disabled
						? "opacity-70 cursor-not-allowed"
						: isLoading
						? "opacity-70 cursor-wait"
						: ""
				}`}
			>
				<div className="p-3 h-12 text-white w-full rounded-lg bg-gradient-to-b from-red-600 to-red-500 font-medium flex items-center justify-center gap-2">
					{isLoading ? (
						<div className="flex items-center justify-center h-full">
							<ImSpinner8 className="animate-spin" size={18} />
						</div>
					) : (
						children
					)}
				</div>
			</button>
		);
};
export default ButtonDanger;
