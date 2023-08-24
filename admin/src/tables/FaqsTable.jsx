import { useEffect } from 'react';
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

import useChangeRow from '../hooks/useChangeRow';
import useTablePanels from '../hooks/useTablePanels';
import useTableStore from '../hooks/useTableStore';

import Button from '../elements/Button';
import ContentGeneratorConfigPanel from '../components/generator/ContentGeneratorConfigPanel';
// import { active } from 'd3';

export default function FaqsTable( { slug } ) {
	const { __ } = useI18n();
	const title = __( 'Add New FAQ' );
	const paginationId = 'faq_id';

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

	const { setRowToEdit } = useTablePanels();
	const rowToEdit = useTablePanels( ( state ) => state.rowToEdit );
	const secondPanel = useTablePanels( ( state ) => state.secondPanel );
	const showSecondPanel = useTablePanels( ( state ) => state.showSecondPanel );

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
		status: __( 'Status' ),
		labels: __( 'Tags' ),
		updated: __( 'Updated' ),
		urls_count: __( 'Assigned URLs' ),
		language: __( 'Language' ),
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
			<Button active onClick={ () => {
				showSecondPanel( 'generator' );
				useTablePanels.setState( () => (
					{
						rowEditorCells,
					}
				) );
			}
			}
			>{ __( 'Generate Answer' ) }</Button>
			{
				secondPanel === 'generator' && (
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

		labels: <TagsMenu hasActivator label={ __( 'All tags for this row:' ) } slug={ slug } onChange={ ( val ) => setRowToEdit( { ...rowToEdit, labels: val } ) } />,

		status: <SingleSelectMenu autoClose defaultAccept description={ __( ' ' ) } items={ statuses } name="status" defaultValue="N" onChange={ ( val ) => setRowToEdit( { ...rowToEdit, status: val } ) }>{ header.status }</SingleSelectMenu>,
	};

	// Saving all variables into state managers
	useEffect( () => {
		useTableStore.setState( () => (
			{
				data,
				title,
				paginationId,
				optionalSelector: undefined,
				slug,
				header,
				id: 'faq_id',
			}
		) );

		useTablePanels.setState( () => (
			{
				rowEditorCells,
				deleteCSVCols: [],
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
		columnHelper.accessor( 'faq_id', {
			className: 'nolimit',
			header: ( th ) => <SortBy { ...th } />,
			size: 20,
		} ),
		columnHelper.accessor( 'question', {
			className: 'nolimit',
			cell: ( cell ) => <InputField type="text" defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 200,
		} ),
		columnHelper.accessor( 'status', {
			filterValMenu: statuses,
			className: 'nolimit',
			cell: ( cell ) => <SingleSelectMenu items={ statuses } name={ cell.column.id } defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy { ...th } />,
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
			header: ( th ) => <SortBy { ...th } />,
			size: 80,
		} ),
		columnHelper.accessor( 'urls_count', {
			cell: ( val ) => val.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 40,
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
			<ModuleViewHeaderBottom />
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
