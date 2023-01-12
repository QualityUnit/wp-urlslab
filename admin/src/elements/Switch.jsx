import '../assets/style/elements/Switch.scss';

export default function Switch({ id, textAfter, secondary, onChange, group, checked, children }) {
	return (
		<div className={`urlslab-switch ${secondary ? 'secondary' : ''} ${textAfter ? 'textAfter' : ''}`}>
			<label className="urlslab-switch-label">
				<input className="urlslab-switch-input" type="checkbox" id={id} name={group} defaultChecked={checked} />
				<div className="urlslab-switch-switcher"></div>
			</label>
			<span className="urlslab-switch-text">{children}</span>
		</div>
	)
}
