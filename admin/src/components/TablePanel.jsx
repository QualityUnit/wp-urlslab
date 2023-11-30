import { memo, createContext } from 'react';
import { __ } from '@wordpress/i18n';

import { Box, Button, Divider, Stack } from '@mui/joy';
import SvgIcon from '../elements/SvgIcon';

const defaultTextBack = __( 'Back to table' );
export const TablePanelContext = createContext( {} );

const TablePanel = ( { children, onBack, textBack, title, subtitle } ) => {
	return (
		<Box sx={ ( theme ) => ( {
			backgroundColor: theme.vars.palette.common.white,
		} ) }>
			<Box sx={ ( theme ) => ( {
				// simulate paddings of table header bottom
				px: 3,
				py: 2,
				borderBottom: `1px solid ${ theme.vars.palette.divider }`,
			} ) }>
				<Stack direction="row" alignItems="center" spacing={ 2 }>
					{ onBack &&
					<Button
						variant="soft"
						onClick={ onBack }
						startDecorator={ <SvgIcon name="arrow-left" /> }
					>
						{ textBack || defaultTextBack }
					</Button>
					}

					{ title &&
					<>
						<Divider orientation="vertical" />
						<Box>
							<Box sx={ ( theme ) => ( {
							// if title is simple text, make it bold
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
			<Box sx={ { px: 3, py: 2 } }>
				<TablePanelContext.Provider value={ { onBack } }>
					{ children }
				</TablePanelContext.Provider>
			</Box>
		</Box>
	);
};

export default memo( TablePanel );
