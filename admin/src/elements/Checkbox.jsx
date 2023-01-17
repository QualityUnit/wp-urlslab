import '../assets/styles/elements/_Checkbox.scss';

export default function Checkbox({ checked, radial, name, className, onChange, textBefore, children }) {
	return (
		<label className={`urlslab-checkbox ${className || ''} ${textBefore ? 'textBefore' : ''} ${radial ? 'radial' : ''}`}>
			<input className="urlslab-checkbox-input" type={name ? 'radio' : 'checkbox'} name={name || ''} defaultChecked={checked} />
			<div className="urlslab-checkbox-box"></div>
			<span className="urlslab-checkbox-text">{children}</span>
		</label>
	)
}
