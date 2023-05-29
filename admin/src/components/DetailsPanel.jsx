import { useEffect, useCallback, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { useVirtual } from 'react-virtual';
import { useI18n } from '@wordpress/react-i18n';

import { postFetch } from '../api/fetching';
import useCloseModal from '../hooks/useCloseModal';
import useTablePanels from '../hooks/useTablePanels';
import Button from '../elements/Button';
import ProgressBar from '../elements/ProgressBar';
import DateTimeFormat from '../elements/DateTimeFormat';
import Loader from './Loader';

export default function DetailsPanel( ) {
	const maxRows = 150;
	const { __ } = useI18n();
	const { ref, inView } = useInView();
	const tableContainerRef = useRef();
	const { CloseIcon, handleClose } = useCloseModal( );
	const { title, text, slug, url, showKeys, listId } = useTablePanels( ( state ) => state.options.detailsOptions );
	const tbody = [];

	const parseDate = ( row, key ) => {
		const dateKeys = [ 'created' ]; // Insert other keys with date, ie. 'modified' if needed
		dateKeys.map( ( val ) => {
			if ( key.includes( val ) ) {
				return <DateTimeFormat datetime={ row[ key ] } key={ row[ key ] } />;
			}
			return null;
		} );
	};

	const { isSuccess, data, isFetchingNextPage,
		hasNextPage,
		fetchNextPage } = useInfiniteQuery( {
		queryKey: [ slug, url ],
		queryFn: async ( { pageParam = '' } ) => {
			const { lastRowId } = pageParam;
			const response = await postFetch( `${ slug }/${ url }`, {
				sorting: [ { col: listId, dir: 'ASC' } ],
				filters: lastRowId
					? [
						{
							cond: 'OR',
							filters: [
								{ cond: 'AND', filters: [ { col: listId, op: '>', val: lastRowId } ] },
							],
						},
					]
					: [ ],
				rows_per_page: maxRows,
			} );
			return response.json();
		},
		getNextPageParam: ( allRows ) => {
			if ( allRows.length < maxRows ) {
				return undefined;
			}
			const lastRowId = allRows[ allRows?.length - 1 ][ listId ] ?? undefined;
			return { lastRowId };
		},
		keepPreviousData: true,
		refetchOnWindowFocus: false,
		cacheTime: Infinity,
		staleTime: Infinity,
	} );

	const rows = data?.pages?.flatMap( ( page ) => page ?? [] );

	const rowVirtualizer = useVirtual( {
		parentRef: tableContainerRef,
		size: rows?.length,
		overscan: 10,
		estimateSize: useCallback( () => 20, [] ),
	} );

	const { virtualItems: virtualRows, totalSize } = rowVirtualizer;
	const paddingTop = virtualRows?.length > 0 ? virtualRows?.[ 0 ]?.start || 0 : 0;
	const paddingBottom =
		virtualRows?.length > 0
			? totalSize - ( virtualRows?.[ virtualRows.length - 1 ]?.end || 0 )
			: 0;

	for ( const virtualRow of virtualRows ) {
		const row = rows[ virtualRow?.index ];
		tbody.push(
			<tr key={ row[ listId ] } className="">
				{ showKeys.map( ( key ) => {
					return <td className="pr-m pos-relative" key={ row[ key ] }>
						<div className="limit">
							{ key.includes( 'url' ) ? <a href={ row[ key ] } target="_blank" rel="noreferrer">{ row[ key ] }</a> : row[ key ] }
							{
								parseDate( row, key )
							}
						</div>
					</td>;
				} ) }
			</tr>
		);
	}

	useEffect( () => {
		if ( inView ) {
			fetchNextPage();
		}
	}, [ inView, fetchNextPage ] );

	return (
		<div className="urlslab-panel-wrap wide urlslab-panel-modal fadeInto">
			<div className="urlslab-panel Details">
				<div className="urlslab-panel-header">
					<h3>{ title }</h3>
					<button className="urlslab-panel-close" onClick={ handleClose }>
						<CloseIcon />
					</button>
					<p>{ text }</p>
				</div>
				<div className="mt-l">
					<div className="table-container" ref={ tableContainerRef }>
						{ isSuccess && data
							? <table>
								<thead>
									<tr >{ showKeys.map( ( key ) => <th className="pr-m" key={ key }>{ key.charAt( 0 ).toUpperCase() + key.slice( 1 ).replaceAll( '_', ' ' ) }</th> ) }</tr>
								</thead>
								<tbody>
									{ paddingTop > 0 && (
										<tr>
											<td style={ { height: `${ paddingTop }px` } } />
										</tr>
									) }
									{ tbody }
									{ paddingBottom > 0 && (
										<tr>
											<td style={ { height: `${ paddingBottom }px` } } />
										</tr>
									) }
								</tbody>
							</table>
							: <Loader />
						}
						<div ref={ ref }>
							{ isFetchingNextPage ? '' : hasNextPage }
							<ProgressBar className="infiniteScroll" value={ ! isFetchingNextPage ? 0 : 100 } />
						</div>
					</div>
					<div className="flex">
						<Button className="ma-left" onClick={ handleClose }>{ __( 'Cancel' ) }</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
