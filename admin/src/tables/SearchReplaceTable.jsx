import { useEffect } from 'react';
import { useI18n } from '@wordpress/react-i18n/';

import {
	useInfiniteFetch, ProgressBar, SortBy, SingleSelectMenu, InputField, Checkbox, Loader, Table, ModuleViewHeaderBottom, TooltipSortingFiltering, TagsMenu, RowActionButtons,
} from '../lib/tableImports';

import useTableStore from '../hooks/useTableStore';
import useChangeRow from '../hooks/useChangeRow';
import useTablePanels from '../hooks/useTablePanels';
// import { active } from 'd3';

export default function SearchReplaceTable( { slug } ) {
	const { __ } = useI18n();
	const title = __( 'Add New Replacement' );
	const paginationId = 'id';

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

	const { resetTableStore } = useTableStore();
	const { setRowToEdit, resetPanelsStore } = useTablePanels();
	const rowToEdit = useTablePanels( ( state ) => state.rowToEdit );

	const searchTypes = {
		T: __( 'Plain text' ),
		R: __( 'Regular expression' ),
	};

	const loginStatuses = {
		A: __( 'Any' ),
		L: __( 'Logged in' ),
		O: __( 'Not logged in' ),
	};

	const header = {
		str_search: __( 'Search string (old)' ),
		str_replace: __( 'Replace string (new)' ),
		search_type: __( 'Search type' ),
		login_status: __( 'Is logged in' ),
		url_filter: 'URL filter',
		labels: __( 'Tags' ),
	};

	const rowEditorCells = {
		search_type: <SingleSelectMenu defaultAccept autoClose items={ searchTypes } name="search_type" defaultValue="T"
			description={ __( 'Choose the method for string matching' ) }
			onChange={ ( val ) => setRowToEdit( { ...rowToEdit, search_type: val } ) }>{ header.search_type }</SingleSelectMenu>,

		str_search: <InputField liveUpdate type="url" defaultValue="" label={ header.str_search }
			description={ __( 'Enter a string or regular expression for replacement' ) }
			onChange={ ( val ) => setRowToEdit( { ...rowToEdit, str_search: val } ) } required />,

		str_replace: <InputField liveUpdate type="url" defaultValue="" label={ header.str_replace }
			description={ __( 'Enter a substitute string' ) }
			onChange={ ( val ) => setRowToEdit( { ...rowToEdit, str_replace: val } ) } required />,

		url_filter: <InputField liveUpdate defaultValue=".*" label={ header.url_filter }
			description={ __( 'Optionally, you can permit replacement only on URLs that match a specific regular expression. Use value `.*` to match all URLs' ) }
			onChange={ ( val ) => setRowToEdit( { ...rowToEdit, url_filter: val } ) } />,

		login_status: <SingleSelectMenu defaultAccept autoClose items={ loginStatuses } name="login_status" defaultValue="A"
			description={ __( '' ) }
			onChange={ ( val ) => setRowToEdit( { ...rowToEdit, login_status: val } ) }>{ header.login_status }</SingleSelectMenu>,

		labels: <TagsMenu hasActivator label={ __( 'Tags:' ) } slug={ slug } onChange={ ( val ) => setRowToEdit( { ...rowToEdit, labels: val } ) } />,
	};

	useEffect( () => {
		resetTableStore();
		resetPanelsStore();
		useTablePanels.setState( () => (
			{
				rowEditorCells,
				deleteCSVCols: [ paginationId, 'dest_url_id' ],
			}
		) );
	}, [] );

	// Saving all variables into state managers
	useEffect( () => {
		useTableStore.setState( () => (
			{
				data,
				title,
				paginationId,
				slug,
				header,
				id: 'str_search',
			}
		) );
	}, [ data ] );

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
		columnHelper.accessor( 'str_search', {
			className: 'nolimit',
			cell: ( cell ) => <InputField type="text" defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 200,
		} ),
		columnHelper.accessor( 'str_replace', {
			className: 'nolimit',
			cell: ( cell ) => <InputField type="text" defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 200,
		} ),
		columnHelper.accessor( 'search_type', {
			filterValMenu: searchTypes,
			className: 'nolimit',
			cell: ( cell ) => <SingleSelectMenu items={ searchTypes } name={ cell.column.id } defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 80,
		} ),
		columnHelper.accessor( 'login_status', {
			filterValMenu: loginStatuses,
			className: 'nolimit',
			cell: ( cell ) => <SingleSelectMenu items={ loginStatuses } name={ cell.column.id } defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 80,
		} ),
		columnHelper.accessor( 'url_filter', {
			className: 'nolimit',
			cell: ( cell ) => <InputField type="text" defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy { ...th } />,
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
			cell: ( cell ) => <RowActionButtons
				onEdit={ () => updateRow( { cell, id: 'str_search' } ) }
				onDelete={ () => deleteRow( { cell, id: 'str_search' } ) }
			>
			</RowActionButtons>,
			header: () => null,
			size: 0,
		} ),
	];

	if ( status === 'loading' ) {
		return <Loader />;
	}

	return (
		<>
			<ModuleViewHeaderBottom />
			<Table className="fadeInto"
				initialState={ { columnVisibility: { login_status: false } } }
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
