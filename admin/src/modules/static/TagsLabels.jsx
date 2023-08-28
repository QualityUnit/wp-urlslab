import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import useChangeRow from '../../hooks/useChangeRow';
import useTablePanels from '../../hooks/useTablePanels';
import useTableStore from '../../hooks/useTableStore';

import { Loader, InputField, MultiSelectMenu, Tag, useInfiniteFetch, RowActionButtons } from '../../lib/tableImports';

import ColorPicker from '../../components/ColorPicker';
import ModuleViewHeaderBottom from '../../components/ModuleViewHeaderBottom';
import Table from '../../components/TableComponent';
import Checkbox from '../../elements/Checkbox';
import hexToHSL from '../../lib/hexToHSL';

import '../../assets/styles/components/_ModuleViewHeader.scss';
import { getFetch } from '../../api/fetching';

export default function TagsLabels( ) {
	const paginationId = 'label_id';
	const slug = 'label';
	const filters = useTableStore( ( state ) => state.filters );
	const sorting = useTableStore( ( state ) => state.sorting );

	const { data: possibleModules } = useQuery( {
		queryKey: [ 'label', 'modules' ],
		queryFn: async () => {
			const response = await getFetch( 'label/modules' );
			if ( response.ok ) {
				return response.json();
			}

			return {};
		},
		refetchOnWindowFocus: false,
	} );

	const {
		columnHelper,
		data,
		status,
		isSuccess,
	} = useInfiniteFetch( { slug }, 500 );

	const { selectRows, deleteRow, updateRow } = useChangeRow( );

	const { setRowToEdit } = useTablePanels();
	const rowToEdit = useTablePanels( ( state ) => state.rowToEdit );

	const header = {
		name: 'Name',
		modules: 'Allowed modules',
	};

	const rowEditorCells = {
		name: <InputField liveUpdate defaultValue="" label={ header.name } onChange={ ( val ) => setRowToEdit( { ...rowToEdit, name: val } ) } required />,
		bgcolor: <ColorPicker defaultValue="" label="Color" onChange={ ( val ) => setRowToEdit( { ...rowToEdit, bgcolor: val } ) } />,
		modules: <MultiSelectMenu liveUpdate id="modules" asTags items={ possibleModules } defaultValue={ [] } onChange={ ( val ) => setRowToEdit( { ...rowToEdit, modules: val } ) }>{ header.modules }</MultiSelectMenu>,
	};

	// Saving all variables into state managers
	useEffect( () => {
		useTableStore.setState( () => (
			{
				data,
				title: 'Create new tag',
				paginationId,
				slug,
				header,
				id: 'name',
			}
		) );

		if ( possibleModules && Object.keys( possibleModules ).length ) {
			useTablePanels.setState( () => (
				{
					rowEditorCells,
				}
			) );
		}
	}, [ data, possibleModules ] );

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
			cell: ( cell ) => <RowActionButtons
				onUpdate={ () => updateRow( { cell, id: 'name' } ) }
				onDelete={ () => deleteRow( { cell, id: 'name' } ) }
			>
			</RowActionButtons>,
			header: null,
			size: 0,
		} ),
	];

	if ( status === 'loading' || ! possibleModules ) {
		return <Loader />;
	}

	return (
		<div className="urlslab-tableView">
			<ModuleViewHeaderBottom
				noColumnsMenu
				noExport
				noImport
				noFiltering
				noCount
				options={ { noScrollbar: true, notWide: true } }
			/>
			<Table className="fadeInto"
				columns={ columns }
				data={ isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] ) }
			>
			</Table>
		</div>
	);
}
