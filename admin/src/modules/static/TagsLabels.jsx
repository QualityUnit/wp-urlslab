import { useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import useChangeRow from '../../hooks/useChangeRow';
import useTablePanels from '../../hooks/useTablePanels';
import useTableStore from '../../hooks/useTableStore';
import { getFetch } from '../../api/fetching';
import useTags from '../../hooks/useTags';

import { Loader, InputField, MultiSelectMenu, Tag, useInfiniteFetch, RowActionButtons } from '../../lib/tableImports';

import ColorPicker from '../../components/ColorPicker';
import ModuleViewHeaderBottom from '../../components/ModuleViewHeaderBottom';
import Table from '../../components/TableComponent';
import Checkbox from '../../elements/Checkbox';

import '../../assets/styles/components/_ModuleViewHeader.scss';

export default function TagsLabels( ) {
	const queryClient = useQueryClient();
	const paginationId = 'label_id';
	const slug = 'label';
	const possibleModules = useRef( { all: 'All Modules' } );
	const { refetchTags } = useTags();

	const { data: modules } = useQuery( {
		queryKey: [ 'label', 'modules' ],
		queryFn: async () => {
			const response = await getFetch( 'label/modules' );
			if ( response.ok ) {
				return response.json();
			}

			return { };
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

	const setRowToEdit = useTablePanels( ( state ) => state.setRowToEdit );
	const rowToEdit = useTablePanels( ( state ) => state.rowToEdit );

	const header = {
		name: 'Name',
		modules: 'Allowed modules',
	};

	const rowEditorCells = {
		name: <InputField liveUpdate autoFocus defaultValue="" label={ header.name } onChange={ ( val ) => setRowToEdit( { ...rowToEdit, name: val } ) } required />,
		bgcolor: <ColorPicker defaultValue="" label="Color" onChange={ ( val ) => setRowToEdit( { ...rowToEdit, bgcolor: val } ) } />,
		modules: <MultiSelectMenu liveUpdate id="modules" asTags items={ possibleModules.current } defaultValue={ [ 'all' ] } onChange={ ( val ) => setRowToEdit( { ...rowToEdit, modules: val } ) }>{ header.modules }</MultiSelectMenu>,
	};

	// Saving all variables into state managers

	useEffect( () => {
		useTableStore.setState( () => (
			{
				activeTable: slug,
				tables: {
					...useTableStore.getState().tables,
					[ slug ]: {
						title: 'Create new tag',
						paginationId,
						slug,
						header,
						id: 'name',
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

		refetchTags();
		queryClient.invalidateQueries( { queryKey: [ 'label', 'menu' ] } );

		if ( modules && Object.keys( modules ).length ) {
			possibleModules.current = { ...possibleModules.current, ...modules };
			useTablePanels.setState( () => (
				{
					rowEditorCells: { ...rowEditorCells, modules: { ...rowEditorCells.modules, props: { ...rowEditorCells.modules.props, items: possibleModules.current } } },
				}
			) );
		}
	}, [ data, slug, modules ] );

	const columns = [
		columnHelper.accessor( 'check', {
			className: 'checkbox',
			cell: ( cell ) => <Checkbox defaultValue={ cell.row.getIsSelected() } onChange={ () => {
				selectRows( cell );
			} } />,
			header: ( head ) => <Checkbox defaultValue={ head.table.getIsAllPageRowsSelected() } onChange={ ( val ) => {
				head.table.toggleAllPageRowsSelected( val );
			} } />,
			enableResizing: false,
		} ),
		columnHelper.accessor( 'name', {
			cell: ( cell ) => <strong>{ cell.getValue() }</strong>,
			header: header.name,
			minSize: 100,
		} ),
		columnHelper.accessor( 'name', {
			className: 'nolimit',
			cell: ( cell ) => {
				const tag = cell?.row?.original;
				return <Tag color={ tag && tag.bgcolor ? tag.bgcolor : null } fitText thinFont>{ cell.getValue() }</Tag>;
			},
			header: 'Tag',
			size: 100,
		} ),
		columnHelper.accessor( 'modules', {
			className: 'nolimit',
			cell: ( cell ) => <MultiSelectMenu items={ possibleModules.current } asTags id={ `modules-${ cell.row.id }` } defaultValue={ ( cell.getValue()?.length && cell.getValue()[ 0 ].length ) ? cell.getValue() : [ 'all' ] }
				onChange={ ( newVal ) => updateRow( { newVal, cell } ) }
			/>,
			header: header.modules,
			size: 150,
		} ),

		columnHelper.accessor( 'editRow', {
			className: 'editRow',
			cell: ( cell ) => <RowActionButtons
				onEdit={ () => updateRow( { cell, id: 'name' } ) }
				onDelete={ () => deleteRow( { cell, id: 'name' } ) }
			>
			</RowActionButtons>,
			header: null,
			size: 0,
		} ),
	];

	if ( status === 'loading' || ! modules ) {
		return <Loader isFullscreen />;
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
