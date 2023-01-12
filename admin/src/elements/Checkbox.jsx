import '../assets/style/elements/Checkbox.scss';

export default function Checkbox({ checked, radial, onChange, textBefore, children }) {
	return (
		<label className={`urlslab-checkbox ${textBefore ? 'textBefore' : ''} ${radial ? 'radial' : ''}`}>
			<input className="urlslab-checkbox-input" type="checkbox" defaultChecked={checked} />
			<div className="urlslab-checkbox-box"></div>
			<span className="urlslab-checkbox-text">{children}</span>
		</label>
	)
}
