import { useState } from 'react';
import { useSorting } from '../hooks/filteringSorting';

export default function useTableUpdater( { slug } ) {
	const [ tableHidden, setHiddenTable ] = useState( false );
	const [ table, setTable ] = useState( );
	const [ filters, setFilters ] = useState( );
	const [ rowToInsert, setInsertRow ] = useState( {} );
	const { sortingColumn, sortBy } = useSorting( { slug } );
	console.log( 'bla' );

	return {
		tableHidden, setHiddenTable, table, setTable, filters, setFilters, sortingColumn, sortBy, rowToInsert, setInsertRow,
	};
}
