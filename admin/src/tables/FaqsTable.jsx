import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { __ } from '@wordpress/i18n';

import {
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
	TableSelectCheckbox,
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
import { postFetch } from '../api/fetching.js';
import { setNotification } from '../hooks/useNotifications.jsx';
import useColumnTypesQuery from '../queries/useColumnTypesQuery';

const title = __( 'Add New FAQ', 'urlslab' );
const paginationId = 'faq_id';

const header = {
	faq_id: __( 'ID', 'urlslab' ),
	question: __( 'Question', 'urlslab' ),
	answer: __( 'Answer', 'urlslab' ),
	language: __( 'Language', 'urlslab' ),
	status: __( 'Status', 'urlslab' ),
	urls_count: __( 'Number of Assigned URLs', 'urlslab' ),
	updated: __( 'Updated', 'urlslab' ),
	urls: __( 'Assigned URLs', 'urlslab' ),
	labels: __( 'Tags', 'urlslab' ),
};
const initialState = { columnVisibility: { answer: false, urls_count: false, labels: false, language: false } };

// init table state with fixed states which we do not need to update anymore during table lifecycle
export default function TableInit( { slug } ) {
	const setTable = useTableStore( ( state ) => state.setTable );
	const [ init, setInit ] = useState( false );
	useEffect( () => {
		setInit( true );
		setTable( slug, {
			title,
			paginationId,
			slug,
			header,
			id: 'faq_id',
		} );
	}, [ setTable, slug ] );

	return init && <FaqsTable slug={ slug } />;
}

function FaqsTable( { slug } ) {
	const {
		columnHelper,
		data,
		isLoading,
		isSuccess,
		isFetchingNextPage,
		ref,
	} = useInfiniteFetch( { slug } );

	const tableData = useMemo( () => data?.pages?.flatMap( ( page ) => page ?? [] ), [ data?.pages ] );
	const setTable = useTableStore( ( state ) => state.setTable );

	const { columnTypes, isLoadingColumnTypes } = useColumnTypesQuery( slug );
	const { deleteRow, updateRow } = useChangeRow();

	const onFaqUrlAssignment = useCallback( async ( cell ) => {
		setNotification( cell?.row.original, { message: __( 'Fetching URLs…', 'urlslab' ), status: 'info' } );

		const resp = await postFetch( 'faqurls/suggest-urls', {
			question: cell?.row?.original?.question,
			answer: cell?.row?.original?.answer,
		} );

		if ( ! resp?.ok ) {
			setNotification( cell?.row.original, { message: __( 'Something went wrong', 'urlslab' ), status: 'error' } );
			return false;
		}

		const urls = await resp.json();

		updateRow( {
			cell,
			changeField: 'urls',
			newVal: urls,
		} );
	}, [ updateRow ] );

	const ActionButton = useMemo( () => ( { cell, onClick } ) => {
		const { status: statusType } = cell?.row?.original;

		return (
			<div className="flex flex-align-center flex-justify-end">
				{
					( statusType === 'D' ) &&
					<Tooltip title={ __( 'Activate', 'urlslab' ) } arrow placement="bottom">
						<IconButton size="xs" color="success" onClick={ () => onClick( 'A' ) }>
							<SvgIcon name="activate" />
						</IconButton>
					</Tooltip>
				}
				{
					( statusType === 'A' ) &&
					<Tooltip title={ __( 'Disable', 'urlslab' ) } arrow placement="bottom">
						<IconButton size="xs" color="danger" onClick={ () => onClick( 'D' ) }>
							<SvgIcon name="disable" />
						</IconButton>
					</Tooltip>
				}
			</div>
		);
	}, [] );

	const columns = useMemo( () => ! columnTypes ? [] : [
		columnHelper.accessor( 'check', {
			className: 'nolimit checkbox',
			cell: ( cell ) => <TableSelectCheckbox tableElement={ cell } />,
			header: ( head ) => <TableSelectCheckbox tableElement={ head } />,
		} ),
		columnHelper.accessor( 'faq_id', {
			className: 'nolimit',
			header: ( th ) => <SortBy { ...th } />,
			size: 20,
		} ),
		columnHelper.accessor( 'question', {
			className: 'nolimit',
			cell: ( cell ) => <InputField type="text" value={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
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
				value={ cell.getValue() }
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
			cell: ( cell ) => <TagsMenu value={ cell.getValue() } slug={ slug } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
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
				<Button
					size="xxs"
					onClick={ () => onFaqUrlAssignment( cell ) }
				>
					{ __( 'Suggest URL', 'urlslab' ) }
				</Button>
			</RowActionButtons>,
			header: () => null,
			size: 0,
		} ),
	], [ columnHelper, columnTypes, deleteRow, onFaqUrlAssignment, slug, updateRow ] );

	useEffect( () => {
		setTable( slug, { data } );
	}, [ data, setTable, slug ] );

	if ( isLoading || isLoadingColumnTypes ) {
		return <Loader isFullscreen />;
	}

	return (
		<>
			<DescriptionBox	title={ __( 'About this table', 'urlslab' ) } tableSlug={ slug } isMainTableDescription>
				{ __( 'The table presents a list of Frequently Asked Questions (FAQs). You have the option to display the FAQ widget on the page either through the Settings or by using a shortcode in an HTML template. Furthermore, the SERP module can automatically create FAQ entries. These questions can then be answered by the AI Generator, saving you valuable time.', 'urlslab' ) }
			</DescriptionBox>

			<ModuleViewHeaderBottom />

			<Table
				className="fadeInto"
				initialState={ initialState }
				columns={ columns }
				data={ isSuccess && tableData }
				referrer={ ref }
				loadingRows={ isFetchingNextPage }
			>
				<TooltipSortingFiltering />
			</Table>

			<TableEditorManager slug={ slug } />
		</>
	);
}

export const TableEditorManager = memo( ( { slug } ) => {
	const activatePanel = useTablePanels( ( state ) => state.activatePanel );
	const setRowToEdit = useTablePanels( ( state ) => state.setRowToEdit );
	const rowToEdit = useTablePanels( ( state ) => state.rowToEdit );
	const [ rowState, setRowState ] = useState( {} );
	const { columnTypes } = useColumnTypesQuery( slug );

	const suggestUrls = useCallback( async () => {
		const resp = await postFetch( `faqurls/suggest-urls`, {
			question: rowToEdit?.question,
			answer: rowToEdit?.answer,
		} );
		if ( resp.ok ) {
			const urls = await resp.json();
			setRowToEdit( { urls: urls?.join( '\n' ) } );
			setRowState( ( state ) => ( { ...state, urls: urls?.join( '\n' ) } ) );
		}
	}, [ rowToEdit?.answer, rowToEdit?.question, setRowToEdit ] );

	const rowEditorCells = useMemo( () => ( {
		question: <InputField liveUpdate fullWidth defaultValue={ rowToEdit.question } label={ header.question }
			description={ __( 'Maximum of 500 characters', 'urlslab' ) }
			onChange={ ( val ) => setRowToEdit( { question: val } ) } required />,

		answer: <Editor
			fullWidth
			height={ 300 }
			description={ ( __( 'Answer to the question', 'urlslab' ) ) }
			defaultValue="" label={ __( 'Answer', 'urlslab' ) } onChange={ ( val ) => {
				setRowToEdit( { answer: val } );
			} } />,

		generate: <Button
			className="generatorBtn"
			fullWidth
			disabled={ ! rowToEdit.question }
			onClick={ () => activatePanel( 'answerGeneratorPanel' ) }
			startDecorator={ <IconStars /> }
		>
			{ __( 'Generate Answer', 'urlslab' ) }
		</Button>,

		language: <LangMenu defaultValue=""
			description={ __( 'Select language', 'urlslab' ) }
			hasTitle
			onChange={ ( val ) => setRowToEdit( { language: val } ) }>{ header.language }</LangMenu>,

		status: <SingleSelectMenu
			defaultAccept
			defaultValue="E"
			onChange={ ( value ) => setRowToEdit( { status: value } ) }
			name="status"
			items={ columnTypes?.status.values }
			autoClose
			description={ __( 'The Status of the FAQ', 'urlslab' ) }
			tooltipLabel={ { label: __( 'FAQ Status', 'urlslab' ), tooltip: __( 'FAQ Status', 'urlslab' ), noWrapText: true } }
		>{ __( 'FAQ Status', 'urlslab' ) }</SingleSelectMenu>,

		labels: <TagsMenu optionItem label={ __( 'Tags:', 'urlslab' ) } slug={ slug } onChange={ ( val ) => setRowToEdit( { labels: val } ) } />,

		urls: <TextArea key={ rowState?.urls } rows="5" liveUpdate fullWidth newLineSeparator defaultValue={ rowToEdit?.urls || '' } label={ header.urls }
			description={ __( 'New line or comma separated list of URLs, where is FAQ assigned. We recommend to use one URL only, otherwise google can understand it as duplicate content if you display same FAQ entry on multiple pages', 'urlslab' ) }
			onChange={ ( val ) => setRowToEdit( { urls: val } ) } />,
		suggest_urls: <Button
			className="suggestBtn"
			disabled={ ! rowToEdit.question }
			onClick={ () => suggestUrls() }
		>
			{ __( 'Suggest URLs', 'urlslab' ) }
		</Button>,
	} ), [ activatePanel, columnTypes?.status.values, rowState?.urls, rowToEdit.question, rowToEdit?.urls, setRowToEdit, slug, suggestUrls ] );

	useEffect( () => {
		useTablePanels.setState( () => (
			{
				...useTablePanels.getState(),
				rowEditorCells,
			}
		) );
	}, [ rowEditorCells ] );
} );
