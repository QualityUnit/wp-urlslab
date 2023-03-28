/* eslint-disable indent */
import { useMemo } from 'react';
import {
	useInfiniteFetch, SortMenu, LangMenu, InputField, Checkbox, Trash, Loader, Tooltip, Table, ModuleViewHeaderBottom,
} from '../constants/tableImports';

import useTableUpdater from '../hooks/useTableUpdater';
import useChangeRow from '../hooks/useChangeRow';

export default function KeywordsTable( { slug } ) {
	const pageId = 'kw_id';
	const { table, setTable, filters, setFilters, sortingColumn, sortBy } = useTableUpdater( { slug } );
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
	} = useInfiniteFetch( { key: slug, url, pageId } );

	const { row, rowsSelected, selectRow, deleteRow, updateRow } = useChangeRow( { data, url, slug, pageId } );

	const keywordTypes = {
		M: __( 'Manual' ),
		I: __( 'Imported' ),
		X: __( 'None' ),
	};

	const header = {
		keyword: __( 'Keyword' ),
		kwType: __( 'Type' ),
		kw_length: __( 'Length' ),
		kw_priority: __( 'Priority' ),
		kw_usage_count: __( 'Usage' ),
		lang: __( 'Language' ),
		link_usage_count: __( 'Link Usage' ),
		urlFilter: __( 'URL Filter' ),
		urlLink: __( 'Link' ),
	};

	const columns = [
		columnHelper.accessor( 'check', {
			className: 'checkbox',
			cell: ( cell ) => <Checkbox checked={ cell.row.getIsSelected() } onChange={ ( val ) => {
				selectRow( val, cell );
			} } />,
			header: null,
			enableResizing: false,
		} ),
		columnHelper.accessor( 'keyword', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			header: header.keyword,
			minSize: 150,
		} ),
		columnHelper.accessor( 'kwType', {
			className: 'nolimit',
			cell: ( cell ) => <SortMenu items={ keywordTypes } name={ cell.column.id } checkedId={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: header.kwType,
			size: 100,
		} ),
		columnHelper.accessor( 'kw_length', {
			header: header.kw_length,
			size: 80,
		} ),
		columnHelper.accessor( 'kw_priority', {
			className: 'nolimit',
			cell: ( cell ) => <InputField type="number" defaultValue={ cell.getValue() }
				onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: header.kw_priority,
			size: 80,
		} ),
		columnHelper.accessor( 'lang', {
			className: 'nolimit',
			cell: ( cell ) => <LangMenu checkedId={ cell?.getValue() }
				onChange={ ( newVal ) => updateRow( { newVal, cell } ) }
			/>,
			header: header.lang,
			size: 165,
		} ),
		columnHelper.accessor( 'kw_usage_count', {
			header: header.kw_usage_count,
			size: 70,
		} ),
		columnHelper.accessor( 'link_usage_count', {
			header: header.link_usage_count,
			size: 100,
		} ),
		columnHelper.accessor( 'urlFilter', {
			className: 'nolimit',
			cell: ( cell ) => <InputField defaultValue={ cell.renderValue() }
				onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: header.urlFilter,
			size: 100,
		} ),
		columnHelper.accessor( 'urlLink', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => <a href={ cell.getValue() } target="_blank" rel="noreferrer">{ cell.getValue() }</a>,
			header: header.urlLink,
			enableResizing: false,
			size: 350,
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
				rowsSelected={ rowsSelected }
				onSort={ ( val ) => sortBy( val ) }
				onFilter={ ( filter ) => setFilters( filter ) }
				exportOptions={ {
					url: slug,
					filters,
					fromId: `from_${ pageId }`,
					pageId,
					deleteCSVCols: [ pageId, 'dest_url_id' ],
				} }
			/>
			<Table className="fadeInto"
				slug={ slug }
				returnTable={ ( returnTable ) => setTable( returnTable ) }
				columns={ columns }
				data={ isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] ) }>
				{ row
					? <Tooltip center>{ `${ header.keyword } “${ row.keyword }”` } { __( 'has been deleted.' ) }</Tooltip>
						: null
				}
				<button ref={ ref }>{ isFetchingNextPage ? 'Loading more...' : hasNextPage }</button>
			</Table>
		</>
	);
}
