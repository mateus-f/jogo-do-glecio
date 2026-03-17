import { useEffect, useState } from "react";
import { HiChevronDown } from "react-icons/hi2";

const Select = ({ name, label, values, selectedValue, onSelect }) => {
    const [selectedOption, setSelectedOption] = useState(selectedValue);

    useEffect(() => {
        setSelectedOption(selectedValue);
    }, [selectedValue]);

    const handleChange = (e) => {
        const selectedId = e.target.value;
        setSelectedOption(selectedId);
        onSelect?.(parseInt(selectedId));
    };

    return (
        <div className="flex flex-col gap-1">
            <label className="text-darkGray text-sm" htmlFor={`select-${name}`}>
                {label}
            </label>
            <div className="relative">
                <select
                    id={`select-${name}`}
                    name={name}
                    value={selectedOption}
                    disabled={values.length === 0}
                    className={`px-[10px] py-3 cursor-pointer rounded-lg border-2 text-purpleGray border-borderColor placeholder:text-grayColor outline-none bg-surface focus:border-purple appearance-none w-full ${
                        values.length === 0 ? "opacity-70 cursor-wait" : ""
                    }`}
                    onChange={handleChange}
                >
                    {values.length > 0 ? (
                        values.map((value, i) => (
                            <option key={i} value={value.id}>
                                {value.name}
                            </option>
                        ))
                    ) : (
                        <option disabled selected value="">
                            Carregando...
                        </option>
                    )}
                </select>
                <HiChevronDown className="absolute top-1/2 right-3 transform -translate-y-1/2 pointer-events-none text-purpleGray" />
            </div>
        </div>
    );
};

export default Select;
