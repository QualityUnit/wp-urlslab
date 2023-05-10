/* eslint-disable indent */
import { useState } from 'react';
import {
	useInfiniteFetch, ProgressBar, TagsMenu, SortBy, SingleSelectMenu, LangMenu, InputField, Checkbox, LinkIcon, Trash, Loader, Tooltip, Table, ModuleViewHeaderBottom, TooltipSortingFiltering, Edit,
} from '../lib/tableImports';

import useTableUpdater from '../hooks/useTableUpdater';
import useChangeRow from '../hooks/useChangeRow';
import IconButton from '../elements/IconButton';

export default function KeywordsTable( { slug } ) {
	const paginationId = 'kw_id';
	const { table, setTable, filters, setFilters, sorting, sortBy } = useTableUpdater( { slug } );
	const url = { filters, sorting };
	const [ detailsOptions, setDetailsOptions ] = useState( null );

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

	const { row, selectedRows, selectRow, rowToEdit, setEditorRow, activePanel, deleteRow, deleteSelectedRows, updateRow } = useChangeRow( { data, url, slug, paginationId } );

	const keywordTypes = {
		M: __( 'Manual' ),
		I: __( 'Imported' ),
		X: __( 'None' ),
	};

	const header = {
		keyword: __( 'Keyword' ),
		urlLink: __( 'Link' ),
		kwType: __( 'Type' ),
		labels: __( 'Tags' ),
		kw_length: __( 'Length' ),
		kw_priority: __( 'Priority' ),
		kw_usage_count: __( 'Usage' ),
		lang: __( 'Language' ),
		urlFilter: __( 'URL filter' ),
	};

	const rowEditorCells = {
		keyword: <InputField liveUpdate defaultValue="" label={ header.keyword } onChange={ ( val ) => setEditorRow( { ...rowToEdit, keyword: val } ) } required disabledOnEdit />,
		urlLink: <InputField liveUpdate type="url" defaultValue="" label={ header.urlLink } onChange={ ( val ) => setEditorRow( { ...rowToEdit, urlLink: val } ) } required disabledOnEdit />,
		kwType: <SingleSelectMenu autoClose items={ keywordTypes } name="kwType" defaultValue="M" onChange={ ( val ) => setEditorRow( { ...rowToEdit, kwType: val } ) }>{ header.kwType }</SingleSelectMenu>,
		kw_priority: <InputField liveUpdate type="number" defaultValue="0" min="0" max="255" label={ header.kw_priority } onChange={ ( val ) => setEditorRow( { ...rowToEdit, kw_priority: val } ) } />,
		lang: <LangMenu autoClose defaultValue="all" onChange={ ( val ) => setEditorRow( { ...rowToEdit, lang: val } ) }>{ __( 'Language' ) }</LangMenu>,
		urlFilter: <InputField liveUpdate defaultValue="" label={ header.urlFilter } onChange={ ( val ) => setEditorRow( { ...rowToEdit, urlFilter: val } ) } />,
		labels: <TagsMenu hasActivator label={ __( 'All tags for this row:' ) } slug={ slug } onChange={ ( val ) => setEditorRow( { ...rowToEdit, labels: val } ) } />,
	};

	const columns = [
		columnHelper.accessor( 'check', {
			className: 'checkbox',
			cell: ( cell ) => <Checkbox checked={ cell.row.getIsSelected() } onChange={ ( val ) => {
				selectRow( val, cell );
			} } />,
			header: () => <Checkbox onChange={ () => console.log( data?.pages ) } />,
			enableResizing: false,
		} ),
		columnHelper.accessor( 'keyword', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => <strong>{ cell.getValue() }</strong>,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.keyword }</SortBy>,
			minSize: 150,
		} ),
		columnHelper.accessor( 'urlLink', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => <a href={ cell.getValue() } target="_blank" rel="noreferrer">{ cell.getValue() }</a>,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.urlLink }</SortBy>,
			enableResizing: false,
			size: 350,
		} ),
		columnHelper.accessor( 'kwType', {
			filterValMenu: keywordTypes,
			className: 'nolimit',
			cell: ( cell ) => keywordTypes[ cell.getValue() ],
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.kwType }</SortBy>,
			size: 100,
		} ),
		columnHelper.accessor( 'labels', {
			className: 'nolimit',
			cell: ( cell ) => <TagsMenu defaultValue={ cell.getValue() } slug={ slug } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: header.labels,
			size: 160,
		} ),
		columnHelper.accessor( 'kw_length', {
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.kw_length }</SortBy>,
			size: 80,
		} ),
		columnHelper.accessor( 'kw_priority', {
			className: 'nolimit',
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.kw_priority }</SortBy>,
			size: 80,
		} ),
		columnHelper.accessor( 'lang', {
			className: 'nolimit',
			cell: ( cell ) => <LangMenu defaultValue={ cell?.getValue() }
				onChange={ ( newVal ) => updateRow( { newVal, cell } ) }
			/>,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.lang }</SortBy>,
			size: 145,
		} ),
		columnHelper.accessor( 'kw_usage_count', {
			cell: ( cell ) => <div className="flex flex-align-center">
				{ cell?.getValue() }
				{ cell?.getValue() > 0 &&
					<button className="ml-s" onClick={ () => setDetailsOptions( {
						title: `Keyword “${
							cell.row.original.keyword }” used on these URLs`, slug, url: `${ cell.row.original.kw_id }/${ cell.row.original.dest_url_id }`, showKeys: [ 'link_type', 'url_name' ], listId: 'url_id' } ) }>
						<LinkIcon />
						<Tooltip>{ __( 'Show URLs where used' ) }</Tooltip>
					</button>
				}
			</div>,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.kw_usage_count }</SortBy>,
			size: 70,
		} ),
		columnHelper.accessor( 'urlFilter', {
			className: 'nolimit',
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.urlFilter }</SortBy>,
			size: 100,
		} ),
		columnHelper.accessor( 'editRow', {
			className: 'editRow',
			cell: ( cell ) => {
				return (
					<div className="flex">
						<IconButton
						onClick={ () => updateRow( { cell } ) }
						tooltipClass="align-left xxxl"
						tooltip={ __( 'Edit row' ) }
					>
							<Edit />
						</IconButton>
						<IconButton
						className="ml-s"
						onClick={ () => deleteRow( { cell } ) }
						tooltipClass="align-left xxxl"
						tooltip={ __( 'Delete row' ) }
					>
							<Trash />
						</IconButton>
					</div>
				);
			},
			header: null,
			size: 60,
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
					setEditorRow();
					console.log( val );
					if ( val === 'rowInserted' || val === 'rowChanged' ) {
						setEditorRow( val );
						setTimeout( () => {
							setEditorRow();
						}, 3000 );
					}
				} }
				detailsOptions={ detailsOptions }
				activatePanel={ activePanel }
				rowEditorOptions={ { rowEditorCells, title: 'Add keyword', data, slug, url, paginationId, rowToEdit } }
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
				data={ isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] ) }>
				{ row
					? <Tooltip center>{ `${ header.keyword } “${ row.keyword }”` } { __( 'has been deleted.' ) }</Tooltip>
						: null
				}
				{ ( rowToEdit === 'rowChanged' )
					? <Tooltip center>{ __( 'Keyword has been changed.' ) }</Tooltip>
					: null
				}
				{ ( rowToEdit === 'rowInserted' )
					? <Tooltip center>{ __( 'Keyword has been added.' ) }</Tooltip>
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
