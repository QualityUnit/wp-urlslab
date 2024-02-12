import { memo } from 'react';
import useSelectRows from '../hooks/useSelectRows';
import useChangeRow from '../hooks/useChangeRow';
import useTableStore from '../hooks/useTableStore';
import Checkbox from './Checkbox';

const TableSelectCheckbox = ( { tableElement, customSlug, className, options } ) => {
	let slug = useTableStore( ( state ) => state.activeTable );
	if ( customSlug ) {
		slug = customSlug;
	}
	const selectedAll = useSelectRows( ( state ) => state.selectedAll[ slug ] );
	const selectedRows = useSelectRows( ( state ) => state.selectedRows[ slug ] );
	const { selectRows } = useChangeRow( { customSlug: slug } );

	const rowId = tableElement?.row?.id;
	const allRows = rowId === undefined;

	const selected = allRows
		? selectedAll
		: selectedRows?.[ rowId ] !== undefined;

	return (
		<Checkbox
			value={ selected }
			onChange={ ( checked ) => selectRows( { tableElement, checked, allRows, maxRows: options?.maxRows } ) }
			{ ...( className ? { className } : null ) }
		/>
	);
};

export default memo( TableSelectCheckbox );
