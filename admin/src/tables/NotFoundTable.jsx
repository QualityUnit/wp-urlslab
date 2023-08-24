import { useRef, useCallback, useEffect } from 'react';
import { useI18n } from '@wordpress/react-i18n/';
import { useQueryClient } from '@tanstack/react-query';

import {
	useInfiniteFetch, ProgressBar, SortBy, Tooltip, SingleSelectMenu, InputField, Checkbox, Loader, Table, ModuleViewHeaderBottom, TooltipSortingFiltering, TagsMenu, SuggestInputField, RowActionButtons, IconButton,
} from '../lib/tableImports';

import useTableStore from '../hooks/useTableStore';
import useChangeRow from '../hooks/useChangeRow';
import useRedirectTableMenus from '../hooks/useRedirectTableMenus';
import useTablePanels from '../hooks/useTablePanels';

import BrowserIcon from '../elements/BrowserIcon';
import { ReactComponent as PlusIcon } from '../assets/images/icons/icon-plus.svg';
import { postFetch } from '../api/fetching';

export default function NotFoundTable( { slug } ) {
	const { __ } = useI18n();
	const paginationId = 'url_id';
	const matchUrlField = useRef();
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
		matchUrlField.current = defaultMatchUrl;

		setRowToEdit( { match_type: 'E', redirect_code: '301', match_url: defaultMatchUrl, replace_url: replaceUrl.protocol + replaceUrl.hostname } );

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
		match_url: <InputField type="url" liveUpdate ref={ matchUrlField } defaultValue={ matchUrlField.current } label={ redirectHeader.match_url } onChange={ ( val ) => setRowToEdit( { ...rowToEdit, match_url: val } ) } />,
		replace_url: <SuggestInputField suggestInput={ rowToEdit?.match_url || '' }
			autoFocus
			liveUpdate
			defaultValue={ ( rowToEdit?.match_url ? getUrlDomain( rowToEdit?.match_url ) : window.location.origin ) }
			label={ redirectHeader.replace_url }
			onChange={ ( val ) => setRowToEdit( { ...rowToEdit, replace_url: val } ) }
			required showInputAsSuggestion={ true }
			postFetchRequest={ async ( val ) => {
				postFetch( 'keyword/suggest', {
					count: val.count,
					keyword: rowToEdit?.keyword || '',
					url: val.input,
				} );
			} }

		/>,
		redirect_code: <SingleSelectMenu autoClose items={ redirectTypes } name="redirect_code" defaultValue="301" onChange={ ( val ) => setRowToEdit( { ...rowToEdit, redirect_code: val } ) }>{ redirectHeader.redirect_code }</SingleSelectMenu>,
		labels: <TagsMenu hasActivator label={ __( 'Tags:' ) } slug={ slug } onChange={ ( val ) => setRowToEdit( { ...rowToEdit, labels: val } ) } />,
	};

	const header = {
		url: __( 'URL' ),
		cnt: __( 'Visits' ),
		created: __( 'First visit' ),
		updated: 'Last visit',
		request_data: 'User agent',
		labels: 'Tags',
	};

	// Saving all variables into state managers
	useEffect( () => {
		if ( actionComplete ) {
			queryClient.invalidateQueries( [ 'redirects' ], { refetchType: 'all' } );
		}

		useTableStore.setState( () => (
			{
				data,
				title: 'Create redirect from this',
				paginationId: 'redirect_id',
				optionalSelector: undefined,
				altPaginationId: paginationId,
				altSlug: slug,
				slug: 'redirects',
				header,
				id: 'url',
				sorting: defaultSorting,
			}
		) );

		useTablePanels.setState( () => (
			{
				rowEditorCells,
				deleteCSVCols: [ paginationId, 'dest_url_id' ],
			}
		) );
	}, [ data, actionComplete, queryClient ] );

	const columns = [
		columnHelper.accessor( 'check', {
			className: 'nolimit checkbox',
			cell: ( cell ) => <Checkbox defaultValue={ cell.row.getIsSelected() } onChange={ () => {
				cell.row.toggleSelected();
				selectRows( cell );
			} } />,
			header: ( head ) => <Checkbox defaultValue={ head.table.getIsAllPageRowsSelected() } onChange={ ( val ) => {
				head.table.toggleAllPageRowsSelected( val );
				selectRows( val ? head : undefined );
			} } />,
		} ),
		columnHelper.accessor( 'url', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			header: ( th ) => <SortBy { ...th } />,
			minSize: 200,
		} ),
		columnHelper.accessor( 'cnt', {
			header: ( th ) => <SortBy { ...th } />,
			minSize: 50,
		} ),
		columnHelper.accessor( 'created', {
			header: ( th ) => <SortBy { ...th } />,
			minSize: 80,
		} ),
		columnHelper.accessor( 'updated', {
			header: ( th ) => <SortBy { ...th } />,
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
		columnHelper.accessor( 'editRow', {
			className: 'editRow',
			cell: ( cell ) => <RowActionButtons
				onDelete={ () => deleteRow( { cell, id: 'url' } ) }
			>
				<IconButton
					tooltip={ __( 'Create redirect from 404' ) }
					tooltipClass="align-left"
					onClick={ () => addRedirect( { cell } ) }
				>
					<PlusIcon />
				</IconButton>
			</RowActionButtons>,
			header: null,
			size: 0,
		} ),
	];

	if ( status === 'loading' ) {
		return <Loader />;
	}

	return (
		<>
			<ModuleViewHeaderBottom
				noImport
				noInsert
			/>
			<Table className="fadeInto"
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
