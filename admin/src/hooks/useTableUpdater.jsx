import { useState } from 'react';
import { useFilter, useSorting } from '../hooks/filteringSorting';
import { useChangeRow } from '../hooks/useChangeRow';

export default function useTableUpdater() {
	const [ tableHidden, setHiddenTable ] = useState( false );
	const { filters, currentFilters, addFilter, removeFilter } = useFilter();
	const { sortingColumn, sortBy } = useSorting();
	const { deleteRow, updateRow } = useChangeRow();

	return {
		tableHidden, setHiddenTable, filters, currentFilters, addFilter, removeFilter, sortingColumn, sortBy, deleteRow, updateRow,
	};
}
