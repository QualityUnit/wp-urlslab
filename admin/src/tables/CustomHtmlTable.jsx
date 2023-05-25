import {
	useInfiniteFetch,
	ProgressBar,
	SortBy,
	Tooltip,
	SingleSelectMenu,
	InputField,
	Checkbox,
	Trash,
	Loader,
	Table,
	ModuleViewHeaderBottom,
	TooltipSortingFiltering,
	TagsMenu,
	Edit,
	SuggestInputField, TextArea,
} from '../lib/tableImports';

import useTableUpdater from '../hooks/useTableUpdater';
import useChangeRow from '../hooks/useChangeRow';
import IconButton from '../elements/IconButton';
import { active } from 'd3';

export default function CustomHtmlTable( { slug } ) {
	const paginationId = 'rule_id';

	const { table, setTable, filters, setFilters, sorting, sortBy } = useTableUpdater( { slug } );

	const url = { filters, sorting };

	const {
		__,
		columnHelper,
		data,
		status,
		isSuccess,
		isFetching,
		isFetchingNextPage,
		hasNextPage,
		ref,
	} = useInfiniteFetch( { key: slug, filters, sorting, paginationId } );

	const { row, selectedRows, selectRow, rowToEdit, setEditorRow, activePanel, setActivePanel, deleteRow, deleteSelectedRows, updateRow } = useChangeRow( { data, url, slug, paginationId } );

	const matchTypes = Object.freeze( {
		E: 'Exact match',
		S: 'Contains',
		R: 'Regexp',
	} );

	const logginTypes = Object.freeze( {
		Y: 'Logged in',
		N: 'Not logged',
		A: 'Any',
	} );

	const header = {
		name: __( 'Rule Name' ),
		labels: __( 'Tags' ),
		match_type: __( 'Match type' ),
		match_url: __( 'Match URL' ),
		is_logged: __( 'Is logged?' ),
		match_browser: __( 'Match Browser' ),
		match_cookie: __( 'Match Cookies' ),
		match_headers: __( 'Match Request headers' ),
		match_params: __( 'Match Request parameters' ),
		match_capabilities: __( 'User has capability' ),
		match_roles: __( 'User has role' ),
		match_ip: __( 'Match Visitor IP' ),
		add_http_headers: __( 'Add HTTP Request headers' ),
		add_start_headers: __( 'Add after <head> tag' ),
		add_end_headers: __( 'Add before </head> tag' ),
		add_start_body: __( 'Add after <body> tag' ),
		add_end_body: __( 'Add before </body> tag' ),
		rule_order: __( 'Rule Order' ),
		is_active: __( 'Active Rule' ),
	};

	const rowEditorCells = {
		name: <InputField liveUpdate type="text" defaultValue="" label={ header.name } onChange={ ( val ) => setEditorRow( { ...rowToEdit, name: val } ) } required />,
		match_type: <SingleSelectMenu defaultAccept autoClose items={ matchTypes } name="match_type" defaultValue="E" onChange={ ( val ) => setEditorRow( { ...rowToEdit, match_type: val } ) }>{ header.match_type }</SingleSelectMenu>,
		match_url: <InputField type="url" autoFocus liveUpdate defaultValue="" label={ header.match_url } onChange={ ( val ) => setEditorRow( { ...rowToEdit, match_url: val } ) } required />,
		match_headers: <InputField liveUpdate defaultValue="" label={ header.match_headers } onChange={ ( val ) => setEditorRow( { ...rowToEdit, match_headers: val } ) } />,
		match_cookie: <InputField liveUpdate defaultValue="" label={ header.match_cookie } onChange={ ( val ) => setEditorRow( { ...rowToEdit, match_cookie: val } ) } />,
		match_params: <InputField liveUpdate defaultValue="" label={ header.match_params } onChange={ ( val ) => setEditorRow( { ...rowToEdit, match_params: val } ) } />,
		match_capabilities: <InputField liveUpdate defaultValue="" label={ header.match_capabilities } onChange={ ( val ) => setEditorRow( { ...rowToEdit, match_capabilities: val } ) } />,
		match_ip: <InputField liveUpdate defaultValue="" label={ header.match_ip } onChange={ ( val ) => setEditorRow( { ...rowToEdit, match_ip: val } ) } />,
		match_roles: <InputField liveUpdate defaultValue="" label={ header.match_roles } onChange={ ( val ) => setEditorRow( { ...rowToEdit, match_roles: val } ) } />,
		match_browser: <InputField liveUpdate defaultValue="" label={ header.match_browser } onChange={ ( val ) => setEditorRow( { ...rowToEdit, match_browser: val } ) } />,
		is_logged: <SingleSelectMenu autoClose items={ logginTypes } name="is_logged" defaultValue="A" onChange={ ( val ) => setEditorRow( { ...rowToEdit, is_logged: val } ) }>{ header.is_logged }</SingleSelectMenu>,
		add_http_headers: <TextArea rows="5" liveUpdate defaultValue="" label={ header.add_http_headers } onChange={ ( val ) => setEditorRow( { ...rowToEdit, add_http_headers: val } ) } required />,
		add_start_headers: <TextArea rows="5" liveUpdate defaultValue="" label={ header.add_start_headers } onChange={ ( val ) => setEditorRow( { ...rowToEdit, add_start_headers: val } ) } required />,
		add_end_headers: <TextArea rows="5" liveUpdate defaultValue="" label={ header.add_end_headers } onChange={ ( val ) => setEditorRow( { ...rowToEdit, add_end_headers: val } ) } required />,
		add_start_body: <TextArea rows="5" liveUpdate defaultValue="" label={ header.add_start_body } onChange={ ( val ) => setEditorRow( { ...rowToEdit, add_start_body: val } ) } required />,
		add_end_body: <TextArea rows="5" liveUpdate defaultValue="" label={ header.add_end_body } onChange={ ( val ) => setEditorRow( { ...rowToEdit, add_end_body: val } ) } required />,
		rule_order: <InputField liveUpdate type="text" defaultValue="" label={ header.rule_order } onChange={ ( val ) => setEditorRow( { ...rowToEdit, rule_order: val } ) } required />,
		is_active: <Checkbox defaultValue={ true } onChange={ ( val ) => setEditorRow( { ...rowToEdit, is_active: val } ) }>{ header.is_active }</Checkbox>,
	};

	const columns = [
		columnHelper.accessor( 'check', {
			className: 'nolimit checkbox',
			cell: ( cell ) => <Checkbox defaultValue={ cell.row.getIsSelected() } onChange={ ( val ) => {
				selectRow( val, cell );
			} } />,
			header: null,
		} ),
		columnHelper.accessor( 'name', {
			className: 'nolimit',
			cell: ( cell ) => <InputField type="text" defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.name }</SortBy>,
			size: 200,
		} ),
		columnHelper.accessor( 'labels', {
			className: 'nolimit',
			cell: ( cell ) => <TagsMenu defaultValue={ cell.getValue() } slug={ slug } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: header.labels,
			size: 160,
		} ),
		columnHelper.accessor( 'is_active', {
			className: 'nolimit',
			cell: ( cell ) => <Checkbox defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.is_active }</SortBy>,
			size: 100,
		} ),
		columnHelper.accessor( 'editRow', {
			className: 'editRow',
			cell: ( cell ) => {
				return (
					<div className="flex">
						<IconButton
							onClick={ () => {
								setActivePanel( 'rowEditor' );
								updateRow( { cell } );
							} }
							tooltipClass="align-left xxxl"
							tooltip={ __( 'Edit row' ) }
						>
							<Edit />
						</IconButton>
						<IconButton
							className="ml-s"
							onClick={ () => deleteRow( { cell } ) }
							tooltipClass="align-left xxxl"
							tooltip={ __( 'Delete row' ) }
						>
							<Trash />
						</IconButton>
					</div>
				);
			},
			header: () => null,
			size: 60,
		} ),
	];

	if ( status === 'loading' ) {
		return <Loader />;
	}

	return (
		<>
			<ModuleViewHeaderBottom
				slug={ slug }
				header={ header }
				table={ table }
				selectedRows={ selectedRows }
				onDeleteSelected={ deleteSelectedRows }
				onFilter={ ( filter ) => setFilters( filter ) }
				onUpdateRow={ ( val ) => {
					setActivePanel();
					setEditorRow();
					if ( val === 'rowInserted' || val === 'rowChanged' ) {
						setActivePanel();
						setEditorRow( val );
						setTimeout( () => {
							setEditorRow();
						}, 3000 );
					}
				} }
				activatePanel={ activePanel }
				rowEditorOptions={ { rowEditorCells, title: 'Add Custom HTML', data, slug, url, paginationId, rowToEdit } }
				exportOptions={ {
					slug,
					url,
					paginationId,
					deleteCSVCols: [ paginationId, 'dest_url_id' ],
				} }
			/>
			<Table className="fadeInto"
				slug={ slug }
				returnTable={ ( returnTable ) => setTable( returnTable ) }
				columns={ columns }
				data={ isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] ) }
			>
				{ row
					? <Tooltip center>{ `${ header.name } “${ row.name }”` } { __( 'has been deleted.' ) }</Tooltip>
					: null
				}
				{ ( rowToEdit === 'rowChanged' )
					? <Tooltip center>{ __( 'Rule has been changed.' ) }</Tooltip>
					: null
				}
				{ ( rowToEdit === 'rowInserted' )
					? <Tooltip center>{ __( 'Rule has been added.' ) }</Tooltip>
					: null
				}
				<TooltipSortingFiltering props={ { isFetching, filters, sorting } } />
				<div ref={ ref }>
					{ isFetchingNextPage ? '' : hasNextPage }
					<ProgressBar className="infiniteScroll" value={ ! isFetchingNextPage ? 0 : 100 } />
				</div>
			</Table>
		</>
	);
}
