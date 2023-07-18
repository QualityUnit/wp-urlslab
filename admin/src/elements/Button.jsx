import '../assets/styles/elements/_Button.scss';

export default function Button( {
	active, danger, type, className, disabled, onClick, href, target, style, children,
} ) {
	return (
		href
			? (
				<a
					className={ `urlslab-button ${ className || '' } ${ active ? 'active' : '' } ${ danger ? 'danger' : '' }` }
					href={ href }
					disabled={ disabled }
					onClick={ onClick || null }
					target={ target || null }
					style={ style }
				>
					{ children }
				</a>
			)
			: (
				<button
					className={ `urlslab-button ${ className || '' } ${ active ? 'active' : '' } ${ danger ? 'danger' : '' }` }
					type={ type || 'button' }
					disabled={ disabled }
					style={ style }
					onClick={ onClick || null }
				>
					{ children }
				</button>
			)

	);
}
