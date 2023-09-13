import "./style.css";

interface SelectProps {
	name: string;
	value: string;
  options: string[];
  onChange: (value: string) => void;
}

const Select = ({ name, value, options, onChange }: SelectProps) => (
	<div className="select">
		<span>{ name }</span>
		<select onChange={(e) => onChange(e.target.value)} value={value}>
			{ options.map(x => (
				<option key={ x }>{ x }</option>
			))}
		</select>
	</div>
);

export default Select;
