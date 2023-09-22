import '../assets/styles/elements/_Tooltip.scss';

export default function TooltipUrls( { active, center, className, style, children } ) {
	return (
		children
			? <div className={ `urlslab-tooltip fadeInto ${ className || '' } ${ center ? 'align-center' : '' } ${ active ? 'active' : '' }` } style={ style }>
				<ul>
					{
						children.map((item, i) => <li>{item}</li>)
					}
				</ul>
			</div>
			: null
	);
}
