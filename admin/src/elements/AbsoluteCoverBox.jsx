import { memo } from 'react';
import Box from '@mui/joy/Box';
import CircularProgress from '@mui/joy/CircularProgress';

const AbsoluteCoverBox = ( { children } ) => {
	return (
		<Box
			sx={ {
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				position: 'absolute',
				top: 0,
				left: 0,
				width: '100%',
				height: '100%',
				zIndex: 1,
			} }
		>
			{ children || <CircularProgress /> }
		</Box>
	);
};

export default memo( AbsoluteCoverBox );
