import {
	useInfiniteFetch,
	ProgressBar,
	SortBy,
	Tooltip,
	Trash,
	Checkbox,
	Loader,
	Table,
	ModuleViewHeaderBottom,
	TooltipSortingFiltering,
	InputField, SingleSelectMenu,
} from '../lib/tableImports';

import useTableUpdater from '../hooks/useTableUpdater';
import useChangeRow from '../hooks/useChangeRow';

import '../assets/styles/components/_ModuleViewHeader.scss';

export default function CreditsTable( { slug } ) {
	const paginationId = 'id';
	const { table, setTable, filters, sorting } = useTableUpdater( { slug } );

	const url = {  };

	const {
		__,
		columnHelper,
		data,
		status,
		isSuccess,
		isFetching,
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
			header: ( th ) => { header.id },
			size: 90,
		} ),
		columnHelper.accessor( 'creditType', {
			header: ( th ) => { header.creditType },
			size: 90,
		} ),
		columnHelper.accessor( 'creditOperation', {
			header: ( th ) => { header.creditOperation },
			size: 90,
		} ),
		columnHelper.accessor( 'operationDate', {
			header: ( th ) => { header.operationDate },
			size: 90,
		} ),
		columnHelper.accessor( 'url', {
			header: ( th ) => { header.url },
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
				<TooltipSortingFiltering props={ { isFetching } } />
			</Table>
		</>
	);
}
