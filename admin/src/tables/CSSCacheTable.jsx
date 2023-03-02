import { useState } from 'react';
import { useI18n } from '@wordpress/react-i18n';
import { createColumnHelper } from '@tanstack/react-table';

import useInfiniteFetch from '../hooks/useInfiniteFetch';
import { useFilter, useSorting } from '../hooks/filteringSorting';
import { handleInput, handleSelected } from '../constants/tableFunctions';

import SortMenu from '../elements/SortMenu';
import Checkbox from '../elements/Checkbox';

import Loader from '../components/Loader';

import Table from '../components/TableComponent';
import ModuleViewHeaderBottom from '../components/ModuleViewHeaderBottom';

export default function CSSCacheTable() {
	const { __ } = useI18n();
	const [ tableHidden, setHiddenTable ] = useState( false );
	const columnHelper = createColumnHelper();
	const { filters, currentFilters, addFilter, removeFilter } = useFilter();
	const { sortingColumn, sortBy } = useSorting();

	const {
		data,
		status,
		isSuccess,
		isFetchingNextPage,
		hasNextPage,
		ref,
	} = useInfiniteFetch( { key: 'css-cache', url: `${ filters }${ sortingColumn }`, pageId: 'url_id' } );

	const statusTypes = {
		N: __( 'New' ),
		A: __( 'Available' ),
		P: __( 'Processing' ),
		D: __( 'Disabled' ),
	};

	const columns = [
		columnHelper.accessor( 'check', {
			className: 'checkbox',
			cell: ( cell ) => <Checkbox checked={ cell.row.getIsSelected() } onChange={ ( val ) => {
				handleSelected( val, cell );
			} } />,
			header: () => __( '' ),
		} ),
		columnHelper?.accessor( 'url_id', {
			header: () => __( 'URL Id' ),
		} ),
		columnHelper?.accessor( 'status', {
			cell: ( cell ) => <SortMenu
				items={ statusTypes }
				name={ cell.column.id }
				checkedId={ cell.getValue() }
				onChange={ ( val ) => handleInput( val, cell ) } />,
			className: 'youtube-status',
			header: () => __( 'Status' ),
		} ),
		columnHelper?.accessor( 'filesize', {
			header: () => __( 'Filesize' ),
		} ),
		columnHelper?.accessor( 'status_changed', {
			header: () => __( 'Status changed' ),
		} ),
		columnHelper?.accessor( 'url', {
			header: () => __( 'URL' ),
		} ),
	];

	if ( status === 'loading' ) {
		return <Loader />;
	}

	return (
		<Table className="fadeInto" columns={ columns }
			data={
				isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] )
			}
		>
			<button ref={ ref }>{ isFetchingNextPage ? 'Loading more...' : hasNextPage }</button>
		</Table>
	);
}
