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
	SingleSelectMenu, TextArea,
} from '../lib/tableImports';

import useTableStore from '../hooks/useTableStore';
import useChangeRow from '../hooks/useChangeRow';
import useTablePanels from '../hooks/useTablePanels';

export default function SerpTopDomainsTable( { slug } ) {
	const { __ } = useI18n();
	const title = __( 'Add Domains' );
	const paginationId = 'domain_id';
	const defaultSorting = [ { key: 'top_100_cnt', dir: 'DESC', op: '<' } ];

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

	const setRowToEdit = useTablePanels( ( state ) => state.setRowToEdit );
	const rowToEdit = useTablePanels( ( state ) => state.rowToEdit );

	const domainTypes = {
		X: __( 'Other' ),
		M: __( 'My Domain' ),
		C: __( 'Competitor' ),
		I: __( 'Ignored' ),
	};
	const newDomainTypes = {
		M: __( 'My Domain' ),
		C: __( 'Competitor' ),
		I: __( 'Ignored' ),
	};

	const header = {
		domain_name: __( 'Domain' ),
		domain_type: __( 'Type' ),
		top_100_cnt: __( 'Queries' ),
	};

	const rowEditorCells = {
		domain_name: <TextArea autoFocus liveUpdate defaultValue="" label={ __( 'Domains' ) } rows={ 10 } allowResize onChange={ ( val ) => setRowToEdit( { ...rowToEdit, domain_name: val } ) } required description={ __( 'Each domain name must be on a separate line' ) } />,
		domain_type: <SingleSelectMenu defaultAccept autoClose items={ newDomainTypes } name="domain_type" defaultValue="M" onChange={ ( val ) => setRowToEdit( { ...rowToEdit, domain_type: val } ) }>{ header.domain_type }</SingleSelectMenu>,
	};

	useEffect( () => {
		useTablePanels.setState( () => (
			{
				rowEditorCells,
				deleteCSVCols: [ paginationId, 'domain_id' ],
			}
		) );
		useTableStore.setState( () => (
			{
				title,
				paginationId,
				slug,
				header,
				id: 'domain_name',
				sorting: defaultSorting,
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
			header: ( th ) => <SortBy { ...th } />,
			minSize: 50,
		} ),
	];

	if ( status === 'loading' ) {
		return <Loader isFullscreen />;
	}

	return (
		<>
			<ModuleViewHeaderBottom noDelete />
			<Table className="fadeInto"
				columns={ columns }
				data={ isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] ) }>
				<TooltipSortingFiltering />
				<div ref={ ref }>
					{ isFetchingNextPage ? '' : hasNextPage }
					<ProgressBar className="infiniteScroll" value={ ! isFetchingNextPage ? 0 : 100 } />
				</div>
			</Table>
		</>
	);
}
