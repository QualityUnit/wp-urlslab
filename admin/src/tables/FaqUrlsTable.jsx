import { useEffect } from 'react';
import { useI18n } from '@wordpress/react-i18n/';

import {
	useInfiniteFetch,
	SortBy,
	InputField,
	Checkbox,
	Loader,
	Table,
	ModuleViewHeaderBottom,
	RowActionButtons,
} from '../lib/tableImports';

import useChangeRow from '../hooks/useChangeRow';
import useTableStore from '../hooks/useTableStore';
import useTablePanels from '../hooks/useTablePanels';

export default function FaqUrlsTable( { slug } ) {
	const { __ } = useI18n();
	const title = __( 'Add New FAQ to URL' );
	const paginationId = 'faq_id';
	const optionalSelector = 'url_id';

	const defaultSorting = [ { key: 'url_name', dir: 'ASC', op: '>' }, { key: 'sorting', dir: 'ASC', op: '>' } ];

	const {
		columnHelper,
		data,
		status,
		isSuccess,
		isFetchingNextPage,
	} = useInfiniteFetch( { slug } );

	const { selectRows, deleteRow, updateRow } = useChangeRow();

	const setRowToEdit = useTablePanels( ( state ) => state.setRowToEdit );
	const rowToEdit = useTablePanels( ( state ) => state.rowToEdit );

	const header = {
		url_name: __( 'URL' ),
		faq_id: __( 'Question ID' ),
		question: __( 'Question' ),
		sorting: __( 'Position' ),
	};

	const rowEditorCells = {
		url_name: <InputField liveUpdate type="url" defaultValue="" label={ header.url_name } onChange={ ( val ) => setRowToEdit( { ...rowToEdit, url_name: val } ) } required />,
		faq_id: <InputField liveUpdate defaultValue="" type="number" label={ header.faq_id } onChange={ ( val ) => setRowToEdit( { ...rowToEdit, faq_id: val } ) } required />,
		sorting: <InputField liveUpdate type="number" defaultValue="10" label={ header.sorting } min="0" max="100"
			description={ __( 'Position of the FAQ in the list (Number 0 - 100).' ) }
			onChange={ ( val ) => setRowToEdit( { ...rowToEdit, sorting: val } ) } />,
	};

	useEffect( () => {
		useTablePanels.setState( () => (
			{
				rowEditorCells,
				deleteCSVCols: [ 'url_id' ],
			}
		) );
		useTableStore.setState( () => (
			{
				title,
				paginationId,
				optionalSelector,
				slug,
				header,
				id: 'faq_id',
				sorting: defaultSorting,
			}
		) );
	}, [] );

	// Saving all variables into state managers
	useEffect( () => {
		useTableStore.setState( () => (
			{
				data,
			}
		) );
	}, [ data ] );

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
		columnHelper.accessor( 'url_name', {
			className: 'nolimit',
			cell: ( cell ) => <a href={ cell.getValue() } target="_blank" rel="noreferrer">{ cell.getValue() }</a>,
			header: ( th ) => <SortBy { ...th } />,
			size: 200,
		} ),
		columnHelper.accessor( 'faq_id', {
			className: 'nolimit',
			header: ( th ) => <SortBy { ...th } />,
			size: 20,
		} ),
		columnHelper.accessor( 'question', {
			className: 'nolimit',
			header: ( th ) => <SortBy { ...th } />,
			size: 200,
		} ),
		columnHelper.accessor( 'sorting', {
			className: 'nolimit',
			cell: ( cell ) => <InputField type="number" defaultValue={ cell.getValue() } min="0" max="100"
				onChange={ ( newVal ) => updateRow( { newVal, cell, optionalSelector } ) } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 80,
		} ),
		columnHelper.accessor( 'editRow', {
			className: 'editRow',
			cell: ( cell ) => <RowActionButtons
				onEdit={ () => updateRow( { cell, optionalSelector, id: 'faq_id' } ) }
				onDelete={ () => deleteRow( { cell, optionalSelector, id: 'faq_id' } ) }
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
			<ModuleViewHeaderBottom />
			<Table className="fadeInto"
				initialState={ { columnVisibility: { sorting: true, faq_id: false, url_name: true, question: true } } }
				columns={ columns }
				data={ isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] ) }
				progressBarValue={ ! isFetchingNextPage ? 0 : 100 }
				hasSortingFiltering
			/>
		</>
	);
}
