import { useEffect, useMemo, useState } from 'react';
import { __ } from '@wordpress/i18n/';

import {
	useInfiniteFetch,
	SortBy,
	InputField,
	Loader,
	Table,
	ModuleViewHeaderBottom,
	TooltipSortingFiltering,
	RowActionButtons, Tooltip, IconButton, SvgIcon, TableSelectCheckbox,
} from '../lib/tableImports';

import useChangeRow from '../hooks/useChangeRow';
import useTableStore from '../hooks/useTableStore';
import DescriptionBox from '../elements/DescriptionBox';
import { TableEditorManager } from './FaqsTable';

const title = __( 'Add New FAQ to URL' , 'wp-urlslab' );
const paginationId = 'faq_id';
const optionalSelector = 'url_id';
const defaultSorting = [ { key: 'sorting', dir: 'ASC', op: '>' } ];
const header = {
	url_name: __( 'URL' , 'wp-urlslab' ),
	faq_id: __( 'Question ID' , 'wp-urlslab' ),
	question: __( 'Question' , 'wp-urlslab' ),
	sorting: __( 'Position' , 'wp-urlslab' ),
};
const initialState = { columnVisibility: { sorting: true, faq_id: false, url_name: true, question: true } };

// init table state with fixed states which we do not need to update anymore during table lifecycle
export default function TableInit( { slug } ) {
	const setTable = useTableStore( ( state ) => state.setTable );
	const [ init, setInit ] = useState( false );
	useEffect( () => {
		setInit( true );
		setTable( slug, {
			title,
			paginationId,
			optionalSelector,
			slug,
			header,
			id: 'faq_id',
			sorting: defaultSorting,
		} );
	}, [ setTable, slug ] );

	return init && <FaqUrlsTable slug={ slug } />;
}

function FaqUrlsTable( { slug } ) {
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

	const { deleteRow, updateRow } = useChangeRow();

	const columns = useMemo( () => [
		columnHelper.accessor( 'check', {
			className: 'nolimit checkbox',
			cell: ( cell ) => <TableSelectCheckbox tableElement={ cell } />,
			header: ( head ) => <TableSelectCheckbox tableElement={ head } />,
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
			cell: ( cell ) => <InputField type="number" value={ cell.getValue() } min="0" max="100" onChange={ ( newVal ) => updateRow( { newVal, cell, optionalSelector } ) } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 80,
		} ),
		columnHelper.accessor( 'editRow', {
			className: 'editRow',
			cell: ( cell ) => <RowActionButtons
				editOtherTable
				onEdit={ () => updateRow( { otherTableSlug: 'faq', id: 'faq_id', fieldVal: cell.row.original.faq_id } ) }
				onDelete={ () => deleteRow( { cell, optionalSelector, id: 'faq_id' } ) }
			>
				{ cell.row.original.edit_url_name?.length > 0 &&
					<Tooltip title={ __( 'Edit Post' , 'wp-urlslab' ) } arrow placement="bottom">
						<IconButton size="xs" component="a" href={ cell.row.original.edit_url_name } target="_blank">
							<SvgIcon name="edit-post" />
						</IconButton>
					</Tooltip>
				}
			</RowActionButtons>,
			header: null,
			size: 0,
		} ),
	], [ columnHelper, deleteRow, updateRow ] );

	useEffect( () => {
		setTable( slug, { data } );
	}, [ data, setTable, slug ] );

	if ( isLoading ) {
		return <Loader isFullscreen />;
	}

	return (
		<>
			<DescriptionBox	title={ __( 'About this table' , 'wp-urlslab' ) } tableSlug={ slug } isMainTableDescription>
				{ __( "The table displays the assignment of FAQs to specific URLs. After assigning an FAQ to a URL, it can be showcased on the page either as a widget through a custom shortcode or by adding it to a post type under the Settings tab. Although it's possible to display one FAQ on several URLs, we recommend assigning each FAQ to only a single URL to avoid duplications, which Google could interpret as duplicate content." , 'wp-urlslab' ) }
			</DescriptionBox>

			<ModuleViewHeaderBottom noInsert />

			<Table className="fadeInto"
				initialState={ initialState }
				columns={ columns }
				data={ isSuccess && tableData }
				referrer={ ref }
				loadingRows={ isFetchingNextPage }
			>
				<TooltipSortingFiltering />
			</Table>

			<TableEditorManager slug="faq" />
		</>
	);
}
