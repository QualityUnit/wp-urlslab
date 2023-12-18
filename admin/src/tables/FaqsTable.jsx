import { memo, useEffect, useMemo } from 'react';
import { __ } from '@wordpress/i18n';

import {
	Checkbox,
	DateTimeFormat,
	Editor,
	IconButton,
	IconStars,
	InputField,
	LangMenu,
	Loader,
	ModuleViewHeaderBottom,
	RowActionButtons,
	SortBy,
	SvgIcon,
	Table,
	TagsMenu, TextArea,
	Tooltip,
	TooltipSortingFiltering,
	useInfiniteFetch,
} from '../lib/tableImports';

import useChangeRow from '../hooks/useChangeRow';
import useTablePanels from '../hooks/useTablePanels';
import useTableStore from '../hooks/useTableStore';

import Button from '@mui/joy/Button';
import SingleSelectMenu from '../elements/SingleSelectMenu';
import { getTooltipUrlsList } from '../lib/elementsHelpers';
import DescriptionBox from '../elements/DescriptionBox';
import useColumnTypesQuery from '../queries/useColumnTypesQuery';

const title = __( 'Add New FAQ' );
const paginationId = 'faq_id';

const header = {
	faq_id: __( 'ID' ),
	question: __( 'Question' ),
	answer: __( 'Answer' ),
	language: __( 'Language' ),
	status: __( 'Status' ),
	urls_count: __( 'Number of Assigned URLs' ),
	updated: __( 'Updated' ),
	urls: __( 'Assigned URLs' ),
	labels: __( 'Tags' ),
};

export default function FaqsTable( { slug } ) {
	const {
		columnHelper,
		data,
		status,
		isSuccess,
		isFetchingNextPage,
		ref,
	} = useInfiniteFetch( { slug } );

	const { columnTypes } = useColumnTypesQuery( slug );

	const { isSelected, selectRows, deleteRow, updateRow } = useChangeRow();

	const ActionButton = useMemo( () => ( { cell, onClick } ) => {
		const { status: statusType } = cell?.row?.original;

		return (
			<div className="flex flex-align-center flex-justify-end">
				{
					( statusType === 'D' ) &&
					<Tooltip title={ __( 'Activate' ) } disablePortal>
						<IconButton size="xs" color="success" onClick={ () => onClick( 'A' ) }>
							<SvgIcon name="activate" />
						</IconButton>
					</Tooltip>
				}
				{
					( statusType === 'A' ) &&
					<Tooltip title={ __( 'Disable' ) } disablePortal>
						<IconButton size="xs" color="danger" onClick={ () => onClick( 'D' ) }>
							<SvgIcon name="disable" />
						</IconButton>
					</Tooltip>
				}
			</div>
		);
	}, [] );

	useEffect( () => {
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
						id: 'faq_id',
					},
				},
			}
		) );
	}, [ slug ] );

	useEffect( () => {
		useTableStore.setState( () => (
			{
				tables: {
					...useTableStore.getState().tables,
					[ slug ]: {
						...useTableStore.getState().tables[ slug ],
						data,
					},
				},
			}
		) );
	}, [ data, slug ] );

	const columns = useMemo( () => [
		columnHelper.accessor( 'check', {
			className: 'nolimit checkbox',
			cell: ( cell ) => <Checkbox defaultValue={ isSelected( cell ) } onChange={ () => {
				selectRows( cell );
			} } />,
			header: ( head ) => <Checkbox defaultValue={ isSelected( head, true ) } onChange={ ( ) => {
				selectRows( head, true );
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
		columnHelper.accessor( 'answer', {
			className: 'nolimit',
			header: ( th ) => <SortBy { ...th } />,
			size: 200,
		} ),
		columnHelper.accessor( 'language', {
			className: 'nolimit',
			cell: ( cell ) => <LangMenu defaultValue={ cell?.getValue() } listboxStyles={ { minWidth: 300 } } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 100,
		} ),
		columnHelper.accessor( 'status', {
			className: 'nolimit',
			cell: ( cell ) => <SingleSelectMenu
				defaultValue={ cell.getValue() }
				onChange={ ( newVal ) => updateRow( { newVal, cell } ) }
				name="status"
				items={ columnTypes?.status.values }
				autoClose
			/>,
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
		columnHelper.accessor( 'urls', {
			tooltip: ( cell ) => getTooltipUrlsList( cell.getValue() ),
			cell: ( cell ) => Array.isArray( cell.getValue() ) ? cell.getValue().join( ', ' ) : cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 100,
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
	], [ columnHelper, columnTypes?.status, deleteRow, isSelected, selectRows, slug, updateRow ] );

	if ( status === 'loading' ) {
		return <Loader isFullscreen />;
	}

	return (
		<>
			<DescriptionBox	title={ __( 'About this table' ) } tableSlug={ slug } isMainTableDescription>
				{ __( 'The table presents a list of Frequently Asked Questions (FAQs). You have the option to display the FAQ widget on the page either through the Settings or by using a shortcode in an HTML template. Furthermore, the SERP module can automatically create FAQ entries. These questions can then be answered by the AI Generator, saving you valuable time.' ) }
			</DescriptionBox>
			<ModuleViewHeaderBottom />
			<Table className="fadeInto"
				initialState={ { columnVisibility: { answer: false, urls_count: false, labels: false, language: false } } }
				columns={ columns }
				data={ isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] ) }
				referrer={ ref }
				loadingRows={ isFetchingNextPage }
			>
				<TooltipSortingFiltering />
			</Table>
			<TableEditorManager slug={ slug } />
		</>
	);
}

const TableEditorManager = memo( ( { slug } ) => {
	const activatePanel = useTablePanels( ( state ) => state.activatePanel );
	const setRowToEdit = useTablePanels( ( state ) => state.setRowToEdit );
	const rowToEdit = useTablePanels( ( state ) => state.rowToEdit );

	const { columnTypes } = useColumnTypesQuery( slug );

	const rowEditorCells = useMemo( () => ( {
		question: <InputField liveUpdate defaultValue={ rowToEdit.question } label={ header.question }
			description={ __( 'Maximum of 500 characters' ) }
			onChange={ ( val ) => setRowToEdit( { question: val } ) } required />,

		answer: <Editor
			description={ ( __( 'Answer to the question' ) ) }
			defaultValue="" label={ __( 'Answer' ) } onChange={ ( val ) => {
				setRowToEdit( { answer: val } );
			} } />,

		language: <LangMenu defaultValue=""
			description={ __( 'Select language' ) }
			onChange={ ( val ) => setRowToEdit( { language: val } ) }>{ header.language }</LangMenu>,

		generate: <Button
			className="generatorBtn"
			disabled={ ! rowToEdit.question }
			onClick={ () => activatePanel( 'answerGeneratorPanel' ) }
			startDecorator={ <IconStars /> }
		>
			{ __( 'Generate Answer' ) }
		</Button>,

		status: <SingleSelectMenu
			defaultAccept
			defaultValue="E"
			onChange={ ( value ) => setRowToEdit( { status: value } ) }
			name="status"
			items={ columnTypes?.status.values }
			autoClose
			description={ __( 'The Status of the FAQ' ) }
			tooltipLabel={ { label: __( 'FAQ Status' ), tooltip: __( 'FAQ Status' ), noWrapText: true } }
		>{ __( 'FAQ Status' ) }</SingleSelectMenu>,

		labels: <TagsMenu optionItem label={ __( 'Tags:' ) } slug={ slug } onChange={ ( val ) => setRowToEdit( { labels: val } ) } />,
		urls: <TextArea rows="5" liveUpdate defaultValue="" label={ header.urls }
			description={ __( 'New line or comma separated list of URLs, where is FAQ assigned. We recommend to use one URL only, otherwise google can understand it as duplicate content if you display same FAQ entry on multiple pages' ) }
			onChange={ ( val ) => setRowToEdit( { urls: val } ) } />,
	} ), [ activatePanel, columnTypes?.status, rowToEdit.question, setRowToEdit, slug ] );

	useEffect( () => {
		useTablePanels.setState( () => (
			{
				...useTablePanels.getState(),
				rowEditorCells,
			}
		) );
	}, [ rowEditorCells ] );
} );
