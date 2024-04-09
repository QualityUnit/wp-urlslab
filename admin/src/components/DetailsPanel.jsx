import { memo, useEffect, useRef, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { __ } from '@wordpress/i18n';

import Button from '@mui/joy/Button';

import { postFetch } from '../api/fetching';
import useCloseModal from '../hooks/useCloseModal';
import useTablePanels from '../hooks/useTablePanels';
import ProgressBar from '../elements/ProgressBar';
import ExportCSVButton from '../elements/ExportCSVButton';
import DateTimeFormat from '../elements/DateTimeFormat';
import Loader from './Loader';
import UnifiedPanelMenu from './UnifiedPanelMenu';

import TableSimple from './TableSimpleComponent';

import '../assets/styles/components/_TableComponent.scss';
import Stack from '@mui/joy/Stack';
import { IconButton, SvgIcon, Tooltip } from '../lib/tableImports';

function DetailsPanel() {
	const maxRows = 150;
	const { ref, inView } = useInView();
	const tableContainerRef = useRef();
	const [ exportStatus, setExportStatus ] = useState();
	const stopFetching = useRef( false );
	const { CloseIcon, handleClose } = useCloseModal();
	const { activePanel, options, rowToEdit } = useTablePanels();

	const {
		title,
		text,
		slug,
		counter,
		url,
		perPage,
		showKeys,
		listId,
	} = useTablePanels( ( state ) => state.options[ activePanel ].detailsOptions );
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

	const {
		isSuccess, data, isFetchingNextPage,
		hasNextPage,
		fetchNextPage,
	} = useInfiniteQuery( {
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
					: [],
				rows_per_page: maxRows,
			} );
			if ( response.ok ) {
				return { allRows: await response.json(), url };
			}
			return { allRows: [], url };
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

	if ( rows ) {
		for ( const row of rows ) {
			if ( data.pages[ 0 ].url === url ) {
				tbody.push(
					<tr key={ row[ listId ] } className="">
						{ showKeys.map( ( key ) => {
							const { name, values } = key;
							return <td className="pr-m pos-relative" key={ row[ name[ 0 ] ] }>
								<div className="limit">
									{
										name[ 0 ].includes( 'url' ) && (
											<Stack direction="row" alignItems="center" spacing={ 1 }><>
												{
													<a href={ row[ name[ 0 ] ] } target="_blank"
														rel="noreferrer">{ row[ name[ 0 ] ] }</a>
												}
												{
													row[ 'edit_' + name[ 0 ] ]?.length > 0 &&

													<Tooltip title={ __( 'Edit Post', 'urlslab' ) } arrow placement="bottom">
														<IconButton size="xs" component="a" href={ row[ 'edit_' + name[ 0 ] ] }
															target="_blank">
															<SvgIcon name="edit-post" />
														</IconButton>
													</Tooltip>
												}
											</>
											</Stack>
										)
									}
									{ values && values[ row[ name[ 0 ] ] ] }
									{ ! values && ! name[ 0 ].includes( 'url' ) && row[ name[ 0 ] ] }
									{
										parseDate( row, name[ 0 ] )
									}
								</div>
							</td>;
						} ) }
					</tr>
				);
			}
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
					{ ( [ ...options ].filter( ( n ) => n ).length > 1 || Object.keys( rowToEdit ).length > 0 ) &&
					<UnifiedPanelMenu /> }
				</div>
				<div className="urlslab-panel-content">
					{ text && <p className="fs-m padded">{ text }</p> }

					<div className="table-container">
						{ isSuccess && data
							? <TableSimple ref={ tableContainerRef } containerProps={ { sx: { m: 0 } } }>
								<thead>
									<tr>{ showKeys.map( ( key ) => <th className="pr-m"
										style={ key.size && { width: `${ key.size }%` } }
										key={ key.name[ 0 ] }>{ key.name[ 1 ] }</th> ) }</tr>
								</thead>
								<tbody>
									{ tbody }
								</tbody>
							</TableSimple>
							: <Loader />
						}
						{ isSuccess && data && data.length < 1000 &&
						<div className="padded mt-l" ref={ ref }>
							{ isFetchingNextPage ? '' : hasNextPage }
							<ProgressBar className="infiniteScroll" value={ ! isFetchingNextPage ? 0 : 100 } />
						</div>
						}
					</div>
					<div className="mt-l padded">
						{ exportStatus
							? <ProgressBar className="mb-m" notification="Exporting…" value={ exportStatus } />
							: null
						}
					</div>
					<div className="flex mt-m ma-left padded">
						<Button variant="plain" color="neutral" onClick={ hidePanel }
							sx={ { ml: 'auto' } }>{ __( 'Cancel', 'urlslab' ) }</Button>
						<ExportCSVButton
							className="ml-s"
							options={ {
								slug: `${ slug }/${ url }`,
								counter,
								data: rows,
								url,
								perPage,
								paginationId: listId,
								stopFetching,
							} } disabled={ ! rows?.length } onClick={ handleExportStatus }
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

export default memo( DetailsPanel );
