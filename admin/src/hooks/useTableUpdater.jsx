import { useState } from 'react';
import { useFilter, useSorting } from '../hooks/filteringSorting';
import { useChangeRow } from '../hooks/useChangeRow';

export default function useTableUpdater( { slug } ) {
	const [ tableHidden, setHiddenTable ] = useState( false );
	const [ table, setTable ] = useState( );
	const [ filters, setFilters ] = useState( );
	const [ rowToInsert, setInsertRow ] = useState( {} );
	const { sortingColumn, sortBy } = useSorting( { slug } );
	const { row, deleteRow, updateRow } = useChangeRow();

	return {
		tableHidden, setHiddenTable, table, setTable, filters, setFilters, sortingColumn, sortBy, row, rowToInsert, setInsertRow, deleteRow, updateRow,
	};
}
