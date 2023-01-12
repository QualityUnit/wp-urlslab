import { useState } from 'react';

export default function InputField({ placeholder, type, disabled, label, labelInline, children, style }) {
	const [val, setVal] = useState('');
	const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
	const urlRegex = /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#?]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/;

	const handleVal = (event) => {
		setVal(event.target.value);
	};
	const valueStatus = () => {
		if (val) {
			if ((type === undefined || type === 'text') ||
				(type === 'email' && emailRegex.test(val)) ||
				(type === 'number' && (/[0-9]/i).test(val)) ||
				(type === 'url' && urlRegex.test(val))
			) {
				return 'has-value success';
			}
			return 'has-value error';
		}
	}

	return (
		<label className={`urlslab-inputField-wrap ${labelInline ? 'inline' : ''}`}>
			<span className="urlslab-inputField-label">{label}</span>
			<div className={`urlslab-inputField ${children ? 'has-svg' : ''} ${valueStatus()}`} style={style}>
				{children}
				<input
					className="urlslab-input input__text"
					type={type}
					value={val}
					onChange={handleVal}
					placeholder={placeholder}
					disabled={disabled ? 'disabled' : ''}
				/>
			</div>
		</label >
	);
}
