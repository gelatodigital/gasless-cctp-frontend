import { useEffect, useState } from "react";
import { ChainId } from "../../cctp-sdk/constants";
import Select from "../Select";
import "./style.css";

interface PathProps {
  onChange: (src: ChainId, dst: ChainId) => void;
}

const keys = Object.keys(ChainId);
const options = keys.slice(keys.length / 2);

const Path = ({ onChange }: PathProps) => {
	const [src, setSrc] = useState<string>(options[0]);
	const [dst, setDst] = useState<string>(options[1]);

	const onChangeSrc = (src: string) => {
		setSrc(src);
		if (src === dst)
			setDst(options.find(x => x !== src)!);
	};

	const onChangeDst = (dst: string) => {
		setDst(dst);
		if (dst === src)
			setSrc(options.find(x => x !== dst)!);
	};

	useEffect(() => (
		onChange(
			ChainId[src as keyof typeof ChainId],
			ChainId[dst as keyof typeof ChainId]
		)
	), [src, dst, onChange]);

	return (
		<div className='path'>
			<Select name="From" value={ src } options={options} onChange={onChangeSrc} />
			<Select name="To" value={ dst } options={options} onChange={onChangeDst} />
		</div>
	);
};

export default Path;
