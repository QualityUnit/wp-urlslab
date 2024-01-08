import { memo } from 'react';

import Box from '@mui/joy/Box';
import Stack from '@mui/joy/Stack';
import Divider from '@mui/joy/Divider';

// simple panel used to switching between table screen and another screen with another data, ie. screen with charts
const TablePanel = ( { children, actionButtons, title, subtitle, noContentPadding } ) => {
	return (
		<Box
			className="urlslab-TablePanel"
			sx={ ( theme ) => ( {
				backgroundColor: theme.vars.palette.common.white,
			} ) }
		>
			<Box
				className="urlslab-TablePanel-header"
				sx={ ( theme ) => ( {
				// simulate paddings of table header bottom
					px: 3,
					py: 2,
					borderBottom: `1px solid ${ theme.vars.palette.divider }`,
				} ) }>
				<Stack direction="row" alignItems="center" spacing={ 2 }>
					{ actionButtons && actionButtons }

					{ title &&
					<>
						<Divider orientation="vertical" />
						<Box>
							<Box sx={ ( theme ) => ( {
							// if title is simple text, make it bold, otherwise any set of components can be passed as custom title
								...( typeof title === 'string' ? { fontWeight: theme.vars.fontWeight.lg } : null ),
							} ) }>{ title }</Box>
							{ title &&
							<Box sx={ ( theme ) => ( { fontSize: theme.vars.fontSize.sm } ) }>{ subtitle }</Box>
							}
						</Box>
					</>
					}
				</Stack>
			</Box>
			<Box sx={ { ...( ! noContentPadding ? { px: 3, py: 2 } : null ) } }>
				{ children }
			</Box>
		</Box>
	);
};

export default memo( TablePanel );
