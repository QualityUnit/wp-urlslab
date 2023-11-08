import { memo, useEffect, useMemo, useState } from 'react';
import { __ } from '@wordpress/i18n/';

import {
	useInfiniteFetch, SortBy, Checkbox, Loader, Table, ModuleViewHeaderBottom, TooltipSortingFiltering, InputField, DateTimeFormat, TagsMenu, RowActionButtons, TextArea,
} from '../lib/tableImports';

import useTableStore from '../hooks/useTableStore';
import useChangeRow from '../hooks/useChangeRow';
import useTablePanels from '../hooks/useTablePanels';
import Box from '@mui/joy/Box';
import DescriptionBox from '../elements/DescriptionBox';

const paginationId = 'url_id';
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
	update_http_date: __( 'HTTP status change' ),
	scr_status: __( 'Screenshot status' ),
	update_scr_date: __( 'Screenshot status change' ),
	sum_status: __( 'Summary status' ),
	update_sum_date: __( 'Summary status change' ),
	rel_schedule: __( 'Schedule' ),
	labels: __( 'Tags' ),
};

export default function MetaTagsManagerTable( { slug } ) {
	const {
		columnHelper,
		data,
		status,
		isSuccess,
		isFetchingNextPage,
		ref,
	} = useInfiniteFetch( { slug } );

	const { isSelected, selectRows, deleteRow, updateRow } = useChangeRow();

	useEffect( () => {
		useTableStore.setState( () => (
			{
				activeTable: slug,
				tables: {
					...useTableStore.getState().tables,
					[ slug ]: {
						paginationId,
						slug,
						header,
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
			className: 'checkbox',
			cell: ( cell ) => <Checkbox defaultValue={ isSelected( cell ) } onChange={ () => {
				selectRows( cell );
			} } />,
			header: ( head ) => <Checkbox defaultValue={ isSelected( head, true ) } onChange={ ( ) => {
				selectRows( head, true );
			} } />,
		} ),
		columnHelper.accessor( 'url_name', {
			tooltip: ( cell ) => {
				const TooltipContent = () => {
					const [ imageLoaded, setImageLoaded ] = useState( false );
					const regex = /(jpeg|jpg|webp|gif|png|svg)/g;
					const isImage = cell.getValue().search( regex );

					let image = '';
					if ( isImage !== -1 ) {
						image = cell.getValue();
					} else if ( cell.row.original.screenshot_url_thumbnail ) {
						image = cell.row.original.screenshot_url_thumbnail;
					}

					if ( image ) {
						return <>
							<Box sx={ { display: imageLoaded ? 'none' : 'block' } }>{ image }</Box>
							<Box
								component="img"
								src={ image }
								alt="url"
								onLoad={ () => setImageLoaded( true ) }
								sx={ {
									// just show image nice with tooltip corners
									borderRadius: 'var(--urlslab-radius-sm)',
									display: imageLoaded ? 'block' : 'none',
									marginY: 0.25,
									maxWidth: '15em',
								} }
							/>
						</>;
					}
					return cell.getValue();
				};

				return <TooltipContent />;
			},
			cell: ( cell ) => <a href={ cell.getValue() } title={ cell.getValue() } target="_blank" rel="noreferrer">{ cell.getValue() }</a>,
			header: ( th ) => <SortBy { ...th } />,
			size: 200,
		} ),
		columnHelper.accessor( 'url_title', {
			tooltip: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 150,
		} ),
		columnHelper?.accessor( 'url_meta_description', {
			tooltip: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 150,
		} ),
		columnHelper.accessor( 'url_summary', {
			tooltip: ( cell ) => cell.getValue(),
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
			cell: ( cell ) => <RowActionButtons
				onEdit={ () => updateRow( { cell, id: 'url_name' } ) }
				onDelete={ () => deleteRow( { cell, id: 'url_name' } ) }
			>
			</RowActionButtons>,
			header: null,
		} ),
	], [ columnHelper, deleteRow, selectRows, slug, updateRow ] );

	if ( status === 'loading' ) {
		return <Loader isFullscreen />;
	}

	return (
		<>
			<DescriptionBox	title={ __( 'About this table' ) } tableSlug={ slug } isMainTableDescription>
				{ __( 'The table provides a list of internal links or pages, which allow you to edit the Title, Description, and Summary. This data is used as HTML meta tags. The Summaries are implemented as title attributes for the corresponding URLs in links. The values of the Title and Description are derived from a background process of page crawling. The Summary is a paid feature offered through the URLsLab Service, using AI to summarize the contents of the page.' ) }
			</DescriptionBox>
			<ModuleViewHeaderBottom
				noImport
				options={ {
					perPage: 1000,
				} }
			/>
			<Table className="fadeInto"
				initialState={ { columnVisibility: { http_status: false, update_http_date: false, update_scr_date: false, update_sum_date: false } } }
				columns={ columns }
				data={ isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] ) }
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
	const setRowToEdit = useTablePanels( ( state ) => state.setRowToEdit );

	const rowEditorCells = useMemo( () => ( {
		url_title: <InputField defaultValue="" label={ header.url_title } onChange={ ( val ) => setRowToEdit( { url_title: val } ) } />,

		url_meta_description: <TextArea rows="5" description=""
			liveUpdate defaultValue="" label={ header.url_meta_description } onChange={ ( val ) => setRowToEdit( { url_meta_description: val } ) } />,

		url_summary: <TextArea rows="5" description=""
			liveUpdate defaultValue="" label={ header.url_summary } onChange={ ( val ) => setRowToEdit( { url_summary: val } ) } />,

		labels: <TagsMenu optionItem label={ __( 'Tags:' ) } slug={ slug } onChange={ ( val ) => setRowToEdit( { labels: val } ) } />,

	} ), [ setRowToEdit, slug ] );

	useEffect( () => {
		useTablePanels.setState( ( ) => (
			{
				...useTablePanels.getState(),
				rowEditorCells,
				deleteCSVCols: [ 'urlslab_url_id', 'url_id', 'urlslab_domain_id' ],
			}
		) );
	}, [ rowEditorCells ] );
} );
