/* eslint-disable indent */
import { useMemo, useState } from 'react';
import {
	useInfiniteFetch, SortMenu, LangMenu, InputField, Checkbox, LinkIcon, Trash, Loader, Tooltip, Table, ModuleViewHeaderBottom,
} from '../lib/tableImports';

import useTableUpdater from '../hooks/useTableUpdater';
import useChangeRow from '../hooks/useChangeRow';

export default function KeywordsTable( { slug } ) {
	const pageId = 'kw_id';
	const { table, setTable, rowToInsert, setInsertRow, filters, setFilters, sortingColumn, sortBy } = useTableUpdater( { slug } );
	const url = useMemo( () => `${ filters }${ sortingColumn }`, [ filters, sortingColumn ] );
	const [ detailsOptions, setDetailsOptions ] = useState( null );

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
		urlFilter: __( 'URL Filter' ),
		urlLink: __( 'Link' ),
	};

	const inserterCells = {
		keyword: <InputField liveUpdate defaultValue="" label={ header.keyword } onChange={ ( val ) => setInsertRow( { ...rowToInsert, keyword: val } ) } required />,
		kwType: <SortMenu autoClose items={ keywordTypes } name="kwType" checkedId="M" onChange={ ( val ) => setInsertRow( { ...rowToInsert, kwType: val } ) }>{ header.kwType }</SortMenu>,
		kw_priority: <InputField liveUpdate type="number" defaultValue="0" min="0" max="255" label={ header.kw_priority } onChange={ ( val ) => setInsertRow( { ...rowToInsert, kw_priority: val } ) } />,
		lang: <LangMenu autoClose checkedId="all" onChange={ ( val ) => setInsertRow( { ...rowToInsert, lang: val } ) }>{ __( 'Language' ) }</LangMenu>,
		urlFilter: <InputField liveUpdate defaultValue="" label={ header.urlFilter } onChange={ ( val ) => setInsertRow( { ...rowToInsert, urlFilter: val } ) } />,
		urlLink: <InputField liveUpdate type="url" defaultValue="" label={ header.urlLink } onChange={ ( val ) => setInsertRow( { ...rowToInsert, urlLink: val } ) } required />,
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
			filterValMenu: keywordTypes,
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
			cell: ( cell ) => <div className="flex flex-align-center">
				{ cell?.getValue() }
				{ cell?.getValue() > 0 &&
					<button className="ml-s" onClick={ () => setDetailsOptions( {
						title: `Keyword “${
							cell.row.original.keyword }” used on these URLs`, slug, url: `${ cell.row.original.kw_id }/${ cell.row.original.dest_url_id }`, showKeys: [ 'link_type', 'url_name' ], listId: 'url_id' } ) }>
						<LinkIcon />
						<Tooltip>{ __( 'Show URLs where used' ) }</Tooltip>
					</button>
				}
			</div>,
			header: header.kw_usage_count,
			size: 70,
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
				onClearRow={ ( clear ) => clear && setInsertRow() }
				detailsOptions={ detailsOptions }
				insertOptions={ { inserterCells, title: 'Add keyword', data, slug, url, pageId, rowToInsert } }
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
