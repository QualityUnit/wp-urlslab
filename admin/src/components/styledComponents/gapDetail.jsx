import { memo } from 'react';

import Box from '@mui/joy/Box';

export const MainWrapper = memo( ( { children } ) => (
	<Box
		sx={ ( theme ) => ( {
			display: 'flex',
			flexDirection: 'row',

			[ theme.breakpoints.down( 'xl' ) ]: {
				flexDirection: 'column',

			},
		} ) }
	>
		{ children }
	</Box>
) );

export const SettingsWrapper = memo( ( { children } ) => (
	<Box sx={ ( theme ) => ( {
		display: 'flex',
		flexDirection: 'row',
		gap: 3.75,
		pr: 3.75, mr: 3.75,
		borderRight: `1px solid ${ theme.vars.palette.divider }`,
		// use custom breakpoint, default 'xl' is too small
		[ theme.breakpoints.down( 'xxl' ) ]: {
			flexDirection: 'column',
			gap: 2,
		},
		[ theme.breakpoints.down( 'xl' ) ]: {
			flexDirection: 'row',
			gap: 3.75,
			pr: 0, mr: 0,
			pb: 2, mb: 2,
			borderRight: 0,
			borderBottom: `1px solid ${ theme.vars.palette.divider }`,
		},
	} ) }
	>
		{ children }
	</Box>

) );
