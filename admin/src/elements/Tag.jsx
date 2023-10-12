import { memo } from 'react';
import classNames from 'classnames';
import hexToHSL from '../lib/hexToHSL';

import Tooltip from '@mui/joy/Tooltip';
import ChipDelete from '@mui/joy/ChipDelete';
import Chip from '@mui/joy/Chip';

const isDark = ( color, lightnessTreshold ) => {
	const { lightness } = color ? hexToHSL( color ) : {};
	if ( ! lightness ) {
		return false;
	}
	if ( lightness < ( lightnessTreshold || 75 ) ) {
		return true;
	}
};

// forward ref to allow wrap component with another mui components like Tooltip that needs to pass ref to child

const Tag = ( {
	className,
	onClick,
	onDelete,
	color, // custom color, used also to change text color to white using isDark()
	size, // mui sizes: sm, md, lg
	tooltip, // pass content for tooltip
	isUppercase, // uppercase text
	isOutlined, // removes background color and adds border with text color
	isTagCloud, // tags displayed as cloud in row and multiple lines, param add necessary grid margins
	isCircle, // displays tag with fixed with and height, use one letter for tag label
	fitText, // smaller sides padding for tag
	sx,

	lightnessTreshold,
	children,

} ) =>
	<Tooltip title={ tooltip }>
		<Chip
			className={ classNames( 'urlslab-tag', className ? className : null ) }
			data-color={ color ? color : null }
			isDark={ isDark( color, lightnessTreshold ) }
			{ ...( onDelete ? { endDecorator: <ChipDelete onDelete={ onDelete } /> } : null ) }
			{ ...( onClick ? { onClick } : null ) }
			{ ...( size ? { size } : null ) }
			{ ...( sx ? { sx } : null ) }
			{ ...( isUppercase ? { isUppercase } : null ) }
			{ ...( isOutlined ? { isOutlined } : null ) }
			{ ...( isTagCloud ? { isTagCloud } : null ) }
			{ ...( isCircle ? { isCircle } : null ) }
			{ ...( fitText ? { fitText } : null ) }
			isTag
		>
			{ children }
		</Chip>
	</Tooltip>;

export default memo( Tag );
