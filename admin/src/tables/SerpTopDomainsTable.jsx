import { memo, useEffect, useMemo } from 'react';
import { __ } from '@wordpress/i18n';

import {
	useInfiniteFetch,
	ProgressBar,
	SortBy,
	Loader,
	Table,
	ModuleViewHeaderBottom,
	TooltipSortingFiltering,
	SingleSelectMenu, TextArea,
} from '../lib/tableImports';

import useTableStore from '../hooks/useTableStore';
import useChangeRow from '../hooks/useChangeRow';
import useTablePanels from '../hooks/useTablePanels';
import DescriptionBox from '../elements/DescriptionBox';

const title = __( 'Add Domains' );
const paginationId = 'domain_id';

const defaultSorting = [ { key: 'top_100_cnt', dir: 'DESC', op: '<' } ];

const domainTypes = {
	X: __( 'Uncategorized' ),
	M: __( 'My Domain' ),
	C: __( 'Competitor' ),
	I: __( 'Ignored' ),
};
const newDomainTypes = {
	M: __( 'My Domain' ),
	C: __( 'Competitor' ),
};

const header = {
	domain_name: __( 'Domain' ),
	domain_type: __( 'Type' ),
	top_100_cnt: __( 'Queries' ),
};

export default function SerpTopDomainsTable( { slug } ) {
	const {
		columnHelper,
		data,
		status,
		isSuccess,
		isFetchingNextPage,
		hasNextPage,
		ref,
	} = useInfiniteFetch( { slug, defaultSorting } );

	const { updateRow } = useChangeRow( { defaultSorting } );

	useEffect( () => {
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
		columnHelper.accessor( 'domain_name', {
			tooltip: ( cell ) => cell.getValue(),
			cell: ( cell ) => <a href={ cell.getValue() } target="_blank" rel="noreferrer"><strong>{ cell.getValue() }</strong></a>,
			header: ( th ) => <SortBy { ...th } />,
			minSize: 200,
		} ),

		columnHelper.accessor( 'domain_type', {
			filterValMenu: domainTypes,
			className: 'nolimit',
			cell: ( cell ) => <SingleSelectMenu autoClose items={ domainTypes } name={ cell.column.id } defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 80,
		} ),

		columnHelper.accessor( 'top_100_cnt', {
			tooltip: ( cell ) => cell.getValue(),
			cell: ( cell ) => <strong>{ cell.getValue() }</strong>,
			header: ( th ) => <SortBy { ...th } defaultSorting={ defaultSorting } />,
			minSize: 50,
		} ),
	], [ columnHelper, updateRow ] );

	if ( status === 'loading' ) {
		return <Loader isFullscreen />;
	}

	return (
		<>
			<DescriptionBox	title={ __( 'About this table' ) } tableSlug={ slug } isMainTableDescription>
				{ __( "The table presents a compilation of domains discovered during the SERP data processing or those manually created. The report organizes these domains according to the number of intersections they have with other similar domains for specific SERP queries. A domain with more intersections indicates that it holds more relevance to your business-centric keywords, making it a significant competitor in your business niche. In this report, you need to classify these domains to pinpoint your direct competitors as well as your own domains. Such classification improves the precision of other reports within this module. Some reports may even withhold data until this categorization is complete. Identifying your own domains along with your primary competitor's domains should be a priority during the configuration of this module." ) }
			</DescriptionBox>
			<ModuleViewHeaderBottom noDelete />
			<Table className="fadeInto"
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
		domain_name: <TextArea autoFocus liveUpdate defaultValue="" label={ __( 'Domains' ) } rows={ 10 } allowResize onChange={ ( val ) => setRowToEdit( { domain_name: val } ) } required description={ __( 'Each domain name must be on a separate line' ) } />,
		domain_type: <SingleSelectMenu defaultAccept autoClose items={ newDomainTypes } name="domain_type" defaultValue="M" onChange={ ( val ) => setRowToEdit( { domain_type: val } ) }>{ header.domain_type }</SingleSelectMenu>,
	} ), [ setRowToEdit ] );

	useEffect( () => {
		useTablePanels.setState( ( ) => (
			{
				...useTablePanels.getState(),
				rowEditorCells,
				deleteCSVCols: [ paginationId, 'domain_id' ],
			}
		) );
	}, [ rowEditorCells ] );
} );
