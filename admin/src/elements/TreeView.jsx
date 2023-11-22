import { memo } from 'react';

import Box from '@mui/joy/Box/Box';
import AccordionGroup from '@mui/joy/AccordionGroup';
import Accordion from '@mui/joy/Accordion';
import AccordionDetails from '@mui/joy/AccordionDetails';
import AccordionSummary, { accordionSummaryClasses } from '@mui/joy/AccordionSummary';

const isObject = ( value ) => typeof value === 'object' && value !== null;

const TreeView = ( { jsonString, inTooltip } ) => {
	let data = null;
	try {
		data = JSON.parse( jsonString );
	} catch ( error ) {
		// eslint-disable-next-line no-console
		console.error( 'TreeView: Invalid JSON string:', error.message );
	}

	return data
		? <Box
			className="urlslab-scrollbar"
			sx={ ( theme ) => ( {
				'--indicator-color': 'currentcolor',
				...( inTooltip && {
					'--variant-plainColor': theme.vars.palette.common.white,
					'--indicator-color': theme.vars.palette.common.white,
					'--custom-divider-color': `rgba(${ theme.vars.palette.neutral.lightChannel } / 0.3 )`,
					'--custom-Icon-fontSize': theme.vars.fontSize.sm,
					'--custom-fontSize': theme.vars.fontSize.xs,
					maxHeight: '20rem',
					maxWidth: '40rem',
					overflowY: 'auto',
				} ),
			} ) }>
			<TreeNode data={ data } />
		</Box>
		: null;
};

const TreeNode = ( { data, dataKey = null } ) => {
	// dataKey not defined, it's the first loop on json object
	if ( ! dataKey && isObject( data ) ) {
		return Object.entries( data ).map( ( [ key, value ] ) => <TreeNode key={ key } data={ value } dataKey={ key } /> );
	}

	if ( Array.isArray( data ) ) {
		return (
			data.length !== 0
				? <CustomAccordionGroup>
					<Accordion>
						<CustomAccordionSummary>
							<span className="title-value">{ dataKey }</span>
							<span className="data-value">({ data.length })</span>
						</CustomAccordionSummary>
						<CustomAccordionDetails >
							{
								data.map( ( item, index ) => (
									<TreeNode key={ index } data={ item } dataKey={ index } />
								) )
							}
						</CustomAccordionDetails>
					</Accordion>
				</CustomAccordionGroup>
				: <TreeNode data={ '[]' } dataKey={ dataKey } />
		);
	}

	if ( isObject( data ) ) {
		return (
			<CustomAccordionGroup>
				<Accordion>
					<CustomAccordionSummary>
						<span className="title-value">{ dataKey }</span>
						<span className="data-value">({ Object.keys( data ).length })</span>
					</CustomAccordionSummary>
					<CustomAccordionDetails>
						{
							Object.entries( data ).map( ( [ key, value ] ) => (
								<TreeNode key={ key } data={ value } dataKey={ key } />
							) )
						}
					</CustomAccordionDetails>
				</Accordion>
			</CustomAccordionGroup>
		);
	}

	return <CustomAccordionGroup>
		<Box sx={ {
			pl: 'var(--row-paddingLeft)',
		} }>
			{ dataKey !== undefined
				? <>
					<span className="title-value">{ dataKey }:</span>
					<span className="data-value">{ String( data ) }</span>
				</>
				: <span className="data-value">{ String( data ) }</span>
			}
		</Box>
	</CustomAccordionGroup>;
};

const CustomAccordionGroup = memo( ( { children } ) => (
	<AccordionGroup
		size="sm"
		sx={ ( theme ) => ( {
			'--ListItem-paddingY': 0,
			'--ListItem-minHeight': 0,
			'--ListItem-paddingLeft': 0,
			'--ListItem-paddingX': 0,
			'--row-paddingLeft': theme.spacing( 2.5 ),
			'--variant-plainHoverBg': ' transparent',
			'--variant-plainActiveBg': ' transparent',
			'--variant-plainHoverColor': 'currentcolor',

			'--Icon-fontSize': `var(--custom-Icon-fontSize, ${ theme.vars.fontSize.md } )`,
			fontSize: `var(--custom-fontSize, ${ theme.vars.fontSize.md })`,
			textWrap: 'nowrap',
			'.title-value': {
				mr: 1,
			},
			'.data-value': {
				opacity: 0.8,
			},

			[ `& .${ accordionSummaryClasses.button }` ]: {
				pl: 'var(--row-paddingLeft)',
				justifyContent: 'left',
				'--Icon-color': 'var(--indicator-color)',
			},

			[ `& .${ accordionSummaryClasses.indicator }` ]: {
				transform: 'rotate(-90deg)',
				transition: '0.2s',
				position: 'absolute',
				left: 0,
			},
			[ `& [aria-expanded="true"] .${ accordionSummaryClasses.indicator }` ]: {
				transform: 'rotate(0deg)',
			},
		} ) }
	>
		{ children }
	</AccordionGroup>
) );

const CustomAccordionSummary = memo( ( { children } ) => (
	<AccordionSummary>
		{ children }
	</AccordionSummary>
) );

const CustomAccordionDetails = memo( ( { children } ) => (
	<AccordionDetails
		sx={ ( theme ) => ( {
			pl: 'calc( var(--row-paddingLeft) / 2 )',
			ml: 'calc( var(--row-paddingLeft) / 2 - 2px )',
			borderLeft: `1px solid var( --custom-divider-color, ${ theme.vars.palette.divider } )`,
			gridTemplateColumns: 'min-content',
		} ) }
	>
		{ children }
	</AccordionDetails>
) );

export default memo( TreeView );
