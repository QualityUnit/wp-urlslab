import { useState, useCallback, useEffect, useMemo, memo } from 'react';
import { __ } from '@wordpress/i18n/';
import DatePicker from 'react-datepicker';

import {
	useInfiniteFetch,
	TagsMenu,
	SortBy,
	SingleSelectMenu,
	LangMenu,
	InputField,
	TableSelectCheckbox,
	SvgIcon,
	Loader,
	Tooltip,
	Table,
	ModuleViewHeaderBottom,
	TooltipSortingFiltering,
	SuggestInputField,
	RowActionButtons,
	Stack,
	IconButton,
	DateTimeFormat,
} from '../lib/tableImports';

import { dateWithTimezone, getDateFnsFormat, notNullishDate } from '../lib/helpers';

import useChangeRow from '../hooks/useChangeRow';
import useTablePanels from '../hooks/useTablePanels';
import useTableStore from '../hooks/useTableStore';
import useColumnTypesQuery from '../queries/useColumnTypesQuery';
import DescriptionBox from '../elements/DescriptionBox';

const title = __( 'Add New Link' );
const paginationId = 'kw_id';
const id = 'keyword';
const header = {
	keyword: __( 'Keyword' ),
	urlLink: __( 'Link' ),
	lang: __( 'Language' ),
	kw_priority: __( 'Priority' ),
	urlFilter: __( 'URL filter' ),
	kw_length: __( 'Length' ),
	kwType: __( 'Type' ),
	kw_usage_count: __( 'Usage' ),
	valid_until: __( 'Valid until' ),
	labels: __( 'Tags' ),
};
const initialState = { columnVisibility: { kw_length: false, kwType: false, valid_until: false } };

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
			id,
		} );
	}, [ setTable, slug ] );

	return init && <KeywordsTable slug={ slug } />;
}

function KeywordsTable( { slug } ) {
	const {
		data,
		columnHelper,
		isLoading,
		isSuccess,
		isFetchingNextPage,
		ref,
	} = useInfiniteFetch( { slug } );

	const tableData = useMemo( () => data?.pages?.flatMap( ( page ) => page ?? [] ), [ data?.pages ] );
	const setTable = useTableStore( ( state ) => state.setTable );
	const activatePanel = useTablePanels( ( state ) => state.activatePanel );
	const setRowToEdit = useTablePanels( ( state ) => state.setRowToEdit );
	const setOptions = useTablePanels( ( state ) => state.setOptions );

	const { columnTypes, isLoadingColumnTypes } = useColumnTypesQuery( slug );
	const { updateRow, deleteRow } = useChangeRow();

	const setUnifiedPanel = useCallback( ( cell ) => {
		const origCell = cell?.row.original;
		const counter = cell?.getValue();
		setOptions( [] );
		setRowToEdit( {} );
		updateRow( { cell, id } );

		if ( origCell.kw_usage_count > 0 ) {
			setOptions( [ {
				detailsOptions: {
					// translators: %s is generated text, do not change it
					title: __( 'Keyword %s usage' ).replace( '%s', `“${ origCell.keyword }”` ),
					// translators: %s is generated text, do not change it
					text: __( 'Keyword %s used on these URLs' ).replace( '%s', `“${ origCell.keyword }”` ),
					slug, url: `${ origCell.kw_id }/${ origCell.dest_url_id }`, showKeys: [ { name: [ 'link_type', 'Type' ], size: 30, values: { U: 'Urlslab', E: 'Editor' } }, { name: [ 'url_name', 'URL' ] } ], listId: 'url_id',
					counter,
				},
			} ] );
		}
	}, [ setOptions, setRowToEdit, slug, updateRow ] );

	const columns = useMemo( () => ! columnTypes ? [] : [
		columnHelper.accessor( 'check', {
			className: 'checkbox',
			cell: ( cell ) => <TableSelectCheckbox tableElement={ cell } />,
			header: ( head ) => <TableSelectCheckbox tableElement={ head } />,
		} ),
		columnHelper.accessor( 'keyword', {
			tooltip: ( cell ) => cell.getValue(),
			cell: ( cell ) => <strong>{ cell.getValue() }</strong>,
			header: ( th ) => <SortBy { ...th } />,
			minSize: 200,
		} ),
		columnHelper.accessor( 'urlLink', {
			tooltip: ( cell ) => cell.getValue(),
			cell: ( cell ) => <a href={ cell.getValue() } title={ cell.getValue() } target="_blank" rel="noreferrer">{ cell.getValue() }</a>,
			header: ( th ) => <SortBy { ...th } />,
			size: 200,
		} ),
		columnHelper.accessor( 'lang', {
			className: 'nolimit',
			cell: ( cell ) => <LangMenu defaultValue={ cell?.getValue() } listboxStyles={ { minWidth: 300 } } onChange={ ( newVal ) => updateRow( { newVal, cell, id } ) } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 100,
		} ),
		columnHelper.accessor( 'kw_priority', {
			className: 'nolimit',
			cell: ( cell ) => <InputField type="number" max={ 100 } value={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell, id } ) } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 80,
		} ),
		columnHelper.accessor( 'urlFilter', {
			className: 'nolimit',
			cell: ( cell ) => <InputField value={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell, id } ) } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 150,
		} ),
		columnHelper.accessor( 'valid_until', {
			className: 'nolimit',
			cell: ( cell ) => {
				const date = cell.getValue();
				if ( date && notNullishDate( date ) ) {
					return <DateTimeFormat datetime={ date } noTime={ true } />;
				}
				return '';
			},
			header: ( th ) => <SortBy { ...th } />,
			size: 30,
		} ),
		columnHelper.accessor( 'kw_length', {
			header: ( th ) => <SortBy { ...th } />,
			size: 80,
		} ),
		columnHelper.accessor( 'kwType', {
			className: 'nolimit',
			cell: ( cell ) => columnTypes?.kwType.values[ cell.getValue() ],
			header: ( th ) => <SortBy { ...th } />,
			size: 80,
		} ),
		columnHelper.accessor( 'kw_usage_count', {
			cell: ( cell ) => (
				<Stack direction="row" alignItems="center" spacing={ 1 }>
					<>
						<span>{ cell?.getValue() }</span>
						{ cell?.getValue() > 0 &&
							<Tooltip title={ __( 'Show URLs where used' ) } arrow placement="bottom">
								<IconButton
									size="xs"
									onClick={ () => {
										setUnifiedPanel( cell );
										activatePanel( 0 );
									} }
								>
									<SvgIcon name="link" />
								</IconButton>
							</Tooltip>
						}
					</>
				</Stack>
			),
			header: ( th ) => <SortBy { ...th } />,
			size: 80,
		} ),
		columnHelper.accessor( 'labels', {
			className: 'nolimit',
			cell: ( cell ) => <TagsMenu value={ cell.getValue() } slug={ slug } onChange={ ( newVal ) => updateRow( { newVal, cell, id } ) } />,
			header: header.labels,
			size: 150,
		} ),
		columnHelper.accessor( 'editRow', {
			className: 'editRow',
			cell: ( cell ) => <RowActionButtons
				onEdit={ () => setUnifiedPanel( cell ) }
				onDelete={ () => deleteRow( { cell, id } ) }
			>
			</RowActionButtons>,
			header: null,
			size: 0,
		} ),
	], [ columnTypes, columnHelper, updateRow, setUnifiedPanel, activatePanel, slug, deleteRow ] );

	useEffect( () => {
		setTable( slug, { data } );
	}, [ data, setTable, slug ] );

	if ( isLoading || isLoadingColumnTypes ) {
		return <Loader isFullscreen />;
	}

	return (
		<>
			<DescriptionBox	title={ __( 'About this table' ) } tableSlug={ slug } isMainTableDescription>
				{ __( "The table defines a list of keywords which can be automatically substituted with link pointing to defined URL in your website's text, facilitating large scale internal link building. This eliminates the need for manual editing of individual pages to add links. The plugin leaves all existing page content intact, with modifications only occurring as the page is generated. To reduce the strain on your Mysql database, the link definitions are cached on the server for a few minutes. Consequently, changes made to the link definitions may only be visibly updated online after a few minutes." ) }
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

const TableEditorManager = memo( ( { slug } ) => {
	const rowToEdit = useTablePanels( ( state ) => state.rowToEdit );
	const setRowToEdit = useTablePanels( ( state ) => state.setRowToEdit );
	const activePanel = useTablePanels( ( state ) => state.activePanel );

	const { columnTypes } = useColumnTypesQuery( slug );

	const rowEditorCells = useMemo( () => ( {
		keyword: <InputField liveUpdate autoFocus defaultValue="" label={ header.keyword } onChange={ ( val ) => {
			setRowToEdit( { keyword: val } );
		} } required description={ __( 'Only exact keyword matches will be substituted with a link' ) } />,

		urlLink: <SuggestInputField suggestInput={ rowToEdit?.keyword || '' }
			liveUpdate
			defaultValue={ ( rowToEdit?.urlLink ? rowToEdit?.urlLink : window.location.origin ) }
			label={ header.urlLink }
			onChange={ ( val ) => setRowToEdit( { urlLink: val } ) }
			required
			showInputAsSuggestion={ true }
			referenceVal="keyword"
			description={ __( 'Destination URL' ) } />,

		kwType: <SingleSelectMenu defaultAccept hideOnAdd autoClose items={ columnTypes?.kwType.values } name="kwType" defaultValue="M" description={ __( 'Select the link type if you only want to modify certain kinds of links in HTML' ) }
			onChange={ ( val ) => setRowToEdit( { kwType: val } ) }>{ header.kwType }</SingleSelectMenu>,

		kw_priority: <InputField liveUpdate type="number" defaultValue="10" min="0" max="100" label={ header.kw_priority }
			description={ __( 'Input a number between 0 and 100. Lower values indicate higher priority' ) }
			onChange={ ( val ) => setRowToEdit( { kw_priority: val } ) } />,

		lang: <LangMenu defaultValue=""
			hasTitle
			description={ __( 'Keywords only apply to pages in the chosen language' ) }
			onChange={ ( val ) => setRowToEdit( { lang: val } ) } />,

		urlFilter: <InputField liveUpdate defaultValue=".*"
			description={ __( 'Optionally, you can permit keyword placement only on URLs that match a specific regular expression. Use value `.*` to match all URLs' ) }
			label={ header.urlFilter } onChange={ ( val ) => setRowToEdit( { urlFilter: val } ) } />,
		valid_until: <label className="urlslab-inputField-wrap">
			<span className="urlslab-inputField-label flex flex-align-center mb-xs ">{ __( 'Valid until' ) }</span>
			<DatePicker
				className="urlslab-input"
				selected={ rowToEdit?.valid_until && notNullishDate( rowToEdit?.valid_until ) ? new Date( rowToEdit?.valid_until ) : '' }
				onChange={ ( val ) => {
					if ( val ) {
						const { correctedDateFormatted } = dateWithTimezone( val );
						setRowToEdit( { valid_until: correctedDateFormatted } );
						return;
					}
					// allow cleared and submit empty string
					setRowToEdit( { valid_until: '' } );
				} }
				dateFormat={ getDateFnsFormat().date }
				calendarStartDay={ window.wp.date.getSettings().l10n.startOfWeek }
				isClearable
			/>
		</label>,
		labels: <TagsMenu optionItem label={ __( 'Tags:' ) } slug={ slug } onChange={ ( val ) => setRowToEdit( { labels: val } ) } />,

	} ), [ columnTypes?.kwType, rowToEdit?.keyword, rowToEdit?.urlLink, rowToEdit?.valid_until, setRowToEdit, slug ] );

	const rowInserterCells = useMemo( () => {
		const copy = { ...rowEditorCells };
		delete copy.kwType;
		return copy;
	}, [ rowEditorCells ] );

	useEffect( () => {
		useTablePanels.setState( ( ) => (
			{
				...useTablePanels.getState(),
				rowEditorCells: activePanel === 'rowInserter' ? rowInserterCells : rowEditorCells,
				deleteCSVCols: [ paginationId, 'dest_url_id' ],
			}
		) );
	}, [ activePanel, rowEditorCells, rowInserterCells ] );
} );
