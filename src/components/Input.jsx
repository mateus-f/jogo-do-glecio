import React, { useState } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { HiPencilSquare } from "react-icons/hi2";

const Input = ({
    name,
    label,
    placeholder,
    maxLength,
    type,
    value,
    error,
    required,
    onChange,
    disabled,
    isEditing,
}) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible((prev) => !prev);
    };

    const isPassword = type === "password";
    const inputType = isPassword && isPasswordVisible ? "text" : type;

    return (
        <div className="relative flex flex-col gap-1">
            <label className="text-sm text-darkGray" htmlFor={`input-${name}`}>
                {label}
            </label>
            <div className="relative">
                <input
                    type={inputType}
                    id={`input-${name}`}
                    name={name}
                    value={value}
                    placeholder={placeholder}
                    maxLength={maxLength}
                    onChange={onChange}
                    required={required}
                    disabled={disabled}
                    className={`py-[10px] pl-3 pr-10 rounded-lg border-2 text-purpleGray placeholder:text-grayColor outline-none bg-surface focus:border-purple w-full ${
                        error ? "border-red-500" : "border-borderColor"
                    } ${disabled ? "opacity-70 cursor-not-allowed" : ""}`}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute transform -translate-y-1/2 right-3 top-1/2 text-purpleGray"
                        aria-label={
                            isPasswordVisible
                                ? "Esconder senha"
                                : "Mostrar senha"
                        }
                    >
                        {isPasswordVisible ? (
                            <HiEyeOff
                                className="w-5 h-5"
                                title="Esconder senha"
                            />
                        ) : (
                            <HiEye className="w-5 h-5" title="Mostrar senha" />
                        )}
                    </button>
                )}
                {isEditing && (
                    <button
                        type="button"
                        onClick={``}
                        className="absolute transform -translate-y-1/2 right-3 top-1/2 text-purpleGray"
                        aria-label="Editar"
                    >
                        <HiPencilSquare className="w-5 h-5" />
                    </button>
                )}
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
};

export default Input;
