import { useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import useChangeRow from '../hooks/useChangeRow';
import useTableUpdater from '../hooks/useTableUpdater';

import { InputField, Loader, MultiSelectMenu, Tag, Trash, useInfiniteFetch } from '../lib/tableImports';

import ColorPicker from '../components/ColorPicker';
import ModuleViewHeaderBottom from '../components/ModuleViewHeaderBottom';
import Table from '../components/TableComponent';
import Checkbox from '../elements/Checkbox';
import Tooltip from '../elements/Tooltip';

import '../assets/styles/components/_ModuleViewHeader.scss';
import hexToHSL from '../lib/hexToHSL';

export default function TagsLabels( ) {
	// const columnHelper = useMemo( () => createColumnHelper(), [] );
	const paginationId = 'label_id';
	const slug = 'label';
	const { table, setTable, rowToInsert, setInsertRow, filters, sorting } = useTableUpdater( { slug } );
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

	const { row, selectedRows, selectRow, deleteRow, deleteSelectedRows, updateRow } = useChangeRow( { data, url, slug, paginationId } );

	const header = {
		name: 'Title',
		modules: 'Allowed in tables',
	};

	const inserterCells = {
		name: <InputField liveUpdate defaultValue="" label={ header.name } onChange={ ( val ) => setInsertRow( { ...rowToInsert, name: val } ) } required />,
		bgcolor: <ColorPicker defaultValue="" label="Background color" onChange={ ( val ) => setInsertRow( { ...rowToInsert, bgcolor: val } ) } />,
		modules: <MultiSelectMenu liveUpdate asTags id="modules" items={ possibleModules } checkedItems={ [] } onChange={ ( val ) => setInsertRow( { ...rowToInsert, modules: val } ) }>{ header.modules }</MultiSelectMenu>,
	};

	const columns = [
		columnHelper.accessor( 'check', {
			className: 'checkbox',
			cell: ( cell ) => <Checkbox checked={ cell.row.getIsSelected() } onChange={ ( val ) => {
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
				const tag = cell.row.original;
				const { lightness } = hexToHSL( tag.bgcolor );
				return <Tag fullSize className={ lightness < 70 ? 'dark' : '' } style={ { backgroundColor: cell.row.original.bgcolor } }>{ cell.getValue() }</Tag>;
			},
			header: 'Tags',
			size: 150,
		} ),
		columnHelper.accessor( 'modules', {
			className: 'nolimit',
			cell: ( cell ) => <MultiSelectMenu items={ possibleModules } asTags id="modules" checkedItems={ ( cell?.getValue()[ 0 ] && cell?.getValue() ) || [] }
				onChange={ ( newVal ) => updateRow( { newVal, cell } ) }
			/>,
			header: header.modules,
			size: 150,
		} ),

		columnHelper.accessor( 'delete', {
			className: 'deleteRow',
			tooltip: () => <Tooltip className="align-left xxxl">{ __( 'Delete item' ) }</Tooltip>,
			cell: ( cell ) => <Trash onClick={ () => deleteRow( { cell } ) } />,
			header: null,
		} ),
	];

	if ( status === 'loading' ) {
		return <Loader />;
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
				onUpdateRows={ ( val ) => {
					setInsertRow();
					if ( val === 'rowInserted' ) {
						setInsertRow( val );
						setTimeout( () => {
							setInsertRow();
						}, 3000 );
					}
				} }
				insertOptions={ { inserterCells, title: 'Add new tag', data, slug, url, paginationId, rowToInsert } }
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
				{ ( rowToInsert === 'rowInserted' )
					? <Tooltip center>{ __( 'Tag has been added.' ) }</Tooltip>
					: null
				}
			</Table>
		</div>
	);
}
