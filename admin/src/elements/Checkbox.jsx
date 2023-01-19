import { useState } from 'react';
import '../assets/styles/elements/_Checkbox.scss';

export default function Checkbox({ checked, radial, name, className, onChange, textBefore, children }) {
	const [isChecked, setChecked] = useState(checked ? true : false);
	const handleOnChange = (event) => {
		if (onChange) {
			onChange(event.target.checked);
		}
		setChecked(event.target.checked);
	}
	return (
		<label className={`urlslab-checkbox ${className || ''} ${textBefore ? 'textBefore' : ''} ${radial ? 'radial' : ''}`}>
			<input
				className="urlslab-checkbox-input"
				type={name ? 'radio' : 'checkbox'}
				name={name || ''}
				defaultChecked={isChecked}
				onChange={(event) => handleOnChange(event)}
			/>
			<div className="urlslab-checkbox-box"></div>
			<span className="urlslab-checkbox-text">{children}</span>
		</label>
	)
}
