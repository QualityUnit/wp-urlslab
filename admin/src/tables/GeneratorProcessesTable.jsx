import { useEffect, useMemo } from 'react';
import { __ } from '@wordpress/i18n';

import {
	Checkbox,
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
} from '../lib/tableImports';

import useChangeRow from '../hooks/useChangeRow';
import useTableStore from '../hooks/useTableStore';
import DescriptionBox from '../elements/DescriptionBox';
import TreeView from '../elements/TreeView';
import useColumnTypesQuery from '../queries/useColumnTypesQuery';

const paginationId = 'task_id';

const header = {
	task_id: __( 'ID' ),
	generator_type: __( 'Generator type' ),
	task_status: __( 'Status' ),
	task_data: __( 'Task data' ),
	result_log: __( 'Result' ),
	updated_at: __( 'Last change' ),
};

export default function GeneratorProcessesTable( { slug } ) {
	const {
		columnHelper,
		data,
		status,
		isSuccess,
		isFetchingNextPage,
		ref,
	} = useInfiniteFetch( { slug } );

	const { columnTypes } = useColumnTypesQuery( slug );

	const { isSelected, selectRows, deleteRow, updateRow } = useChangeRow( );

	const ActionButton = useMemo( () => ( { cell, onClick } ) => {
		const { task_status } = cell?.row?.original;

		return (
			<div className="flex flex-align-center flex-justify-end">
				{
					task_status === 'D' &&
					<Tooltip title={ __( 'Regenerate' ) } disablePortal>
						<IconButton size="xs" onClick={ () => onClick( 'N' ) }>
							<SvgIcon name="refresh" />
						</IconButton>
					</Tooltip>
				}
			</div>
		);
	}, [] );

	useEffect( () => {
		useTableStore.setState( () => (
			{
				activeTable: slug,
				tables: {
					...useTableStore.getState().tables,
					[ slug ]: {
						...useTableStore.getState().tables[ slug ],
						paginationId,
						slug,
						header,
						id: 'template_id',
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
			className: 'nolimit checkbox',
			cell: ( cell ) => <Checkbox defaultValue={ isSelected( cell ) } onChange={ () => {
				selectRows( cell );
			} } />,
			header: ( head ) => <Checkbox defaultValue={ isSelected( head, true ) } onChange={ ( ) => {
				selectRows( head, true );
			} } />,
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
	], [ columnHelper, columnTypes?.generator_type, columnTypes?.task_status, deleteRow, isSelected, selectRows, updateRow ] );

	if ( status === 'loading' ) {
		return <Loader isFullscreen />;
	}

	return (
		<>
			<DescriptionBox	title={ __( 'About this table' ) } tableSlug={ slug } isMainTableDescription>
				{ __( 'The AI Generator operates by producing content through a background process. The table displays a list of scheduled tasks and currently running background tasks, which are awaiting content results from the generator. Once the content has been successfully generated, the respective task is immediately removed from the list.' ) }
			</DescriptionBox>
			<ModuleViewHeaderBottom noImport />
			<Table className="fadeInto"
				columns={ columns }
				data={ isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] ) }
				referrer={ ref }
				loadingRows={ isFetchingNextPage }
			>
				<TooltipSortingFiltering />
			</Table>
		</>
	);
}
