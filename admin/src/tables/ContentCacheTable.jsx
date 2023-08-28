import { useEffect } from 'react';
import { useI18n } from '@wordpress/react-i18n/';
import {
	useInfiniteFetch, ProgressBar, SortBy, Tooltip, Loader, Table, ModuleViewHeaderBottom, TooltipSortingFiltering, DateTimeFormat,
} from '../lib/tableImports';
import useTableStore from '../hooks/useTableStore';
import useTablePanels from '../hooks/useTablePanels';

export default function ContentCacheTable( { slug } ) {
	const { __ } = useI18n();
	const paginationId = 'cache_crc32';

	const {
		columnHelper,
		data,
		status,
		isSuccess,
		isFetchingNextPage,
		hasNextPage,
		ref,
	} = useInfiniteFetch( { slug } );

	const { resetTableStore } = useTableStore();
	const { resetPanelsStore } = useTablePanels();

	const header = {
		cache_content: __( 'Cache content' ),
		cache_len: __( 'Cache size' ),
		date_changed: __( 'Last change' ),
	};

	// Saving all variables into state managers
	useEffect( () => {
		resetTableStore();
		resetPanelsStore();

		useTableStore.setState( () => (
			{
				data,
				paginationId,
				slug,
				header,
			}
		) );
	}, [ ] );

	const columns = [
		columnHelper.accessor( 'cache_content', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			header: ( th ) => <SortBy { ...th } />,
			size: 300,
		} ),
		columnHelper.accessor( 'cache_len', {
			cell: ( cell ) => `${ Math.round( cell.getValue() / 1024, 0 ) }\u00A0kB`,
			header: ( th ) => <SortBy { ...th } />,
			size: 80,
		} ),
		columnHelper.accessor( 'date_changed', {
			cell: ( val ) => <DateTimeFormat datetime={ val.getValue() } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 115,
		} ),
	];

	if ( status === 'loading' ) {
		return <Loader />;
	}

	return (
		<>
			<ModuleViewHeaderBottom />
			<Table className="fadeInto"
				columns={ columns }
				data={
					isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] )
				}
			>
				<TooltipSortingFiltering />
				<div ref={ ref }>
					{ isFetchingNextPage ? '' : hasNextPage }
					<ProgressBar className="infiniteScroll" value={ ! isFetchingNextPage ? 0 : 100 } />
				</div>
			</Table>
		</>
	);
}
