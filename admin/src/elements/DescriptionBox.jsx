import classNames from 'classnames';

import AccordionGroup from '@mui/joy/AccordionGroup';
import Accordion from '@mui/joy/Accordion';
import AccordionSummary from '@mui/joy/AccordionSummary';
import AccordionDetails from '@mui/joy/AccordionDetails';

/*
* isMainTableDescription: used for description above main module table to follow paddings of module header
*/
const DescriptionBox = ( { children, title, sx, className, isMainTableDescription } ) => {
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
			<Accordion>
				<AccordionSummary
					className="urlslab-DescriptionBox-header"
					isMainTableDescription={ isMainTableDescription }
					isDescriptionBox
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

export default DescriptionBox;
