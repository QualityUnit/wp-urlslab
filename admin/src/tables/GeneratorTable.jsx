import {
	useInfiniteFetch, Tooltip, Checkbox, Trash, ProgressBar, InputField, Loader, Table, ModuleViewHeaderBottom, TooltipSortingFiltering, DateTimeFormat,
} from '../lib/tableImports';

import IconButton from '../elements/IconButton';
import { ReactComponent as AcceptIcon } from '../assets/images/icons/icon-activate.svg';
import { ReactComponent as DisableIcon } from '../assets/images/icons/icon-disable.svg';
import { ReactComponent as RefreshIcon } from '../assets/images/icons/icon-cron-refresh.svg';

import { langName } from '../lib/helpers';

import useTableUpdater from '../hooks/useTableUpdater';
import useChangeRow from '../hooks/useChangeRow';

export default function GeneratorTable( { slug } ) {
	const pageId = 'generator_id';
	const { table, setTable, filters, setFilters, currentFilters, sortingColumn, sortBy } = useTableUpdater( { slug } );

	const url = `${ 'undefined' === typeof filters ? '' : filters }${ 'undefined' === typeof sortingColumn ? '' : sortingColumn }`;

	const ActionButton = ( { cell, onClick } ) => {
		const { status } = cell?.row?.original;

		return (
			<div className="flex flex-align-center flex-justify-end">
				{
					( status === 'W' || status === 'D' ) &&
					<IconButton className="mr-s c-saturated-green" tooltip={ __( 'Accept' ) } tooltipClass="align-left" onClick={ () => onClick( 'A' ) }>
						<AcceptIcon />
					</IconButton>
				}
				{
					( status === 'W' || status === 'A' ) &&
					<IconButton className="mr-s c-saturated-red" tooltip={ __( 'Decline' ) } tooltipClass="align-left" onClick={ () => onClick( 'D' ) }>
						<DisableIcon />
					</IconButton>
				}
				{
					( status !== 'N' && status !== 'P' ) &&
					<IconButton className="mr-s" tooltip={ __( 'Regenerate' ) } tooltipClass="align-left" onClick={ () => onClick( 'N' ) }>
						<RefreshIcon />
					</IconButton>
				}
			</div>
		);
	};

	const {
		__,
		columnHelper,
		data,
		status,
		isSuccess,
		isFetching,
		isFetchingNextPage,
		hasNextPage,
		ref,
	} = useInfiniteFetch( { key: slug, url, pageId, currentFilters, sortingColumn } );

	const { row, selectedRows, selectRow, deleteRow, deleteSelectedRows, updateRow } = useChangeRow( { data, url, slug, pageId } );

	const statusTypes = {
		A: 'Active',
		N: 'New',
		P: 'Pending',
		W: 'Waiting approval',
		D: 'Disabled',
	};

	const header = {
		command: __( 'Command' ),
		semantic_context: __( 'Context' ),
		url_filter: __( 'URL filter' ),
		lang: __( 'Language' ),
		status: __( 'Status' ),
		status_changed: __( 'Last change' ),
		result: __( 'Result' ),
		usage_count: __( 'Usage' ),
	};

	const columns = [
		columnHelper.accessor( 'check', {
			className: 'checkbox',
			cell: ( cell ) => <Checkbox checked={ cell.row.getIsSelected() } onChange={ ( val ) => {
				selectRow( val, cell );
			} } />,
			header: null,
		} ),
		columnHelper.accessor( 'command', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			header: header.command,
			size: 180,
		} ),
		columnHelper.accessor( 'semantic_context', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			header: header.semantic_context,
			size: 180,
		} ),
		columnHelper.accessor( 'url_filter', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			header: header.url_filter,
			size: 180,
		} ),
		columnHelper.accessor( 'lang', {
			cell: ( cell ) => langName( cell?.getValue() ),
			header: header.lang,
			size: 100,
		} ),
		columnHelper.accessor( 'result', {
			className: 'nolimit',
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => <InputField defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: header.result,
			size: 180,
		} ),
		columnHelper.accessor( 'status', {
			filterValMenu: statusTypes,
			className: 'nolimit',
			cell: ( cell ) => statusTypes[ cell.getValue() ],
			header: header.status,
			size: 150,
		} ),
		columnHelper.accessor( 'status_changed', {
			cell: ( val ) => <DateTimeFormat datetime={ val.getValue() } />,
			header: header.status_changed,
			size: 100,
		} ),
		columnHelper.accessor( 'usage_count', {
			header: header.usage_count,
			size: 100,
		} ),
		columnHelper.accessor( 'actions', {
			className: 'actions hoverize nolimit',
			cell: ( cell ) => <ActionButton cell={ cell } onClick={ ( val ) => updateRow( { changeField: 'status', newVal: val, cell } ) } />,
			header: null,
			size: 70,
		} ),
		columnHelper.accessor( 'delete', {
			className: 'deleteRow',
			cell: ( cell ) => <Trash onClick={ () => deleteRow( { cell } ) } />,
			header: null,
		} ),
	];

	if ( status === 'loading' ) {
		return <Loader />;
	}

	return (
		<>
			<ModuleViewHeaderBottom
				slug={ slug }
				header={ header }
				table={ table }
				noImport
				selectedRows={ selectedRows }
				onSort={ ( val ) => sortBy( val ) }
				onDeleteSelected={ deleteSelectedRows }
				onFilter={ ( filter ) => setFilters( filter ) }
				exportOptions={ {
					url: slug,
					filters,
					fromId: `from_${ pageId }`,
					pageId,
					deleteCSVCols: [ pageId, 'generator_id' ],
				} }
			/>
			<Table className="fadeInto"
				slug={ slug }
				columns={ columns }
				returnTable={ ( returnTable ) => setTable( returnTable ) }
				data={
					isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] )
				}
			>
				{ row
					? <Tooltip center>{ __( 'Item has been deleted.' ) }</Tooltip>
					: null
				}
				<TooltipSortingFiltering props={ { isFetching, filters, sortingColumn } } />
				<div ref={ ref }>
					{ isFetchingNextPage ? '' : hasNextPage }
					<ProgressBar className="infiniteScroll" value={ ! isFetchingNextPage ? 0 : 100 } />
				</div>
			</Table>
		</>
	);
}
