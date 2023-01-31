import '../assets/styles/elements/_Button.scss';

export default function Button( {
	active, type, className, onClick, href, target, children,
} ) {
	return (
		href
			? (
				<a
					className={ `urlslab-button ${ className || '' } ${ active ? 'active' : '' }` }
					href={ href }
					onClick={ onClick || null }
					target={ target || null }
				>
					{ children }
				</a>
			)
			: (
				<button
					className={ `urlslab-button ${ className || '' } ${ active ? 'active' : '' }` }
					type={ type || 'button' }
					onClick={ onClick || null }
				>
					{ children }
				</button>
			)

	);
}
