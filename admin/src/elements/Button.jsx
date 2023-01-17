import '../assets/styles/elements/_Button.scss';

export default function Button({ active, secondary, type, className, onClick, href, children }) {
	return (
		href
			? <a
				className={`urlslab-button ${className || ''} ${active ? 'active' : ''}`}
				href={href}
				onClick={onClick || null}
			>
				{children}
			</a>
			: <button
				className={`urlslab-button ${className || ''} ${active ? 'active' : ''}`}
				type={type ? type : 'button'}
				onClick={onClick || null}
			>
				{children}
			</button>

	)
}
