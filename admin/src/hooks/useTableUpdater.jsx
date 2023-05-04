import { useState } from 'react';
import { useSorting } from '../hooks/filteringSorting';

export default function useTableUpdater( { slug } ) {
	const [ tableHidden, setHiddenTable ] = useState( false );
	const [ table, setTable ] = useState( );
	const [ filters, setFilters ] = useState( );
	const { sorting, sortBy } = useSorting( { slug } );

	return {
		tableHidden, setHiddenTable, table, setTable, filters, setFilters, sorting, sortBy,
	};
}
