import { useI18n } from '@wordpress/react-i18n';
import { createColumnHelper } from '@tanstack/react-table';

import useInfiniteFetch from '../hooks/useInfiniteFetch';
import { useFilter, useSorting } from '../hooks/filteringSorting';
import { handleSelected } from '../constants/tableFunctions';
import Checkbox from '../elements/Checkbox';

import Table from '../components/TableComponent';

import Loader from '../components/Loader';

export default function ContentCacheTable() {
	const { __ } = useI18n();
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
	} = useInfiniteFetch( { key: 'content-cache', url: `${ filters }${ sortingColumn }`, pageId: 'cache_crc32' } );

	const columns = [
		columnHelper.accessor( 'check', {
			className: 'checkbox',
			cell: ( cell ) => <Checkbox checked={ cell.row.getIsSelected() } onChange={ ( val ) => {
				handleSelected( val, cell );
			} } />,
			header: () => __( '' ),
		} ),
		columnHelper.accessor( 'date_changed', {
			header: () => __( 'Changed at' ),
		} ),
		columnHelper.accessor( 'cache_len', {
			header: () => __( 'Cache size' ),
		} ),
		columnHelper.accessor( 'cache_content', {
			cell: ( cell ) => <div className="limit-100">{ cell?.getValue() }</div>,
			header: () => __( 'Cache content' ),
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
