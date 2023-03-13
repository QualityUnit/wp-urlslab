import { useState } from 'react';
import { useFilter, useSorting } from '../hooks/filteringSorting';
import { useChangeRow } from '../hooks/useChangeRow';

export default function useTableUpdater() {
	const [ tableHidden, setHiddenTable ] = useState( false );
	const [ rowToInsert, setInsertRow ] = useState( {} );
	const { filters, currentFilters, addFilter, removeFilters } = useFilter();
	const { sortingColumn, sortBy } = useSorting();
	const { row, deleteRow, updateRow } = useChangeRow();

	return {
		tableHidden, setHiddenTable, filters, currentFilters, addFilter, removeFilters, sortingColumn, sortBy, row, rowToInsert, setInsertRow, deleteRow, updateRow,
	};
}
