import { createContext, memo, useContext, useRef, useState } from 'react';

import useClickOutside from '../hooks/useClickOutside';
import { isNestedObject, isObject } from '../lib/helpers';

import SvgIcon from './SvgIcon';
import Box from '@mui/joy/Box/Box';
import AccordionGroup from '@mui/joy/AccordionGroup';
import Accordion from '@mui/joy/Accordion';
import IconButton from '@mui/joy/IconButton';
import Tooltip from '@mui/joy/Tooltip';
import AccordionDetails, { accordionDetailsClasses } from '@mui/joy/AccordionDetails';
import AccordionSummary, { accordionSummaryClasses } from '@mui/joy/AccordionSummary';

const TreeViewContext = createContext( {} );
const acceptedData = ( data ) => data || isObject( data ) || Array.isArray( data ) || ( typeof data === 'string' && data !== '' );

const TreeView = ( { sourceData, isTableCellPopper } ) => {
	//exit early if no data to prevent unnecessary logging of erro catch on empty data
	if ( ! acceptedData( sourceData ) ) {
		return null;
	}

	let data = null;
	try {
		data = JSON.parse( sourceData );
	} catch ( error ) {
		// eslint-disable-next-line no-console
		console.error( 'TreeView: Invalid JSON string:', error.message );
	}

	if ( ! data ) {
		return null;
	}

	const isNested = isNestedObject( data );

	return (
		<TreeViewContext.Provider value={ { data, sourceData, isNested } } >
			{
				isTableCellPopper
				// show tree view wrapped with functionality for table cell popup
					? <TableCellTreeView />
				// show directly standard tree view
					: <StandardTreeView />
			}
		</TreeViewContext.Provider>
	);
};
const StandardTreeView = memo( () => {
	const { data } = useContext( TreeViewContext );
	return (
		<MainWrapper>
			<RecursiveTreeNode data={ data } />
		</MainWrapper>
	);
} );

const TableCellTreeView = memo( () => {
	const { data, sourceData } = useContext( TreeViewContext );
	const [ opened, setOpened ] = useState( false );
	const referrer = useRef();
	useClickOutside( referrer, () => setOpened( false ) );

	return (
		<Tooltip
			arrow
			placement="bottom-start"
			title={
				<Box ref={ referrer }>
					<MainWrapper isTableCellPopper>
						<RecursiveTreeNode data={ data } />
					</MainWrapper>
				</Box>
			}
			open={ opened }
			sx={ ( theme ) => ( { zIndex: `calc( ${ theme.vars.zIndex.table } - 1 )` } ) }
			disablePortal
		>
			<Box
				className={ opened && 'opened' }
				onClick={ () => setOpened( ! opened ) }
				sx={ ( theme ) => ( {
					cursor: 'pointer',

					'& .text-wrapper': {
						transition: `opacity ${ theme.transition.general.duration }`,
					},
					'& .MuiIconButton-root': {
						position: 'absolute',
						top: '50%', left: '50%',
						opacity: 0,
						transform: 'translate(-50%, -50%)',
					},

					'&:hover, &.opened': {
						'& .text-wrapper': {
							opacity: 0.5,
						},
						'& .MuiIconButton-root': {
							opacity: 1,
						},
					},
				} ) }
			>
				<Box className="text-wrapper ellipsis">
					{ sourceData }
				</Box>
				<IconButton
					size="xs"
					variant="soft"
					color="primary"
				>
					<SvgIcon name="eye" />
				</IconButton>
			</Box>
		</Tooltip>

	);
} );

const RecursiveTreeNode = memo( ( { data, dataKey } ) => {
	// dataKey not defined, it's the first loop on json object or array
	if ( dataKey === undefined ) {
		if ( Array.isArray( data ) ) {
			return data.map( ( value, index ) => <RecursiveTreeNode key={ index } data={ value } dataKey={ index } /> );
		}

		if ( isObject( data ) ) {
			return Object.entries( data ).map( ( [ key, value ] ) => <RecursiveTreeNode key={ key } data={ value } dataKey={ key } /> );
		}
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
								data.map( ( value, index ) => (
									<RecursiveTreeNode key={ index } data={ value } dataKey={ index } />
								) )
							}
						</CustomAccordionDetails>
					</Accordion>
				</CustomAccordionGroup>
				: <RecursiveTreeNode data={ '[ ]' } dataKey={ dataKey } />
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
								<RecursiveTreeNode key={ key } data={ value } dataKey={ key } />
							) )
						}
					</CustomAccordionDetails>
				</Accordion>
			</CustomAccordionGroup>
		);
	}

	return (
		<CustomAccordionGroup>
			<Box sx={ {
				pl: 'var(--row-paddingLeft)',
				display: 'flex',
			} }>
				{ dataKey !== undefined
					? <>
						<span className="title-value">{ dataKey }:</span>
						<span className="data-value">{ String( data ) }</span>
					</>
					: <span className="data-value">{ String( data ) }</span>
				}
			</Box>
		</CustomAccordionGroup>
	);
} );

const MainWrapper = memo( ( { children, isTableCellPopper } ) => {
	const { isNested } = useContext( TreeViewContext );

	return <Box
		className="urlslab-scrollbar"
		sx={ ( theme ) => ( {
			'--indicator-color': 'currentcolor',
			'--row-paddingLeft': isNested ? theme.spacing( 2.5 ) : 0, // remove left empty space if tree is no nested
			overflow: 'auto',
			...( isTableCellPopper && {
				'--variant-plainColor': theme.vars.palette.common.white,
				'--indicator-color': theme.vars.palette.common.white,
				'--custom-divider-color': `rgba(${ theme.vars.palette.neutral.lightChannel } / 0.3 )`,
				'--custom-Icon-fontSize': theme.vars.fontSize.sm,
				'--custom-fontSize': theme.vars.fontSize.xs,
				maxHeight: '20rem',
				minWidth: '15rem',
			} ),
		} ) }>{ children }</Box>;
} );

const CustomAccordionGroup = memo( ( { children } ) => (
	<AccordionGroup
		size="sm"
		sx={ ( theme ) => ( {
			'--ListItem-paddingY': 0,
			'--ListItem-minHeight': 0,
			'--ListItem-paddingLeft': 0,
			'--ListItem-paddingX': 0,

			'--variant-plainHoverBg': ' transparent',
			'--variant-plainActiveBg': ' transparent',
			'--variant-plainHoverColor': 'currentcolor',

			'--Icon-fontSize': `var(--custom-Icon-fontSize, ${ theme.vars.fontSize.md } )`,
			fontSize: `var(--custom-fontSize, ${ theme.vars.fontSize.md })`,
			//textWrap: 'nowrap',

			'.title-value': {
				mr: 1,
			},
			'.data-value': {
				opacity: 0.8,
				//wordBreak: 'break-all',
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
			//gridTemplateColumns: 'min-content',
			[ `& .${ accordionDetailsClasses.content }.${ accordionDetailsClasses.expanded }` ]: {
				overflow: 'visible',
				'.data-value': {
					//wordBreak: 'break-all',
				},
			},
		} ) }
	>
		{ children }
	</AccordionDetails>
) );

export default memo( TreeView );
