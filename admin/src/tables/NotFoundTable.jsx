import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { __ } from '@wordpress/i18n/';
import { useQueryClient } from '@tanstack/react-query';

import {
	useInfiniteFetch, SortBy, Tooltip, SingleSelectMenu, InputField, Loader, Table, ModuleViewHeaderBottom, TooltipSortingFiltering, TagsMenu, SuggestInputField, RowActionButtons, IconButton, DateTimeFormat, SvgIcon, TableSelectCheckbox,
} from '../lib/tableImports';

import useTableStore from '../hooks/useTableStore';
import useChangeRow from '../hooks/useChangeRow';
import useTablePanels from '../hooks/useTablePanels';
import { setNotification } from '../hooks/useNotifications';
import useColumnTypesQuery from '../queries/useColumnTypesQuery';
import { handleApiError, postFetch } from '../api/fetching';
import { countriesList } from '../api/fetchCountries';

import BrowserIcon from '../elements/BrowserIcon';
import DescriptionBox from '../elements/DescriptionBox';
import TreeView from '../elements/TreeView';

import { header as redirectsHeader } from '../lib/redirectsHeader';

const paginationId = 'url_id';
const defaultSorting = [ { key: 'updated', dir: 'DESC', op: '<' } ];
const header = {
	url: __( 'URL' , 'wp-urlslab' ),
	cnt: __( 'Visits' , 'wp-urlslab' ),
	created: __( 'First visit' , 'wp-urlslab' ),
	updated: __( 'Last visit' , 'wp-urlslab' ),
	ip: __( 'IP address' , 'wp-urlslab' ),
	country: __( 'Country' , 'wp-urlslab' ),
	browser: __( 'User agent' , 'wp-urlslab' ),
	referrer: __( 'Referrer' , 'wp-urlslab' ),
	request: __( 'Request data' , 'wp-urlslab' ),
};
const initialState = { columnVisibility: { referrer: false, request: false } };

// init table state with fixed states which we do not need to update anymore during table lifecycle
export default function TableInit( { slug } ) {
	const setTable = useTableStore( ( state ) => state.setTable );
	const [ init, setInit ] = useState( false );
	useEffect( () => {
		setInit( true );
		setTable( slug, {
			title: __( 'Create redirect' , 'wp-urlslab' ),
			paginationId,
			slug,
			header,
			id: 'url',
			sorting: defaultSorting,
		} );
	}, [ setTable, slug ] );

	return init && <NotFoundTable slug={ slug } />;
}

function NotFoundTable( { slug } ) {
	const {
		columnHelper,
		data,
		isLoading,
		isSuccess,
		isFetchingNextPage,
		ref,
	} = useInfiniteFetch( { slug } );

	const tableData = useMemo( () => data?.pages?.flatMap( ( page ) => page ?? [] ), [ data?.pages ] );
	const setTable = useTableStore( ( state ) => state.setTable );
	const setRowToEdit = useTablePanels( ( state ) => state.setRowToEdit );
	const activatePanel = useTablePanels( ( state ) => state.activatePanel );

	const { deleteRow } = useChangeRow();

	const addRedirect = useCallback( ( { cell } ) => {
		const { url: defaultMatchUrl } = cell.row.original;
		let replaceUrl = new URL( window.location.href );
		try {
			replaceUrl = new URL( defaultMatchUrl );
		} catch ( e ) {
		}

		// set custom defaults for fields in insertRowPanel
		setRowToEdit( {
			match_type: 'E',
			redirect_code: '301',
			match_url: defaultMatchUrl,
			replace_url: replaceUrl.protocol + replaceUrl.hostname,
		} );

		activatePanel( 'rowInserter' );
	}, [ activatePanel, setRowToEdit ] );

	const columns = useMemo( () => [
		columnHelper.accessor( 'check', {
			className: 'nolimit checkbox',
			cell: ( cell ) => <TableSelectCheckbox tableElement={ cell } />,
			header: ( head ) => <TableSelectCheckbox tableElement={ head } />,
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
		columnHelper.accessor( 'referrer', {
			tooltip: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			minSize: 100,
		} ),
		columnHelper.accessor( 'ip', {
			tooltip: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			minSize: 100,
		} ),
		columnHelper.accessor( 'request', {
			className: 'nolimit',
			cell: ( cell ) => <TreeView sourceData={ cell.getValue() } isTableCellPopper />,
			header: ( th ) => <SortBy { ...th } />,
			minSize: 100,
		} ),
		columnHelper.accessor( 'country', {
			tooltip: ( cell ) => cell.getValue(),
			cell: ( cell ) => <strong>{ countriesList[ cell.getValue() ] ? countriesList[ cell.getValue() ] : cell.getValue() }</strong>,
			header: ( th ) => <SortBy { ...th } />,
			minSize: 40,
		} ),
		columnHelper.accessor( 'browser', {
			tooltip: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			cell: ( cell ) => <BrowserIcon uaString={ cell.getValue() } />,
			minSize: 50,
		} ),
		columnHelper.accessor( 'editRow', {
			className: 'editRow',
			cell: ( cell ) => <RowActionButtons
				onDelete={ () => deleteRow( { cell } ) }
			>
				<Tooltip title={ __( 'Create redirect from 404' , 'wp-urlslab' ) } arrow placement="bottom">
					<IconButton
						size="xs"
						onClick={ () => addRedirect( { cell } ) }
					>
						<SvgIcon name="plus" />
					</IconButton>
				</Tooltip>
			</RowActionButtons>,
			header: null,
			size: 0,
		} ),
	], [ addRedirect, columnHelper, deleteRow ] );

	useEffect( () => {
		setTable( slug, { data } );
	}, [ data, setTable, slug ] );

	if ( isLoading ) {
		return <Loader isFullscreen />;
	}

	return (
		<>
			<DescriptionBox	title={ __( 'About this table' , 'wp-urlslab' ) } tableSlug={ slug } isMainTableDescription>
				{ __( 'This plugin stores all the URLs visited by your website users that resulted in a 404 error. Some of these URLs might be due to cyber-attacks attempting to decipher your web structure. However, some could be actual missing URLs that are included in your sitemap or website content. To address this issue, you have several options. You can create the missing page or use the Redirect Rule to guide the user to another appropriate page. The plugin also provides automatic redirect suggestions using AI technology.' , 'wp-urlslab' ) }
			</DescriptionBox>

			<ModuleViewHeaderBottom noImport noInsert />

			<Table
				className="fadeInto"
				initialState={ initialState }
				columns={ columns }
				data={ isSuccess && tableData }
				referrer={ ref }
				loadingRows={ isFetchingNextPage }
				disableAddNewTableRecord
			>
				<TooltipSortingFiltering />
			</Table>

			<TableCreateRedirectManager slug={ slug } />
		</>
	);
}

const TableCreateRedirectManager = memo( ( { slug } ) => {
	const queryClient = useQueryClient();
	const setRowToEdit = useTablePanels( ( state ) => state.setRowToEdit );
	const rowToEdit = useTablePanels( ( state ) => state.rowToEdit );
	const { columnTypes } = useColumnTypesQuery( slug );

	const saveRedirect = useCallback( async () => {
		const actionSlug = 'redirects';
		setNotification( actionSlug, { message: __( 'Adding row…' , 'wp-urlslab' ), status: 'info' } );
		const response = await postFetch( `redirects/create`, rowToEdit, { skipErrorHandling: true } );

		if ( response.ok ) {
			setNotification( actionSlug, { message: __( 'Row has been added.' , 'wp-urlslab' ), status: 'success' } );
			queryClient.invalidateQueries( [ actionSlug ], { refetchType: 'all' } );
			return false;
		}

		// handle attempt to create duplicated redirect
		if ( ! response.ok && response.status === 409 ) {
			handleApiError( actionSlug, response, { message: __( 'Redirect for this URL probably exists.' , 'wp-urlslab' ) } );
			return false;
		}
		// handle general error
		handleApiError( actionSlug, response );
	}, [ queryClient, rowToEdit ] );

	const rowEditorCells = useMemo( () => ( {
		match_type: <SingleSelectMenu autoClose items={ columnTypes?.match_type?.values } name="match_type" defaultValue="E" onChange={ ( val ) => setRowToEdit( { match_type: val } ) }>{ redirectsHeader.match_type }</SingleSelectMenu>,
		match_url: <InputField type="url" liveUpdate defaultValue={ rowToEdit.match_url } label={ redirectsHeader.match_url } onChange={ ( val ) => setRowToEdit( { match_url: val } ) } />,
		replace_url: <SuggestInputField suggestInput={ rowToEdit?.match_url || '' }
			autoFocus
			liveUpdate
			defaultValue={ ( rowToEdit?.match_url ? getUrlDomain( rowToEdit?.match_url ) : window.location.origin ) }
			label={ redirectsHeader.replace_url }
			onChange={ ( val ) => setRowToEdit( { replace_url: val } ) }
			required showInputAsSuggestion={ true }
			referenceVal="match_url"
		/>,
		redirect_code: <SingleSelectMenu autoClose items={ columnTypes?.redirect_code?.values } name="redirect_code" defaultValue="301" onChange={ ( val ) => setRowToEdit( { redirect_code: val } ) }>{ redirectsHeader.redirect_code }</SingleSelectMenu>,
		labels: <TagsMenu optionItem label={ __( 'Tags:' , 'wp-urlslab' ) } slug="redirects" onChange={ ( val ) => setRowToEdit( { labels: val } ) } />,
	} ), [ columnTypes, rowToEdit.match_url, setRowToEdit ] );

	useEffect( () => {
		useTablePanels.setState( ( ) => (
			{
				...useTablePanels.getState(),
				rowEditorCells,
				deleteCSVCols: [ paginationId, 'dest_url_id' ],
			}
		) );
	}, [ rowEditorCells ] );

	useEffect( () => {
		useTablePanels.setState( ( ) => (
			{
				...useTablePanels.getState(),
				customSubmitAction: saveRedirect,
			}
		) );
	}, [ saveRedirect ] );
} );

const getUrlDomain = ( urlVar ) => {
	try {
		const url_obj = new URL( urlVar );
		return url_obj.protocol + '//' + url_obj.hostname;
	} catch ( e ) {
		return urlVar;
	}
};

