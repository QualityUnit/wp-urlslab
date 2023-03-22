import '../assets/styles/elements/_Button.scss';

export default function Button( {
	active, danger, type, className, disabled, onClick, href, target, children,
} ) {
	return (
		href
			? (
				<a
					className={ `urlslab-button ${ className || '' } ${ active && 'active' } ${ danger && 'danger' }` }
					href={ href }
					disabled={ disabled }
					onClick={ onClick || null }
					target={ target || null }
				>
					{ children }
				</a>
			)
			: (
				<button
					className={ `urlslab-button ${ className || '' } ${ active && 'active' } ${ danger && 'danger' }` }
					type={ type || 'button' }
					disabled={ disabled }
					onClick={ onClick || null }
				>
					{ children }
				</button>
			)

	);
}
