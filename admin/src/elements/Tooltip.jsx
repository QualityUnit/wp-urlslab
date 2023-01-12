import '../assets/style/elements/Tooltip.scss';

export default function Tooltip({ active, children }) {
	return (
		<div className={`urlslab-tooltip ${active ? 'active' : ''}`}>
			{children}
		</div>
	)
}
