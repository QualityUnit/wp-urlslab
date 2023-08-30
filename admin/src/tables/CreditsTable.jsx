import { useEffect } from 'react';
import { useI18n } from '@wordpress/react-i18n/';
import {
	useInfiniteFetch,
	Loader,
	Table,
	ModuleViewHeaderBottom,
	TooltipSortingFiltering,
	Tooltip, DateTimeFormat,
} from '../lib/tableImports';

import useTableStore from '../hooks/useTableStore';
import useTablePanels from '../hooks/useTablePanels';

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

	const { resetTableStore } = useTableStore();
	const { resetPanelsStore } = useTablePanels();

	const header = {
		id: __( 'Transaction Id' ),
		operationDate: __( 'Timestamp' ),
		creditType: __( 'Type' ),
		creditOperation: __( 'Operation' ),
		context: __( 'Data' ),
	};

	// Saving all variables into state managers
	useEffect( () => {
		resetTableStore();
		resetPanelsStore();
		useTableStore.setState( () => (
			{
				data,
				paginationId,
				slug,
				header,
			}
		) );
	}, [ data ] );

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
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => cell.getValue(),
			header: header.context,
			size: 200,
		} ),
	];

	if ( status === 'loading' ) {
		return <Loader />;
	}

	return (
		<>
			<ModuleViewHeaderBottom
				noFiltering
				noCount
				noExport
				noImport
				noDelete
			/>
			<Table className="noHeightLimit fadeInto"
				columns={ columns }
				initialState={ { columnVisibility: { id: false } } }
				data={ isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] ) }
			>
				<TooltipSortingFiltering />
			</Table>
		</>
	);
}
