import { useI18n } from '@wordpress/react-i18n';

import {
	useInfiniteFetch,
	ProgressBar,
	SortBy,
	SingleSelectMenu,
	InputField,
	Checkbox,
	Loader,
	Table,
	ModuleViewHeaderBottom,
	TooltipSortingFiltering,
	TagsMenu,
	Editor, LangMenu, DateTimeFormat, RowActionButtons,
} from '../lib/tableImports';

import useTableUpdater from '../hooks/useTableUpdater';
import useChangeRow from '../hooks/useChangeRow';
import useTablePanels from '../hooks/useTablePanels';
import { useState } from 'react';
import Button from '../elements/Button';
import ContentGeneratorConfigPanel from '../components/generator/ContentGeneratorConfigPanel';
// import { active } from 'd3';

export default function FaqsTable( { slug } ) {
	const { __ } = useI18n();
	const title = __( 'Add New FAQ' );
	const paginationId = 'faq_id';

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
	const [ showGeneratorPanel, setShowGeneratorPanel ] = useState( false );

	const { setRowToEdit } = useTablePanels();
	const rowToEdit = useTablePanels( ( state ) => state.rowToEdit );

	const statuses = {
		A: __( 'Active' ),
		N: __( 'New - answerred' ),
		E: __( 'New - Missing answer' ),
		W: __( 'Waiting approval' ),
		P: __( 'Processing answer' ),
		D: __( 'Disabled' ),
	};

	const header = {
		faq_id: __( 'ID' ),
		question: __( 'Question' ),
		answer: __( 'Answer' ),
		language: __( 'Language' ),
		labels: __( 'Tags' ),
		status: __( 'Status' ),
		updated: __( 'Updated' ),
	};

	const handlePanel = () => {
		setShowGeneratorPanel( false );
	};

	const rowEditorCells = {
		question: <div>
			<InputField liveUpdate defaultValue={ rowToEdit.question } label={ header.question }
				description={ __( 'Up to 500 characters.' ) }
				onChange={ ( val ) => setRowToEdit( { ...rowToEdit, question: val } ) } required />
		</div>,

		answer: <Editor
			description={ ( __( 'Answer to the question' ) ) }
			defaultValue="" label={ header.answer } onChange={ ( val ) => {
				setRowToEdit( { ...rowToEdit, answer: val } );
			} } />,

		language: <LangMenu autoClose defaultValue="all"
			description={ __( 'Select language' ) }
			onChange={ ( val ) => setRowToEdit( { ...rowToEdit, language: val } ) }>{ header.language }</LangMenu>,

		generate: <>
			<Button active onClick={ () => setShowGeneratorPanel( true ) }>{ __( 'Generate Answer' ) }</Button>
			{
				showGeneratorPanel && (
					<ContentGeneratorConfigPanel
						initialData={ {
							keywordsList: [ { q: rowToEdit.question, checked: true } ],
							dataSource: 'SERP_CONTEXT',
							initialPromptType: 'S',
						} }
						onGenerateComplete={ ( val ) => {
							setRowToEdit( { ...rowToEdit, answer: val } );
						} }
					/>
				)
			}
		</>,

		labels: <TagsMenu hasActivator label={ __( 'Tags:' ) } slug={ slug } onChange={ ( val ) => setRowToEdit( { ...rowToEdit, labels: val } ) } />,

		status: <SingleSelectMenu autoClose defaultAccept description={ __( ' ' ) } items={ statuses } name="status" defaultValue="N" onChange={ ( val ) => setRowToEdit( { ...rowToEdit, status: val } ) }>{ header.status }</SingleSelectMenu>,
	};

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
		columnHelper.accessor( 'faq_id', {
			className: 'nolimit',
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.faq_id }</SortBy>,
			size: 20,
		} ),
		columnHelper.accessor( 'question', {
			className: 'nolimit',
			cell: ( cell ) => <InputField type="text" defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.question }</SortBy>,
			size: 200,
		} ),
		columnHelper.accessor( 'status', {
			filterValMenu: statuses,
			className: 'nolimit',
			cell: ( cell ) => <SingleSelectMenu items={ statuses } name={ cell.column.id } defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.status }</SortBy>,
			size: 80,
		} ),
		columnHelper.accessor( 'labels', {
			className: 'nolimit',
			cell: ( cell ) => <TagsMenu defaultValue={ cell.getValue() } slug={ slug } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: header.labels,
			size: 160,
		} ),
		columnHelper.accessor( 'updated', {
			cell: ( val ) => <DateTimeFormat datetime={ val.getValue() } />,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.updated }</SortBy>,
			size: 80,
		} ),
		columnHelper.accessor( 'editRow', {
			className: 'editRow',
			cell: ( cell ) => <RowActionButtons
				onEdit={ () => updateRow( { cell, id: 'faq_id' } ) }
				onDelete={ () => deleteRow( { cell, id: 'faq_id' } ) }
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
			<ModuleViewHeaderBottom
				table={ table }
				onDeleteSelected={ deleteMultipleRows }
				onFilter={ ( filter ) => setFilters( filter ) }
				options={ { header, data, slug, url, paginationId,
					title,
					rowEditorCells,
					rowToEdit,
					handlePanel,
					id: 'faq_id',
				} }
			/>
			<Table className="fadeInto"
				title={ title }
				slug={ slug }
				returnTable={ ( returnTable ) => setTable( returnTable ) }
				columns={ columns }
				data={ isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] ) }
			>
				<TooltipSortingFiltering props={ { isFetching, filters, sorting } } />
				<div ref={ ref }>
					{ isFetchingNextPage ? '' : hasNextPage }
					<ProgressBar className="infiniteScroll" value={ ! isFetchingNextPage ? 0 : 100 } />
				</div>
			</Table>
		</>
	);
}
