import {
	useInfiniteFetch, ProgressBar, SortBy, Tooltip, SingleSelectMenu, InputField, Checkbox, Trash, Loader, Table, ModuleViewHeaderBottom, TooltipSortingFiltering, TagsMenu, Edit,
} from '../lib/tableImports';

import useTableUpdater from '../hooks/useTableUpdater';
import useChangeRow from '../hooks/useChangeRow';
import IconButton from '../elements/IconButton';
import { active } from 'd3';

export default function SearchReplaceTable( { slug } ) {
	const paginationId = 'id';

	const { table, setTable, filters, setFilters, sorting, sortBy } = useTableUpdater( { slug } );

	const url = { filters, sorting };

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

	const { row, selectedRows, selectRow, rowToEdit, setEditorRow, activePanel, setActivePanel, deleteRow, deleteSelectedRows, updateRow } = useChangeRow( { data, url, slug, paginationId } );

	const searchTypes = {
		T: __( 'Plain text' ),
		R: __( 'Regular expression' ),
	};

	const header = {
		str_search: __( 'Search string (old)' ),
		str_replace: __( 'Replace string (new)' ),
		search_type: __( 'Search type' ),
		labels: __( 'Tags' ),
		url_filter: 'URL filter',
	};

	const rowEditorCells = {
		str_search: <InputField liveUpdate type="url" defaultValue="" label={ header.str_search } onChange={ ( val ) => setEditorRow( { ...rowToEdit, str_search: val } ) } required />,
		str_replace: <InputField liveUpdate type="url" defaultValue="" label={ header.str_replace } onChange={ ( val ) => setEditorRow( { ...rowToEdit, str_replace: val } ) } required />,
		search_type: <SingleSelectMenu defaultAccept autoClose items={ searchTypes } name="search_type" defaultValue="T" onChange={ ( val ) => setEditorRow( { ...rowToEdit, search_type: val } ) }>{ header.search_type }</SingleSelectMenu>,
		url_filter: <InputField liveUpdate defaultValue="" label={ header.url_filter } onChange={ ( val ) => setEditorRow( { ...rowToEdit, url_filter: val } ) } />,
	};

	const columns = [
		columnHelper.accessor( 'check', {
			className: 'nolimit checkbox',
			cell: ( cell ) => <Checkbox defaultValue={ cell.row.getIsSelected() } onChange={ ( val ) => {
				selectRow( val, cell );
			} } />,
			header: null,
		} ),
		columnHelper.accessor( 'str_search', {
			className: 'nolimit',
			cell: ( cell ) => <InputField type="text" defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.str_search }</SortBy>,
			size: 200,
		} ),
		columnHelper.accessor( 'str_replace', {
			className: 'nolimit',
			cell: ( cell ) => <InputField type="text" defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.str_replace }</SortBy>,
			size: 200,
		} ),
		columnHelper.accessor( 'search_type', {
			filterValMenu: searchTypes,
			className: 'nolimit',
			cell: ( cell ) => <SingleSelectMenu items={ searchTypes } name={ cell.column.id } defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.search_type }</SortBy>,
			size: 80,
		} ),
		columnHelper.accessor( 'url_filter', {
			className: 'nolimit',
			cell: ( cell ) => <InputField type="text" defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.url_filter }</SortBy>,
			size: 150,
		} ),
		columnHelper.accessor( 'labels', {
			className: 'nolimit',
			cell: ( cell ) => <TagsMenu defaultValue={ cell.getValue() } slug={ slug } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: header.labels,
			size: 160,
		} ),
		columnHelper.accessor( 'editRow', {
			className: 'editRow',
			cell: ( cell ) => {
				return (
					<div className="flex">
						<IconButton
							onClick={ () => {
								setActivePanel( 'rowEditor' );
								updateRow( { cell } );
							} }
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
			header: () => null,
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
					setActivePanel();
					setEditorRow();
					if ( val === 'rowInserted' || val === 'rowChanged' ) {
						setActivePanel();
						setEditorRow( val );
						setTimeout( () => {
							setEditorRow();
						}, 3000 );
					}
				} }
				activatePanel={ activePanel }
				rowEditorOptions={ { rowEditorCells, title: 'Add New Replacement', data, slug, url, paginationId, rowToEdit } }
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
					? <Tooltip center>{ `${ header.str_search } “${ row.str_search }”` } { __( 'has been deleted.' ) }</Tooltip>
					: null
				}
				{ ( rowToEdit === 'rowChanged' )
					? <Tooltip center>{ __( 'Search & Replace rule has been changed.' ) }</Tooltip>
					: null
				}
				{ ( rowToEdit === 'rowInserted' )
					? <Tooltip center>{ __( 'Search & Replace rule has been added.' ) }</Tooltip>
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
