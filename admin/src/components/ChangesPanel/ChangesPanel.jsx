import { memo, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import { __ } from '@wordpress/i18n';

import { postFetch } from '../../api/fetching';
import useCloseModal from '../../hooks/useCloseModal';
import useTablePanels from '../../hooks/useTablePanels';
import useChangeRow from '../../hooks/useChangeRow';
import useChangesChartDate from '../../hooks/useChangesChartDate';
import useSelectRows from '../../hooks/useSelectRows';

import Table from '../TableComponent';
import '../../assets/styles/components/_ChangesPanel.scss';
import DateTimeFormat from '../../elements/DateTimeFormat';
import SvgIcon from '../../elements/SvgIcon';
import Chart from './Chart';
import ImageCompare from '../ImageCompare';
import Loader from '../Loader';

import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Tooltip from '@mui/joy/Tooltip';
import TableSelectCheckbox from '../../elements/TableSelectCheckbox';

const header = {
	screenshot: __( 'Screenshot' ),
	last_seen: __( 'Crawl date' ),
	last_changed: __( 'Change date' ),
	status_code: __( 'Status' ),
	load_duration: __( 'Page load duration' ),
	word_count: __( 'Word count' ),
	requests: __( 'Page requests' ),
	page_size: __( 'Page size' ),
};

function ChangesPanel( ) {
	const columnHelper = useMemo( () => createColumnHelper(), [] );
	const { CloseIcon, handleClose } = useCloseModal();
	const { title, slug } = useTablePanels( ( state ) => state.options.changesPanel );

	const setSelectedRows = useSelectRows( ( state ) => state.setSelectedRows );
	const changesPanel = useSelectRows( ( state ) => state.selectedRows.changesPanel || {} );
	const { isSelected, selectRows } = useChangeRow( { customSlug: 'changesPanel' } );
	const chartDateState = useChangesChartDate();

	function hidePanel() {
		handleClose();
		setSelectedRows( { ...useSelectRows.getState().selectedRows, changesPanel: {} } );
	}

	// Deselects first row if more than 2, and removes it from selectedRows list
	if ( changesPanel && Object.keys( changesPanel )?.length === 3 ) {
		delete changesPanel[ Object.keys( changesPanel )[ 0 ] ];
		setSelectedRows( { ...useSelectRows.getState().selectedRows, changesPanel } );
	}

	const rowSelected = useCallback( ( cell ) => {
		return <>
			{ Object.keys( changesPanel )?.length === 2 && Object.keys( changesPanel )[ 1 ] === cell.row.id
			// shows when second row is selected
				? <Button
					size="sm"
					className="thumbnail-button"
					onClick={ () => useTablePanels.setState( { imageCompare: true } ) }
					sx={ { position: 'absolute', pl: 4, fontSize: '1em' } }
				>
					{ __( 'Show diff 2/2' ) }
				</Button>
				: null
			}
			<span className={ `thumbnail-wrapper ${ isSelected( cell ) ? 'selected' : '' }` } style={ { maxWidth: '3.75rem' } }>
				<img src={ cell?.getValue().thumbnail } alt={ title } />
				{ changesPanel && Object.keys( changesPanel )?.length && isSelected( cell ) && Object.keys( changesPanel )[ 0 ] === cell.row.id &&
				<span className="thumbnail-selected-info fs-xm">1/2</span>
				}
			</span>
		</>;
	}, [ isSelected, changesPanel, title ] );

	const showCompare = useCallback( ( cell ) => {
		// deselect all selected rows
		setSelectedRows( { ...useSelectRows.getState().selectedRows, changesPanel: {} } );
		selectRows( cell );
		selectRows( { row: { ...cell.table.getRow( Number( cell.row.id ) + 1 ) } } );
		useTablePanels.setState( { imageCompare: true } );
	}, [ selectRows, setSelectedRows ] );

	const { data, isSuccess, isLoading } = useQuery( {
		queryKey: [ 'changesPanel', 'table', slug ],
		queryFn: async () => {
			const result = await postFetch( slug, { only_changed: true } );
			if ( result.ok ) {
				return await result.json();
			}
		},
		refetchOnWindowFocus: false,
	} );

	const chartResult = useQuery( {
		queryKey: [ 'changesPanel', 'chart', chartDateState.startDate, chartDateState.endDate ],
		queryFn: async () => {
			const res = await postFetch( slug, {
				start_date: chartDateState.startDate,
				end_date: chartDateState.endDate,
			} );
			if ( res.ok ) {
				const returningData = await res.json();
				return returningData.reverse();
			}
		},
		refetchOnWindowFocus: false,
	} );

	const columns = useMemo( () => [
		columnHelper.accessor( 'screenshot', {
			id: 'thumb',
			className: 'nolimit thumbnail',
			tooltip: ( cell ) =>
				<Box
					component="img"
					src={ cell?.getValue().thumbnail }
					alt="url"
					sx={ {
						// just show image nice with tooltip corners
						borderRadius: 'var(--urlslab-radius-sm)',
						display: 'block',
						marginY: 0.25,
						maxWidth: '15em',
					} }
				/>,
			cell: ( cell ) => (
				<div className="pos-relative pl-m">
					<TableSelectCheckbox tableElement={ cell } customSlug="changesPanel" className="thumbnail-check" />
					{ rowSelected( cell ) }
				</div>
			),
			header: () => header.screenshot,
			size: 120,
		} ),
		columnHelper.accessor( 'last_seen', {
			cell: ( cell ) => <DateTimeFormat datetime={ cell.getValue() * 1000 } />,
			header: () => header.last_seen,
			size: 80,
		} ),
		columnHelper.accessor( 'status_code', {
			cell: ( cell ) => {
				const status = cell.getValue();
				if ( status >= 200 && status <= 299 ) {
					return <span className="c-saturated-green">OK</span>;
				}
				if ( status >= 300 && status <= 399 ) {
					return <span className="c-saturated-orange">Redirect</span>;
				}
				return <span className="c-saturated-red">{ status }</span>;
			},
			header: () => header.status_code,
			size: 60,
		} ),
		columnHelper.accessor( 'word_count', {
			header: () => header.word_count,
			size: 100,
		} ),
		columnHelper.accessor( 'page_size', {
			cell: ( cell ) => `${ parseFloat( cell.getValue() / 1024 / 1024 ).toFixed( 2 ) }\u00A0MB`,
			header: () => header.page_size,
			size: 150,
		} ),
		columnHelper.accessor( 'requests', {
			header: () => header.requests,
			size: 150,
		} ),
		columnHelper.accessor( 'load_duration', {
			cell: ( cell ) => `${ parseFloat( cell.getValue() / 1000 ).toFixed( 2 ) }\u00A0s`,
			header: () => header.load_duration,
			size: 150,
		} ),
		columnHelper.display( {
			id: 'diff_actions',
			cell: ( cell ) => {
				if ( data?.length > 1 && cell.row.index < data?.length - 1 ) {
					return <div className="pos-absolute" style={ { top: '2.25em', zIndex: 2 } }>
						<Tooltip title={ __( 'Compare' ) }>
							<Button // compares two consecutive rows
								size="sm"
								color="neutral"
								onClick={ () => showCompare( cell ) }
								sx={ { fontSize: '1em' } }
							>{ __( 'Compare' ) }</Button>
						</Tooltip>
					</div>;
				}

				return '';
			},
			size: 150,
		} ),
	], [ columnHelper, data?.length, rowSelected, showCompare ] );

	if ( isLoading ) {
		return <Loader isWhite isFullscreen overlay />;
	}

	return (
		<>
			{ changesPanel && Object.keys( changesPanel ).length === 2 &&
				<ImageCompare key={ changesPanel } allChanges={ data } customSlug="changesPanel" />
			}
			{ isSuccess && (
				<div className={ `urlslab-panel-wrap urlslab-panel-modal urlslab-changesPanel-wrap fadeInto` }>
					<div className="urlslab-panel urlslab-changesPanel customPadding">
						<div className="urlslab-panel-header">
							<h3>
								<a href={ title } target="_blank" rel="noreferrer">
									{ title }
									<SvgIcon name="anchor" />
								</a>
							</h3>
							<button className="urlslab-panel-close" onClick={ hidePanel }>
								<CloseIcon />
							</button>
						</div>
						{ chartResult.isSuccess &&
							<Chart data={ chartResult.data } header={ header } useChangesChartDate={ chartDateState } />
						}
						{
							data?.length > 0 &&
							<div className="mt-l table-container" style={ { position: 'relative', top: 0, left: 0, zIndex: 1 } }>
								<Table
									customSlug={ 'changesPanel' }
									columns={ columns }
									data={ isSuccess && data }
								/>
							</div>
						}
					</div>
				</div>
			) }

			{ ! isLoading && ! isSuccess && (
				<div className={ `urlslab-panel-wrap urlslab-panel-modal urlslab-changesPanel-wrap fadeInto` }>
					<div className="urlslab-panel urlslab-changesPanel customPadding">
						<div className="urlslab-panel-header">
							<h3>{ title }</h3>
							<button className="urlslab-panel-close" onClick={ hidePanel }>
								<CloseIcon />
							</button>
						</div>
						<div className="p-l">
							{ __( 'No Data found for this url. Try to schedule url to get data.' ) }
						</div>
					</div>
				</div>
			) }

		</>
	);
}

export default memo( ChangesPanel );
