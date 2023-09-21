import { forwardRef } from 'react';

import JoyTable from '@mui/joy/Table';
import Sheet from '@mui/joy/Sheet';

import '../assets/styles/components/_TableComponent.scss';

const TableSimple = forwardRef( ( { containerProps, children, ...props }, ref ) => {
	return (
		<Sheet
			ref={ ref }
			variant="plain"
			className="urlslab-table-container"
			urlslabTableContainer
			{ ...containerProps }
		>
			<JoyTable
				className="urlslab-table"
				{ ...props }
				urlslabTable
			>
				{ children }
			</JoyTable>
		</Sheet>
	);
} );

export default TableSimple;
