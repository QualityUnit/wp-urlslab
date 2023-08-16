import { memo, useEffect, useCallback, useRef, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { useVirtual } from 'react-virtual';
import { useI18n } from '@wordpress/react-i18n';

import { postFetch } from '../api/fetching';
import useCloseModal from '../hooks/useCloseModal';
import useTablePanels from '../hooks/useTablePanels';
import Button from '../elements/Button';
import ProgressBar from '../elements/ProgressBar';
import ExportCSVButton from '../elements/ExportCSVButton';
import DateTimeFormat from '../elements/DateTimeFormat';
import Loader from './Loader';
import UnifiedPanelMenu from './UnifiedPanelMenu';
import '../assets/styles/components/_TableComponent.scss';

function DetailsPanel( ) {
	const maxRows = 150;
	const { __ } = useI18n();
	const { ref, inView } = useInView();
	const tableContainerRef = useRef();
	const [ exportStatus, setExportStatus ] = useState();
	const stopFetching = useRef( false );
	const { CloseIcon, handleClose } = useCloseModal( );
	const { activePanel, options, rowToEdit } = useTablePanels( );

	const { title, text, slug, url, showKeys, listId } = useTablePanels( ( state ) => state.options[ activePanel ].detailsOptions );
	const tbody = [];

	const hidePanel = () => {
		stopFetching.current = true;

		handleClose();
	};

	const handleExportStatus = ( val ) => {
		setExportStatus( val );
		if ( val === 100 ) {
			setTimeout( () => {
				setExportStatus();
				handleClose();
			}, 1000 );
		}
	};

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
			return { allRows: await response.json(), url };
		},
		getNextPageParam: ( { allRows } ) => {
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

	const rows = data?.pages?.flatMap( ( page ) => page.allRows ?? [] );

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
		if ( data?.pages[ 0 ].url === url ) {
			tbody.push(
				<tr key={ row[ listId ] } className="">
					{ showKeys.map( ( key ) => {
						const { name, values } = key;
						return <td className="pr-m pos-relative" key={ row[ name ] }>
							<div className="limit">
								{ name.includes( 'url' ) && <a href={ row[ name ] } target="_blank" rel="noreferrer">{ row[ name ] }</a> }
								{ values && values[ row[ name ] ] }
								{ ! values && ! name.includes( 'url' ) && row[ name ] }
								{
									parseDate( row, name )
								}
							</div>
						</td>;
					} ) }
				</tr>
			);
		}
	}

	useEffect( () => {
		if ( inView ) {
			fetchNextPage();
		}
	}, [ inView, fetchNextPage ] );

	return (
		<div className="urlslab-panel-wrap wide urlslab-panel-modal ultrawide fadeInto">
			<div className="urlslab-panel Details">
				<div className="urlslab-panel-header">
					<h3>{ title }</h3>
					<button className="urlslab-panel-close" onClick={ hidePanel }>
						<CloseIcon />
					</button>
					{ ( [ ...options ].filter( ( n ) => n ).length > 1 || Object.keys( rowToEdit ).length > 0 ) && <UnifiedPanelMenu /> }
				</div>
				<div className="urlslab-panel-content">
					{ text && <p className="fs-m padded">{ text }</p> }
					<div className="table-container" ref={ tableContainerRef }>
						{ isSuccess && data
							? <table className="urlslab-table">
								<thead>
									<tr >{ showKeys.map( ( key ) => <th className="pr-m" style={ key.size && { width: `${ key.size }%` } } key={ key.name }>{ key.name.charAt( 0 ).toUpperCase() + key.name.slice( 1 ).replaceAll( '_', ' ' ) }</th> ) }</tr>
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
					<div className="mt-l">
						{ exportStatus
							? <ProgressBar className="mb-m" notification="Exporting…" value={ exportStatus } />
							: null
						}
					</div>
					<div className="flex mt-m ma-left padded">
						<Button className="ma-left" onClick={ hidePanel }>{ __( 'Cancel' ) }</Button>
						<ExportCSVButton
							className="ml-s"
							options={ { slug: `${ slug }/${ url }`, url, paginationId: listId, stopFetching } } onClick={ handleExportStatus }
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

export default memo( DetailsPanel );
