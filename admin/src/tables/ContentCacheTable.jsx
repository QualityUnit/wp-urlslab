import { useEffect, useMemo, useState } from 'react';
import { __ } from '@wordpress/i18n/';
import {
	useInfiniteFetch, SortBy, Loader, Table, ModuleViewHeaderBottom, TooltipSortingFiltering, DateTimeFormat,
} from '../lib/tableImports';
import useTableStore from '../hooks/useTableStore';

import DescriptionBox from '../elements/DescriptionBox';

const paginationId = 'cache_crc32';

const header = {
	cache_content: __( 'Cache content' ),
	cache_len: __( 'Cache size' ),
	date_changed: __( 'Last change' ),
};

// init table state with fixed states which we do not need to update anymore during table lifecycle
export default function TableInit( { slug } ) {
	const setTable = useTableStore( ( state ) => state.setTable );
	const [ init, setInit ] = useState( false );
	useEffect( () => {
		setInit( true );
		setTable( slug, {
			paginationId,
			slug,
			header,
		} );
	}, [ setTable, slug ] );

	return init && <ContentCacheTable slug={ slug } />;
}

function ContentCacheTable( { slug } ) {
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

	const columns = useMemo( () => [
		columnHelper.accessor( 'cache_content', {
			tooltip: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 300,
		} ),
		columnHelper.accessor( 'cache_len', {
			cell: ( cell ) => `${ Math.round( cell.getValue() / 1024, 0 ) }\u00A0kB`,
			header: ( th ) => <SortBy { ...th } />,
			size: 80,
		} ),
		columnHelper.accessor( 'date_changed', {
			cell: ( val ) => <DateTimeFormat datetime={ val.getValue() } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 115,
		} ),
	], [ columnHelper ] );

	useEffect( () => {
		setTable( slug, { data } );
	}, [ data, setTable, slug ] );

	if ( isLoading ) {
		return <Loader isFullscreen />;
	}

	return (
		<>
			<DescriptionBox	title={ __( 'About this table' ) } tableSlug={ slug } isMainTableDescription>
				{ __( 'You can use the Content Lazy Loading feature by enabling it in the Settings tab. The portions of your webpage that will be lazy-loaded are determined by the class name, which is also set in the Settings tab. When the Lazy Loading option for HTML is activated, the plugin captures the HTML during the page creation process and stores the lazy-loaded section in a database table. This table displays a list of HTML elements from your webpage that are lazy-loaded. When a visitor scrolls to a lazy-loaded element on the page, the element is subsequently loaded from this table in the background and then displayed in the browser. Each cached HTML segment can be accessed via a unique URL.' ) }
			</DescriptionBox>

			<ModuleViewHeaderBottom />

			<Table
				className="fadeInto"
				columns={ columns }
				data={ isSuccess && tableData }
				referrer={ ref }
				loadingRows={ isFetchingNextPage }
			>
				<TooltipSortingFiltering />
			</Table>
		</>
	);
}
