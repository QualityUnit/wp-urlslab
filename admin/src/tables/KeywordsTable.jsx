/* eslint-disable indent */
import { useI18n } from '@wordpress/react-i18n/';

import {
	useInfiniteFetch, ProgressBar, TagsMenu, SortBy, SingleSelectMenu, LangMenu, InputField, Checkbox, LinkIcon, Loader, Tooltip, Table, ModuleViewHeaderBottom, TooltipSortingFiltering, SuggestInputField, RowActionButtons,
} from '../lib/tableImports';

import useTableUpdater from '../hooks/useTableUpdater';
import useChangeRow from '../hooks/useChangeRow';
import useTablePanels from '../hooks/useTablePanels';
import { useCallback } from 'react';
import { postFetch } from '../api/fetching';

export default function KeywordsTable( { slug } ) {
	const { __ } = useI18n();
	const title = __( 'Add New Keyword' );
	const paginationId = 'kw_id';
	const { table, setTable, filters, setFilters, sorting, sortBy } = useTableUpdater( { slug } );
	const url = { filters, sorting };

	const {
		columnHelper,
		data,
		status,
		isSuccess,
		isFetching,
		isFetchingNextPage,
		hasNextPage,
		ref,
	} = useInfiniteFetch( { key: slug, filters, sorting, paginationId } );

	const { selectRows, deleteRow, deleteMultipleRows, updateRow } = useChangeRow( { data, url, slug, paginationId } );

	const { activatePanel, setRowToEdit, setOptions } = useTablePanels();
	const rowToEdit = useTablePanels( ( state ) => state.rowToEdit );

	const setUnifiedPanel = useCallback( ( cell ) => {
		const origCell = cell?.row.original;
		setOptions( [] );
		setRowToEdit( {} );
		updateRow( { cell, id: 'keyword' } );

		if ( origCell.kw_usage_count > 0 ) {
			setOptions( [ {
				detailsOptions: {
					title: `Keyword “${ origCell.keyword }” usage`, text: `Keyword “${ origCell.keyword }” used on these URLs`, slug, url: `${ origCell.kw_id }/${ origCell.dest_url_id }`, showKeys: [ { name: 'link_type', size: 30, values: { U: 'Urlslab', E: 'Editor' } }, { name: 'url_name' } ], listId: 'url_id',
				},
			} ] );
		}
	}, [ setOptions, setRowToEdit, slug, updateRow ] );

	const keywordTypes = {
		M: __( 'Manual' ),
		I: __( 'Imported' ),
		X: __( 'None' ),
	};

	const header = {
		keyword: __( 'Keyword' ),
		urlLink: __( 'Link' ),
		lang: __( 'Language' ),
		kw_priority: __( 'SEO rank' ),
		urlFilter: __( 'URL filter' ),
		kw_length: __( 'Length' ),
		kwType: __( 'Type' ),
		kw_usage_count: __( 'Usage' ),
		labels: __( 'Tags' ),
	};

	const rowEditorCells = {
		keyword: <InputField autoFocus liveUpdate defaultValue="" label={ header.keyword } onChange={ ( val ) => setRowToEdit( { ...rowToEdit, keyword: val } ) } required
							description={ __( 'Only exact keyword matches will be substituted with a link' ) } />,

		urlLink: <SuggestInputField suggestInput={ rowToEdit?.keyword || '' }
									liveUpdate
									defaultValue={ ( rowToEdit?.urlLink ? rowToEdit?.urlLink : window.location.origin ) }
									label={ header.urlLink }
									onChange={ ( val ) => setRowToEdit( { ...rowToEdit, urlLink: val } ) }
									required
									showInputAsSuggestion={ true }
									postFetchRequest={ async ( val ) => {
										return await postFetch( 'keyword/suggest', {
											count: val.count,
											keyword: rowToEdit?.keyword || '',
											url: val.input,
										} );
									} }
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

		labels: <TagsMenu hasActivator label={ __( 'Tags:' ) } slug={ slug } onChange={ ( val ) => setRowToEdit( { ...rowToEdit, labels: val } ) } />,
	};

	const columns = [
		columnHelper.accessor( 'check', {
			className: 'checkbox',
			cell: ( cell ) => <Checkbox defaultValue={ cell.row.getIsSelected() } onChange={ ( ) => {
				cell.row.toggleSelected();
				selectRows( cell );
			} } />,
			header: ( head ) => <Checkbox defaultValue={ head.table.getIsAllPageRowsSelected() } onChange={ ( val ) => {
				head.table.toggleAllPageRowsSelected( val );
				selectRows( val ? head : undefined );
			} } />,
			enableResizing: false,
		} ),
		columnHelper.accessor( 'keyword', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => <strong>{ cell.getValue() }</strong>,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.keyword }</SortBy>,
			minSize: 200,
		} ),
		columnHelper.accessor( 'urlLink', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => <a href={ cell.getValue() } title={ cell.getValue() } target="_blank" rel="noreferrer">{ cell.getValue() }</a>,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.urlLink }</SortBy>,
			enableResizing: false,
			size: 200,
		} ),
		columnHelper.accessor( 'lang', {
			className: 'nolimit',
			cell: ( cell ) => <LangMenu defaultValue={ cell?.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell, id: 'keyword' } ) } />,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.lang }</SortBy>,
			size: 100,
		} ),
		columnHelper.accessor( 'kw_priority', {
			className: 'nolimit',
			cell: ( cell ) => <InputField defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell, id: 'keyword' } ) } />,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.kw_priority }</SortBy>,
			size: 80,
		} ),
		columnHelper.accessor( 'urlFilter', {
			className: 'nolimit',
			cell: ( cell ) => <InputField defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell, id: 'keyword' } ) } />,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.urlFilter }</SortBy>,
			size: 150,
		} ),
		columnHelper.accessor( 'kw_length', {
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.kw_length }</SortBy>,
			size: 80,
		} ),
		columnHelper.accessor( 'kwType', {
			filterValMenu: keywordTypes,
			className: 'nolimit',
			cell: ( cell ) => keywordTypes[ cell.getValue() ],
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.kwType }</SortBy>,
			size: 80,
		} ),
		columnHelper.accessor( 'kw_usage_count', {
			cell: ( cell ) => <div className="flex flex-align-center">
				{ cell?.getValue() }
				{ cell?.getValue() > 0 &&
					<button className="ml-s" onClick={ () => {
						setUnifiedPanel( cell );
						activatePanel( 0 );
					} }>
						<LinkIcon />
						<Tooltip>{ __( 'Show URLs where used' ) }</Tooltip>
					</button>
				}
			</div>,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.kw_usage_count }</SortBy>,
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
				onDelete={ () => deleteRow( { cell, id: 'url' } ) }
			>
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
				table={ table }
				onDeleteSelected={ deleteMultipleRows }
				onFilter={ ( filter ) => setFilters( filter ) }
				options={ { header, data, slug, paginationId, url,
					title,
					id: 'keyword',
					rowToEdit,
					rowEditorCells,
					deleteCSVCols: [ paginationId, 'dest_url_id' ] }
				}
			/>
			<Table className="fadeInto"
				title={ title }
				slug={ slug }
				returnTable={ ( returnTable ) => setTable( returnTable ) }
				columns={ columns }
				data={ isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] ) }>
				<TooltipSortingFiltering props={ { isFetching, filters, sorting } } />
				<div ref={ ref }>
					{ isFetchingNextPage ? '' : hasNextPage }
					<ProgressBar className="infiniteScroll" value={ ! isFetchingNextPage ? 0 : 100 } />
				</div>
			</Table>
		</>
	);
}
