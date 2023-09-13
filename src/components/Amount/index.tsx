import { useState } from "react";
import { ethers } from "ethers";
import "./style.css";

interface InputProps {
	name: string;
	decimals: number;
  onChange: (value: bigint) => void;
}

const Input = (props: InputProps) => {
	const [value, setValue] = useState("0");

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		let input = e.target.value;

		if (!input)
			input = "0";

		if (input.split(".")[1]?.length > props.decimals)
			return;

		const num = ethers.parseUnits(input, props.decimals);

		if (num < 0n)
			return;

		setValue(e.target.value);
		props.onChange(num);
	};

	return (
		<div className="input">
			<span>{ props.name }</span>
			<input value={value} type="number" step="0.000001" min="0" onChange={onChange}/>
		</div>
	);
};

export default Input;
