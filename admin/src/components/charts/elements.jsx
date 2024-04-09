import { memo } from 'react';
import { __ } from '@wordpress/i18n';

import { useTheme } from '@mui/joy';
import Box from '@mui/joy/Box';
import Alert from '@mui/joy/Alert';
import Sheet from '@mui/joy/Sheet';
import Stack from '@mui/joy/Stack';
import Divider from '@mui/joy/Divider';
import Typography from '@mui/joy/Typography';
import CircularProgress from '@mui/joy/CircularProgress';

import StatusDot from '../../elements/StatusDot';

export const ChartTitle = memo( ( { title, description } ) => {
	return (
		<Stack direction="row" spacing={ 2 } sx={ { mb: 3 } } divider={ <Divider orientation="vertical" /> }>
			{ typeof title === 'string'
				? <Typography color="primary" fontWeight="xl">{ title }</Typography>
				: title
			}
			{ description && <Typography >{ description }</Typography> }
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
			<Typography sx={ { mt: 2 } }>{ __( 'Loading chart data…', 'urlslab' ) }</Typography>
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
				<Typography color="primary" fontWeight="xl">{ __( 'No data found', 'urlslab' ) }</Typography>
				<Typography fontSize="xs">{ __( 'Try to define more precise filters.', 'urlslab' ) }</Typography>
			</Alert>
		</Box>
	);
} );

export const ChartTooltipContent = memo( ( { title, data, appendContent } ) => {
	const theme = useTheme();
	return (
		<Box fontSize="xs">
			<Box sx={ {
				fontSize: theme.vars.fontSize.sm,
				fontWeight: theme.vars.fontWeight.xl,
				color: theme.vars.palette.text.secondary,
				pb: 1, mb: 1, borderBottom: `1px solid ${ theme.vars.palette.divider }`,
			} }>
				{ title }
			</Box>
			<Box
				component="ul"
				sx={ {
					m: 0,
					li: { m: 0 },
				} }
			>
				{ data.map( ( item ) => {
					const { key, color, name, value } = item;
					return (
						<Box
							key={ key }
							component="li"
							sx={ {
								...( color ? { color } : null ),
							} }
						>
							{ `${ name }: ${ value }` }
						</Box>
					);
				} )
				}
			</Box>
			{ appendContent &&
			<Box sx={ { mt: 1 } }>
				{ appendContent }
			</Box>
			}

		</Box>
	);
} );

export const ChartStatusInfo = memo( ( { color, status } ) => {
	return <Box sx={ ( theme ) => ( { display: 'flex', alignItems: 'center', gap: theme.spacing( 0.5 ), color } ) }><StatusDot color={ 'currentColor' } />{ status }</Box>;
} );
