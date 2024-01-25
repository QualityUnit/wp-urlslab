import { useEffect, useMemo } from 'react';
import { __ } from '@wordpress/i18n/';

import {
	useInfiniteFetch,
	SortBy,
	InputField,
	Checkbox,
	Loader,
	Table,
	ModuleViewHeaderBottom,
	TooltipSortingFiltering,
	RowActionButtons, Tooltip, IconButton, SvgIcon,
} from '../lib/tableImports';

import useChangeRow from '../hooks/useChangeRow';
import useTableStore from '../hooks/useTableStore';
import DescriptionBox from '../elements/DescriptionBox';
import { TableEditorManager } from './FaqsTable';

const title = __( 'Add New FAQ to URL' );
const paginationId = 'faq_id';
const optionalSelector = 'url_id';

const defaultSorting = [ { key: 'sorting', dir: 'ASC', op: '>' } ];

const header = {
	url_name: __( 'URL' ),
	faq_id: __( 'Question ID' ),
	question: __( 'Question' ),
	sorting: __( 'Position' ),
};

export default function FaqUrlsTable( { slug } ) {
	const {
		columnHelper,
		data,
		status,
		isSuccess,
		isFetchingNextPage,
		ref,
	} = useInfiniteFetch( { slug, defaultSorting } );

	const { isSelected, selectRows, deleteRow, updateRow } = useChangeRow( { defaultSorting } );

	useEffect( () => {
		useTableStore.setState( () => (
			{
				activeTable: slug,
				tables: {
					...useTableStore.getState().tables,
					[ slug ]: {
						...useTableStore.getState().tables[ slug ],
						title,
						paginationId,
						optionalSelector,
						slug,
						header,
						id: 'faq_id',
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
		columnHelper.accessor( 'url_name', {
			className: 'nolimit',
			cell: ( cell ) => <a href={ cell.getValue() } target="_blank" rel="noreferrer">{ cell.getValue() }</a>,
			header: ( th ) => <SortBy { ...th } />,
			size: 200,
		} ),
		columnHelper.accessor( 'faq_id', {
			className: 'nolimit',
			header: ( th ) => <SortBy { ...th } />,
			size: 20,
		} ),
		columnHelper.accessor( 'question', {
			className: 'nolimit',
			header: ( th ) => <SortBy { ...th } />,
			size: 200,
		} ),
		columnHelper.accessor( 'sorting', {
			className: 'nolimit',
			cell: ( cell ) => <InputField type="number" defaultValue={ cell.getValue() } min="0" max="100"
				onChange={ ( newVal ) => updateRow( { newVal, cell, optionalSelector } ) } />,
			header: ( th ) => <SortBy { ...th } defaultSorting={ defaultSorting } />,
			size: 80,
		} ),
		columnHelper.accessor( 'editRow', {
			className: 'editRow',
			cell: ( cell ) => <RowActionButtons
				editOtherTable
				onEdit={ () => updateRow( { otherTableSlug: 'faq', id: 'faq_id', fieldVal: cell.row.original.faq_id } ) }
				onDelete={ () => deleteRow( { cell, optionalSelector, id: 'faq_id' } ) }
			>
				{
					cell.row.original.edit_url_name?.length > 0 &&
					<Tooltip title={ __( 'Edit Post' ) } arrow placement="bottom">
						<IconButton size="xs" component="a" href={ cell.row.original.edit_url_name } target="_blank">
							<SvgIcon name="edit-post" />
						</IconButton>
					</Tooltip>
				}
			</RowActionButtons>,
			header: null,
			size: 0,
		} ),
	], [ columnHelper, deleteRow, isSelected, selectRows, updateRow ] );

	if ( status === 'loading' ) {
		return <Loader isFullscreen />;
	}

	return (
		<>
			<DescriptionBox	title={ __( 'About this table' ) } tableSlug={ slug } isMainTableDescription>
				{ __( "The table displays the assignment of FAQs to specific URLs. After assigning an FAQ to a URL, it can be showcased on the page either as a widget through a custom shortcode or by adding it to a post type under the Settings tab. Although it's possible to display one FAQ on several URLs, we recommend assigning each FAQ to only a single URL to avoid duplications, which Google could interpret as duplicate content." ) }
			</DescriptionBox>
			<ModuleViewHeaderBottom noInsert />
			<Table className="fadeInto"
				initialState={ { columnVisibility: { sorting: true, faq_id: false, url_name: true, question: true } } }
				columns={ columns }
				data={ isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] ) }
				defaultSorting={ defaultSorting }
				referrer={ ref }
				loadingRows={ isFetchingNextPage }
			>
				<TooltipSortingFiltering />
			</Table>
			<TableEditorManager slug="faq" />
		</>
	);
}
