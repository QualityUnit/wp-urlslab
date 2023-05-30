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

export default function UsageTable( { slug } ) {
	const paginationId = 'id';
	const { table, setTable, filters, sorting, sortBy } = useTableUpdater( { slug } );
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
		groupBucketTitle: __( 'Date' ),
		creditType: __( 'Type' ),
		events: __( 'Count' ),
		credits: __( 'Usage' ),
	};

	const columns = [
		columnHelper.accessor( 'groupBucketTitle', {
			header: ( th ) => header.groupBucketTitle,
			size: 200,
		} ),
		columnHelper.accessor( 'creditType', {
			header: ( th ) => header.creditType,
			size: 100,
		} ),
		columnHelper.accessor( 'events', {
			header: ( th ) => header.events,
			size: 100,
		} ),
		columnHelper.accessor( 'credits', {
			header: ( th ) => header.credits,
			size: 100,
		} ),
	];

	if ( status === 'loading' ) {
		return <Loader />;
	}

	return (
		<>
			<ModuleViewHeaderBottom
				table={ table }
				noFiltering
				noCount
				noExport
				noImport
				noDelete
				options={ { header, data, slug, paginationId, url } }
			/>
			<Table className="noHeightLimit fadeInto"
				slug={ slug }
				returnTable={ ( returnTable ) => setTable( returnTable ) }
				columns={ columns }
				data={ isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] ) }
				initialState={ { columnVisibility: { events: false } } }
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
