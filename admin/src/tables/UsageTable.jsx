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
import useTablePanels from '../hooks/useTablePanels';

import '../assets/styles/components/_ModuleViewHeader.scss';

export default function UsageTable( { slug } ) {
	const { __ } = useI18n();
	const paginationId = 'id';

	const {
		columnHelper,
		data,
		status,
		isSuccess,
	} = useInfiniteFetch( { slug }, 5000 );

	const header = {
		groupBucketTitle: __( 'Date' ),
		creditType: __( 'Type' ),
		events: __( 'Count' ),
		credits: __( 'Usage' ),
	};

	useEffect( () => {
		useTablePanels.setState( () => (
			{
				deleteCSVCols: [ paginationId ],
			}
		) );
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
		columnHelper.accessor( 'groupBucketTitle', {
			cell: ( cell ) => <DateTimeFormat noTime datetime={ cell.getValue() } />,
			header: header.groupBucketTitle,
			size: 200,
		} ),
		columnHelper.accessor( 'creditType', {
			header: header.creditType,
			size: 100,
		} ),
		columnHelper.accessor( 'events', {
			header: header.events,
			size: 100,
		} ),
		columnHelper.accessor( 'credits', {
			header: header.credits,
			size: 100,
		} ),
	];

	if ( status === 'loading' ) {
		return <Loader isFullscreen />;
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
			<Table className="fadeInto"
				columns={ columns }
				data={ isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] ) }
				initialState={ { columnVisibility: { events: false } } }
			>
				<TooltipSortingFiltering />
			</Table>
		</>
	);
}
