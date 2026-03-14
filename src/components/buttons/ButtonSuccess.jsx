import { ImSpinner8 } from "react-icons/im";

const ButtonSuccess = ({
	children,
	type,
	disabled,
	isLoading,
	onClick,
	invertedContent,
}) => {
	return (
		<button
			type={type}
			onClick={onClick}
			disabled={disabled || isLoading}
			className={`relative block w-full p-[2px] drop-shadow-md rounded-lg bg-gradient-to-b from-[#0C961D] to-[#0B8319] hover:brightness-110 transition-all duration-300 ease-in-out ${
				disabled
					? "opacity-70 cursor-not-allowed"
					: isLoading
					? "opacity-70 cursor-wait"
					: ""
			}`}
		>
			<div
				className={`p-3 h-12 text-white w-full rounded-lg bg-gradient-to-b from-[#0B8319] to-[#0C961D] font-medium flex items-center justify-center gap-2 ${
					invertedContent == true &&
					"max-sm:flex-row-reverse max-sm:justify-between"
				}`}
			>
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
export default ButtonSuccess;
