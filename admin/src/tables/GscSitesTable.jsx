/* eslint-disable indent */
import { useEffect } from 'react';
import { useI18n } from '@wordpress/react-i18n';
import {
	useInfiniteFetch,
	ProgressBar,
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

export default function GscSitesTable( { slug } ) {
	const { __ } = useI18n();
	const title = __( 'Add Domains' );
	const paginationId = 'site_id';

	const {
		columnHelper,
		data,
		status,
		isSuccess,
		isFetchingNextPage,
		hasNextPage,
		ref,
	} = useInfiniteFetch( { slug } );

	const { updateRow } = useChangeRow();

	const header = {
		site_name: __( 'Google Search Console Site' ),
		date_to: __( 'Import date' ),
		updated: __( 'Last import' ),
		row_offset: __( 'Last position' ),
		importing: __( 'Active import' ),
	};

	useEffect( () => {
		useTablePanels.setState( () => (
			{
				rowEditorCells: {},
				deleteCSVCols: [ paginationId, 'domain_id' ],
			}
		) );
		useTableStore.setState( () => (
			{
				activeTable: slug,
				tables: {
					...useTableStore.getState().tables,
					[ slug ]: {
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

	// Saving all variables into state managers
	useEffect( () => {
		useTableStore.setState( () => (
			{
				tables: { ...useTableStore.getState().tables, [ slug ]: { ...useTableStore.getState().tables[ slug ], data } },
			}
		) );
	}, [ data, slug ] );

	const columns = [
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

	];

	if ( status === 'loading' ) {
		return <Loader isFullscreen />;
	}

	return (
		<>
			<DescriptionBox	title={ __( 'About this table' ) } isMainTableDescription>
				{ __( 'After linking your Google Search Console to your account at www.urlslab.com, a list of Google Search Console properties will be visible in this table. You have the option to independently enable query imports for each property. Only import properties that are relevant to your current Wordpress installation. Domains from Google Search Console are stored in your local Wordpress database. We aim to only update the list of properties every 15 minutes when you refresh this table.' ) }
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
				referer={ ref }
			>
				<TooltipSortingFiltering />
				<>
					{ isFetchingNextPage ? '' : hasNextPage }
					<ProgressBar className="infiniteScroll" value={ ! isFetchingNextPage ? 0 : 100 } />
				</>
			</Table>
		</>
	);
}
