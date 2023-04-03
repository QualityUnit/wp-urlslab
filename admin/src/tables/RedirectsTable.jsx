import { useMemo } from 'react';
import {
	useInfiniteFetch, Tooltip, Checkbox, Trash, Loader, Table, ModuleViewHeaderBottom,
} from '../lib/tableImports';

import useTableUpdater from '../hooks/useTableUpdater';
import useChangeRow from '../hooks/useChangeRow';

export default function RedirectsTable( { slug } ) {
	const pageId = 'redirect_id';

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

	const { row, selectRow, deleteRow } = useChangeRow( { data, url, slug, pageId } );


	const header = {
		match_type: __( 'Match type' ),
		match_url: __( 'URL' ),
		replace_url: __( 'Redirect to URL' ),
		redirect_code: __( 'HTTP Code' ),
		is_logged: __( 'Login' ),
		capabilities: __( 'Capabilities' ),
		browser: __( 'Browser' ),
		cookie: __( 'Cookies' ),
		headers: __( 'Request headers' ),
		params: __( 'Request parameters' ),
		if_not_found: __( 'Execute if 404' ),
		cnt: __( 'Redirects Count' ),
	};


	const columns = [
		columnHelper.accessor( 'check', {
			className: 'nolimit checkbox',
			cell: ( cell ) => <Checkbox checked={ cell.row.getIsSelected() } onChange={ ( val ) => {
				selectRow( val, cell );
			} } />,
			header: null,
		} ),
		columnHelper.accessor( 'match_type', {
			className: 'nolimit',
			header: header.match_type,
			size: 30,
		} ),
		columnHelper.accessor( 'match_url', {
			className: 'nolimit',
			header: header.match_url,
			size: 300,
		} ),
		columnHelper.accessor( 'replace_url', {
			className: 'nolimit',
			header: header.replace_url,
			size: 100,
		} ),
		columnHelper.accessor( 'redirect_code', {
			className: 'nolimit',
			header: header.redirect_code,
			size: 100,
		} ),
		columnHelper.accessor( 'is_logged', {
			className: 'nolimit',
			header: header.is_logged,
			size: 100,
		} ),
		columnHelper.accessor( 'capabilities', {
			className: 'nolimit',
			header: header.capabilities,
			size: 100,
		} ),
		columnHelper.accessor( 'browser', {
			className: 'nolimit',
			header: header.browser,
			size: 100,
		} ),
		columnHelper.accessor( 'cookie', {
			className: 'nolimit',
			header: header.cookie,
			size: 100,
		} ),
		columnHelper.accessor( 'headers', {
			className: 'nolimit',
			header: header.headers,
			size: 100,
		} ),
		columnHelper.accessor( 'params', {
			className: 'nolimit',
			header: header.params,
			size: 100,
		} ),
		columnHelper.accessor( 'if_not_found', {
			className: 'nolimit',
			header: header.if_not_found,
			size: 100,
		} ),
		columnHelper.accessor( 'cnt', {
			className: 'nolimit',
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
