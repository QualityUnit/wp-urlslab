import { useCallback, useEffect, useMemo } from 'react';
import { __ } from '@wordpress/i18n/';

import {
	useInfiniteFetch,
	SortBy,
	Tooltip,
	TooltipArray,
	SingleSelectMenu,
	Checkbox,
	Loader,
	Table,
	ModuleViewHeaderBottom,
	TooltipSortingFiltering,
	DateTimeFormat,
	TagsMenu,
	Button,
	InputField,
	IconButton,
	SvgIcon,
	RowActionButtons,
} from '../lib/tableImports';

import useTableStore from '../hooks/useTableStore';
import useChangeRow from '../hooks/useChangeRow';
import useTablePanels from '../hooks/useTablePanels';
import { langName } from '../lib/helpers';

import Stack from '@mui/joy/Stack';
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
	A: __( 'Active' ),
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

const visibilityTypes = {
	V: __( 'Visible' ),
	H: __( 'Hidden' ),
};

const header = {
	url_name: __( 'URL' ),
	url_title: __( 'Title' ),
	url_h1: __( 'H1 tag' ),
	url_meta_description: __( 'Description' ),
	url_summary: __( 'Summary' ),
	visibility: __( 'Visibility' ),
	url_priority: __( 'SEO rank' ),
	url_links_count: __( 'Outgoing links count' ),
	url_usage_cnt: __( 'Incoming links count' ),
	url_lang: __( 'Language' ),
	http_status: __( 'HTTP status' ),
	update_http_date: __( 'HTTP status change' ),
	scr_status: __( 'Screenshot status' ),
	update_scr_date: __( 'Screenshot status change' ),
	sum_status: __( 'Summary status' ),
	update_sum_date: __( 'Summary status change' ),

	//SERP stats
	comp_intersections: __( 'Competitors intersection' ),
	best_position: __( 'Best position' ),
	top10_queries_cnt: __( 'Top 10' ),
	top100_queries_cnt: __( 'Top 100' ),
	top_queries: __( 'Top queries' ),
	my_urls_ranked_top10: __( 'My URLs ranked Top 10' ),
	my_urls_ranked_top100: __( 'My URLs ranked Top 100' ),

	labels: __( 'Tags' ),
};
export default function LinkManagerTable( { slug } ) {
	const {
		columnHelper,
		data,
		status,
		isSuccess,
		isFetchingNextPage,
		ref,
	} = useInfiniteFetch( { slug } );

	const { isSelected, selectRows, deleteRow, updateRow } = useChangeRow();

	const activatePanel = useTablePanels( ( state ) => state.activatePanel );
	const setRowToEdit = useTablePanels( ( state ) => state.setRowToEdit );
	const setOptions = useTablePanels( ( state ) => state.setOptions );

	const showChanges = useCallback( ( cell ) => {
		const { http_status, urlslab_scr_timestamp, urlslab_sum_timestamp, scr_status } = cell?.row?.original;
		if ( http_status > 299 || http_status <= 0 || scr_status === 'E' || ! scr_status ) {
			return false;
		}

		return urlslab_scr_timestamp !== 0 || urlslab_sum_timestamp !== 0;
	}, [] );

	const setUnifiedPanel = useCallback( ( cell ) => {
		const origCell = cell?.row.original;
		setOptions( [] );
		setRowToEdit( {} );

		setOptions( [ origCell.url_links_count > 0 &&
				{
					detailsOptions: {
						title: `Outgoing links`, text: `URL: ${ origCell.url_name }`, slug, url: `${ origCell.url_id }/links`, showKeys: [ { name: [ 'dest_url_name', 'Destination URL' ] } ], listId: 'dest_url_id',
					},
				},
		origCell.url_usage_cnt > 0 && {
			detailsOptions: {
				title: `Incoming links`, text: `URL: ${ origCell.url_name }`, slug, url: `${ origCell.url_id }/linked-from`, showKeys: [ { name: [ 'src_url_name', 'Source URL' ] } ], listId: 'src_url_id',
			},
		},
		] );
	}, [ setOptions, setRowToEdit, slug ] );

	const ActionButton = useMemo( () => ( { cell, onClick } ) => {
		const { http_status } = cell?.row?.original;

		return (
			http_status !== '-2' &&
			<Tooltip title={ __( 'Re-check status' ) }>
				<IconButton size="xs" onClick={ () => onClick( '-2' ) }>
					<SvgIcon name="refresh" />
				</IconButton>
			</Tooltip>
		);
	}, [] );

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
			header: ( head ) => <Checkbox defaultValue={ isSelected( head ) } onChange={ ( ) => {
				selectRows( head, true );
			} } />,
		} ),
		columnHelper.accessor( 'url_name', {
			tooltip: ( cell ) => cell.row.original.screenshot_url_thumbnail ? <Box
				component="img"
				src={ cell.row.original.screenshot_url_thumbnail }
				alt="url"
				sx={ {
					// just show image nice with tooltip corners
					borderRadius: 'var(--urlslab-radius-sm)',
					display: 'block',
					marginY: 0.25,
					maxWidth: '15em',
				} }
			/> : cell.getValue(),
			cell: ( cell ) => {
				// eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
				return <a href={ cell.getValue() } target="_blank" rel="noreferrer">{ cell.getValue() }</a>;
			},
			header: ( th ) => <SortBy { ...th } />,
			size: 200,
		} ),
		columnHelper.accessor( 'url_title', {
			tooltip: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 120,
		} ),
		columnHelper.accessor( 'url_h1', {
			tooltip: ( cell ) => cell.getValue(),
			header: header.url_h1,
			size: 120,
		} ),
		columnHelper?.accessor( 'url_meta_description', {
			tooltip: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 120,
		} ),
		columnHelper.accessor( 'url_summary', {
			tooltip: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 200,
		} ),
		columnHelper.accessor( 'visibility', {
			filterValMenu: visibilityTypes,
			className: 'nolimit',
			cell: ( cell ) => <SingleSelectMenu defaultAccept autoClose items={ visibilityTypes } name={ cell.column.id } defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 100,
		} ),
		columnHelper.accessor( 'url_priority', {
			className: 'nolimit',
			cell: ( cell ) => <InputField type="number" defaultValue={ cell.getValue() } min="0" max="100" onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 80,
		} ),
		columnHelper.accessor( 'url_links_count', {
			cell: ( cell ) => (
				<Stack direction="row" alignItems="center" spacing={ 1 }>
					<>
						<span>{ cell?.getValue() }</span>
						{ cell?.getValue() > 0 &&
							<Tooltip title={ __( 'Show URLs where used' ) }>
								<IconButton
									size="xs"
									onClick={ () => {
										setUnifiedPanel( cell );
										activatePanel( 0 );
									} }
								>
									<SvgIcon name="link" />
								</IconButton>
							</Tooltip>
						}
					</>
				</Stack>
			),
			header: ( th ) => <SortBy { ...th } />,
			size: 70,
		} ),
		columnHelper.accessor( 'url_usage_cnt', {
			cell: ( cell ) => (
				<Stack direction="row" alignItems="center" spacing={ 1 }>
					<>
						<span>{ cell?.getValue() }</span>
						{ cell?.getValue() > 0 &&
							<Tooltip title={ __( 'Show URLs where used' ) }>
								<IconButton
									size="xs"
									onClick={ () => {
										setUnifiedPanel( cell );
										activatePanel( 1 );
									} }
								>
									<SvgIcon name="link" />
								</IconButton>
							</Tooltip>
						}
					</>
				</Stack>
			),
			header: ( th ) => <SortBy { ...th } />,
			size: 70,
		} ),
		columnHelper.accessor( 'url_lang', {
			className: 'nolimit',
			tooltip: ( cell ) => cell.getValue(),
			cell: ( cell ) => langName( cell?.getValue() ),
			header: header.url_lang,
			size: 110,
		} ),
		columnHelper?.accessor( 'http_status', {
			filterValMenu: httpStatusTypes,
			cell: ( cell ) => httpStatusTypes[ cell.getValue() ],
			header: ( th ) => <SortBy { ...th } />,
			size: 80,
		} ),
		columnHelper.accessor( 'update_http_date', {
			cell: ( cell ) => <DateTimeFormat datetime={ cell.getValue() } />,
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
			cell: ( cell ) => <DateTimeFormat datetime={ cell.getValue() } />,
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
			cell: ( cell ) => <DateTimeFormat datetime={ cell.getValue() } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 115,
		} ),

		columnHelper.accessor( 'comp_intersections', {
			cell: ( cell ) => <strong>{ cell.getValue() }</strong>,
			header: ( th ) => <SortBy { ...th } />,
			minSize: 50,
		} ),
		columnHelper.accessor( 'best_position', {
			cell: ( cell ) => <strong>{ cell.getValue() }</strong>,
			header: ( th ) => <SortBy { ...th } />,
			minSize: 50,
		} ),
		columnHelper.accessor( 'top10_queries_cnt', {
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			minSize: 50,
		} ),
		columnHelper.accessor( 'top100_queries_cnt', {
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			minSize: 50,
		} ),
		columnHelper.accessor( 'my_urls_ranked_top10', {
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			minSize: 50,
		} ),
		columnHelper.accessor( 'my_urls_ranked_top100', {
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			minSize: 50,
		} ),
		columnHelper.accessor( 'top_queries', {
			tooltip: ( cell ) => <TooltipArray>{ cell.getValue() }</TooltipArray>,
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			minSize: 200,
		} ),

		columnHelper.accessor( 'labels', {
			className: 'nolimit',
			cell: ( cell ) => <TagsMenu defaultValue={ cell.getValue() } slug={ slug } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: header.labels,
			size: 160,
		} ),
		columnHelper.accessor( 'editRow', {
			className: 'editRow',
			cell: ( cell ) => <RowActionButtons
				onDelete={ () => deleteRow( { cell, id: 'url_name' } ) }
			>
				{
					showChanges( cell ) &&
					<Button
						size="xxs"
						onClick={ () => {
							setOptions( { changesPanel: { title: cell.row.original.url_name, slug: `url/${ cell.row.original.url_id }/changes` } } );
							activatePanel( 'changesPanel' );
						} }
						sx={ { mr: 1 } }
					>
						{ __( 'Show changes' ) }
					</Button>
				}
				<ActionButton cell={ cell } onClick={ ( val ) => updateRow( { changeField: 'http_status', newVal: val, cell } ) } />
			</RowActionButtons>,
			header: null,
			size: 0,
		} ),
	], [ activatePanel, columnHelper, deleteRow, isSelected, selectRows, setOptions, setUnifiedPanel, showChanges, slug, updateRow ] );

	if ( status === 'loading' ) {
		return <Loader isFullscreen />;
	}

	return (
		<>
			<DescriptionBox	title={ __( 'About this table' ) } tableSlug={ slug } isMainTableDescription>
				{ __( "The table displays the links found on your website during page generation. A background cron process evaluates these links for their accessibility to your site's visitors upon detection. This plugin offers features such as concealing all links that lead to invalid or non-existent URLs. Additionally, it provides a detailed overview of all internal and external links used on your website." ) }
			</DescriptionBox>
			<ModuleViewHeaderBottom
				noImport
				options={ { perPage: 1000 } }
			/>
			<Table className="fadeInto"
				initialState={ {
					columnVisibility: {
						url_h1: false, url_meta_description: false, url_summary: false, scr_status: false, sum_status: false, update_scr_date: false, update_sum_date: false, best_position: false, top10_queries_cnt: false,
						top100_queries_cnt: false, top_queries: false,
					} } }
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
