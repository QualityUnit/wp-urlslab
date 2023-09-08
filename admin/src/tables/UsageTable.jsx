import { useEffect } from 'react';
import { useI18n } from '@wordpress/react-i18n/';
import {
	useInfiniteFetch,
	Loader,
	Table,
	ModuleViewHeaderBottom,
	TooltipSortingFiltering,
	ProgressBar,
} from '../lib/tableImports';

import useTableStore from '../hooks/useTableStore';

import '../assets/styles/components/_ModuleViewHeader.scss';
import useTablePanels from '../hooks/useTablePanels';

export default function UsageTable( { slug } ) {
	const { __ } = useI18n();
	const paginationId = 'id';

	const {
		columnHelper,
		data,
		status,
		isSuccess,
		isFetchingNextPage,
		hasNextPage,
		ref,
	} = useInfiniteFetch( { slug } );

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
				paginationId,
				slug,
				header,
			}
		) );
	}, [] );

	// Saving all variables into state managers
	useEffect( () => {
		useTableStore.setState( () => (
			{
				data,
			}
		) );
	}, [ data ] );

	const columns = [
		columnHelper.accessor( 'groupBucketTitle', {
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
			<Table className="noHeightLimit fadeInto"
				columns={ columns }
				data={ isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] ) }
				initialState={ { columnVisibility: { events: false } } }
			>
				<TooltipSortingFiltering />
				<div ref={ ref }>
					{ isFetchingNextPage ? '' : hasNextPage }
					<ProgressBar className="infiniteScroll" value={ ! isFetchingNextPage ? 0 : 100 } />
				</div>
			</Table>
		</>
	);
}
