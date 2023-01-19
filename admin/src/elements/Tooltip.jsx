import '../assets/styles/elements/_Tooltip.scss';

export default function Tooltip({ active, center, className, children }) {
	return (
		<div className={`urlslab-tooltip ${className || ''} ${center ? 'align-center' : ''} ${active ? 'active' : ''}`}>
			{children}
		</div>
	)
}
