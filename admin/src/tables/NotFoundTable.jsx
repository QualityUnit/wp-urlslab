import { memo, useCallback, useEffect, useMemo } from 'react';
import { __ } from '@wordpress/i18n/';
import { useQueryClient } from '@tanstack/react-query';

import {
	useInfiniteFetch, SortBy, Tooltip, SingleSelectMenu, InputField, Checkbox, Loader, Table, ModuleViewHeaderBottom, TooltipSortingFiltering, TagsMenu, SuggestInputField, RowActionButtons, IconButton, DateTimeFormat, SvgIcon,
} from '../lib/tableImports';

import useTableStore from '../hooks/useTableStore';
import useChangeRow from '../hooks/useChangeRow';
import useRedirectTableMenus from '../hooks/useRedirectTableMenus';
import useTablePanels from '../hooks/useTablePanels';
import { setNotification } from '../hooks/useNotifications';
import useColumnTypesQuery from '../queries/useColumnTypesQuery';
import { handleApiError, postFetch } from '../api/fetching';
import { countriesList } from '../api/fetchCountries';

import BrowserIcon from '../elements/BrowserIcon';
import DescriptionBox from '../elements/DescriptionBox';
import TreeView from '../elements/TreeView';

const paginationId = 'url_id';
const defaultSorting = [ { key: 'updated', dir: 'DESC', op: '<' } ];

const header = {
	url: __( 'URL' ),
	cnt: __( 'Visits' ),
	created: __( 'First visit' ),
	updated: __( 'Last visit' ),
	ip: __( 'IP address' ),
	country: __( 'Country' ),
	browser: __( 'User agent' ),
	referrer: __( 'Referrer' ),
	request: __( 'Request data' ),
};

export default function NotFoundTable( { slug } ) {
	const {
		columnHelper,
		data,
		status,
		isSuccess,
		isFetchingNextPage,
		ref,
	} = useInfiniteFetch( { slug, defaultSorting } );

	const { isSelected, selectRows, deleteRow } = useChangeRow( { defaultSorting } );

	const setRowToEdit = useTablePanels( ( state ) => state.setRowToEdit );
	const activatePanel = useTablePanels( ( state ) => state.activatePanel );

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

	useEffect( () => {
		useTableStore.setState( () => (
			{
				activeTable: slug,
				tables: {
					...useTableStore.getState().tables,
					[ slug ]: {
						...useTableStore.getState().tables[ slug ],
						title: __( 'Create redirect' ),
						paginationId,
						slug,
						header,
						id: 'url',
					},
				},
			}
		) );
	}, [ slug ] );

	useEffect( () => {
		useTableStore.setState( () => (
			{
				tables: {
					...useTableStore.getState().tables,
					[ slug ]: {
						...useTableStore.getState().tables[ slug ],
						data,
					},
				},
			}
		) );
	}, [ data, slug ] );

	const columns = useMemo( () => [
		columnHelper.accessor( 'check', {
			className: 'nolimit checkbox',
			cell: ( cell ) => <Checkbox defaultValue={ isSelected( cell ) } onChange={ () => {
				selectRows( cell );
			} } />,
			header: ( head ) => <Checkbox defaultValue={ isSelected( head, true ) } onChange={ ( ) => {
				selectRows( head, true );
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
			header: ( th ) => <SortBy { ...th } defaultSorting={ defaultSorting } />,
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
				<Tooltip title={ __( 'Create redirect from 404' ) } arrow placement="bottom">
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
	], [ addRedirect, columnHelper, deleteRow, isSelected, selectRows ] );

	if ( status === 'loading' ) {
		return <Loader isFullscreen />;
	}

	return (
		<>
			<DescriptionBox	title={ __( 'About this table' ) } tableSlug={ slug } isMainTableDescription>
				{ __( 'This plugin stores all the URLs visited by your website users that resulted in a 404 error. Some of these URLs might be due to cyber-attacks attempting to decipher your web structure. However, some could be actual missing URLs that are included in your sitemap or website content. To address this issue, you have several options. You can create the missing page or use the Redirect Rule to guide the user to another appropriate page. The plugin also provides automatic redirect suggestions using AI technology.' ) }
			</DescriptionBox>
			<ModuleViewHeaderBottom
				noImport
				noInsert
			/>
			<Table className="fadeInto"
				initialState={ { columnVisibility: { referrer: false, request: false } } }
				columns={ columns }
				data={ isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] ) }
				disableAddNewTableRecord
				defaultSorting={ defaultSorting }
				referrer={ ref }
				loadingRows={ isFetchingNextPage }
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
	const { header: redirectHeader } = useRedirectTableMenus();
	const { columnTypes } = useColumnTypesQuery( slug );

	const saveRedirect = useCallback( async () => {
		const actionSlug = 'redirects';
		setNotification( actionSlug, { message: __( 'Adding row…' ), status: 'info' } );
		const response = await postFetch( `redirects/create`, rowToEdit, { skipErrorHandling: true } );

		if ( response.ok ) {
			setNotification( actionSlug, { message: __( 'Row has been added.' ), status: 'success' } );
			queryClient.invalidateQueries( [ actionSlug ], { refetchType: 'all' } );
			return false;
		}

		// handle attempt to create duplicated redirect
		if ( ! response.ok && response.status === 409 ) {
			handleApiError( actionSlug, response, { message: __( 'Redirect for this URL probably exists.' ) } );
			return false;
		}
		// handle general error
		handleApiError( actionSlug, response );
	}, [ queryClient, rowToEdit ] );

	const rowEditorCells = useMemo( () => ( {
		match_type: <SingleSelectMenu autoClose items={ columnTypes?.match_type?.values } name="match_type" defaultValue="E" onChange={ ( val ) => setRowToEdit( { match_type: val } ) }>{ redirectHeader.match_type }</SingleSelectMenu>,
		match_url: <InputField type="url" liveUpdate defaultValue={ rowToEdit.match_url } label={ redirectHeader.match_url } onChange={ ( val ) => setRowToEdit( { match_url: val } ) } />,
		replace_url: <SuggestInputField suggestInput={ rowToEdit?.match_url || '' }
			autoFocus
			liveUpdate
			defaultValue={ ( rowToEdit?.match_url ? getUrlDomain( rowToEdit?.match_url ) : window.location.origin ) }
			label={ redirectHeader.replace_url }
			onChange={ ( val ) => setRowToEdit( { replace_url: val } ) }
			required showInputAsSuggestion={ true }
			referenceVal="match_url"
		/>,
		redirect_code: <SingleSelectMenu autoClose items={ columnTypes?.redirect_code?.values } name="redirect_code" defaultValue="301" onChange={ ( val ) => setRowToEdit( { redirect_code: val } ) }>{ redirectHeader.redirect_code }</SingleSelectMenu>,
		labels: <TagsMenu optionItem label={ __( 'Tags:' ) } slug="redirects" onChange={ ( val ) => setRowToEdit( { labels: val } ) } />,
	} ), [ columnTypes, redirectHeader, rowToEdit.match_url, setRowToEdit ] );

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

