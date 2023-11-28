import { useEffect, useMemo, memo } from 'react';
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
	Tooltip, IconButton, SvgIcon,
} from '../lib/tableImports';

import useTableStore from '../hooks/useTableStore';
import useChangeRow from '../hooks/useChangeRow';
import useTablePanels from '../hooks/useTablePanels';
import DescriptionBox from '../elements/DescriptionBox';
import Stack from "@mui/joy/Stack";

const title = __( 'Add New Related Article' );
const paginationId = 'src_url_id';
const optionalSelector = 'dest_url_id';

const header = {
	src_url_name: __( 'Source URL' ),
	dest_url_name: __( 'Destination URL' ),
	pos: __( 'Position' ),
	is_locked: __( 'Locked' ),
	created_date: __( 'Updated' ),
};

export default function URLRelationTable( { slug } ) {
	const {
		columnHelper,
		data,
		status,
		isSuccess,
		isFetchingNextPage,
		ref,
	} = useInfiniteFetch( { slug } );

	const { isSelected, selectRows, deleteRow, updateRow } = useChangeRow();

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
						id: 'src_url_name',
						optionalSelector,
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
			className: 'checkbox',
			cell: ( cell ) => <Checkbox defaultValue={ isSelected( cell ) } onChange={ () => {
				selectRows( cell );
			} } />,
			header: ( head ) => <Checkbox defaultValue={ isSelected( head, true ) } onChange={ ( ) => {
				selectRows( head, true );
			} } />,
		} ),
		columnHelper.accessor( 'src_url_name', {
			tooltip: ( cell ) => cell.getValue(),
			cell: ( cell ) =>
				(
					<Stack direction="row" alignItems="center" spacing={ 1 }><>
						{
							<a href={ cell.getValue() } target="_blank" rel="noreferrer">{ cell.getValue() }</a>
						}
						{
							cell.row.original.edit_src_url_name?.length > 0 &&
							<Tooltip title={ __( 'Edit Post' ) }>
								<IconButton size="xs" component="a" href={ cell.row.original.edit_src_url_name } target="_blank">
									<SvgIcon name="edit" />
								</IconButton>
							</Tooltip>
						}
					</>
					</Stack>
				),
			header: ( th ) => <SortBy { ...th } />,
			size: 200,
		} ),
		columnHelper.accessor( 'dest_url_name', {
			tooltip: ( cell ) => cell.getValue(),
			cell: ( cell ) =>
				(
					<Stack direction="row" alignItems="center" spacing={ 1 }><>
						{
							<a href={ cell.getValue() } target="_blank" rel="noreferrer">{ cell.getValue() }</a>
						}
						{
							cell.row.original.edit_dest_url_name?.length > 0 &&
							<Tooltip title={ __( 'Edit Post' ) }>
								<IconButton size="xs" component="a" href={ cell.row.original.edit_dest_url_name } target="_blank">
									<SvgIcon name="edit" />
								</IconButton>
							</Tooltip>
						}
					</>
					</Stack>
				),
			header: ( th ) => <SortBy { ...th } />,
			size: 200,
		} ),
		columnHelper.accessor( 'pos', {
			className: 'nolimit',
			cell: ( cell ) => <InputField type="number" defaultValue={ cell.getValue() } min="0" max="100"
				onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 50,
		} ),
		columnHelper.accessor( 'is_locked', {
			className: 'nolimit',
			cell: ( cell ) => <Checkbox defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
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
			</RowActionButtons>,
			header: null,
			size: 0,
		} ),
	], [ columnHelper, deleteRow, isSelected, selectRows, updateRow ] );

	if ( status === 'loading' ) {
		return <Loader isFullscreen />;
	}

	return (
		<>
			<DescriptionBox	title={ __( 'About this table' ) } tableSlug={ slug } isMainTableDescription>
				{ __( 'The table illustrates the associations between URLs on your website. The plugin can automatically load these connections, a paid feature, or you can configure them manually. These data sets are predominantly used by the plugin to display the Related Articles widget. This widget can either be included automatically on all your pages, as seen in the Settings tab, or added individually to each page or template through a shortcode.' ) }
			</DescriptionBox>
			<ModuleViewHeaderBottom />

			<Table className="fadeInto"
				columns={ columns }
				data={ isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] ) }
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
