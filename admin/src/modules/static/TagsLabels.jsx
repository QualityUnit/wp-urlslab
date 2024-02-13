import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { __ } from '@wordpress/i18n/';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import useChangeRow from '../../hooks/useChangeRow';
import useTablePanels from '../../hooks/useTablePanels';
import useTableStore from '../../hooks/useTableStore';
import { getFetch } from '../../api/fetching';

import { Loader, InputField, MultiSelectMenu, Tag, useInfiniteFetch, RowActionButtons, TableSelectCheckbox } from '../../lib/tableImports';

import ColorPicker from '../../components/ColorPicker';
import ModuleViewHeaderBottom from '../../components/ModuleViewHeaderBottom';
import Table from '../../components/TableComponent';

import '../../assets/styles/components/_ModuleViewHeader.scss';

const paginationId = 'label_id';
const slug = 'label';
const title = __( 'Create new tag' );
const header = {
	name: __( 'Name' ),
	modules: __( 'Allowed modules' ),
};
const headerBottomOptions = { noScrollbar: true, notWide: true };

const useLabelModulesQuery = () => {
	return useQuery( {
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
};

// init table state with fixed states which we do not need to update anymore during table lifecycle
export default function TableInit() {
	const queryClient = useQueryClient();
	const setTable = useTableStore( ( state ) => state.setTable );
	const [ init, setInit ] = useState( false );
	useEffect( () => {
		setInit( true );
		setTable( slug, {
			title,
			paginationId,
			slug,
			header,
			id: 'name',
		} );
	}, [ setTable ] );

	useEffect( () => {
		queryClient.invalidateQueries( { queryKey: [ 'label', 'menu' ] } );
	}, [ queryClient ] );

	return init && <TagsLabels />;
}

function TagsLabels() {
	const queryClient = useQueryClient();
	const possibleModules = useRef( { all: __( 'All Modules' ) } );
	const { data: modules, isLoading: isLoadingModules } = useLabelModulesQuery();

	if ( modules && Object.keys( modules ).length ) {
		possibleModules.current = { ...possibleModules.current, ...modules };
	}

	const {
		columnHelper,
		data,
		isLoading,
		isSuccess,
	} = useInfiniteFetch( { slug }, 500 );

	const tableData = useMemo( () => data?.pages?.flatMap( ( page ) => page ?? [] ), [ data?.pages ] );
	const setTable = useTableStore( ( state ) => state.setTable );

	const changeRowSuccessCallbacks = useMemo( () => {
		const refreshTags = () => {
			queryClient.refetchQueries( { queryKey: [ 'label', 'menu' ] } );
			queryClient.invalidateQueries( { queryKey: [ 'label', 'menu' ] } );
		};
		return {
			onEdit: refreshTags,
			onDelete: refreshTags,
			onInsert: refreshTags,
		};
	}, [ queryClient ] );

	const { deleteRow, updateRow } = useChangeRow( { successCallbacks: changeRowSuccessCallbacks } );

	const columns = useMemo( () => isLoadingModules || ! ( modules && Object.keys( modules ).length ) ? [] : [
		columnHelper.accessor( 'check', {
			className: 'checkbox',
			cell: ( cell ) => <TableSelectCheckbox tableElement={ cell } />,
			header: ( head ) => <TableSelectCheckbox tableElement={ head } />,
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
			cell: ( cell ) => <MultiSelectMenu items={ possibleModules.current } asTags id={ `modules-${ cell.row.id }` } emptyAll value={ ( cell.getValue()?.length && cell.getValue()[ 0 ].length ) ? cell.getValue() : [] }
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
	], [ columnHelper, deleteRow, isLoadingModules, modules, updateRow ] );

	useEffect( () => {
		setTable( slug, { data } );
	}, [ data, setTable ] );

	if ( isLoading || isLoadingModules ) {
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
				options={ headerBottomOptions }
			/>
			<Table
				className="fadeInto"
				columns={ columns }
				data={ isSuccess && tableData }
			>
			</Table>

			<TableEditorManager possibleModules={ possibleModules.current } />

		</div>
	);
}

const TableEditorManager = memo( ( { possibleModules } ) => {
	const rowToEdit = useTablePanels( ( state ) => state.rowToEdit );
	const setRowToEdit = useTablePanels( ( state ) => state.setRowToEdit );

	const rowEditorCells = useMemo( () => ( {
		name: <InputField liveUpdate autoFocus defaultValue="" label={ header.name } onChange={ ( val ) => setRowToEdit( { ...rowToEdit, name: val } ) } required />,
		bgcolor: <ColorPicker defaultValue="" label={ __( 'Color' ) } onChange={ ( val ) => setRowToEdit( { ...rowToEdit, bgcolor: val } ) } />,
		modules: <MultiSelectMenu liveUpdate id="modules" asTags items={ possibleModules } defaultValue={ [] } emptyAll onChange={ ( val ) => setRowToEdit( { ...rowToEdit, modules: val } ) }>{ header.modules }</MultiSelectMenu>,

	} ), [ possibleModules, rowToEdit, setRowToEdit ] );

	useEffect( () => {
		useTablePanels.setState( ( ) => (
			{
				...useTablePanels.getState(),
				rowEditorCells: {
					...rowEditorCells,
					modules: {
						...rowEditorCells.modules,
						props: {
							...rowEditorCells.modules.props,
							items: possibleModules,
						},
					},
				},
			}
		) );
	}, [ possibleModules, rowEditorCells ] );
} );
