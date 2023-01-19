import { useState, useRef } from 'react';
import '../assets/styles/elements/_OptionButton.scss';

export default function OptionButton({ id, name, checked, className, style, children }) {
	const [active, setActive] = useState(checked ? true : false);
	const ref_id = useRef(null);
	const handleOnClick = (event) => {
		document.querySelectorAll(`.urlslab-optionbutton.${name}`).forEach(btn => {
			btn.classList.remove('active');
		});
		setActive(event.target.value);
	}

	return (
		<label
			className={`urlslab-optionbutton ${name} ${className || ''} ${active ? 'active' : ''}`}
			style={{ style }}
			onClick={(event) => handleOnClick(event)}
		>
			<input className="urlslab-optionbutton-input" ref={ref_id} id={id} type="radio" name={name || ''} defaultChecked={checked} />
			<div className="urlslab-optionbutton-radio"></div>
			<span className="urlslab-optionbutton-text">{children}</span>
		</label >
	)
}
