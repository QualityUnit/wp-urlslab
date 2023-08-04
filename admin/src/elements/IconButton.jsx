import Tooltip from './Tooltip';

import '../assets/styles/elements/_IconButton.scss';

export default function IconButton( { className, style, children, tooltip, tooltipClass, tooltipStyle, onClick } ) {
	return (
		<button onClick={ onClick } className={ `urlslab-icon-button pos-relative ${ className || '' }` } style={ style }>
			{ children }
			{ tooltip &&
				<Tooltip className={ `showOnHover ${ tooltipClass }` } style={ tooltipStyle }>{ tooltip }</Tooltip>
			}
		</button>
	);
}
