import { useCallback, useEffect } from 'react';
import { useI18n } from '@wordpress/react-i18n/';
import { useQueryClient } from '@tanstack/react-query';

import {
	useInfiniteFetch, ProgressBar, SortBy, Tooltip, SingleSelectMenu, InputField, Checkbox, Loader, Table, ModuleViewHeaderBottom, TooltipSortingFiltering, TagsMenu, SuggestInputField, RowActionButtons, IconButton, DateTimeFormat,
} from '../lib/tableImports';

import useTableStore from '../hooks/useTableStore';
import useChangeRow from '../hooks/useChangeRow';
import useRedirectTableMenus from '../hooks/useRedirectTableMenus';
import useTablePanels from '../hooks/useTablePanels';

import BrowserIcon from '../elements/BrowserIcon';
import { ReactComponent as PlusIcon } from '../assets/images/icons/icon-plus.svg';

export default function NotFoundTable( { slug } ) {
	const { __ } = useI18n();
	const paginationId = 'url_id';
	const queryClient = useQueryClient();

	const defaultSorting = [ { key: 'updated', dir: 'DESC', op: '<' } ];

	const {
		columnHelper,
		data,
		status,
		isSuccess,
		isFetchingNextPage,
		hasNextPage,
		ref,
	} = useInfiniteFetch( { slug } );

	const { selectRows, deleteRow, updateRow } = useChangeRow();

	const { activatePanel, setRowToEdit, actionComplete } = useTablePanels();
	const rowToEdit = useTablePanels( ( state ) => state.rowToEdit );

	const { redirectTypes, matchTypes, header: redirectHeader } = useRedirectTableMenus();

	const addRedirect = useCallback( ( { cell } ) => {
		const { url: defaultMatchUrl } = cell.row.original;
		let replaceUrl = new URL( window.location.href );
		try {
			replaceUrl = new URL( defaultMatchUrl );
		} catch ( e ) {
		}

		useTableStore.setState( () => ( {
			paginationId: 'redirect_id',
			slug: 'redirects',
		} ) );

		setRowToEdit( { match_type: 'E', redirect_code: '301', match_url: defaultMatchUrl, replace_url: replaceUrl.protocol + replaceUrl.hostname } );
		useTablePanels.setState( () => (
			{
				rowEditorCells: { ...rowEditorCells, match_url: { ...rowEditorCells.match_url, props: { ...rowEditorCells.match_url.props, defaultValue: defaultMatchUrl } } },
			}
		) );

		activatePanel( 'rowInserter' );
	}, [ activatePanel, setRowToEdit ] );

	const getUrlDomain = ( urlVar ) => {
		try {
			const url_obj = new URL( urlVar );
			return url_obj.protocol + '//' + url_obj.hostname;
		} catch ( e ) {
			return urlVar;
		}
	};

	const rowEditorCells = {
		match_type: <SingleSelectMenu autoClose items={ matchTypes } name="match_type" defaultValue="E" onChange={ ( val ) => setRowToEdit( { ...rowToEdit, match_type: val } ) }>{ redirectHeader.match_type }</SingleSelectMenu>,
		match_url: <InputField type="url" liveUpdate defaultValue={ rowToEdit.match_url } label={ redirectHeader.match_url } onChange={ ( val ) => setRowToEdit( { ...rowToEdit, match_url: val } ) } />,
		replace_url: <SuggestInputField suggestInput={ rowToEdit?.match_url || '' }
			autoFocus
			liveUpdate
			defaultValue={ ( rowToEdit?.match_url ? getUrlDomain( rowToEdit?.match_url ) : window.location.origin ) }
			label={ redirectHeader.replace_url }
			onChange={ ( val ) => setRowToEdit( { ...rowToEdit, replace_url: val } ) }
			required showInputAsSuggestion={ true }
			referenceVal="match_url"
		/>,
		redirect_code: <SingleSelectMenu autoClose items={ redirectTypes } name="redirect_code" defaultValue="301" onChange={ ( val ) => setRowToEdit( { ...rowToEdit, redirect_code: val } ) }>{ redirectHeader.redirect_code }</SingleSelectMenu>,
		labels: <TagsMenu hasActivator label={ __( 'Tags:' ) } slug={ slug } onChange={ ( val ) => setRowToEdit( { ...rowToEdit, labels: val } ) } />,
	};

	const header = {
		url: __( 'URL' ),
		cnt: __( 'Visits' ),
		created: __( 'First visit' ),
		updated: __( 'Last visit' ),
		ip: __( 'IP address' ),
		request_data: __( 'User agent' ),
		labels: __( 'Tags' ),
	};

	useEffect( () => {
		useTablePanels.setState( () => (
			{
				rowEditorCells,
				deleteCSVCols: [ paginationId, 'dest_url_id' ],
			}
		) );
		useTableStore.setState( () => (
			{
				title: 'Create redirect from this',
				paginationId,
				slug,
				header,
				id: 'url',
				sorting: defaultSorting,
			}
		) );
	}, [] );

	// Saving all variables into state managers
	useEffect( () => {
		if ( actionComplete ) {
			queryClient.invalidateQueries( [ 'redirects' ], { refetchType: 'all' } );
			useTableStore.setState( () => ( {
				slug,
				paginationId,
			} ) );
		}

		useTableStore.setState( () => (
			{
				data,
			}
		) );
	}, [ data, actionComplete, queryClient ] );

	const columns = [
		columnHelper.accessor( 'check', {
			className: 'nolimit checkbox',
			cell: ( cell ) => <Checkbox defaultValue={ cell.row.getIsSelected() } onChange={ () => {
				selectRows( cell );
			} } />,
			header: ( head ) => <Checkbox defaultValue={ head.table.getIsAllPageRowsSelected() } onChange={ ( val ) => {
				head.table.toggleAllPageRowsSelected( val );
			} } />,
		} ),
		columnHelper.accessor( 'url', {
			tooltip: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			minSize: 200,
		} ),
		columnHelper.accessor( 'cnt', {
			header: ( th ) => <SortBy { ...th } />,
			minSize: 50,
		} ),
		columnHelper.accessor( 'created', {
			cell: ( val ) => <DateTimeFormat datetime={ val.getValue() } />,
			header: ( th ) => <SortBy { ...th } />,
			minSize: 80,
		} ),
		columnHelper.accessor( 'updated', {
			cell: ( val ) => <DateTimeFormat datetime={ val.getValue() } />,
			header: ( th ) => <SortBy { ...th } />,
			minSize: 80,
		} ),
		columnHelper?.accessor( ( cell ) => JSON.parse( `${ cell?.request_data }` )?.server.referer, {
			id: 'referer',
			tooltip: ( cell ) => cell.getValue(),
			cell: ( cell ) => cell.getValue(),
			header: __( 'Referer' ),
			size: 100,
		} ),
		columnHelper?.accessor( ( cell ) => JSON.parse( `${ cell?.request_data }` )?.server.ip, {
			id: 'ip',
			cell: ( cell ) => {
				return cell.getValue();
			},
			header: header.ip,
			size: 100,
		} ),
		columnHelper?.accessor( ( cell ) => JSON.parse( `${ cell?.request_data }` )?.server.agent, {
			id: 'agent',
			tooltip: ( cell ) => cell.getValue(),
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
		columnHelper.accessor( 'editRow', {
			className: 'editRow',
			cell: ( cell ) => <RowActionButtons
				onDelete={ () => deleteRow( { cell } ) }
			>
				<Tooltip title={ __( 'Create redirect from 404' ) }>
					<IconButton
						size="xs"
						onClick={ () => addRedirect( { cell } ) }
					>
						<PlusIcon />
					</IconButton>
				</Tooltip>
			</RowActionButtons>,
			header: null,
			size: 0,
		} ),
	];

	if ( status === 'loading' ) {
		return <Loader isFullscreen />;
	}

	return (
		<>
			<ModuleViewHeaderBottom
				noImport
				noInsert
			/>
			<Table className="fadeInto"
				initialState={ { columnVisibility: { referer: false, labels: false } } }
				columns={ columns }
				data={ isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] ) }
			>
				<TooltipSortingFiltering />
				<div ref={ ref }>
					{ isFetchingNextPage ? '' : hasNextPage }
					<ProgressBar className="infiniteScroll" value={ ! isFetchingNextPage ? 0 : 100 } />
				</div>
			</Table>
		</>
	);
}
