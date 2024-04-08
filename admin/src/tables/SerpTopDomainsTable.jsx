import { memo, useEffect, useMemo, useState } from 'react';
import { __ } from '@wordpress/i18n';

import {
	useInfiniteFetch,
	SortBy,
	Loader,
	Table,
	ModuleViewHeaderBottom,
	TooltipSortingFiltering,
	SingleSelectMenu, TextArea, Button, Stack,
} from '../lib/tableImports';

import useTableStore from '../hooks/useTableStore';
import useChangeRow from '../hooks/useChangeRow';
import useTablePanels from '../hooks/useTablePanels';
import DescriptionBox from '../elements/DescriptionBox';
import { domainTypes } from '../lib/serpUrlColumns';

const title = __( 'Add Domains' , 'wp-urlslab' );
const paginationId = 'domain_id';

const defaultSorting = [ { key: 'top_100_cnt', dir: 'DESC', op: '<' } ];

const newDomainTypes = {
	M: __( 'My Domain' , 'wp-urlslab' ),
	C: __( 'Competitor' , 'wp-urlslab' ),
};

const header = {
	domain_name: __( 'Domain' , 'wp-urlslab' ),
	domain_type: __( 'Type' , 'wp-urlslab' ),
	top_100_cnt: __( 'Queries' , 'wp-urlslab' ),
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
			id: 'domain_name',
			sorting: defaultSorting,
		} );
	}, [ setTable, slug ] );

	return init && <SerpTopDomainsTable slug={ slug } />;
}

function SerpTopDomainsTable( { slug } ) {
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
		columnHelper.accessor( 'domain_name', {
			tooltip: ( cell ) => cell.getValue(),
			cell: ( cell ) => <a href={ cell.getValue() } target="_blank" rel="noreferrer"><strong>{ cell.getValue() }</strong></a>,
			header: ( th ) => <SortBy { ...th } />,
			minSize: 300,
		} ),

		columnHelper.accessor( 'domain_type', {
			filterValMenu: domainTypes,
			cell: ( cell ) => (
				<Stack direction="row" flexWrap="wrap" spacing={ 0.5 } >
					{
						Object.entries( domainTypes ).map( ( [ domainKey, domainName ] ) => {
							const selected = cell.getValue() === domainKey;
							return (
								domainKey !== 'X'
									? <Button
										key={ domainKey }
										size="xs"
										variant="outlined"
										color="neutral"
										sx={ { ...( ! selected && { opacity: 0.5 } ) } }
										onClick={ () => {
											if ( ! selected ) {
												updateRow( { newVal: domainKey, cell } );
											}
										} }
									>
										{ domainName }
									</Button>
									: null
							);
						} )
					}
				</Stack>
			),
			header: ( th ) => <SortBy { ...th } />,
			size: 300,
		} ),

		columnHelper.accessor( 'top_100_cnt', {
			tooltip: ( cell ) => cell.getValue(),
			cell: ( cell ) => <strong>{ cell.getValue() }</strong>,
			header: ( th ) => <SortBy { ...th } />,
			minSize: 50,
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
				{ __( "The table presents a compilation of domains discovered during the SERP data processing or those manually created. The report organizes these domains according to the number of intersections they have with other similar domains for specific SERP queries. A domain with more intersections indicates that it holds more relevance to your business-centric keywords, making it a significant competitor in your business niche. In this report, you need to classify these domains to pinpoint your direct competitors as well as your own domains. Such classification improves the precision of other reports within this module. Some reports may even withhold data until this categorization is complete. Identifying your own domains along with your primary competitor's domains should be a priority during the configuration of this module." , 'wp-urlslab' ) }
			</DescriptionBox>

			<ModuleViewHeaderBottom noDelete />

			<Table
				className="fadeInto"
				columns={ columns }
				data={ isSuccess && tableData }
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
	const setRowToEdit = useTablePanels( ( state ) => state.setRowToEdit );

	const rowEditorCells = useMemo( () => ( {
		domain_name: <TextArea autoFocus liveUpdate defaultValue="" label={ __( 'Domains' , 'wp-urlslab' ) } rows={ 10 } allowResize onChange={ ( val ) => setRowToEdit( { domain_name: val } ) } required description={ __( 'Each domain name must be on a separate line' , 'wp-urlslab' ) } />,
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
