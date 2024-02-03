import { memo } from 'react';
import useSelectRows from '../hooks/useSelectRows';
import useChangeRow from '../hooks/useChangeRow';
import useTableStore from '../hooks/useTableStore';
import Checkbox from './Checkbox';

const TableSelectCheckbox = ( { tableElement } ) => {
	const slug = useTableStore( ( state ) => state.activeTable );
	const selectedAll = useSelectRows( ( state ) => state.selectedAll[ slug ] );
	const selectedRows = useSelectRows( ( state ) => state.selectedRows[ slug ] );
	const { selectRows } = useChangeRow();

	const rowId = tableElement?.row?.id;
	const isSelectAll = rowId === undefined;

	const selected = isSelectAll
		? selectedAll
		: selectedRows?.[ rowId ] !== undefined;

	return (
		<Checkbox
			value={ selected }
			onChange={ ( checked ) => selectRows( tableElement, checked, isSelectAll ) }
		/>
	);
};

export default memo( TableSelectCheckbox );
