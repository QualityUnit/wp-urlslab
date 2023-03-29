import { useMemo } from 'react';
import {
	useInfiniteFetch, Tooltip, Checkbox, Trash, SortMenu, InputField, Loader, Table, ModuleViewHeaderBottom,
} from '../constants/tableImports';

import { langName } from '../constants/helpers';

import useTableUpdater from '../hooks/useTableUpdater';
import useChangeRow from '../hooks/useChangeRow';

export default function GeneratorTable( { slug } ) {
	const pageId = 'generator_id';
	const { table, setTable, filters, setFilters, currentFilters, sortingColumn, sortBy } = useTableUpdater( { slug } );

	const url = useMemo( () => `${ filters }${ sortingColumn }`, [ filters, sortingColumn ] );

	const {
		__,
		columnHelper,
		data,
		status,
		isSuccess,
		isFetchingNextPage,
		hasNextPage,
		ref,
	} = useInfiniteFetch( { key: slug, url, pageId, currentFilters, sortingColumn } );

	const { row, selectRow, deleteRow, updateRow } = useChangeRow( { data, url, slug, pageId } );

	const header = {
		query: __( 'Query' ),
		context: __( 'Context' ),
		lang: __( 'Language code' ),
		status: __( 'Status' ),
		status_changed: __( 'Changed at' ),
		results: __( 'Results' ),
	};

	const columns = [
		columnHelper.accessor( 'check', {
			className: 'checkbox',
			cell: ( cell ) => <Checkbox checked={ cell.row.getIsSelected() } onChange={ ( val ) => {
				selectRow( val, cell );
			} } />,
			header: null,
		} ),
		columnHelper.accessor( 'query', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			header: header.query,
			size: 200,
		} ),
		columnHelper.accessor( 'context', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			header: header.context,
			size: 200,
		} ),
		columnHelper.accessor( 'lang', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => langName( cell?.getValue() ),
			header: header.lang,
			size: 165,
		} ),
		columnHelper.accessor( 'results', {
			className: 'nolimit',
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => <InputField defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: header.results,
			size: 200,
		} ),
		columnHelper.accessor( 'status', {
			className: 'status',
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			header: header.status,
			size: 100,
		} ),
		columnHelper.accessor( 'status_changed', {
			cell: ( val ) => new Date( val?.getValue() ).toLocaleString( window.navigator.language ),
			header: header.status_changed,
			size: 100,
		} ),
		columnHelper.accessor( 'delete', {
			className: 'deleteRow',
			cell: ( cell ) => <Trash onClick={ () => deleteRow( { cell } ) } />,
			header: null,
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
				noImport
				onSort={ ( val ) => sortBy( val ) }
				onFilter={ ( filter ) => setFilters( filter ) }
				exportOptions={ {
					url: slug,
					filters,
					fromId: `from_${ pageId }`,
					pageId,
					deleteCSVCols: [ pageId, 'generator_id' ],
				} }
			/>
			<Table className="fadeInto"
				slug={ slug }
				columns={ columns }
				returnTable={ ( returnTable ) => setTable( returnTable ) }
				data={
					isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] )
				}
			>
				{ row
					? <Tooltip center>{ __( 'Row has been deleted.' ) }</Tooltip>
					: null
				}
				<button ref={ ref }>{ isFetchingNextPage ? 'Loading more...' : hasNextPage }</button>
			</Table>
		</>
	);
}
