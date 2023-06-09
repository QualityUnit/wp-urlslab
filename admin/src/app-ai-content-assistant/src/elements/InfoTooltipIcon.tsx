import React from 'react';
import JSXIconButton from '../../../elements/IconButton';
import { ReactComponent as InfoIcon } from '../assets/images/icons/icon-info.svg';

type InfoTooltipIconType = {
	text: string
	onClick?: () => void
}
export const InfoTooltipIcon: React.FC<InfoTooltipIconType> = React.memo( ( {
	text,
	onClick,
}: InfoTooltipIconType ) => {
	return <JSXIconButton className="urlslab-info-tooltip ml-s" tooltip={ text } tooltipClass={ undefined } onClick={ onClick } style={ undefined } tooltipStyle={ { whiteSpace: 'nowrap' } }>
		<InfoIcon width="15px" height="15px" />
	</JSXIconButton>;
} );
InfoTooltipIcon.displayName = 'InfoTooltip';
