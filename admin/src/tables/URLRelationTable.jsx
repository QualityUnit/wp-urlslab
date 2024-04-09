import { useEffect, useMemo, memo, useState } from 'react';
import { __ } from '@wordpress/i18n/';
import {
	useInfiniteFetch,
	SortBy,
	InputField,
	Checkbox,
	Loader,
	Table,
	ModuleViewHeaderBottom,
	TooltipSortingFiltering,
	RowActionButtons,
	DateTimeFormat,
	Tooltip, IconButton, SvgIcon, TableSelectCheckbox,
} from '../lib/tableImports';

import useTableStore from '../hooks/useTableStore';
import useChangeRow from '../hooks/useChangeRow';
import useTablePanels from '../hooks/useTablePanels';
import DescriptionBox from '../elements/DescriptionBox';

const title = __( 'Add New Related Article', 'urlslab' );
const paginationId = 'src_url_id';
const optionalSelector = 'dest_url_id';

const header = {
	src_url_name: __( 'Source URL', 'urlslab' ),
	dest_url_name: __( 'Destination URL', 'urlslab' ),
	pos: __( 'Position', 'urlslab' ),
	is_locked: __( 'Locked', 'urlslab' ),
	created_date: __( 'Updated', 'urlslab' ),
};

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
			id: 'src_url_name',
			optionalSelector,
		} );
	}, [ setTable, slug ] );

	return init && <URLRelationTable slug={ slug } />;
}

function URLRelationTable( { slug } ) {
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

	const { deleteRow, updateRow } = useChangeRow();

	const columns = useMemo( () => [
		columnHelper.accessor( 'check', {
			className: 'checkbox',
			cell: ( cell ) => <TableSelectCheckbox tableElement={ cell } />,
			header: ( head ) => <TableSelectCheckbox tableElement={ head } />,
		} ),
		columnHelper.accessor( 'src_url_name', {
			tooltip: ( cell ) => cell.getValue(),
			cell: ( cell ) => <a href={ cell.getValue() } target="_blank" rel="noreferrer">{ cell.getValue() }</a>,
			header: ( th ) => <SortBy { ...th } />,
			size: 200,
		} ),
		columnHelper.accessor( 'dest_url_name', {
			tooltip: ( cell ) => cell.getValue(),
			cell: ( cell ) => <a href={ cell.getValue() } target="_blank" rel="noreferrer">{ cell.getValue() }</a>,
			header: ( th ) => <SortBy { ...th } />,
			size: 200,
		} ),
		columnHelper.accessor( 'pos', {
			className: 'nolimit',
			cell: ( cell ) => <InputField type="number" value={ cell.getValue() } min="0" max="100"
				onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 50,
		} ),
		columnHelper.accessor( 'is_locked', {
			className: 'nolimit',
			cell: ( cell ) => <Checkbox value={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 50,
		} ),
		columnHelper.accessor( 'created_date', {
			className: 'nolimit',
			cell: ( val ) => <DateTimeFormat datetime={ val.getValue() } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 115,
		} ),
		columnHelper.accessor( 'editRow', {
			className: 'editRow',
			cell: ( cell ) => <RowActionButtons
				onDelete={ () => deleteRow( { cell, optionalSelector, id: 'src_url_name' } ) }
			>
				{ cell.row.original.edit_src_url_name?.length > 0 &&
					<Tooltip title={ __( 'Edit Source Post', 'urlslab' ) } arrow placement="bottom">
						<IconButton size="xs" component="a" href={ cell.row.original.edit_src_url_name } target="_blank">
							<SvgIcon name="edit-post" />
						</IconButton>
					</Tooltip>
				}
				{ cell.row.original.edit_dest_url_name?.length > 0 &&
					<Tooltip title={ __( 'Edit Destination Post', 'urlslab' ) } arrow placement="bottom">
						<IconButton size="xs" component="a" href={ cell.row.original.edit_dest_url_name } target="_blank">
							<SvgIcon name="edit-post" />
						</IconButton>
					</Tooltip>
				}
			</RowActionButtons>,
			header: null,
			size: 100,
		} ),
	], [ columnHelper, deleteRow, updateRow ] );

	useEffect( () => {
		setTable( slug, { data } );
	}, [ data, setTable, slug ] );

	if ( isLoading ) {
		return <Loader isFullscreen />;
	}

	return (
		<>
			<DescriptionBox	title={ __( 'About this table', 'urlslab' ) } tableSlug={ slug } isMainTableDescription>
				{ __( 'The table illustrates the associations between URLs on your website. The plugin can automatically load these connections, a paid feature, or you can configure them manually. These data sets are predominantly used by the plugin to display the Related Articles widget. This widget can either be included automatically on all your pages, as seen in the Settings tab, or added individually to each page or template through a shortcode.', 'urlslab' ) }
			</DescriptionBox>
			<ModuleViewHeaderBottom />

			<Table
				className="fadeInto"
				columns={ columns }
				data={ isSuccess && tableData }
				referrer={ ref }
				loadingRows={ isFetchingNextPage }
			>
				<TooltipSortingFiltering />
			</Table>

			<TableEditorManager />
		</>
	);
}

const TableEditorManager = memo( () => {
	const setRowToEdit = useTablePanels( ( state ) => state.setRowToEdit );

	const rowEditorCells = useMemo( () => ( {
		src_url_name: <InputField liveUpdate type="url" defaultValue="" label={ header.src_url_name } onChange={ ( val ) => setRowToEdit( { src_url_name: val } ) } required />,
		dest_url_name: <InputField liveUpdate type="url" defaultValue="" label={ header.dest_url_name } onChange={ ( val ) => setRowToEdit( { dest_url_name: val } ) } required />,
		pos: <InputField liveUpdate type="number" defaultValue="1" min="0" max="100" label={ header.pos } onChange={ ( val ) => setRowToEdit( { pos: val } ) } required />,
		is_locked: <Checkbox defaultValue={ false } onChange={ ( val ) => setRowToEdit( { is_locked: val } ) }>{ header.is_locked }</Checkbox>,
	} ), [ setRowToEdit ] );

	useEffect( () => {
		useTablePanels.setState( ( ) => (
			{
				...useTablePanels.getState(),
				rowEditorCells,
				deleteCSVCols: [ paginationId, 'dest_url_id' ],
			}
		) );
	}, [ rowEditorCells ] );
} );
