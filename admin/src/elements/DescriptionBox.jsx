import { useEffect, useRef, useState, memo } from 'react';
import classNames from 'classnames';

import AccordionGroup from '@mui/joy/AccordionGroup';
import Accordion from '@mui/joy/Accordion';
import AccordionSummary from '@mui/joy/AccordionSummary';
import AccordionDetails from '@mui/joy/AccordionDetails';
import { get, update } from 'idb-keyval';

/*
* isMainTableDescription: used for description above main module table to follow paddings of module header
* tableSlug: if tableSlug is defined, table description is opened for user by default for the first time
*/
const DescriptionBox = ( { children, title, sx, className, tableSlug, isMainTableDescription } ) => {
	const isControlledComponent = useRef( tableSlug !== undefined );

	const [ waitForDbData, setWaitForDbData ] = useState( isControlledComponent.current ? true : false );
	const [ opened, setOpened ] = useState( isControlledComponent.current ? true : false );

	useEffect( () => {
		if ( isControlledComponent.current ) {
			get( tableSlug ).then( ( dbData ) => {
				setOpened( dbData?.tableDescriptionRead !== true );
				setWaitForDbData( false );
				if ( dbData?.tableDescriptionRead !== true ) {
					update( tableSlug, ( currentDbData ) => {
						return { ...currentDbData, tableDescriptionRead: true };
					} );
				}
			} );
		}
	}, [ tableSlug ] );

	if ( ! title || ! children ) {
		return null;
	}

	return (
		<AccordionGroup
			size="sm"
			className={ classNames( [ 'urlslab-DescriptionBox', className ? className : null ] ) }
			isMainTableDescription={ isMainTableDescription }
			isDescriptionBox
			sx={ { ...sx } }
		>
			<Accordion
				{ ...( isControlledComponent.current ? {
					expanded: opened,
					onChange: () => setOpened( ! opened ),
					// while waiting data from db, do not show accordion, but keep it rendered so table can calculate with its height while setting of own table height
					sx: ( theme ) => ( {
						opacity: waitForDbData ? 0 : 1,
						transition: `opacity ${ theme.transition.general.duration }`,
					} ),
				} : null ) }
			>
				<AccordionSummary
					className="urlslab-DescriptionBox-header"
					isMainTableDescription={ isMainTableDescription }

					isDescriptionBox
				>
					{ title }
				</AccordionSummary>
				{ // if component is controlled, prevent showing of opened dropdown until data from db are loaded
					( ! isControlledComponent.current || ( isControlledComponent.current && ! waitForDbData ) ) &&
					<AccordionDetails
						isMainTableDescription={ isMainTableDescription }
						isDescriptionBox
					>
						{ children }
					</AccordionDetails>
				}
			</Accordion>
		</AccordionGroup>
	);
};

export default memo( DescriptionBox );
