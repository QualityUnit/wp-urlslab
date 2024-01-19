/* eslint-disable indent */
import { memo, useEffect, useMemo } from 'react';
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

const title = __( 'Add Domains' );
const paginationId = 'site_id';

const header = {
	site_name: __( 'Google Search Console Site' ),
	date_to: __( 'Import date' ),
	updated: __( 'Last import' ),
	row_offset: __( 'Last position' ),
	importing: __( 'Active import' ),
};

export default function GscSitesTable( { slug } ) {
	const {
		columnHelper,
		data,
		status,
		isSuccess,
		isFetchingNextPage,
		ref,
	} = useInfiniteFetch( { slug } );

	const { updateRow } = useChangeRow();

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
						slug,
						header,
						id: 'domain_name',
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
			cell: ( cell ) => <Checkbox defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 30,
		} ),

	], [ columnHelper, updateRow ] );

	if ( status === 'loading' ) {
		return <Loader isFullscreen />;
	}

	return (
		<>
			<DescriptionBox	title={ __( 'About this table' ) } tableSlug={ slug } isMainTableDescription>
				{ __( 'After linking your Google Search Console to your account at www.urlslab.com, a list of Google Search Console properties will become visible in this table. You have the option to enable query imports for each property independently. Only import properties that are relevant to your current website. Domains from Google Search Console are stored in your local WordPress database. Our goal is to update the list of properties only every 15 minutes when you refresh this table.' ) }
			</DescriptionBox>
			<ModuleViewHeaderBottom
				noDelete
				noInsert
				noImport
			/>
			<Table className="fadeInto"
				columns={ columns }
				initialState={ { columnVisibility: { row_offset: false, date_to: false } } }
				data={ isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] ) }
				disableAddNewTableRecord
				referrer={ ref }
				loadingRows={ isFetchingNextPage }
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
