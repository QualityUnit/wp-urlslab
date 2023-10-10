import { useEffect } from 'react';
import { useI18n } from '@wordpress/react-i18n';

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
	ProgressBar,
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

export default function FaqsTable( { slug } ) {
	const { __ } = useI18n();

	const title = __( 'Add New FAQ' );
	const paginationId = 'faq_id';

	const ActionButton = ( { cell, onClick } ) => {
		const { status } = cell?.row?.original;

		return (
			<div className="flex flex-align-center flex-justify-end">
				{
					( status === 'D' ) &&
					<Tooltip title={ __( 'Activate' ) }>
						<IconButton size="xs" color="success" onClick={ () => onClick( 'A' ) }>
							<SvgIcon name="activate" />
						</IconButton>
					</Tooltip>
				}
				{
					( status === 'A' ) &&
					<Tooltip title={ __( 'Disable' ) }>
						<IconButton size="xs" color="danger" onClick={ () => onClick( 'D' ) }>
							<SvgIcon name="disable" />
						</IconButton>
					</Tooltip>
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

	const { activatePanel, setRowToEdit, rowToEdit } = useTablePanels();

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
		language: __( 'Language' ),
		status: __( 'Status' ),
		urls_count: __( 'Assigned URLs' ),
		updated: __( 'Updated' ),
		labels: __( 'Tags' ),
		urls: __( 'Assigned URLs' ),
	};

	// Saving all variables into state managers
	useEffect( () => {
		const rowEditorCells = {
			question: <InputField liveUpdate defaultValue={ rowToEdit.question } label={ header.question }
				description={ __( 'Maximum of 500 characters' ) }
				onChange={ ( val ) => setRowToEdit( { ...rowToEdit, question: val } ) } required />,

			answer: <Editor
				description={ ( __( 'Answer to the question' ) ) }
				defaultValue="" label={ __( 'Answer' ) } onChange={ ( val ) => {
					setRowToEdit( { ...rowToEdit, answer: val } );
				} } />,

			language: <LangMenu autoClose defaultValue="all"
				description={ __( 'Select language' ) }
				onChange={ ( val ) => setRowToEdit( { ...rowToEdit, language: val } ) }>{ header.language }</LangMenu>,

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
				onChange={ ( value ) => setRowToEdit( { ...rowToEdit, status: value } ) }
				name="status"
				items={ statusTypes }
				autoClose
				description={ __( 'The Status of the FAQ' ) }
				tooltipLabel={ { label: __( 'FAQ Status' ), tooltip: __( 'FAQ Status' ), noWrapText: true } }
			>{ __( 'FAQ Status' ) }</SingleSelectMenu>,

			labels: <TagsMenu optionItem label={ __( 'Tags:' ) } slug={ slug } onChange={ ( val ) => setRowToEdit( { ...rowToEdit, labels: val } ) } />,
			urls: <TextArea rows="5" liveUpdate defaultValue="" label={ header.urls }
				description={ __( 'New line or comma separated list of URLs, where is FAQ assigned. We recommend to use one URL only, otherwise google can understand it as duplicate content if you display same FAQ entry on multiple pages' ) }
				onChange={ ( val ) => setRowToEdit( { ...rowToEdit, urls: val } ) } />,
		};
		useTablePanels.setState( () => (
			{
				rowEditorCells,
			}
		) );
	}, [ rowToEdit ] );

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
			cell: ( cell ) => <SingleSelectMenu
				defaultValue={ cell.getValue() }
				onChange={ ( newVal ) => updateRow( { newVal, cell } ) }
				name="status"
				items={ statusTypes }
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
	];

	if ( status === 'loading' ) {
		return <Loader isFullscreen />;
	}

	return (
		<>
			<ModuleViewHeaderBottom />

			<Table className="fadeInto"
				initialState={ { columnVisibility: { answer: false, urls_count: false, labels: false } } }
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
