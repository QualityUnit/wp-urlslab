/* eslint-disable indent */
import {
	useInfiniteFetch,
	ProgressBar,
	SortBy,
	Loader,
	Tooltip,
	Table,
	ModuleViewHeaderBottom,
	TooltipSortingFiltering,
	SingleSelectMenu, TextArea,
} from '../lib/tableImports';

import useTableUpdater from '../hooks/useTableUpdater';
import useChangeRow from '../hooks/useChangeRow';
import useTablePanels from '../hooks/useTablePanels';

export default function SerpTopDomainsTable( { slug } ) {
	const paginationId = 'domain_id';
	const { table, setTable, filters, setFilters, sorting, sortBy } = useTableUpdater( { slug } );
	const defaultSorting = sorting.length ? sorting : [ { key: 'top_10_cnt', dir: 'DESC', op: '<' } ];
	const url = { filters, sorting: defaultSorting };

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
	} = useInfiniteFetch( { key: slug, filters, sorting: defaultSorting, paginationId } );

	const { updateRow } = useChangeRow( { data, url, slug, paginationId } );

	const { setRowToEdit } = useTablePanels();
	const rowToEdit = useTablePanels( ( state ) => state.rowToEdit );

	const domainTypes = {
		X: __( 'Other' ),
		M: __( 'My Domain' ),
		C: __( 'Competitor' ),
	};
	const newDomainTypes = {
		M: __( 'My Domain' ),
		C: __( 'Competitor' ),
	};

	const header = {
		domain_name: __( 'Domain' ),
		domain_type: __( 'Type' ),
		top_10_cnt: __( 'Top 10 URLs' ),
		top_100_cnt: __( 'Top 100 URLs' ),
		avg_pos: __( 'Average Position' ),
	};

	const rowEditorCells = {
		domain_name: <TextArea autoFocus liveUpdate defaultValue="" label={ __( 'Add Domains' ) } rows={ 10 } allowResize onChange={ ( val ) => setRowToEdit( { ...rowToEdit, domain_name: val } ) } required description={ __( 'Domain names separated by new line' ) } />,
		domain_type: <SingleSelectMenu defaultAccept autoClose items={ newDomainTypes } name="domain_type" defaultValue="M" onChange={ ( val ) => setRowToEdit( { ...rowToEdit, domain_type: val } ) }>{ header.domain_type }</SingleSelectMenu>,
	};

	const columns = [
		columnHelper.accessor( 'domain_name', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => <a href={ cell.getValue() } target="_blank" rel="noreferrer"><strong>{ cell.getValue() }</strong></a>,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.domain_name }</SortBy>,
			minSize: 200,
		} ),

		columnHelper.accessor( 'domain_type', {
			filterValMenu: domainTypes,
			className: 'nolimit',
			cell: ( cell ) => <SingleSelectMenu items={ domainTypes } name={ cell.column.id } defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.domain_type }</SortBy>,
			size: 80,
		} ),

		columnHelper.accessor( 'top_10_cnt', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => <strong>{ cell.getValue() }</strong>,
			header: ( th ) => <SortBy props={ { header, sorting: defaultSorting, th, onClick: () => sortBy( th ) } }>{ header.top_10_cnt }</SortBy>,
			minSize: 50,
		} ),
		columnHelper.accessor( 'top_100_cnt', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => <strong>{ cell.getValue() }</strong>,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.top_100_cnt }</SortBy>,
			minSize: 50,
		} ),
		columnHelper.accessor( 'avg_pos', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => <strong>{ cell.getValue() }</strong>,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.avg_pos }</SortBy>,
			minSize: 50,
		} ),
	];

	if ( status === 'loading' ) {
		return <Loader />;
	}

	return (
		<>
			<ModuleViewHeaderBottom
				table={ table }
				onFilter={ ( filter ) => setFilters( filter ) }
				noDelete
				options={ { header, data, slug, paginationId, url, id: 'domain_name', title: 'Add Domains', rowToEdit, rowEditorCells,
					deleteCSVCols: [ paginationId, 'domain_id' ] }
				}
			/>
			<Table className="fadeInto"
				slug={ slug }
				returnTable={ ( returnTable ) => setTable( returnTable ) }
				columns={ columns }
				data={ isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] ) }>
				<TooltipSortingFiltering props={ { isFetching, filters, sorting } } />
				<div ref={ ref }>
					{ isFetchingNextPage ? '' : hasNextPage }
					<ProgressBar className="infiniteScroll" value={ ! isFetchingNextPage ? 0 : 100 } />
				</div>
			</Table>
		</>
	);
}
