import { memo, useEffect, useMemo } from 'react';
import { __ } from '@wordpress/i18n/';

import {
	useInfiniteFetch,
	ProgressBar,
	SortBy,
	InputField,
	Checkbox,
	Loader,
	Table,
	ModuleViewHeaderBottom,
	TooltipSortingFiltering,
	RowActionButtons,
} from '../lib/tableImports';

import useChangeRow from '../hooks/useChangeRow';
import useTableStore from '../hooks/useTableStore';
import useTablePanels from '../hooks/useTablePanels';
import DescriptionBox from '../elements/DescriptionBox';

const title = __( 'Add New FAQ to URL' );
const paginationId = 'faq_id';
const optionalSelector = 'url_id';

const defaultSorting = [ { key: 'url_name', dir: 'ASC', op: '>' }, { key: 'sorting', dir: 'ASC', op: '>' } ];

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
		hasNextPage,
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
			header: ( th ) => <SortBy { ...th } defaultSorting={ defaultSorting } />,
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
			header: ( th ) => <SortBy { ...th } />,
			size: 80,
		} ),
		columnHelper.accessor( 'editRow', {
			className: 'editRow',
			cell: ( cell ) => <RowActionButtons
				onEdit={ () => updateRow( { cell, optionalSelector, id: 'faq_id' } ) }
				onDelete={ () => deleteRow( { cell, optionalSelector, id: 'faq_id' } ) }
			>
			</RowActionButtons>,
			header: null,
			size: 0,
		} ),
	], [ columnHelper, deleteRow, selectRows, updateRow ] );

	if ( status === 'loading' ) {
		return <Loader isFullscreen />;
	}

	return (
		<>
			<DescriptionBox	title={ __( 'About this table' ) } tableSlug={ slug } isMainTableDescription>
				{ __( "The table displays the assignment of FAQs to specific URLs. After assigning an FAQ to a URL, it can be showcased on the page either as a widget through a custom shortcode or by adding it to a post type under the Settings tab. Although it's possible to display one FAQ on several URLs, we recommend assigning each FAQ to only a single URL to avoid duplications, which Google could interpret as duplicate content." ) }
			</DescriptionBox>
			<ModuleViewHeaderBottom />
			<Table className="fadeInto"
				initialState={ { columnVisibility: { sorting: true, faq_id: false, url_name: true, question: true } } }
				columns={ columns }
				data={ isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] ) }
				defaultSorting={ defaultSorting }
				referer={ ref }
			>
				<TooltipSortingFiltering />
				<>
					{ isFetchingNextPage ? '' : hasNextPage }
					<ProgressBar className="infiniteScroll" value={ ! isFetchingNextPage ? 0 : 100 } />
				</>
			</Table>
			<TableEditorManager />
		</>
	);
}

const TableEditorManager = memo( () => {
	const setRowToEdit = useTablePanels( ( state ) => state.setRowToEdit );

	const rowEditorCells = useMemo( () => ( {
		url_name: <InputField liveUpdate type="url" defaultValue="" label={ header.url_name } onChange={ ( val ) => setRowToEdit( { url_name: val } ) } required />,
		faq_id: <InputField liveUpdate defaultValue="" type="number" label={ header.faq_id } onChange={ ( val ) => setRowToEdit( { faq_id: val } ) } required />,
		sorting: <InputField liveUpdate type="number" defaultValue="10" label={ header.sorting } min="0" max="100"
			description={ __( 'Position of the FAQ in the list (Number 0 - 100).' ) }
			onChange={ ( val ) => setRowToEdit( { sorting: val } ) } />,
	} ), [ setRowToEdit ] );

	useEffect( () => {
		useTablePanels.setState( () => (
			{
				...useTablePanels.getState(),
				rowEditorCells,
			}
		) );
	}, [ rowEditorCells ] );
} );
