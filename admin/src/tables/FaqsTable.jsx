import { useEffect, useState } from 'react';
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
	Editor, LangMenu, DateTimeFormat, RowActionButtons, IconButton, AcceptIcon, DisableIcon,
} from '../lib/tableImports';

import useChangeRow from '../hooks/useChangeRow';
import useTablePanels from '../hooks/useTablePanels';
import useTableStore from '../hooks/useTableStore';

import Button from '../elements/Button';
import ContentGeneratorConfigPanel from '../components/generator/ContentGeneratorConfigPanel';
// import { active } from 'd3';

export default function FaqsTable( { slug } ) {
	const { __ } = useI18n();
	const [ generatorPanelPos, setGeneratorPanelPos ] = useState( { left: '0px', bottom: '0px' } );
	const title = __( 'Add New FAQ' );
	const paginationId = 'faq_id';

	const ActionButton = ( { cell, onClick } ) => {
		const { status } = cell?.row?.original;

		return (
			<div className="flex flex-align-center flex-justify-end">
				{
					( status === 'D' ) &&
					<IconButton className="mr-s c-saturated-green"
						tooltip={ __( 'Activate' ) }
						tooltipClass="align-left" onClick={ () => onClick( 'A' ) }>
						<AcceptIcon />
					</IconButton>
				}
				{
					( status === 'A' ) &&
					<IconButton className="mr-s c-saturated-red"
						tooltip={ __( 'Disable' ) }
						tooltipClass="align-left" onClick={ () => onClick( 'D' ) }>
						<DisableIcon />
					</IconButton>
				}
			</div>
		);
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

	const { selectRows, deleteRow, updateRow } = useChangeRow();

	const { resetTableStore } = useTableStore();
	const { setRowToEdit, resetPanelsStore } = useTablePanels();
	const rowToEdit = useTablePanels( ( state ) => state.rowToEdit );
	const secondPanel = useTablePanels( ( state ) => state.secondPanel );
	const showSecondPanel = useTablePanels( ( state ) => state.showSecondPanel );

	const statusTypes = {
		A: __( 'Active' ),
		N: __( 'New - answered' ),
		E: __( 'New - missing answer' ),
		W: __( 'Awaiting approval' ),
		P: __( 'Processing answer' ),
		D: __( 'Disabled' ),
	};

	const header = {
		faq_id: __( 'ID' ),
		question: __( 'Question' ),
		answer: __( 'Answer' ),
		urls_count: __( 'Assigned URLs' ),
		language: __( 'Language' ),
		status: __( 'Status' ),
		updated: __( 'Updated' ),
		labels: __( 'Tags' ),
	};

	const rowEditorCells = {
		question: <InputField liveUpdate defaultValue={ rowToEdit.question } label={ header.question }
			description={ __( 'Maximum of 500 characters' ) }
			onChange={ ( val ) => setRowToEdit( { ...rowToEdit, question: val } ) } required />,

		answer: <Editor
			description={ ( __( 'Answer to the question' ) ) }
			defaultValue="" label={ header.answer } onChange={ ( val ) => {
				setRowToEdit( { ...rowToEdit, answer: val } );
			} } />,

		language: <LangMenu autoClose defaultValue="all"
			description={ __( 'Select language' ) }
			onChange={ ( val ) => setRowToEdit( { ...rowToEdit, language: val } ) }>{ header.language }</LangMenu>,

		generate: <Button active className="generatorBtn" onClick={ () => showSecondPanel( 'generator' ) }>{ __( 'Generate Answer' ) }</Button>,

		labels: <TagsMenu hasActivator label={ __( 'Tags:' ) } slug={ slug } onChange={ ( val ) => setRowToEdit( { ...rowToEdit, labels: val } ) } />,

		status: <SingleSelectMenu autoClose defaultAccept description={ __( ' ' ) } items={ statusTypes } name="status" defaultValue="N" onChange={ ( val ) => setRowToEdit( { ...rowToEdit, status: val } ) }>{ header.status }</SingleSelectMenu>,
	};

	// Saving all variables into state managers
	useEffect( () => {
		resetTableStore();
		resetPanelsStore();
		useTablePanels.setState( () => (
			{
				rowEditorCells,
			}
		) );
		useTableStore.setState( () => (
			{
				data,
				title,
				paginationId,
				slug,
				header,
				id: 'faq_id',
			}
		) );

		if ( secondPanel ) {
			const generatorPanelPosition = () => {
				const generatorBtnPos = document.querySelector( '.generatorBtn' ).getBoundingClientRect();
				setGeneratorPanelPos( { left: `${ generatorBtnPos.left }px`, bottom: `${ generatorBtnPos.top }px` } );
			};

			const resizeWatcher = new ResizeObserver( ( [ entry ] ) => {
				if ( entry.borderBoxSize ) {
					generatorPanelPosition();
				}
			} );

			resizeWatcher.observe( document.documentElement );
		}
	}, [ secondPanel ] );

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
		columnHelper.accessor( 'language', {
			className: 'nolimit',
			cell: ( cell ) => <LangMenu defaultValue={ cell?.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 100,
		} ),
		columnHelper.accessor( 'status', {
			filterValMenu: statusTypes,
			className: 'nolimit',
			cell: ( cell ) => statusTypes[ cell.getValue() ],
			header: ( th ) => <SortBy { ...th } />,
			size: 80,
		} ),
		columnHelper.accessor( 'urls_count', {
			cell: ( val ) => val.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 40,
		} ),
		columnHelper.accessor( 'updated', {
			cell: ( val ) => <DateTimeFormat datetime={ val.getValue() } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 80,
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
				onEdit={ () => updateRow( { cell, id: 'faq_id' } ) }
				onDelete={ () => deleteRow( { cell, id: 'faq_id' } ) }
			>
				<ActionButton cell={ cell } onClick={ ( val ) => updateRow( { changeField: 'status', newVal: val, cell } ) } />
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
			{
				secondPanel === 'generator' && (
					<ContentGeneratorConfigPanel
						style={ { '--posBottom': generatorPanelPos.bottom, '--posLeft': generatorPanelPos.left } }
						noPromptTemplate
						isFloating
						closeBtn
						className="onTop pos-fixed"
						initialData={ {
							keywordsList: [ { q: rowToEdit.question, checked: true } ],
							dataSource: 'SERP_CONTEXT',
							initialPromptType: 'S',
						} }
						onGenerateComplete={ ( val ) => {
							setRowToEdit( { ...rowToEdit, answer: val } );
							showSecondPanel();
						} }
					/>
				)
			}

			<Table className="fadeInto"
				initialState={ { columnVisibility: { answer: false, urls_count: false, labels: false } } }
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
