import { memo } from 'react';
import { __ } from '@wordpress/i18n';

import Box from '@mui/joy/Box';
import Alert from '@mui/joy/Alert';
import Sheet from '@mui/joy/Sheet';
import Stack from '@mui/joy/Stack';
import Divider from '@mui/joy/Divider';
import Typography from '@mui/joy/Typography';
import CircularProgress from '@mui/joy/CircularProgress';

export const ChartTitle = memo( ( { title, description } ) => {
	return (
		<Stack direction="row" spacing={ 2 } sx={ { mb: 3 } } divider={ <Divider orientation="vertical" /> }>
			<Typography color="primary" fontWeight="xl">{ title }</Typography>
			{ description && <Typography >{ __( 'Last 24 hours results' ) }</Typography> }
		</Stack>
	);
} );

export const ChartWrapper = memo( ( { children } ) => (
	<Sheet variant="outlined" sx={ ( theme ) => ( {
		borderRadius: theme.vars.radius.md,
		p: 2,
	} ) } >
		{ children }
	</Sheet>
) );

export const ChartLoader = memo( () => (
	<Box sx={ { m: 2, display: 'flex', justifyContent: 'center' } }>
		<Box display="flex" alignItems="center" flexDirection="column">
			<CircularProgress />
			<Typography sx={ { mt: 2 } }>{ __( 'Loading chart data…' ) }</Typography>
		</Box>
	</Box>
) );

export const ChartNoData = memo( () => {
	return (
		<Box sx={ { m: 2, display: 'flex', justifyContent: 'center' } }>
			<Alert
				variant="soft"
				color="primary"
				sx={ { flexDirection: 'column', gap: 0 } }
			>
				<Typography color="primary" fontWeight="xl">{ __( 'No data found' ) }</Typography>
				<Typography fontSize="xs">{ __( 'Try to define more precise filters.' ) }</Typography>
			</Alert>
		</Box>
	);
} );
