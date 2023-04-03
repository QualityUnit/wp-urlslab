import { useMemo } from 'react';
import {
	useInfiniteFetch, Tooltip, Checkbox, InputField, SortMenu, Trash, Loader, Table, ModuleViewHeaderBottom,
} from '../lib/tableImports';

import useTableUpdater from '../hooks/useTableUpdater';
import useChangeRow from '../hooks/useChangeRow';

export default function RedirectsTable( { slug } ) {
	const pageId = 'redirect_id';

	const { table, setTable, rowToInsert, setInsertRow, filters, setFilters, sortingColumn, sortBy } = useTableUpdater( { slug } );

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

	const { row, selectRow, deleteRow } = useChangeRow( { data, url, slug, pageId } );

	const redirectTypes = {
		301: 'Moved Permanently (301)',
		307: 'Temporary Redirect (307)',
	};

	const header = {
		match_type: __( 'Match type' ),
		match_url: __( 'URL' ),
		replace_url: __( 'Redirect to URL' ),
		redirect_code: __( 'HTTP Code' ),
		is_logged: __( 'Is Logged in' ),
		capabilities: __( 'Capabilities' ),
		browser: __( 'Browser' ),
		cookie: __( 'Cookies' ),
		headers: __( 'Request headers' ),
		params: __( 'Request parameters' ),
		if_not_found: __( 'Execute if 404' ),
		cnt: __( 'Redirects Count' ),
	};

	const inserterCells = {
		match_type: <InputField type="url" liveUpdate defaultValue="" label={ header.match_type } onChange={ ( val ) => setInsertRow( { ...rowToInsert, match_type: val } ) } required />,
		match_url: <InputField type="url" liveUpdate defaultValue="" label={ header.match_url } onChange={ ( val ) => setInsertRow( { ...rowToInsert, match_url: val } ) } required />,
		replace_url: <InputField type="url" liveUpdate defaultValue="" label={ header.replace_url } onChange={ ( val ) => setInsertRow( { ...rowToInsert, replace_url: val } ) } required />,
		redirect_code: <SortMenu autoClose items={ redirectTypes } name="redirect_code" checkedId="301" onChange={ ( val ) => setInsertRow( { ...rowToInsert, redirect_code: val } ) } required>{ header.redirect_code }</SortMenu>,
		is_logged: <Checkbox onChange={ ( val ) => setInsertRow( { ...rowToInsert, is_logged: val } ) }>{ header.is_logged }</Checkbox>,
		headers: <InputField liveUpdate defaultValue="" label={ header.headers } onChange={ ( val ) => setInsertRow( { ...rowToInsert, headers: val } ) } />,
		cookie: <InputField liveUpdate defaultValue="" label={ header.cookie } onChange={ ( val ) => setInsertRow( { ...rowToInsert, cookie: val } ) } />,
		params: <InputField liveUpdate defaultValue="" label={ header.params } onChange={ ( val ) => setInsertRow( { ...rowToInsert, capabilities: val } ) } />,
		capabilities: <InputField liveUpdate defaultValue="" label={ header.capabilities } onChange={ ( val ) => setInsertRow( { ...rowToInsert, capabilities: val } ) } />,
		browser: <InputField liveUpdate defaultValue="" label={ header.browser } onChange={ ( val ) => setInsertRow( { ...rowToInsert, browser: val } ) } />,
		if_not_found: <InputField liveUpdate defaultValue="" label={ header.if_not_found } onChange={ ( val ) => setInsertRow( { ...rowToInsert, if_not_found: val } ) } />,
	};

	const columns = [
		columnHelper.accessor( 'check', {
			className: 'checkbox',
			cell: ( cell ) => <Checkbox checked={ cell.row.getIsSelected() } onChange={ ( val ) => {
				selectRow( val, cell );
			} } />,
			header: null,
		} ),
		columnHelper.accessor( 'match_type', {
			header: header.match_type,
			size: 80,
		} ),
		columnHelper.accessor( 'match_url', {
			header: header.match_url,
			size: 200,
		} ),
		columnHelper.accessor( 'replace_url', {
			header: header.replace_url,
			size: 100,
		} ),
		columnHelper.accessor( 'redirect_code', {
			filterValMenu: redirectTypes,
			className: 'nolimit',
			header: header.redirect_code,
			size: 100,
		} ),
		columnHelper.accessor( 'is_logged', {
			header: header.is_logged,
			size: 100,
		} ),
		columnHelper.accessor( 'capabilities', {
			header: header.capabilities,
			size: 100,
		} ),
		columnHelper.accessor( 'browser', {
			header: header.browser,
			size: 100,
		} ),
		columnHelper.accessor( 'cookie', {
			header: header.cookie,
			size: 100,
		} ),
		columnHelper.accessor( 'headers', {
			header: header.headers,
			size: 100,
		} ),
		columnHelper.accessor( 'params', {
			header: header.params,
			size: 100,
		} ),
		columnHelper.accessor( 'if_not_found', {
			header: header.if_not_found,
			size: 100,
		} ),
		columnHelper.accessor( 'cnt', {
			header: header.cnt,
			size: 100,
		} ),
		columnHelper.accessor( 'delete', {
			className: 'deleteRow',
			cell: ( cell ) => <Trash onClick={ () => deleteRow( { cell } ) } />,
			header: () => null,
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
				onSort={ ( val ) => sortBy( val ) }
				onFilter={ ( filter ) => setFilters( filter ) }
				insertOptions={ { inserterCells, title: 'Add redirect', data, slug, url, pageId, rowToInsert } }
				exportOptions={ {
					url: slug,
					filters,
					fromId: `from_${ pageId }`,
					pageId,
					deleteCSVCols: [ pageId ],
				} }
			/>
			<Table className="fadeInto"
				slug={ slug }
				returnTable={ ( returnTable ) => setTable( returnTable ) }
				columns={ columns }
				data={ isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] ) }
			>
				{ row
					? <Tooltip center>{ `${ header.str_search } “${ row.str_search }”` } { __( 'has been deleted.' ) }</Tooltip>
					: null
				}
				<button ref={ ref }>{ isFetchingNextPage ? 'Loading more...' : hasNextPage }</button>
			</Table>
		</>
	);
}
