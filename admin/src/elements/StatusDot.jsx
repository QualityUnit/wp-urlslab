import { memo } from 'react';
import Box from '@mui/joy/Box';

const StatusDot = ( { size, color } ) => {
	return (
		<Box
			sx={ ( theme ) => ( {
				width: size ? size : theme.spacing( 1 ),
				height: size ? size : theme.spacing( 1 ),
				backgroundColor: color ? color : theme.vars.palette.primary.solidBg,
				borderRadius: '100%',
			} ) }
		/>
	);
};

export default memo( StatusDot );
