import '../assets/styles/elements/_Tooltip.scss';

export default function Tooltip( { active, center, className, children } ) {
	return (
		children
			? <div className={ `urlslab-tooltip fadeInto ${ className || '' } ${ center ? 'align-center' : '' } ${ active ? 'active' : '' }` }>
				{ children }
			</div>
			: null
	);
}
