import { useState } from 'react';
import "../assets/style/elements/Inputs.scss";

export default function SearchField({ placeholder, onChange }) {
	const [val, setVal] = useState('');

	const handleVal = (event) => {
		setVal(event.target.value);
	};
	setTimeout(() => {
		onChange(val);
	}, 300);
	return (
		<div className="urlslab-inputField urlslab-inputField__search has-svg">
			<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" xml:space="preserve"><path d="M9.167 16.583A7.417 7.417 0 1 0 9.166 1.75a7.417 7.417 0 0 0 .001 14.833Zm0-1.5a5.917 5.917 0 1 1 0-11.833 5.917 5.917 0 0 1 0 11.833Z" style={{ fill: '#65676b' }} /><path d="m18.03 16.97-3.625-3.625a.75.75 0 0 0-1.061 1.06l3.625 3.625a.75.75 0 0 0 1.061-1.06Z" style={{ fill: '#65676b' }} /></svg>

			<input
				className="urlslab-input input__text"
				type="search"
				value={val}
				onChange={(event) => handleVal(event)}
				placeholder={placeholder ? placeholder : 'Search...'}
			/>
		</div>
	);
}
