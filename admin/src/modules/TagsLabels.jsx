import { useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import useChangeRow from '../hooks/useChangeRow';
import useTableUpdater from '../hooks/useTableUpdater';
import useTablePanels from '../hooks/useTablePanels';

import { Edit, InputField, Loader, MultiSelectMenu, Tag, Trash, useInfiniteFetch } from '../lib/tableImports';

import ColorPicker from '../components/ColorPicker';
import ModuleViewHeaderBottom from '../components/ModuleViewHeaderBottom';
import Table from '../components/TableComponent';
import Checkbox from '../elements/Checkbox';
import IconButton from '../elements/IconButton';

import '../assets/styles/components/_ModuleViewHeader.scss';
import hexToHSL from '../lib/hexToHSL';

export default function TagsLabels( ) {
	// const columnHelper = useMemo( () => createColumnHelper(), [] );
	const paginationId = 'label_id';
	const slug = 'label';
	const { table, setTable, filters, sorting } = useTableUpdater( { slug } );
	const url = { filters, sorting };
	const queryClient = useQueryClient();

	const possibleModules = useMemo( () => {
		return queryClient.getQueryData( [ slug, 'modules' ] );
	}, [ queryClient ] );

	const {
		__,
		columnHelper,
		data,
		status,
		isSuccess,
	} = useInfiniteFetch( { key: slug, filters, sorting, paginationId }, 500 );

	const { selectRows, deleteRow, deleteSelectedRows, updateRow } = useChangeRow( { data, url, slug, paginationId } );

	const { activatePanel, setRowToEdit } = useTablePanels();
	const rowToEdit = useTablePanels( ( state ) => state.rowToEdit );

	const header = {
		name: 'Name',
		modules: 'Allowed',
	};

	const rowEditorCells = {
		name: <InputField liveUpdate defaultValue="" label={ header.name } onChange={ ( val ) => setRowToEdit( { ...rowToEdit, name: val } ) } required />,
		bgcolor: <ColorPicker defaultValue="" label="Background color" onChange={ ( val ) => setRowToEdit( { ...rowToEdit, bgcolor: val } ) } />,
		modules: <MultiSelectMenu liveUpdate id="modules" asTags items={ possibleModules } defaultValue={ [] } onChange={ ( val ) => setRowToEdit( { ...rowToEdit, modules: val } ) }>{ header.modules }</MultiSelectMenu>,
	};

	const columns = [
		columnHelper.accessor( 'check', {
			className: 'checkbox',
			cell: ( cell ) => <Checkbox defaultValue={ cell.row.getIsSelected() } onChange={ () => {
				cell.row.toggleSelected();
				selectRows( cell );
			} } />,
			header: ( head ) => <Checkbox defaultValue={ head.table.getIsAllPageRowsSelected() } onChange={ ( val ) => {
				head.table.toggleAllPageRowsSelected( val );
				selectRows( val ? head : undefined );
			} } />,
			enableResizing: false,
		} ),
		columnHelper.accessor( 'name', {
			cell: ( cell ) => <strong>{ cell.getValue() }</strong>,
			header: header.name,
			minSize: 150,
		} ),
		columnHelper.accessor( 'name', {
			className: 'nolimit',
			cell: ( cell ) => {
				const tag = cell?.row?.original;
				const { lightness } = tag && hexToHSL( tag.bgcolor );
				return <Tag fullSize className={ lightness < 70 ? 'dark' : '' } style={ { backgroundColor: tag?.bgcolor } }>{ cell.getValue() }</Tag>;
			},
			header: 'Tag',
			size: 150,
		} ),
		columnHelper.accessor( 'modules', {
			className: 'nolimit',
			cell: ( cell ) => <MultiSelectMenu items={ possibleModules } asTags id="modules" defaultValue={ cell.getValue() || '' }
				onChange={ ( newVal ) => updateRow( { newVal, cell } ) }
			/>,
			header: header.modules,
			size: 150,
		} ),

		columnHelper.accessor( 'editRow', {
			className: 'editRow',
			cell: ( cell ) => {
				return (
					<div className="flex mr-s">
						<IconButton
							className="ma-left"
							onClick={ () => {
								updateRow( { cell, id: 'name' } );
								activatePanel( 'rowEditor' );
							} }
							tooltipClass="align-left-0"
							tooltip={ __( 'Edit row' ) }
						>
							<Edit />
						</IconButton>
						<IconButton
							className="ml-s"
							onClick={ () => deleteRow( { cell, id: 'name' } ) }
							tooltipClass="align-left-0"
							tooltip={ __( 'Delete row' ) }
						>
							<Trash />
						</IconButton>
					</div>
				);
			},
			header: null,
			size: 60,
		} ),
	];

	if ( status === 'loading' ) {
		return <Loader />;
	}

	// if ( row ) {
	// 	queryClient.invalidateQueries( [ 'label' ] );
	// }

	return (
		<div className="urlslab-tableView">
			<ModuleViewHeaderBottom
				table={ table }
				onDeleteSelected={ deleteSelectedRows }
				noColumnsMenu
				noExport
				noImport
				noFiltering
				noCount
				options={ { header, rowEditorCells, notWide: true, title: 'Create new tag', data, slug, url, paginationId, rowToEdit, id: 'name' } }
			/>
			<Table className="fadeInto"
				slug={ slug }
				returnTable={ ( returnTable ) => setTable( returnTable ) }
				columns={ columns }
				data={ isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] ) }
			>
			</Table>
		</div>
	);
}
