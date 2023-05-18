import {
	useInfiniteFetch,
	Loader,
	Table,
	ModuleViewHeaderBottom,
	TooltipSortingFiltering,
	ProgressBar,
} from '../lib/tableImports';

import useTableUpdater from '../hooks/useTableUpdater';

import '../assets/styles/components/_ModuleViewHeader.scss';

export default function CreditsTable( { slug } ) {
	const paginationId = 'id';
	const { table, setTable, filters, sorting } = useTableUpdater( { slug } );

	const url = { filters, sorting };

	const {
		__,
		columnHelper,
		data,
		status,
		isSuccess,
		isFetching,
		isFetchingNextPage,
		hasNextPage,
		ref,
	} = useInfiniteFetch( { key: slug, filters, sorting, paginationId } );

	const header = {
		id: __( 'Transaction Id' ),
		creditType: __( 'Type' ),
		creditOperation: __( 'Operation' ),
		operationDate: __( 'Timestamp' ),
		url: __( 'URL' ),
	};

	const columns = [
		columnHelper.accessor( 'id', {
			header: header.id,
			size: 90,
		} ),
		columnHelper.accessor( 'creditType', {
			header: header.creditType,
			size: 90,
		} ),
		columnHelper.accessor( 'creditOperation', {
			header: header.creditOperation,
			size: 90,
		} ),
		columnHelper.accessor( 'operationDate', {
			header: header.operationDate,
			size: 90,
		} ),
		columnHelper.accessor( 'url', {
			header: header.url,
			size: 90,
		} ),
	];

	if ( status === 'loading' ) {
		return <Loader />;
	}

	return (
		<>
			<ModuleViewHeaderBottom
				slug={ slug }
				header={ header }
				table={ table }
				noFiltering
				noCount
				noExport
				noDelete
			/>
			<Table className="noHeightLimit fadeInto"
				slug={ slug }
				returnTable={ ( returnTable ) => setTable( returnTable ) }
				columns={ columns }
				data={ isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] ) }
			>
				<TooltipSortingFiltering props={ { isFetching, filters, sorting } } />
				<div ref={ ref }>
					{ isFetchingNextPage ? '' : hasNextPage }
					<ProgressBar className="infiniteScroll" value={ ! isFetchingNextPage ? 0 : 100 } />
				</div>
			</Table>
		</>
	);
}
