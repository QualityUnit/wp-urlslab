import { useEffect, useMemo } from 'react';
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
	id: __( 'Transaction ID' ),
	installationId: __( 'Installation ID' ),
	operationDate: __( 'Timestamp' ),
	creditType: __( 'Type' ),
	creditOperation: __( 'Operation' ),
	context: __( 'Data' ),
};

export default function CreditsTable( { slug } ) {
	const {
		columnHelper,
		data,
		status,
		isSuccess,
	} = useInfiniteFetch( { slug } );

	useEffect( () => {
		useTableStore.setState( () => (
			{
				activeTable: slug,
				tables: {
					...useTableStore.getState().tables,
					[ slug ]: {
						...useTableStore.getState().tables[ slug ],
						paginationId,
						slug,
						header,
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

	if ( status === 'loading' ) {
		return <Loader isFullscreen />;
	}

	return (
		<>
			<DescriptionBox	title={ __( 'About this table' ) } tableSlug={ slug } isMainTableDescription>
				{ __( 'The table displays the 500 most recent transactions, which represent tasks performed by the URLsLab Service linked to your API key. To evaluate the aggregated costs by task type, go to the Daily Usage tab.' ) }
			</DescriptionBox>
			<ModuleViewHeaderBottom
				noFiltering
				noCount
				hideActions
			/>
			<Table className="fadeInto"
				columns={ columns }
				initialState={ { columnVisibility: { id: false } } }
				data={ isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] ) }
			>
				<TooltipSortingFiltering />
			</Table>
		</>
	);
}
