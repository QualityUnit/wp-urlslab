/* eslint-disable indent */
import { useCallback, useEffect, useMemo, memo } from 'react';
import { __ } from '@wordpress/i18n/';

import {
	useInfiniteFetch, TagsMenu, SortBy, SingleSelectMenu, LangMenu, InputField, Checkbox, SvgIcon, Loader, Tooltip, Table, ModuleViewHeaderBottom, TooltipSortingFiltering, SuggestInputField, RowActionButtons, Stack, IconButton,
} from '../lib/tableImports';

import useChangeRow from '../hooks/useChangeRow';
import useTablePanels from '../hooks/useTablePanels';
import useTableStore from '../hooks/useTableStore';
import DescriptionBox from '../elements/DescriptionBox';

const title = __( 'Add New Link' );
const paginationId = 'kw_id';

const header = {
	keyword: __( 'Keyword' ),
	urlLink: __( 'Link' ),
	lang: __( 'Language' ),
	kw_priority: __( 'Priority' ),
	urlFilter: __( 'URL filter' ),
	kw_length: __( 'Length' ),
	kwType: __( 'Type' ),
	kw_usage_count: __( 'Usage' ),
	labels: __( 'Tags' ),
};
const keywordTypes = {
	M: __( 'Manual' ),
	I: __( 'Imported' ),
	X: __( 'None' ),
};

export default function KeywordsTable( { slug } ) {
	const {
		data,
		status,
		isSuccess,
		isFetchingNextPage,
		columnHelper,
		ref,
	} = useInfiniteFetch( { slug } );

	const { isSelected, selectRows, deleteRow, updateRow } = useChangeRow();

	const activatePanel = useTablePanels( ( state ) => state.activatePanel );
	const setRowToEdit = useTablePanels( ( state ) => state.setRowToEdit );
	const setOptions = useTablePanels( ( state ) => state.setOptions );

	const setUnifiedPanel = useCallback( ( cell ) => {
		const origCell = cell?.row.original;
		setOptions( [] );
		setRowToEdit( {} );
		updateRow( { cell, id: 'keyword' } );

		if ( origCell.kw_usage_count > 0 ) {
			setOptions( [ {
				detailsOptions: {
					// translators: %s is generated text, do not change it
					title: __( 'Keyword %s usage' ).replace( '%s', `“${ origCell.keyword }”` ),
					// translators: %s is generated text, do not change it
					text: __( 'Keyword %s used on these URLs' ).replace( '%s', `“${ origCell.keyword }”` ),
					slug, url: `${ origCell.kw_id }/${ origCell.dest_url_id }`, showKeys: [ { name: [ 'link_type', 'Type' ], size: 30, values: { U: 'Urlslab', E: 'Editor' } }, { name: [ 'url_name', 'URL' ] } ], listId: 'url_id',
				},
			} ] );
		}
	}, [ setOptions, setRowToEdit, slug, updateRow ] );

	useEffect( () => {
		useTableStore.setState( () => (
			{
				activeTable: slug,
				tables: {
					...useTableStore.getState().tables,
					[ slug ]: {
						title,
						paginationId,
						slug,
						header,
						id: 'keyword',
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
			className: 'checkbox',
			cell: ( cell ) => <Checkbox defaultValue={ isSelected( cell ) } onChange={ ( ) => {
				selectRows( cell );
			} } />,
			header: ( head ) => <Checkbox defaultValue={ isSelected( head, true ) } onChange={ ( ) => {
				selectRows( head, true );
			} } />,
			enableResizing: false,
		} ),
		columnHelper.accessor( 'keyword', {
			tooltip: ( cell ) => cell.getValue(),
			cell: ( cell ) => <strong>{ cell.getValue() }</strong>,
			header: ( th ) => <SortBy { ...th } />,
			minSize: 200,
		} ),
		columnHelper.accessor( 'urlLink', {
			tooltip: ( cell ) => cell.getValue(),
			cell: ( cell ) => <a href={ cell.getValue() } title={ cell.getValue() } target="_blank" rel="noreferrer">{ cell.getValue() }</a>,
			header: ( th ) => <SortBy { ...th } />,
			enableResizing: false,
			size: 200,
		} ),
		columnHelper.accessor( 'lang', {
			className: 'nolimit',
			cell: ( cell ) => <LangMenu defaultValue={ cell?.getValue() } listboxStyles={ { minWidth: 300 } } onChange={ ( newVal ) => updateRow( { newVal, cell, id: 'keyword' } ) } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 100,
		} ),
		columnHelper.accessor( 'kw_priority', {
			className: 'nolimit',
			cell: ( cell ) => <InputField type="number" max={ 100 } defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell, id: 'keyword' } ) } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 80,
		} ),
		columnHelper.accessor( 'urlFilter', {
			className: 'nolimit',
			cell: ( cell ) => <InputField defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell, id: 'keyword' } ) } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 150,
		} ),
		columnHelper.accessor( 'kw_length', {
			header: ( th ) => <SortBy { ...th } />,
			size: 80,
		} ),
		columnHelper.accessor( 'kwType', {
			filterValMenu: keywordTypes,
			className: 'nolimit',
			cell: ( cell ) => keywordTypes[ cell.getValue() ],
			header: ( th ) => <SortBy { ...th } />,
			size: 80,
		} ),
		columnHelper.accessor( 'kw_usage_count', {
			cell: ( cell ) => (
				<Stack direction="row" alignItems="center" spacing={ 1 }>
					<>
						<span>{ cell?.getValue() }</span>
						{ cell?.getValue() > 0 &&
							<Tooltip title={ __( 'Show URLs where used' ) } disablePortal>
								<IconButton
									size="xs"
									onClick={ () => {
										setUnifiedPanel( cell );
										activatePanel( 0 );
									} }
								>
									<SvgIcon name="link" />
								</IconButton>
							</Tooltip>
						}
					</>
				</Stack>
			),
			header: ( th ) => <SortBy { ...th } />,
			size: 80,
		} ),
		columnHelper.accessor( 'labels', {
			className: 'nolimit',
			cell: ( cell ) => <TagsMenu defaultValue={ cell.getValue() } slug={ slug } onChange={ ( newVal ) => updateRow( { newVal, cell, id: 'keyword' } ) } />,
			header: header.labels,
			size: 150,
		} ),
		columnHelper.accessor( 'editRow', {
			className: 'editRow',
			cell: ( cell ) => <RowActionButtons
				onEdit={ () => setUnifiedPanel( cell ) }
				onDelete={ () => deleteRow( { cell, id: 'keyword' } ) }
			>
			</RowActionButtons>,
			header: null,
			size: 0,
		} ),
	], [ activatePanel, columnHelper, deleteRow, selectRows, setUnifiedPanel, slug, updateRow ] );

	if ( status === 'loading' ) {
		return <Loader isFullscreen />;
	}

	return (
		<>
			<DescriptionBox	title={ __( 'About this table' ) } tableSlug={ slug } isMainTableDescription>
				{ __( "The table defines a list of keywords which can be automatically substituted with link pointing to defined URL in your website's text, facilitating large scale internal link building. This eliminates the need for manual editing of individual pages to add links. The plugin leaves all existing page content intact, with modifications only occurring as the page is generated. To reduce the strain on your Mysql database, the link definitions are cached on the server for a few minutes. Consequently, changes made to the link definitions may only be visibly updated online after a few minutes." ) }
			</DescriptionBox>

			<ModuleViewHeaderBottom />

			<Table className="fadeInto"
				initialState={ { columnVisibility: { kw_length: false, kwType: false } } }
				columns={ columns }
				data={ isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] ) }
				referrer={ ref }
				loadingRows={ isFetchingNextPage }
			>
				<TooltipSortingFiltering />
			</Table>
			<TableEditorManager slug={ slug } />
		</>
	);
}

const TableEditorManager = memo( ( { slug } ) => {
	const rowToEdit = useTablePanels( ( state ) => state.rowToEdit );
	const setRowToEdit = useTablePanels( ( state ) => state.setRowToEdit );
	const activePanel = useTablePanels( ( state ) => state.activePanel );

	const rowEditorCells = useMemo( () => ( {
		keyword: <InputField liveUpdate autoFocus defaultValue="" label={ header.keyword } onChange={ ( val ) => {
			setRowToEdit( { keyword: val } );
		} } required description={ __( 'Only exact keyword matches will be substituted with a link' ) } />,

		urlLink: <SuggestInputField suggestInput={ rowToEdit?.keyword || '' }
									liveUpdate
									defaultValue={ ( rowToEdit?.urlLink ? rowToEdit?.urlLink : window.location.origin ) }
									label={ header.urlLink }
									onChange={ ( val ) => setRowToEdit( { urlLink: val } ) }
									required
									showInputAsSuggestion={ true }
									referenceVal="keyword"
									description={ __( 'Destination URL' ) } />,

		kwType: <SingleSelectMenu defaultAccept hideOnAdd autoClose items={ keywordTypes } name="kwType" defaultValue="M" description={ __( 'Select the link type if you only want to modify certain kinds of links in HTML' ) }
			onChange={ ( val ) => setRowToEdit( { kwType: val } ) }>{ header.kwType }</SingleSelectMenu>,

		kw_priority: <InputField liveUpdate type="number" defaultValue="10" min="0" max="100" label={ header.kw_priority }
								description={ __( 'Input a number between 0 and 100. Lower values indicate higher priority' ) }
			onChange={ ( val ) => setRowToEdit( { kw_priority: val } ) } />,

		lang: <LangMenu defaultValue=""
						hasTitle
						description={ __( 'Keywords only apply to pages in the chosen language' ) }
						onChange={ ( val ) => setRowToEdit( { lang: val } ) } />,

		urlFilter: <InputField liveUpdate defaultValue=".*"
								description={ __( 'Optionally, you can permit keyword placement only on URLs that match a specific regular expression. Use value `.*` to match all URLs' ) }
			label={ header.urlFilter } onChange={ ( val ) => setRowToEdit( { urlFilter: val } ) } />,

		labels: <TagsMenu optionItem label={ __( 'Tags:' ) } slug={ slug } onChange={ ( val ) => setRowToEdit( { labels: val } ) } />,

	} ), [ rowToEdit?.keyword, rowToEdit?.urlLink, setRowToEdit, slug ] );

	const rowInserterCells = useMemo( () => {
		const copy = { ...rowEditorCells };
		delete copy.kwType;
		return copy;
	}, [ rowEditorCells ] );

	useEffect( () => {
		useTablePanels.setState( ( ) => (
			{
				...useTablePanels.getState(),
				rowEditorCells: activePanel === 'rowInserter' ? rowInserterCells : rowEditorCells,
				deleteCSVCols: [ paginationId, 'dest_url_id' ],
			}
		) );
	}, [ activePanel, rowEditorCells, rowInserterCells ] );
} );
