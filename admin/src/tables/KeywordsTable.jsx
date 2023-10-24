/* eslint-disable indent */
import { useCallback, useEffect, useMemo } from 'react';
import { useI18n } from '@wordpress/react-i18n/';

import {
	useInfiniteFetch, ProgressBar, TagsMenu, SortBy, SingleSelectMenu, LangMenu, InputField, Checkbox, SvgIcon, Loader, Tooltip, Table, ModuleViewHeaderBottom, TooltipSortingFiltering, SuggestInputField, RowActionButtons, Stack, IconButton,
} from '../lib/tableImports';

import useChangeRow from '../hooks/useChangeRow';
import useTablePanels from '../hooks/useTablePanels';
import useTableStore from '../hooks/useTableStore';
import DescriptionBox from '../elements/DescriptionBox';

export default function KeywordsTable( { slug } ) {
	const { __ } = useI18n();
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

	const {
		columnHelper,
		data,
		status,
		isSuccess,
		isFetchingNextPage,
		hasNextPage,
		ref,
	} = useInfiniteFetch( { slug } );

	const { isSelected, selectRows, deleteRow, updateRow } = useChangeRow();

	const activatePanel = useTablePanels( ( state ) => state.activatePanel );
	const setRowToEdit = useTablePanels( ( state ) => state.setRowToEdit );
	const setOptions = useTablePanels( ( state ) => state.setOptions );
	const rowToEdit = useTablePanels( ( state ) => state.rowToEdit );
	const activePanel = useTablePanels( ( state ) => state.activePanel );

	const setUnifiedPanel = useCallback( ( cell ) => {
		const origCell = cell?.row.original;
		setOptions( [] );
		setRowToEdit( {} );
		updateRow( { cell, id: 'keyword' } );

		if ( origCell.kw_usage_count > 0 ) {
			setOptions( [ {
				detailsOptions: {
					title: `Keyword “${ origCell.keyword }” usage`, text: `Keyword “${ origCell.keyword }” used on these URLs`, slug, url: `${ origCell.kw_id }/${ origCell.dest_url_id }`, showKeys: [ { name: [ 'link_type', 'Type' ], size: 30, values: { U: 'Urlslab', E: 'Editor' } }, { name: [ 'url_name', 'URL' ] } ], listId: 'url_id',
				},
			} ] );
		}
	}, [ setOptions, setRowToEdit, slug, updateRow ] );

	const keywordTypes = useMemo( () => ( {
		M: __( 'Manual' ),
		I: __( 'Imported' ),
		X: __( 'None' ),
	} ), [ __ ] );

	const rowEditorCells = {
		keyword: <InputField liveUpdate autoFocus defaultValue="" label={ header.keyword } onChange={ ( val ) => {
			setRowToEdit( { ...rowToEdit, keyword: val } );
		} } required description={ __( 'Only exact keyword matches will be substituted with a link' ) } />,

		urlLink: <SuggestInputField suggestInput={ rowToEdit?.keyword || '' }
									liveUpdate
									defaultValue={ ( rowToEdit?.urlLink ? rowToEdit?.urlLink : window.location.origin ) }
									label={ header.urlLink }
									onChange={ ( val ) => setRowToEdit( { ...rowToEdit, urlLink: val } ) }
									required
									showInputAsSuggestion={ true }
									referenceVal="keyword"
									description={ __( 'Destination URL' ) } />,

		kwType: <SingleSelectMenu defaultAccept hideOnAdd autoClose items={ keywordTypes } name="kwType" defaultValue="M" description={ __( 'Select the link type if you only want to modify certain kinds of links in HTML' ) }
			onChange={ ( val ) => setRowToEdit( { ...rowToEdit, kwType: val } ) }>{ header.kwType }</SingleSelectMenu>,

		kw_priority: <InputField liveUpdate type="number" defaultValue="10" min="0" max="100" label={ header.kw_priority }
								description={ __( 'Input a number between 0 and 100. Lower values indicate higher priority' ) }
			onChange={ ( val ) => setRowToEdit( { ...rowToEdit, kw_priority: val } ) } />,

		lang: <LangMenu autoClose defaultValue="all"
						description={ __( 'Keywords only apply to pages in the chosen language' ) }
			onChange={ ( val ) => setRowToEdit( { ...rowToEdit, lang: val } ) }>{ __( 'Language' ) }</LangMenu>,

		urlFilter: <InputField liveUpdate defaultValue=".*"
								description={ __( 'Optionally, you can permit keyword placement only on URLs that match a specific regular expression. Use value `.*` to match all URLs' ) }
			label={ header.urlFilter } onChange={ ( val ) => setRowToEdit( { ...rowToEdit, urlFilter: val } ) } />,

		labels: <TagsMenu optionItem label={ __( 'Tags:' ) } slug={ slug } onChange={ ( val ) => setRowToEdit( { ...rowToEdit, labels: val } ) } />,
	};

	const rowInserterCells = { ...rowEditorCells };
	delete rowInserterCells.kwType;

	useEffect( () => {
		useTablePanels.setState( ( ) => (
			{
				rowEditorCells,
				deleteCSVCols: [ paginationId, 'dest_url_id' ],
			}
		) );
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

	// Saving all variables into state managers
	useEffect( () => {
		useTableStore.setState( () => (
			{
				tables: { ...useTableStore.getState().tables, [ slug ]: { ...useTableStore.getState().tables[ slug ], data } },
			}
		) );

		useTablePanels.setState( () => (
			{
				rowEditorCells,
			}
		) );

		if ( activePanel === 'rowInserter' ) {
			useTablePanels.setState( () => (
				{
					rowEditorCells: rowInserterCells,
				}
			) );
		}
	}, [ data, slug, activePanel ] );

	const columns = [
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
			cell: ( cell ) => <LangMenu autoClose defaultValue={ cell?.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell, id: 'keyword' } ) } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 100,
		} ),
		columnHelper.accessor( 'kw_priority', {
			className: 'nolimit',
			cell: ( cell ) => <InputField type="number" defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell, id: 'keyword' } ) } />,
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
							<Tooltip title={ __( 'Show URLs where used' ) }>
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
	];

	if ( status === 'loading' ) {
		return <Loader isFullscreen />;
	}

	return (
		<>
			<DescriptionBox	title={ __( 'About this table' ) } tableSlug={ slug } isMainTableDescription>
				{ __( "The table defines a list of keywords that can be automatically substituted with a link pointing to a defined URL in your website's text, which facilitates large-scale internal link building. This eliminates the need for manually editing individual pages to add links. The plugin leaves all existing page content intact, with modifications only occurring as the page is generated. To reduce the strain on your MySQL database, the link definitions are cached on the server for a few minutes. As a result, changes made to the link definitions may not become visible online until a few minutes have passed." ) }
			</DescriptionBox>
			<ModuleViewHeaderBottom />
			<Table className="fadeInto"
				initialState={ { columnVisibility: { kw_length: false, kwType: false } } }
				columns={ columns }
				data={ isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] ) }
				referer={ ref }
			>
				<TooltipSortingFiltering />
				<>
					{ isFetchingNextPage ? '' : hasNextPage }
					<ProgressBar className="infiniteScroll" value={ ! isFetchingNextPage ? 0 : 100 } />
				</>
			</Table>
		</>
	);
}
