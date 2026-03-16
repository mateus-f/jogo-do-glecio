import { ImSpinner8 } from "react-icons/im";

const ButtonPrimary = ({
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
			className={`relative block w-full p-[2px] rounded-lg bg-gradient-to-b from-purple to-darkPurple drop-shadow-md hover:brightness-110 transition-all duration-300 ease-in-out ${
				disabled
					? "opacity-70 cursor-not-allowed"
					: isLoading
					? "opacity-70 cursor-wait"
					: ""
			}`}
		>
			<div className={`flex items-center justify-center w-full h-12 gap-2 p-3 font-medium text-white rounded-lg bg-gradient-to-b from-darkPurple to-purpleSecondary ${invertedContent == true && "max-sm:flex-row-reverse max-sm:justify-between"}`}>
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
export default ButtonPrimary;
