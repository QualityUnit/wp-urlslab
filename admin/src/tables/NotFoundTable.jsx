import { useRef, useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import {
	useInfiniteFetch, ProgressBar, SortBy, Tooltip, SingleSelectMenu, InputField, Checkbox, Trash, Loader, Table, ModuleViewHeaderBottom, TooltipSortingFiltering, TagsMenu,
} from '../lib/tableImports';

import useTableUpdater from '../hooks/useTableUpdater';
import useChangeRow from '../hooks/useChangeRow';
import useRedirectTableMenus from '../hooks/useRedirectTableMenus';

import BrowserIcon from '../elements/BrowserIcon';
import { ReactComponent as PlusIcon } from '../assets/images/icons/icon-plus.svg';

export default function NotFoundTable( { slug } ) {
	const paginationId = 'url_id';
	const matchUrlField = useRef();
	const queryClient = useQueryClient();

	const { table, setTable, filters, setFilters, sorting, sortBy } = useTableUpdater( { slug } );

	const defaultSorting = sorting.length ? sorting : [ { key: 'updated', dir: 'DESC', op: '<' } ];

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

	const { row, selectedRows, selectRow, activePanel, setActivePanel, deleteRow, deleteSelectedRows, updateRow } = useChangeRow( { data, url, slug, paginationId } );

	const [ rowToEdit, setEditorRow ] = useState( {} ); // setting row state here due to updating value on rerender, causing sending wrong values from addRedirect function

	const { redirectTypes, matchTypes, header: redirectHeader } = useRedirectTableMenus();

	const addRedirect = useCallback( ( { cell } ) => {
		const { url: defaultMatchUrl } = cell.row.original;
		matchUrlField.current = defaultMatchUrl;
		setEditorRow( { match_type: 'E', redirect_code: '301', match_url: defaultMatchUrl } );

		setActivePanel( 'rowInserter' );
	}, [ setActivePanel, setEditorRow ] );

	const rowEditorCells = {
		match_type: <SingleSelectMenu autoClose items={ matchTypes } name="match_type" defaultValue="E" onChange={ ( val ) => setEditorRow( { ...rowToEdit, match_type: val } ) }>{ redirectHeader.match_type }</SingleSelectMenu>,
		match_url: <InputField type="url" liveUpdate ref={ matchUrlField } defaultValue={ matchUrlField.current } label={ redirectHeader.match_url } onChange={ ( val ) => setEditorRow( { ...rowToEdit, match_url: val } ) } />,
		replace_url: <InputField type="url" liveUpdate defaultValue="" label={ redirectHeader.replace_url } onChange={ ( val ) => setEditorRow( { ...rowToEdit, replace_url: val } ) } required />,
		redirect_code: <SingleSelectMenu autoClose items={ redirectTypes } name="redirect_code" defaultValue="301" onChange={ ( val ) => setEditorRow( { ...rowToEdit, redirect_code: val } ) }>{ redirectHeader.redirect_code }</SingleSelectMenu>,
	};

	const header = {
		url: __( 'URL' ),
		cnt: __( 'Visits' ),
		created: __( 'First visit' ),
		updated: 'Last visit',
		labels: 'Tags',
		request_data: 'User agent',
	};

	const columns = [
		columnHelper.accessor( 'check', {
			className: 'nolimit checkbox',
			cell: ( cell ) => <Checkbox defaultValue={ cell.row.getIsSelected() } onChange={ ( val ) => {
				selectRow( val, cell );
			} } />,
			header: null,
		} ),
		columnHelper.accessor( 'url', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.url }</SortBy>,
			minSize: 200,
		} ),
		columnHelper.accessor( 'cnt', {
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.cnt }</SortBy>,
			minSize: 50,
		} ),
		columnHelper.accessor( 'created', {
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.created }</SortBy>,
			minSize: 80,
		} ),
		columnHelper.accessor( 'updated', {
			header: ( th ) => <SortBy props={ { header, sorting: defaultSorting, th, onClick: () => sortBy( th ) } }>{ header.updated }</SortBy>,
			minSize: 80,
		} ),
		columnHelper?.accessor( ( cell ) => JSON.parse( `${ cell?.request_data }` )?.server.referer, {
			id: 'referer',
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => {
				return cell.getValue();
			},
			header: __( 'Referer' ),
			size: 100,
		} ),
		columnHelper?.accessor( ( cell ) => JSON.parse( `${ cell?.request_data }` )?.server.ip, {
			id: 'ip',
			cell: ( cell ) => {
				return cell.getValue();
			},
			header: 'IP address',
			size: 100,
		} ),
		columnHelper?.accessor( ( cell ) => JSON.parse( `${ cell?.request_data }` )?.server.agent, {
			id: 'agent',
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => <BrowserIcon uaString={ cell.getValue() } />,
			header: __( 'User Agent' ),
			size: 100,
		} ),
		columnHelper.accessor( 'labels', {
			className: 'nolimit',
			cell: ( cell ) => <TagsMenu defaultValue={ cell.getValue() } slug={ slug } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: header.labels,
			size: 150,
		} ),
		columnHelper.accessor( 'addRedirect', {
			className: 'hoverize',
			tooltip: () => <Tooltip className="align-left xxxl">{ __( 'Create redirect from 404' ) }</Tooltip>,
			cell: ( cell ) => <PlusIcon onClick={ () => addRedirect( { cell } ) } />,
			header: null,
		} ),
		columnHelper.accessor( 'editRow', {
			className: 'editRow',
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
				onDeleteSelected={ deleteSelectedRows }
				onFilter={ ( filter ) => setFilters( filter ) }
				onUpdateRow={ ( val ) => {
					setActivePanel();
					setEditorRow();

					if ( val === 'rowInserted' ) {
						queryClient.invalidateQueries( [ 'redirects' ], { refetchType: 'all' } );
						setActivePanel();
						setEditorRow( val );
						setTimeout( () => {
							setEditorRow( );
						}, 3000 );
					}
				} }
				noImport
				noInsert
				activatePanel={ activePanel }
				rowEditorOptions={ {
					rowEditorCells, title: 'Create redirect from this',
					data, slug: 'redirects', url, paginationId: 'redirect_id', rowToEdit,
				} }
				exportOptions={ {
					slug,
					url,
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
				{ ( rowToEdit === 'rowInserted' )
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
