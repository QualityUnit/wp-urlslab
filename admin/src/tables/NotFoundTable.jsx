import { useRef, useState, useCallback } from 'react';

import {
	useInfiniteFetch, ProgressBar, SortBy, Tooltip, SortMenu, InputField, Checkbox, Trash, Loader, Table, ModuleViewHeaderBottom, TooltipSortingFiltering,
} from '../lib/tableImports';

import useTableUpdater from '../hooks/useTableUpdater';
import useChangeRow from '../hooks/useChangeRow';
import useRedirectTableMenus from '../hooks/useRedirectTableMenus';

import BrowserIcon from '../elements/BrowserIcon';
import { ReactComponent as PlusIcon } from '../assets/images/icons/icon-plus.svg';

export default function NotFoundTable( { slug } ) {
	const [ activePanel, setActivePanel ] = useState();
	const paginationId = 'url_id';
	const matchUrlField = useRef();

	const { table, setTable, rowToInsert, setInsertRow, filters, setFilters, sorting, sortBy } = useTableUpdater( { slug } );

	const url = `${ 'undefined' === typeof filters ? '' : filters }${ 'undefined' === typeof sorting ? '' : sorting }`;

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

	const { row, selectedRows, selectRow, deleteRow, deleteSelectedRows } = useChangeRow( { data, url, slug, paginationId } );

	const { redirectTypes, matchTypes, header: redirectHeader } = useRedirectTableMenus();

	const addRedirect = useCallback( ( { cell } ) => {
		const { url: defaultMatchUrl } = cell.row.original;
		matchUrlField.current = defaultMatchUrl;
		setInsertRow( { match_type: 'E', redirect_code: '301', match_url: defaultMatchUrl } );

		setActivePanel( 'addrow' );
	}, [ setInsertRow ] );

	const inserterCells = {
		match_type: <SortMenu autoClose items={ matchTypes } name="match_type" checkedId="E" onChange={ ( val ) => setInsertRow( { ...rowToInsert, match_type: val } ) }>{ redirectHeader.match_type }</SortMenu>,
		match_url: <InputField type="url" disabled ref={ matchUrlField } defaultValue={ matchUrlField.current } label={ redirectHeader.match_url } />,
		replace_url: <InputField type="url" liveUpdate defaultValue="" label={ redirectHeader.replace_url } onChange={ ( val ) => setInsertRow( { ...rowToInsert, replace_url: val } ) } required />,
		redirect_code: <SortMenu autoClose items={ redirectTypes } name="redirect_code" checkedId="301" onChange={ ( val ) => setInsertRow( { ...rowToInsert, redirect_code: val } ) }>{ redirectHeader.redirect_code }</SortMenu>,
	};

	const header = {
		url: __( 'URL' ),
		cnt: __( 'Visits' ),
		created: __( 'First visit' ),
		updated: 'Last visit',
		request_data: 'User agent',
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
			header: <SortBy props={ { sorting, key: 'url', onClick: () => sortBy( 'url' ) } }>{ header.url }</SortBy>,
			minSize: 300,
		} ),
		columnHelper.accessor( 'cnt', {
			header: <SortBy props={ { sorting, key: 'cnt', onClick: () => sortBy( 'cnt' ) } }>{ header.cnt }</SortBy>,
			minSize: 50,
		} ),
		columnHelper.accessor( 'created', {
			header: <SortBy props={ { sorting, key: 'created', onClick: () => sortBy( 'created' ) } }>{ header.created }</SortBy>,
			minSize: 100,
		} ),
		columnHelper.accessor( 'updated', {
			header: <SortBy props={ { sorting, key: 'updated', onClick: () => sortBy( 'updated' ) } }>{ header.updated }</SortBy>,
			minSize: 100,
		} ),
		columnHelper?.accessor( ( cell ) => JSON.parse( `${ cell?.request_data }` )?.server.agent, {
			id: 'agent',
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => <BrowserIcon uaString={ cell.getValue() } />,
			header: __( 'User Agent' ),
			size: 150,
		} ),
		columnHelper?.accessor( ( cell ) => JSON.parse( `${ cell?.request_data }` )?.server.referer, {
			id: 'referer',
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => {
				return cell.getValue();
			},
			header: __( 'Referer' ),
			size: 120,
		} ),
		columnHelper?.accessor( ( cell ) => JSON.parse( `${ cell?.request_data }` )?.server.ip, {
			id: 'ip',
			cell: ( cell ) => {
				return cell.getValue();
			},
			header: 'IP address',
			size: 100,
		} ),
		columnHelper.accessor( 'addRedirect', {
			className: 'hoverize',
			tooltip: () => <Tooltip className="align-left xxxl">{ __( 'Create redirect from 404' ) }</Tooltip>,
			cell: ( cell ) => <PlusIcon onClick={ () => addRedirect( { cell } ) } />,
			header: null,
		} ),
		columnHelper.accessor( 'delete', {
			className: 'deleteRow',
			tooltip: () => <Tooltip className="align-left xxxl">{ __( 'Delete item' ) }</Tooltip>,
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
				selectedRows={ selectedRows }
				onSort={ ( val ) => sortBy( val ) }
				onDeleteSelected={ deleteSelectedRows }
				onFilter={ ( filter ) => setFilters( filter ) }
				onClearRow={ ( clear ) => {
					setActivePanel();
					setInsertRow();
					if ( clear === 'rowInserted' ) {
						setInsertRow( clear );
						setTimeout( () => {
							setInsertRow( );
						}, 3000 );
					}
				} }
				noImport
				noInsert
				activatePanel={ activePanel }
				insertOptions={ {
					inserterCells, title: 'Create redirect from this',
					data, slug: 'redirects', url: '', paginationId: 'redirect_id', rowToInsert,
				} }
				exportOptions={ {
					slug,
					filters,
					fromId: `from_${ paginationId }`,
					paginationId,
					deleteCSVCols: [ paginationId, 'dest_url_id' ],
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
				{ ( rowToInsert === 'rowInserted' )
					? <Tooltip center>{ __( 'Redirect rule has been added.' ) }</Tooltip>
					: null
				}
				<TooltipSortingFiltering props={ { isFetching, filters, sorting } } />
				<div ref={ ref }>
					{ isFetchingNextPage ? '' : hasNextPage }
					<ProgressBar className="infiniteScroll" value={ ! isFetchingNextPage ? 0 : 100 } />
				</div>
			</Table>
		</>
	);
}
