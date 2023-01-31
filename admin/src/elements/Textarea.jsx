import { useState } from 'react';

export default function Textarea({ placeholder, rows }) {
	const [val, setVal] = useState('');

	const handleVal = (event) => {
		setVal(event.target.value);
	};

	return (
		<div className={`urlslab-inputField ${val ? 'valid' : ''}`}>
			<textarea
				className="input__text"
				placeholder={placeholder}
				rows={rows || 3}
				onChange={handleVal}
			/>
		</div>
	);
}
