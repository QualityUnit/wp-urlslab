import { memo, useEffect, useMemo, useState } from 'react';
import { __ } from '@wordpress/i18n';
import {
	useInfiniteFetch,
	SortBy,
	Loader,
	Table,
	ModuleViewHeaderBottom,
	TooltipSortingFiltering,
	Checkbox,
	DateTimeFormat,
} from '../lib/tableImports';

import useTableStore from '../hooks/useTableStore';
import useChangeRow from '../hooks/useChangeRow';
import useTablePanels from '../hooks/useTablePanels';
import DescriptionBox from '../elements/DescriptionBox';

const title = __( 'Add Domains' , 'wp-urlslab' );
const paginationId = 'site_id';
const header = {
	site_name: __( 'Google Search Console Site' , 'wp-urlslab' ),
	date_to: __( 'Import date' , 'wp-urlslab' ),
	updated: __( 'Last import' , 'wp-urlslab' ),
	row_offset: __( 'Last position' , 'wp-urlslab' ),
	importing: __( 'Active import' , 'wp-urlslab' ),
};
const initialState = { columnVisibility: { row_offset: false, date_to: false } };

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
			id: 'domain_name',
		} );
	}, [ setTable, slug ] );

	return init && <GscSitesTable slug={ slug } />;
}

function GscSitesTable( { slug } ) {
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

	const { updateRow } = useChangeRow();

	const columns = useMemo( () => [
		columnHelper.accessor( 'site_name', {
			tooltip: ( cell ) => cell.getValue(),
			cell: ( cell ) => {
				// eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
				return <a href={ cell.getValue() } target="_blank" rel="noreferrer">{ cell.getValue() }</a>;
			},
			header: ( th ) => <SortBy { ...th } />,
			minSize: 200,
		} ),

		columnHelper.accessor( 'date_to', {
			tooltip: ( cell ) => cell.getValue(),
			cell: ( cell ) => <strong><DateTimeFormat datetime={ cell.getValue() } noTime /></strong>,
			header: ( th ) => <SortBy { ...th } />,
			minSize: 50,
		} ),

		columnHelper.accessor( 'updated', {
			tooltip: ( cell ) => cell.getValue(),
			cell: ( cell ) => <DateTimeFormat datetime={ cell.getValue() } />,
			header: ( th ) => <SortBy { ...th } />,
			minSize: 50,
		} ),

		columnHelper.accessor( 'row_offset', {
			tooltip: ( cell ) => cell.getValue(),
			cell: ( cell ) => <strong>{ cell.getValue() }</strong>,
			header: ( th ) => <SortBy { ...th } />,
			minSize: 50,
		} ),
		columnHelper.accessor( 'importing', {
			className: 'nolimit',
			cell: ( cell ) => <Checkbox value={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 30,
		} ),

	], [ columnHelper, updateRow ] );

	useEffect( () => {
		setTable( slug, { data } );
	}, [ data, setTable, slug ] );

	if ( isLoading ) {
		return <Loader isFullscreen />;
	}

	return (
		<>
			<DescriptionBox	title={ __( 'About this table' , 'wp-urlslab' ) } tableSlug={ slug } isMainTableDescription>
				{ __( 'After linking your Google Search Console to your account at www.urlslab.com, a list of Google Search Console properties will become visible in this table. You have the option to enable query imports for each property independently. Only import properties that are relevant to your current website. Domains from Google Search Console are stored in your local WordPress database. Our goal is to update the list of properties only every 15 minutes when you refresh this table.' , 'wp-urlslab' ) }
			</DescriptionBox>

			<ModuleViewHeaderBottom noDelete noInsert noImport />

			<Table
				className="fadeInto"
				columns={ columns }
				initialState={ initialState }
				data={ isSuccess && tableData }
				referrer={ ref }
				loadingRows={ isFetchingNextPage }
				disableAddNewTableRecord
			>
				<TooltipSortingFiltering />
			</Table>

			<TableEditorManager />
		</>
	);
}

const TableEditorManager = memo( () => {
	useEffect( () => {
		useTablePanels.setState( () => (
			{
				rowEditorCells: {},
				deleteCSVCols: [ paginationId, 'domain_id' ],
			}
		) );
	}, [] );
} );
