import '../assets/styles/elements/_Tooltip.scss';
import { getTooltipUrlsList } from '../lib/elementsHelpers';

export default function TooltipUrls( { active, center, className, style, children } ) {
	return (
		children
			? <div className={ `urlslab-tooltip fadeInto ${ className || '' } ${ center ? 'align-center' : '' } ${ active ? 'active' : '' }` } style={ style }>
				{ getTooltipUrlsList( children ) }
			</div>
			: null
	);
}
