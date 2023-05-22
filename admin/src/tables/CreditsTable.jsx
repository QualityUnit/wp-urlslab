import {
	useInfiniteFetch,
	Loader,
	Table,
	ModuleViewHeaderBottom,
	TooltipSortingFiltering,
	ProgressBar, Tooltip, SortBy,
} from '../lib/tableImports';

import useTableUpdater from '../hooks/useTableUpdater';

import '../assets/styles/components/_ModuleViewHeader.scss';

export default function CreditsTable( { slug } ) {
	const paginationId = 'id';
	const { table, setTable, filters, sorting } = useTableUpdater( { slug } );

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
			size: 60,
		} ),
		columnHelper.accessor( 'creditType', {
			header: header.creditType,
			size: 30,
		} ),
		columnHelper.accessor( 'creditOperation', {
			header: header.creditOperation,
			size: 30,
		} ),
		columnHelper.accessor( 'operationDate', {
			header: header.operationDate,
			size: 30,
		} ),
		columnHelper.accessor( 'url', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => <a href={ cell.getValue() } title={ cell.getValue() } target="_blank" rel="noreferrer">{ cell.getValue() }</a>,
			header: ( th ) => {
				header.url;
			},
			size: 200,
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
