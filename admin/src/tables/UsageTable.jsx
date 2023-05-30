import {
	useInfiniteFetch,
	Loader,
	Table,
	ModuleViewHeaderBottom,
	TooltipSortingFiltering,
	ProgressBar, Tooltip, SortBy, DateTimeFormat,
} from '../lib/tableImports';

import useTableUpdater from '../hooks/useTableUpdater';

import '../assets/styles/components/_ModuleViewHeader.scss';

export default function UsageTable( { slug } ) {
	const paginationId = 'id';
	const { table, setTable, filters, sorting, sortBy } = useTableUpdater( { slug } );

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
			size: 80,
		} ),
		columnHelper.accessor( 'creditType', {
			header: ( th ) => header.creditType,
			size: 80,
		} ),
		columnHelper.accessor( 'events', {
			header: ( th ) => header.events,
			size: 60,
		} ),
		columnHelper.accessor( 'credits', {
			header: ( th ) => header.credits,
			size: 60,
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
				noImport
				noDelete
			/>
			<Table className="noHeightLimit fadeInto"
				slug={ slug }
				returnTable={ ( returnTable ) => setTable( returnTable ) }
				columns={ columns }
				data={ isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] ) }
				initialState={ { columnVisibility: { events: false } } }
			>
				<TooltipSortingFiltering props={ { isFetching, filters, sorting } } />
			</Table>
		</>
	);
}
