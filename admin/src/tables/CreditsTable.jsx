import { useEffect } from 'react';
import { useI18n } from '@wordpress/react-i18n/';
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

export default function CreditsTable( { slug } ) {
	const { __ } = useI18n();
	const paginationId = 'id';

	const {
		columnHelper,
		data,
		status,
		isSuccess,
	} = useInfiniteFetch( { slug } );

	const header = {
		id: __( 'Transaction ID' ),
		operationDate: __( 'Timestamp' ),
		creditType: __( 'Type' ),
		creditOperation: __( 'Operation' ),
		context: __( 'Data' ),
	};

	useEffect( () => {
		useTableStore.setState( () => (
			{
				activeTable: slug,
				tables: {
					...useTableStore.getState().tables,
					[ slug ]: {
						paginationId,
						slug,
						header,
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
		columnHelper.accessor( 'id', {
			header: header.id,
			size: 60,
		} ),
		columnHelper.accessor( 'operationDate', {
			cell: ( val ) => <DateTimeFormat datetime={ val.getValue() } />,
			header: header.operationDate,
			size: 100,
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
	];

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
				noExport
				noImport
				noDelete
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
