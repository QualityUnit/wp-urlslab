import { useEffect, useCallback } from 'react';
import { useI18n } from '@wordpress/react-i18n/';

import {
	useInfiniteFetch, ProgressBar, SortBy, Tooltip, Trash, Checkbox, Loader, Table, ModuleViewHeaderBottom, TooltipSortingFiltering, InputField, DateTimeFormat, TagsMenu, IconButton, RefreshIcon, Edit,
} from '../lib/tableImports';

import useTableStore from '../hooks/useTableStore';
import useChangeRow from '../hooks/useChangeRow';
import useTablePanels from '../hooks/useTablePanels';

export default function MetaTagsManagerTable( { slug } ) {
	const { __ } = useI18n();
	const paginationId = 'url_id';

	const {
		columnHelper,
		data,
		status,
		isSuccess,
		isFetchingNextPage,
		hasNextPage,
		ref,
	} = useInfiniteFetch( { slug } );

	const { selectRows, deleteRow, updateRow } = useChangeRow();

	const { resetTableStore } = useTableStore();
	const { activatePanel, setOptions, setRowToEdit, resetPanelsStore } = useTablePanels();
	const rowToEdit = useTablePanels( ( state ) => state.rowToEdit );

	const setUnifiedPanel = useCallback( ( cell ) => {
		setOptions( [] );
		setRowToEdit( {} );
		updateRow( { cell } );
	}, [ setOptions, setRowToEdit, slug ] );

	const ActionButton = ( { cell, onClick } ) => {
		const { http_status } = cell?.row?.original;

		return (
			<div className="flex flex-align-center flex-justify-end">
				{
					http_status !== '-2' &&
					<IconButton className="mr-s" tooltip={ __( 'Regenerate' ) } tooltipClass="align-left" onClick={ () => onClick( '-2' ) }>
						<RefreshIcon />
					</IconButton>
				}
			</div>
		);
	};

	const scrStatusTypes = {
		N: __( 'Waiting' ),
		A: __( 'Active' ),
		P: __( 'Pending' ),
		U: __( 'Updating' ),
		E: __( 'Error' ),
	};

	const sumStatusTypes = {
		N: __( 'Waiting' ),
		A: __( 'Processed' ),
		P: __( 'Pending' ),
		U: __( 'Updating' ),
		E: __( 'Error' ),
	};

	const httpStatusTypes = {
		'-2': __( 'Processing' ),
		'-1': __( 'Waiting' ),
		200: __( 'Valid' ),
		400: __( 'Client Error (400)' ),
		301: __( 'Moved Permanently' ),
		302: __( 'Found, Moved temporarily' ),
		307: __( 'Temporary Redirect' ),
		308: __( 'Permanent Redirect' ),
		404: __( 'Not Found' ),
		500: __( 'Server Error (500)' ),
		503: __( 'Server Error (503)' ),
	};

	const relScheduleTypes = {
		N: 'New',
		M: 'Manual',
		S: 'Scheduled',
		E: 'Error',
	};

	const header = {
		url_name: __( 'URL' ),
		url_title: __( 'Title' ),
		url_meta_description: __( 'Description' ),
		url_summary: __( 'Summary' ),
		http_status: __( 'HTTP status' ),
		scr_status: __( 'Screenshot status' ),
		sum_status: __( 'Summary status' ),
		rel_schedule: __( 'Schedule' ),
		update_http_date: __( 'HTTP status change' ),
		update_scr_date: __( 'Screenshot status change' ),
		update_sum_date: __( 'Summary status change' ),
		labels: __( 'Tags' ),
	};

	const rowEditorCells = {
		url_title: <InputField defaultValue="" label={ header.url_title } onChange={ ( val ) => setRowToEdit( { ...rowToEdit, url_title: val } ) } />,

		url_meta_description: <InputField defaultValue="" label={ header.url_meta_description } onChange={ ( val ) => setRowToEdit( { ...rowToEdit, url_meta_description: val } ) } />,

		url_summary: <InputField defaultValue="" label={ header.url_summary } onChange={ ( val ) => setRowToEdit( { ...rowToEdit, url_summary: val } ) } />,

		labels: <TagsMenu hasActivator label={ __( 'Tags:' ) } slug={ slug } onChange={ ( val ) => setRowToEdit( { ...rowToEdit, labels: val } ) } />,
	};

	// Saving all variables into state managers
	useEffect( () => {
		resetPanelsStore();
		resetTableStore();

		useTableStore.setState( () => (
			{
				data,
				paginationId,
				slug,
				header,
			}
		) );

		useTablePanels.setState( () => (
			{
				rowEditorCells,
				deleteCSVCols: [ 'urlslab_url_id', 'url_id', 'urlslab_domain_id' ],
			}
		) );
	}, [ data ] );

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
		} ),
		columnHelper.accessor( 'url_name', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => <a href={ cell.getValue() } title={ cell.getValue() } target="_blank" rel="noreferrer">{ cell.getValue() }</a>,
			header: ( th ) => <SortBy { ...th } />,
			size: 200,
		} ),
		columnHelper.accessor( 'url_title', {
			tooltip: ( cell ) => <Tooltip className="xxl">{ cell.getValue() }</Tooltip>,
			header: ( th ) => <SortBy { ...th } />,
			size: 150,
		} ),
		columnHelper?.accessor( 'url_meta_description', {
			tooltip: ( cell ) => <Tooltip className="xxl">{ cell.getValue() }</Tooltip>,
			header: ( th ) => <SortBy { ...th } />,
			size: 150,
		} ),
		columnHelper.accessor( 'url_summary', {
			tooltip: ( cell ) => <Tooltip className="xxl">{ cell.getValue() }</Tooltip>,
			header: ( th ) => <SortBy { ...th } />,
			size: 200,
		} ),
		columnHelper?.accessor( 'http_status', {
			filterValMenu: httpStatusTypes,
			cell: ( cell ) => httpStatusTypes[ cell.getValue() ],
			header: ( th ) => <SortBy { ...th } />,
			size: 80,
		} ),
		columnHelper.accessor( 'update_http_date', {
			cell: ( val ) => <DateTimeFormat datetime={ val.getValue() } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 115,
		} ),
		columnHelper?.accessor( 'scr_status', {
			filterValMenu: scrStatusTypes,
			cell: ( cell ) => scrStatusTypes[ cell.getValue() ],
			header: ( th ) => <SortBy { ...th } />,
			size: 80,
		} ),
		columnHelper?.accessor( 'update_scr_date', {
			cell: ( val ) => <DateTimeFormat datetime={ val.getValue() } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 115,
		} ),
		columnHelper?.accessor( 'sum_status', {
			filterValMenu: sumStatusTypes,
			cell: ( cell ) => sumStatusTypes[ cell.getValue() ],
			header: ( th ) => <SortBy { ...th } />,
			size: 80,
		} ),
		columnHelper?.accessor( 'update_sum_date', {
			cell: ( val ) => <DateTimeFormat datetime={ val.getValue() } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 115,
		} ),
		columnHelper.accessor( 'rel_schedule', {
			filterValMenu: relScheduleTypes,
			cell: ( cell ) => relScheduleTypes[ cell.getValue() ],
			header: ( th ) => <SortBy { ...th } />,
			size: 80,
		} ),
		columnHelper.accessor( 'labels', {
			className: 'nolimit',
			cell: ( cell ) => <TagsMenu defaultValue={ cell.getValue() } slug={ slug } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: header.labels,
			size: 150,
		} ),
		columnHelper.accessor( 'editRow', {
			className: 'editRow',
			cell: ( cell ) => {
				return (
					<div className="flex editRow-buttons">
						<ActionButton cell={ cell } onClick={ ( val ) => updateRow( { changeField: 'http_status', newVal: val, cell } ) } />
						<IconButton
							onClick={ () => {
								setUnifiedPanel( cell );
								activatePanel( 'rowEditor' );
							} }
							tooltipClass="align-left"
							tooltip={ __( 'Edit row' ) }
						>
							<Edit />
						</IconButton>
						<IconButton
							className="ml-s"
							onClick={ () => deleteRow( { cell, id: 'url_name' } ) }
							tooltipClass="align-left"
							tooltip={ __( 'Delete row' ) }
						>
							<Trash />
						</IconButton>
					</div>
				);
			},
			header: null,
		} ),
	];

	if ( status === 'loading' ) {
		return <Loader />;
	}

	return (
		<>
			<ModuleViewHeaderBottom
				noImport
				options={ {
					perPage: 1000,
				} }
			/>
			<Table className="fadeInto"
				initialState={ { columnVisibility: { scr_status: false, sum_status: false, update_scr_date: false, update_sum_date: false } } }
				columns={ columns }
				data={ isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] ) }
			>
				<TooltipSortingFiltering />
				<div ref={ ref }>
					{ isFetchingNextPage ? '' : hasNextPage }
					<ProgressBar className="infiniteScroll" value={ ! isFetchingNextPage ? 0 : 100 } />
				</div>
			</Table>
		</>
	);
}
