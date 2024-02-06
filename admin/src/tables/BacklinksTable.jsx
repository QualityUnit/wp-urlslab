/* eslint-disable indent */
import { useEffect, useMemo, memo, useState } from 'react';
import { __ } from '@wordpress/i18n/';

import {
	useInfiniteFetch,
	TagsMenu,
	SortBy,
	InputField,
	Loader,
	Table,
	ModuleViewHeaderBottom,
	TooltipSortingFiltering,
	RowActionButtons,
	TextArea, DateTimeFormat, Tooltip, IconButton, SvgIcon, TableSelectCheckbox,
} from '../lib/tableImports';

import useChangeRow from '../hooks/useChangeRow';
import useTablePanels from '../hooks/useTablePanels';
import useTableStore from '../hooks/useTableStore';
import DescriptionBox from '../elements/DescriptionBox';
import Stack from '@mui/joy/Stack';
import MuiIconButton from '@mui/joy/IconButton';
import useColumnTypesQuery from '../queries/useColumnTypesQuery';

const title = __( 'Add New Backlink Monitor' );
const paginationId = 'from_url_id';
const id = 'from_url_name';
const optionalSelector = 'to_url_id';
const header = {
	from_url_name: __( 'From URL' ),
	from_http_status: __( 'URL HTTP Status' ),
	from_attributes: __( 'URL Attributes' ),
	to_url_name: __( 'My Link' ),
	anchor_text: __( 'Anchor text' ),
	link_attributes: __( 'Link attributes' ),
	status: __( 'Backlink Status' ),
	note: __( 'Notes' ),
	created: __( 'Created' ),
	updated: __( 'Updated' ),
	first_seen: __( 'Link first seen' ),
	last_seen: __( 'Link last seen' ),
	labels: __( 'Tags' ),
};
const initialState = {
	columnVisibility: {
		created: false,
		updated: false,
		first_seen: false,
		note: false,
	},
};

// init table state with fixed states which we do not need to update anymore during table lifecycle
export default function TableInit( { slug } ) {
	const setTable = useTableStore( ( state ) => state.setTable );
	const [ init, setInit ] = useState( false );
	useEffect( () => {
		setInit( true );
		setTable( slug, {
			title,
			paginationId,
			slug,
			header,
			id,
			optionalSelector,
		} );
	}, [ setTable, slug ] );

	return init && <BacklinksTable slug={ slug } />;
}

function BacklinksTable( { slug } ) {
	const {
		data,
		isLoading,
		isSuccess,
		isFetchingNextPage,
		columnHelper,
		ref,
	} = useInfiniteFetch( { slug } );

	const tableData = useMemo( () => data?.pages?.flatMap( ( page ) => page ?? [] ), [ data?.pages ] );
	const setTable = useTableStore( ( state ) => state.setTable );

	const { columnTypes, isLoadingColumnTypes } = useColumnTypesQuery( slug );
	const { deleteRow, updateRow } = useChangeRow();

	const ActionHTTPStatusButton = useMemo( () => ( { cell, onClick } ) => {
		const { from_http_status } = cell?.row?.original;
		return (
			from_http_status > -2 &&
			<Tooltip title={ __( 'Re-check status' ) } arrow placement="bottom">
				<IconButton size="xs" onClick={ () => onClick( '-1' ) }>
					<SvgIcon name="refresh" />
				</IconButton>
			</Tooltip>
		);
	}, [] );

	const columns = useMemo( () => ! columnTypes ? [] : [
		columnHelper.accessor( 'check', {
			className: 'checkbox',
			cell: ( cell ) => <TableSelectCheckbox tableElement={ cell } />,
			header: ( head ) => <TableSelectCheckbox tableElement={ head } />,
		} ),
		columnHelper.accessor( 'from_url_name', {
			tooltip: ( cell ) => cell.getValue(),
			cell: ( cell ) => <a href={ cell.getValue() } target="_blank" rel="noreferrer">{ cell.getValue() }</a>,
			header: ( th ) => <SortBy { ...th } />,
			minSize: 200,
		} ),
		columnHelper.accessor( 'from_attributes', {
			tooltip: ( cell ) => cell.getValue(),
			cell: ( cell ) => (
				<Stack direction="row" alignItems="center" spacing={ 1 }><>
					{
						( cell?.getValue().includes( 'noindex' ) || cell?.getValue().includes( 'nofollow' ) )
							? <MuiIconButton size="xs" variant="soft" color="danger" sx={ { pointerEvents: 'none' } }>
								<SvgIcon name="error" />
							</MuiIconButton>
							: cell?.getValue().length > 0 &&
							<MuiIconButton size="xs" variant="soft" color="neutral" sx={ { pointerEvents: 'none' } }>
								<SvgIcon name="checkmark" />
							</MuiIconButton>
					}
				</>
				</Stack>
			),
			header: ( th ) => <SortBy { ...th } />,
			minSize: 30,
		} ),
		columnHelper?.accessor( 'from_http_status', {
			tooltip: ( cell ) => columnTypes?.from_http_status.values[ cell?.getValue() ] ? columnTypes?.from_http_status.values[ cell?.getValue() ] : cell?.getValue(),
			cell: ( cell ) => (
				<Stack direction="row" alignItems="center" spacing={ 1 }>
					{ cell?.getValue() > 399 &&
						<MuiIconButton size="xs" variant="soft" color="danger" sx={ { pointerEvents: 'none' } }>
							<SvgIcon name="error" />
						</MuiIconButton>
					}
					{ cell?.getValue() < 400 && cell?.getValue() > 0 &&
						<MuiIconButton size="xs" variant="soft" color="success" sx={ { pointerEvents: 'none' } }>
							<SvgIcon name="checkmark" />
						</MuiIconButton>
					}
					{ cell?.getValue() < 1 &&
						<MuiIconButton size="xs" variant="soft" color="neutral" sx={ { pointerEvents: 'none' } }>
							<SvgIcon name="loading-input" />
						</MuiIconButton>
					}
				</Stack>
			),
			header: ( th ) => <SortBy { ...th } />,
			size: 30,
		} ),
		columnHelper.accessor( 'to_url_name', {
			tooltip: ( cell ) => cell.getValue(),
			cell: ( cell ) => <a href={ cell.getValue() } target="_blank" rel="noreferrer">{ cell.getValue() }</a>,
			header: ( th ) => <SortBy { ...th } />,
			minSize: 200,
		} ),
		columnHelper.accessor( 'anchor_text', {
			tooltip: ( cell ) => cell.getValue(),
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			minSize: 100,
		} ),
		columnHelper.accessor( 'link_attributes', {
			tooltip: ( cell ) => cell.getValue(),
			cell: ( cell ) =>
				<Stack direction="row" alignItems="center" spacing={ 1 }>
					{ ( cell?.getValue().includes( 'noindex' ) || cell?.getValue().includes( 'nofollow' ) )
						? <MuiIconButton size="xs" variant="soft" color="danger" sx={ { pointerEvents: 'none' } }>
							<SvgIcon name="error" />
						</MuiIconButton>
						: cell.getValue().length > 0 &&
							<MuiIconButton size="xs" variant="soft" color="neutral" sx={ { pointerEvents: 'none' } }>
								<SvgIcon name="info" />
							</MuiIconButton>
					}
				</Stack>,
			header: ( th ) => <SortBy { ...th } />,
			minSize: 30,
		} ),
		columnHelper.accessor( 'status', {
			tooltip: ( cell ) => ( cell?.getValue() && columnTypes?.status.values[ cell?.getValue() ] ) ? columnTypes?.status.values[ cell?.getValue() ] : cell?.getValue(),
			cell: ( cell ) =>
				<Stack direction="row" alignItems="center" spacing={ 1 }>
					{ cell?.getValue() === 'M' &&
						<MuiIconButton size="xs" variant="soft" color="danger" sx={ { pointerEvents: 'none' } }>
							<SvgIcon name="error" />
						</MuiIconButton>
					}
					{ cell?.getValue() === 'O' &&
						<MuiIconButton size="xs" variant="soft" color="success" sx={ { pointerEvents: 'none' } }>
							<SvgIcon name="checkmark" />
						</MuiIconButton>
					}
					{ cell?.getValue() === 'N' &&
						<MuiIconButton size="xs" variant="soft" color="neutral" sx={ { pointerEvents: 'none' } }>
							<SvgIcon name="loading-input" />
						</MuiIconButton>
					}
				</Stack>,
			header: ( th ) => <SortBy { ...th } />,
			minSize: 30,
		} ),
		columnHelper.accessor( 'note', {
			tooltip: ( cell ) => cell.getValue(),
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			minSize: 100,
		} ),
		columnHelper.accessor( 'created', {
			cell: ( val ) => <DateTimeFormat datetime={ val.getValue() } />,
			header: ( th ) => <SortBy { ...th } />,
			minSize: 40,
		} ),
		columnHelper.accessor( 'updated', {
			cell: ( val ) => <DateTimeFormat datetime={ val.getValue() } />,
			header: ( th ) => <SortBy { ...th } />,
			minSize: 40,
		} ),
		columnHelper.accessor( 'first_seen', {
			cell: ( val ) => <DateTimeFormat datetime={ val.getValue() } />,
			header: ( th ) => <SortBy { ...th } />,
			minSize: 40,
		} ),
		columnHelper.accessor( 'last_seen', {
			cell: ( val ) => <DateTimeFormat datetime={ val.getValue() } />,
			header: ( th ) => <SortBy { ...th } />,
			minSize: 40,
		} ),
		columnHelper.accessor( 'labels', {
			className: 'nolimit',
			cell: ( cell ) => <TagsMenu value={ cell.getValue() } slug={ slug } onChange={ ( newVal ) => updateRow( {
				optionalSelector,
				newVal,
				cell,
				id: 'keyword',
			} ) } />,
			header: header.labels,
			size: 150,
		} ),
		columnHelper.accessor( 'editRow', {
			className: 'editRow',
			cell: ( cell ) => <RowActionButtons
				onEdit={ () => updateRow( { cell, optionalSelector, id } ) }
				onDelete={ () => deleteRow( { cell, optionalSelector, id } ) }
			>
				<ActionHTTPStatusButton cell={ cell } onClick={ ( val ) => updateRow( {
					optionalSelector,
					changeField: 'from_http_status',
					newVal: val,
					cell,
				} ) } />
				{ cell.row.original.edit_from_url_name?.length > 0 &&
					<Tooltip title={ __( 'Edit From URL Post' ) } arrow placement="bottom">
						<IconButton size="xs" component="a" href={ cell.row.original.edit_from_url_name } target="_blank">
							<SvgIcon name="edit-post" />
						</IconButton>
					</Tooltip>
				}
				{ cell.row.original.edit_to_url_name?.length > 0 &&
					<Tooltip title={ __( 'Edit My Link Post' ) } arrow placement="bottom">
						<IconButton size="xs" component="a" href={ cell.row.original.edit_to_url_name } target="_blank">
							<SvgIcon name="edit-post" />
						</IconButton>
					</Tooltip>
				}
			</RowActionButtons>,
			header: () => null,
			size: 150,
		} ),

	], [ columnHelper, columnTypes, deleteRow, slug, updateRow ] );

	useEffect( () => {
		setTable( slug, { data } );
	}, [ data, setTable, slug ] );

	if ( isLoading || isLoadingColumnTypes ) {
		return <Loader isFullscreen />;
	}

	return (
		<>
			<DescriptionBox title={ __( 'About this table' ) } tableSlug={ slug } isMainTableDescription>
				{ __( "Implementing a regular backlinks monitoring schedule is indispensable for maintaining the integrity and efficacy of your website's backlink profile. By keeping a vigilant watch on your backlinks, you ensure that the connections you've cultivated with various online partners remain robust and continue to contribute positively to your site's SEO. With an effective monitoring system in place, you empower your outreach team to quickly identify when previously established backlinks are no longer present on your partners' websites. Promptly noticing these changes allows you to be proactive and engage in constructive dialogue with your partners. You can inquire about the disappearance of the agreed-upon links and work collaboratively to resolve any issues. This proactive approach is both beneficial for the relationship with your partners and crucial for sustaining your website's SEO health. Maintaining existing backlinks is generally more cost-efficient than acquiring new ones, as the process of building new partnerships and securing new links often requires a significant investment of time, effort, and sometimes financial resources. Thus, restoring access to backlinks that have been removed—preserving the value of your already invested resources—is a strategic advantage." ) }
			</DescriptionBox>

			<ModuleViewHeaderBottom />

			<Table
				className="fadeInto"
				initialState={ initialState }
				columns={ columns }
				data={ isSuccess && tableData }
				referrer={ ref }
				loadingRows={ isFetchingNextPage }
			>
				<TooltipSortingFiltering />
			</Table>
			<TableEditorManager slug={ slug } />
		</>
	);
}

const TableEditorManager = memo( ( { slug } ) => {
	const activePanel = useTablePanels( ( state ) => state.activePanel );
	const setRowToEdit = useTablePanels( ( state ) => state.setRowToEdit );

	const rowEditorCells = useMemo( () => ( {
		from_url_name: <InputField liveUpdate autoFocus defaultValue="" label={ header.from_url_name }
										onChange={ ( val ) => {
											setRowToEdit( { from_url_name: val } );
										} } required
											disabled={ activePanel === 'rowEditor' }
										description={ __( 'Enter URL of page where you arranged backlink to your website and you want to monitor it.' ) } />,

		to_url_name: <InputField liveUpdate defaultValue="" label={ header.to_url_name }
									onChange={ ( val ) => {
										setRowToEdit( { to_url_name: val } );
									} }
									required
									disabled={ activePanel === 'rowEditor' }
									description={ __( 'Specify the URL included in the content of the monitored webpage. If you enter just your domain name without specific path, we will check if there is ANY link to your domain.' ) } />,

		note: <TextArea rows="5"
						description={ __( 'Add a note about the monitored backlink. For example, record the contact details of the partner responsible for managing the backlink.' ) }
						liveUpdate defaultValue="" label={ header.note } onChange={ ( val ) => setRowToEdit( { note: val } ) } />,

		labels: <TagsMenu optionItem label={ header.labels } slug={ slug }
						onChange={ ( val ) => setRowToEdit( { labels: val } ) } />,

	} ), [ activePanel, setRowToEdit, slug ] );

	useEffect( () => {
		useTablePanels.setState( () => (
			{
				...useTablePanels.getState(),
				rowEditorCells,
				deleteCSVCols: [ paginationId, 'to_url_id' ],
			}
		) );
	}, [ rowEditorCells ] );
} );
