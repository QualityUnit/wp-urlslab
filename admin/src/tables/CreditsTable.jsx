import { useEffect, useMemo, useState } from 'react';
import { __ } from '@wordpress/i18n/';
import {
	useInfiniteFetch,
	Loader,
	Table,
	ModuleViewHeaderBottom,
	TooltipSortingFiltering,
	DateTimeFormat,
} from '../lib/tableImports';

import useTableStore from '../hooks/useTableStore';
import DescriptionBox from '../elements/DescriptionBox';

import '../assets/styles/components/_ModuleViewHeader.scss';

const paginationId = 'id';

const header = {
	id: __( 'Transaction ID', 'urlslab' ),
	installationId: __( 'Installation ID', 'urlslab' ),
	operationDate: __( 'Timestamp', 'urlslab' ),
	creditType: __( 'Type', 'urlslab' ),
	creditOperation: __( 'Operation', 'urlslab' ),
	context: __( 'Data', 'urlslab' ),
};

const initialState = { columnVisibility: { id: false } };

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

	return init && <CreditsTable slug={ slug } />;
}

function CreditsTable( { slug } ) {
	const {
		columnHelper,
		data,
		isLoading,
		isSuccess,
	} = useInfiniteFetch( { slug } );

	const tableData = useMemo( () => data?.pages?.flatMap( ( page ) => page ?? [] ), [ data?.pages ] );
	const setTable = useTableStore( ( state ) => state.setTable );

	const columns = useMemo( () => [
		columnHelper.accessor( 'id', {
			header: header.id,
			size: 60,
		} ),
		columnHelper.accessor( 'operationDate', {
			cell: ( val ) => <DateTimeFormat datetime={ val.getValue() } />,
			header: header.operationDate,
			size: 100,
		} ),
		columnHelper.accessor( 'installationId', {
			header: header.installationId,
			size: 60,
		} ),
		columnHelper.accessor( 'creditType', {
			header: header.creditType,
			size: 60,
		} ),
		columnHelper.accessor( 'creditOperation', {
			header: header.creditOperation,
			size: 30,
		} ),
		columnHelper.accessor( 'context', {
			tooltip: ( cell ) => cell.getValue(),
			cell: ( cell ) => cell.getValue(),
			header: header.context,
			size: 200,
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
			<DescriptionBox	title={ __( 'About this table', 'urlslab' ) } tableSlug={ slug } isMainTableDescription>
				{ __( 'The table displays the 500 most recent transactions, which represent tasks performed by the URLsLab Service linked to your API key. To evaluate the aggregated costs by task type, go to the Daily Usage tab.', 'urlslab' ) }
			</DescriptionBox>

			<ModuleViewHeaderBottom
				noFiltering
				noCount
				hideActions
			/>

			<Table
				className="fadeInto"
				columns={ columns }
				initialState={ initialState }
				data={ isSuccess && tableData }
			>
				<TooltipSortingFiltering />
			</Table>
		</>
	);
}
