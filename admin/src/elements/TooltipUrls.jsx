import '../assets/styles/elements/_Tooltip.scss';

export default function TooltipUrls( { active, center, className, style, children } ) {
	return (
		children
			? <div className={ `urlslab-tooltip fadeInto ${ className || '' } ${ center ? 'align-center' : '' } ${ active ? 'active' : '' }` } style={ style }>
				<ul>
					{
						children.map((item, i) => <li><a href={item} target="_blank" rel="noreferrer">{item}</a></li>)
					}
				</ul>
			</div>
			: null
	);
}
