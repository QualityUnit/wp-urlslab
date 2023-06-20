import React from 'react';
import JSXIconButton from '../../../elements/IconButton';
import { ReactComponent as InfoIcon } from '../assets/images/icons/icon-info.svg';

type InfoTooltipIconType = {
	text: string
	onClick?: () => void
	noWrapText?: boolean
	tooltipWidth?: string
}
export const InfoTooltipIcon: React.FC<InfoTooltipIconType> = React.memo( ( {
	text,
	onClick,
	noWrapText,
	tooltipWidth,
}: InfoTooltipIconType ) => {
	return (
		<JSXIconButton
			className="urlslab-info-tooltip ml-s"
			tooltip={ text }
			tooltipClass={ undefined }
			onClick={ onClick }
			style={ undefined }
			tooltipStyle={ {
				textAlign: 'left',
				...( tooltipWidth && { width: tooltipWidth } ),
				...( noWrapText && { whiteSpace: 'nowrap' } ),
			} }
		>
			<InfoIcon width="15px" height="15px" />
		</JSXIconButton>
	);
} );
InfoTooltipIcon.displayName = 'InfoTooltip';
