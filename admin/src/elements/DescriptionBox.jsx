import { useEffect, useRef, useState, memo } from 'react';
import classNames from 'classnames';

import useUserLocalData from '../hooks/useUserLocalData';

import AccordionGroup from '@mui/joy/AccordionGroup';
import Accordion from '@mui/joy/Accordion';
import AccordionSummary from '@mui/joy/AccordionSummary';
import AccordionDetails from '@mui/joy/AccordionDetails';

/*
* isMainTableDescription: used for description above main module table to follow paddings of module header
* tableSlug: if tableSlug is defined, table description is opened for user by default for the first time
*/
const DescriptionBox = ( { children, title, sx, className, tableSlug, isMainTableDescription } ) => {
	const isControlledComponent = useRef( tableSlug !== undefined );
	const getUserLocalData = useUserLocalData( ( state ) => state.getUserLocalData );
	const setUserLocalData = useUserLocalData( ( state ) => state.setUserLocalData );

	const tableDescriptionRead = getUserLocalData( tableSlug, 'tableDescriptionRead' );

	const [ opened, setOpened ] = useState( isControlledComponent.current && ! tableDescriptionRead ? true : false );

	useEffect( () => {
		if ( isControlledComponent.current ) {
			setUserLocalData( tableSlug, { tableDescriptionRead: true } );
		}
	}, [ setUserLocalData, tableSlug ] );

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
				} : null ) }
			>
				<AccordionSummary
					className="urlslab-DescriptionBox-header"
					isMainTableDescription={ isMainTableDescription }
					isDescriptionBox
					leftIconIndicator
				>
					{ title }
				</AccordionSummary>

				<AccordionDetails
					isMainTableDescription={ isMainTableDescription }
					isDescriptionBox
				>
					{ children }
				</AccordionDetails>

			</Accordion>
		</AccordionGroup>
	);
};

export default memo( DescriptionBox );
