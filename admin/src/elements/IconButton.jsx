import Tooltip from './Tooltip';

import '../assets/styles/elements/_IconButton.scss';

export default function IconButton( { className, style, children, tooltip, tooltipClass, onClick } ) {
	return (
		<button onClick={ onClick } className={ `urlslab-icon-button ${ className || '' }` } style={ style }>
			{ children }
			{ tooltip &&
			<Tooltip className={ `showOnHover ${ tooltipClass }` }>{ tooltip }</Tooltip>
			}
		</button>
	);
}
