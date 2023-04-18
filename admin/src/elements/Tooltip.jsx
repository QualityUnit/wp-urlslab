import '../assets/styles/elements/_Tooltip.scss';

export default function Tooltip( { active, center, className, style, children } ) {
	return (
		children
			? <div className={ `urlslab-tooltip fadeInto ${ className || '' } ${ center ? 'align-center' : '' } ${ active ? 'active' : '' }` } style={ style }>
				{ children }
			</div>
			: null
	);
}
