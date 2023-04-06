import { useMemo } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { UAParser } from 'ua-parser-js';
import BrowserIcon from '../elements/BrowserIcon';

import {
	useInfiniteFetch, ProgressBar, Tooltip, Checkbox, Trash, Loader, Table, ModuleViewHeaderBottom,
} from '../lib/tableImports';

import useTableUpdater from '../hooks/useTableUpdater';
import useChangeRow from '../hooks/useChangeRow';

export default function NotFoundTable( { slug } ) {
	const pageId = 'url_id';

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
		url: __( 'URL' ),
		cnt: __( 'Visits' ),
		created: __( 'First Visit' ),
		updated: 'Last Visit',
		agent: 'User Agent',
		referer: 'Referer',
	};

	const columns = [
		columnHelper.accessor( 'check', {
			className: 'nolimit checkbox',
			cell: ( cell ) => <Checkbox checked={ cell.row.getIsSelected() } onChange={ ( val ) => {
				selectRow( val, cell );
			} } />,
			header: null,
		} ),
		columnHelper.accessor( 'url', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			header: header.url,
			minSize: 300,
		} ),
		columnHelper.accessor( 'cnt', {
			header: header.cnt,
			minSize: 50,
		} ),
		columnHelper.accessor( 'created', {
			header: header.created,
			minSize: 100,
		} ),
		columnHelper.accessor( 'updated', {
			header: header.updated,
			minSize: 100,
		} ),
		columnHelper?.accessor( ( cell ) => JSON.parse( `${ cell?.request_data }` )?.server.agent, {
			id: 'agent',
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => {
				const { browser, os, ua } = UAParser( cell.getValue() );
				return <BrowserIcon browserName={ browser.name } osName={ os.name || ua } />;
			},
			header: header.agent,
			size: 150,
		} ),
		columnHelper?.accessor( ( cell ) => JSON.parse( `${ cell?.request_data }` )?.server.referer, {
			id: 'referer',
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => cell.getValue(),
			header: header.referer,
			size: 120,
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
				onSort={ ( val ) => sortBy( val ) }
				onFilter={ ( filter ) => setFilters( filter ) }
				onClearRow={ ( clear ) => clear }
				noImport
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
				data={ isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] ) }
			>
				{ row
					? <Tooltip center>{ `${ header.url } “${ row.url }”` } { __( 'has been deleted.' ) }</Tooltip>
					: null
				}
				<div ref={ ref }>
					{ isFetchingNextPage ? '' : hasNextPage }
					<ProgressBar className="infiniteScroll" value={ ! isFetchingNextPage ? 0 : 100 } />
				</div>
			</Table>
		</>
	);
}
