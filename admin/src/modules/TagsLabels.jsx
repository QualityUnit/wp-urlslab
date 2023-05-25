import { useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import useChangeRow from '../hooks/useChangeRow';
import useTableUpdater from '../hooks/useTableUpdater';

import { Edit, InputField, Loader, MultiSelectMenu, Tag, Trash, useInfiniteFetch } from '../lib/tableImports';

import ColorPicker from '../components/ColorPicker';
import ModuleViewHeaderBottom from '../components/ModuleViewHeaderBottom';
import Table from '../components/TableComponent';
import Checkbox from '../elements/Checkbox';
import Tooltip from '../elements/Tooltip';
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

	const { row, selectedRows, rowToEdit, setEditorRow, activePanel, setActivePanel, selectRow, deleteRow, deleteSelectedRows, updateRow } = useChangeRow( { data, url, slug, paginationId } );

	const header = {
		name: 'Name',
		modules: 'Allowed',
	};

	const rowEditorCells = {
		name: <InputField liveUpdate defaultValue="" label={ header.name } onChange={ ( val ) => setEditorRow( { ...rowToEdit, name: val } ) } required />,
		bgcolor: <ColorPicker defaultValue="" label="Background color" onChange={ ( val ) => setEditorRow( { ...rowToEdit, bgcolor: val } ) } />,
		modules: <MultiSelectMenu liveUpdate asTags id="modules" items={ possibleModules } defaultValue={ [] } onChange={ ( val ) => setEditorRow( { ...rowToEdit, modules: val } ) }>{ header.modules }</MultiSelectMenu>,
	};

	const columns = [
		columnHelper.accessor( 'check', {
			className: 'checkbox',
			cell: ( cell ) => <Checkbox defaultValue={ cell.row.getIsSelected() } onChange={ ( val ) => {
				selectRow( val, cell );
			} } />,
			header: () => <Checkbox onChange={ () => console.log( '' ) } />,
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
			cell: ( cell ) => <MultiSelectMenu items={ possibleModules } asTags id="modules" defaultValue={ ( cell.getValue() && cell.getValue()[ 0 ] ) || '' }
				onChange={ ( newVal ) => updateRow( { newVal, cell } ) }
			/>,
			header: header.modules,
			size: 150,
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
			header: null,
			size: 60,
		} ),
	];

	if ( status === 'loading' ) {
		return <Loader />;
	}

	if ( row ) {
		queryClient.invalidateQueries( [ 'label' ] );
	}

	return (
		<div className="urlslab-tableView">
			<ModuleViewHeaderBottom
				slug={ slug }
				header={ header }
				table={ table }
				selectedRows={ selectedRows }
				onDeleteSelected={ deleteSelectedRows }
				noColumnsMenu
				noExport
				noImport
				noFiltering
				noCount
				onUpdate={ ( val ) => {
					setActivePanel();
					setEditorRow();
					if ( val === 'rowInserted' || val === 'rowChanged' ) {
						setEditorRow( val );
						setTimeout( () => {
							setEditorRow();
						}, 3000 );
					}
				} }
				activatePanel={ activePanel }
				rowEditorOptions={ { rowEditorCells, notWide: true, title: 'Create new tag', data, slug, url, paginationId, rowToEdit } }
			/>
			<Table className="fadeInto"
				slug={ slug }
				returnTable={ ( returnTable ) => setTable( returnTable ) }
				columns={ columns }
				data={ isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] ) }
			>
				{ row
					? <Tooltip center>{ `Tag “${ row.name }”` } { __( 'has been deleted.' ) }</Tooltip>
					: null
				}
				{ ( rowToEdit === 'rowChanged' )
					? <Tooltip center>{ __( 'Tag has been changed.' ) }</Tooltip>
					: null
				}
				{ ( rowToEdit === 'rowInserted' )
					? <Tooltip center>{ __( 'Tag has been added.' ) }</Tooltip>
					: null
				}
			</Table>
		</div>
	);
}
