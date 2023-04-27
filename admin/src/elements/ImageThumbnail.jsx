/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import { useRef, useState } from 'react';
import Tooltip from './Tooltip';

import '../assets/styles/elements/_ImageThumbnail.scss';

export default function ImageThumbnail( { className, tooltipClass, alt, src, thumb, href } ) {
	const [ tooltipUrl, setTooltipUrl ] = useState();
	const thumbRef = useRef();

	const handleMouseOver = ( ) => {
		setTooltipUrl( thumb );
	};

	const handleLeave = () => {
		setTooltipUrl();
	};

	return (
		src
			? <a ref={ thumbRef } className={ `urlslab-image-thumb ${ className || '' }` } href={ href } target="_blank" rel="noreferrer"
				onMouseOver={ handleMouseOver } onMouseLeave={ handleLeave }
			>
				<img src={ src } alt={ alt || '' } />

				<Tooltip className={ `showOnHover urlslab-image-tooltip ${ tooltipClass || '' }` }>
					<div className="urlslab-image-tooltip-inn">
						<img src={ tooltipUrl } alt={ alt || '' } />
					</div>
				</Tooltip>
			</a>
			: <div className="img"></div>
	);
}
