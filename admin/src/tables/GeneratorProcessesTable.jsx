import { useEffect, useMemo, useState } from 'react';
import { __ } from '@wordpress/i18n';

import {
	DateTimeFormat,
	Loader,
	ModuleViewHeaderBottom,
	RowActionButtons,
	SortBy,
	Table,
	TooltipSortingFiltering,
	IconButton,
	Tooltip,
	SvgIcon,
	useInfiniteFetch,
	TableSelectCheckbox,
} from '../lib/tableImports';

import useChangeRow from '../hooks/useChangeRow';
import useTableStore from '../hooks/useTableStore';
import DescriptionBox from '../elements/DescriptionBox';
import TreeView from '../elements/TreeView';
import useColumnTypesQuery from '../queries/useColumnTypesQuery';

const paginationId = 'task_id';
const header = {
	task_id: __( 'ID', 'urlslab' ),
	generator_type: __( 'Generator type', 'urlslab' ),
	task_status: __( 'Status', 'urlslab' ),
	task_data: __( 'Task data', 'urlslab' ),
	result_log: __( 'Result', 'urlslab' ),
	updated_at: __( 'Last change', 'urlslab' ),
};

// init table state with fixed states which we do not need to update anymore during table lifecycle
export default function TableInit( { slug } ) {
	const setTable = useTableStore( ( state ) => state.setTable );
	const [ init, setInit ] = useState( false );
	useEffect( () => {
		setInit( true );
		setTable( slug, {
			paginationId,
			slug,
			header,
			id: 'template_id',
		} );
	}, [ setTable, slug ] );

	return init && <GeneratorProcessesTable slug={ slug } />;
}

function GeneratorProcessesTable( { slug } ) {
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

	const { columnTypes, isLoadingColumnTypes } = useColumnTypesQuery( slug );
	const { deleteRow, updateRow } = useChangeRow( );

	const ActionButton = useMemo( () => ( { cell, onClick } ) => {
		const { task_status } = cell?.row?.original;

		return (
			<div className="flex flex-align-center flex-justify-end">
				{ task_status === 'D' &&
					<Tooltip title={ __( 'Regenerate', 'urlslab' ) } arrow placement="bottom">
						<IconButton size="xs" onClick={ () => onClick( 'N' ) }>
							<SvgIcon name="refresh" />
						</IconButton>
					</Tooltip>
				}
			</div>
		);
	}, [] );

	const columns = useMemo( () => ! columnTypes ? [] : [
		columnHelper.accessor( 'check', {
			className: 'nolimit checkbox',
			cell: ( cell ) => <TableSelectCheckbox tableElement={ cell } />,
			header: ( head ) => <TableSelectCheckbox tableElement={ head } />,
		} ),
		columnHelper.accessor( 'task_id', {
			className: 'nolimit',
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 80,
		} ),
		columnHelper.accessor( 'generator_type', {
			cell: ( cell ) => columnTypes?.generator_type.values[ cell.getValue() ],
			header: ( th ) => <SortBy { ...th } />,
			size: 80,
		} ),
		columnHelper.accessor( 'task_status', {
			className: 'nolimit',
			cell: ( cell ) => columnTypes?.task_status.values[ cell.getValue() ],
			header: ( th ) => <SortBy { ...th } />,
			size: 80,
		} ),
		columnHelper.accessor( 'task_data', {
			cell: ( cell ) => <TreeView sourceData={ cell.getValue() } isTableCellPopper />,
			header: ( th ) => <SortBy { ...th } />,
			size: 100,
		} ),
		columnHelper.accessor( 'result_log', {
			tooltip: ( cell ) => cell.getValue(),
			cell: ( cell ) => cell?.row?.original.generator_type === 'P' ? <a href={ cell.getValue() }>{ cell.getValue() }</a> : cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 100,
		} ),
		columnHelper.accessor( 'updated_at', {
			cell: ( val ) => <DateTimeFormat datetime={ val.getValue() } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 80,
		} ),
		columnHelper.accessor( 'editRow', {
			className: 'editRow',
			cell: ( cell ) => <RowActionButtons
				onDelete={ () => deleteRow( { cell, id: 'task_id' } ) }
			>
				<ActionButton cell={ cell } onClick={ ( val ) => updateRow( { changeField: 'task_status', newVal: val, cell } ) } />
			</RowActionButtons>,
			header: () => null,
			size: 0,
		} ),
	], [ columnHelper, columnTypes, deleteRow, updateRow ] );

	useEffect( () => {
		setTable( slug, { data } );
	}, [ data, setTable, slug ] );

	if ( isLoading || isLoadingColumnTypes ) {
		return <Loader isFullscreen />;
	}

	return (
		<>
			<DescriptionBox	title={ __( 'About this table', 'urlslab' ) } tableSlug={ slug } isMainTableDescription>
				{ __( 'The AI Generator operates by producing content through a background process. The table displays a list of scheduled tasks and currently running background tasks, which are awaiting content results from the generator. Once the content has been successfully generated, the respective task is immediately removed from the list.', 'urlslab' ) }
			</DescriptionBox>

			<ModuleViewHeaderBottom noImport />

			<Table className="fadeInto"
				columns={ columns }
				data={ isSuccess && tableData }
				referrer={ ref }
				loadingRows={ isFetchingNextPage }
			>
				<TooltipSortingFiltering />
			</Table>
		</>
	);
}
