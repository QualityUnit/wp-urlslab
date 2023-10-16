import { useEffect } from 'react';
import { useI18n } from '@wordpress/react-i18n/';

import {
	useInfiniteFetch, ProgressBar, SortBy, SingleSelectMenu, InputField, Checkbox, Loader, Table, ModuleViewHeaderBottom, TooltipSortingFiltering, TagsMenu, RowActionButtons,
} from '../lib/tableImports';

import useTableStore from '../hooks/useTableStore';
import useChangeRow from '../hooks/useChangeRow';
import useTablePanels from '../hooks/useTablePanels';
import DescriptionBox from '../elements/DescriptionBox';

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

	const setRowToEdit = useTablePanels( ( state ) => state.setRowToEdit );
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

		labels: <TagsMenu optionItem label={ __( 'Tags:' ) } slug={ slug } onChange={ ( val ) => setRowToEdit( { ...rowToEdit, labels: val } ) } />,
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
				activeTable: slug,
				tables: {
					...useTableStore.getState().tables,
					[ slug ]: {
						title,
						paginationId,
						slug,
						header,
						id: 'str_search',
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
	}, [ data, slug ] );

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
			cell: ( cell ) => <SingleSelectMenu autoClose items={ searchTypes } name={ cell.column.id } defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 80,
		} ),
		columnHelper.accessor( 'login_status', {
			filterValMenu: loginStatuses,
			className: 'nolimit',
			cell: ( cell ) => <SingleSelectMenu autoClose items={ loginStatuses } name={ cell.column.id } defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
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
		return <Loader isFullscreen />;
	}

	return (
		<>
			<DescriptionBox	title={ __( 'Learn more…' ) } isMainTableDescription>
				{ __( "Table lists HTML replacement rules. These rules get applied to all HTML requests in real-time as the page content is generated. When the conditions of a rule are fulfilled, all corresponding strings will be replaced according to that rule's definition. Please note that this process happens dynamically and does not alter the original content in the database. If the module or a specific rule is deactivated, the plugin will revert to displaying the original content." ) }
			</DescriptionBox>
			<ModuleViewHeaderBottom />
			<Table className="fadeInto"
				initialState={ { columnVisibility: { login_status: false } } }
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
