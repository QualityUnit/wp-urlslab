import { memo, useMemo, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import { useI18n } from '@wordpress/react-i18n';

import { postFetch } from '../../api/fetching';
import useCloseModal from '../../hooks/useCloseModal';
import useTablePanels from '../../hooks/useTablePanels';
import useChangeRow from '../../hooks/useChangeRow';

import Table from '../TableComponent';
import '../../assets/styles/components/_ChangesPanel.scss';
import DateTimeFormat from '../../elements/DateTimeFormat';
import Checkbox from '../../elements/Checkbox';
import Chart from './Chart';
import ImageCompare from '../ImageCompare';
import Button from '../../elements/Button';
import { ReactComponent as IconAnchor } from '../../assets/images/icons/icon-anchor.svg';
import Tooltip from '../../elements/Tooltip';
import DiffButton from '../../elements/DiffButton';

function ChangesPanel() {
	const { __ } = useI18n();
	const columnHelper = useMemo( () => createColumnHelper(), [] );
	const { CloseIcon, handleClose } = useCloseModal();
	const { title, slug } = useTablePanels( ( state ) => state.options.changesPanel );

	const { selectedRows, selectRows, clearRows } = useChangeRow( {} );
	const [ consecutiveSelects, setConsecutiveSelects ] = useState( [] );

	function hidePanel() {
		handleClose();
	}

	useEffect( () => {
		if ( consecutiveSelects && selectedRows.length === 0 && consecutiveSelects.length === 2 ) {
			consecutiveSelects[ 0 ].row.toggleSelected();
			selectRows( consecutiveSelects[ 0 ] );
			consecutiveSelects[ 1 ].row.toggleSelected();
			selectRows( consecutiveSelects[ 1 ] );
			setConsecutiveSelects( [] );
			useTablePanels.setState( { imageCompare: true } );
		}

		if ( selectedRows.length > 2 ) {
			selectedRows[ 0 ].row.toggleSelected();
			selectRows( selectedRows[ 0 ], true );
		}
	}, [ selectedRows, selectRows ] );

	const tableResult = useQuery( {
		queryKey: [ slug ],
		queryFn: async () => {
			const result = await postFetch( slug, { only_changed: true } );
			if ( result.ok ) {
				return await result.json();
			}
			return [];
		},
		refetchOnWindowFocus: false,
	} );

	const chartResult = useQuery( {
		queryKey: [ slug, 'chart' ],
		queryFn: async () => {
			const res = await postFetch( slug );
			if ( res.ok ) {
				const returningData = await res.json();
				return returningData.reverse();
			}
		},
		refetchOnWindowFocus: false,
	} );

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

	const columns = [
		columnHelper.accessor( 'screenshot', {
			id: 'thumb',
			className: 'nolimit thumbnail',
			tooltip: ( cell ) => <Tooltip className="withImage">
				<div className="imageWrapper">
					<img src={ cell?.getValue().thumbnail } alt="url" />
				</div>
			</Tooltip>,
			cell: ( cell ) => {
				const isSelected = cell.row.getIsSelected();

				return <div className="pos-relative pl-m">
					<Checkbox className="thumbnail-check" defaultValue={ cell.row.getIsSelected() } onChange={ ( val ) => {
						cell.row.toggleSelected();
						if ( ! val ) {
							selectRows( cell, true );
							return false;
						}
						selectRows( cell );
					} } />
					{ selectedRows && selectedRows?.length === 2 && isSelected && cell.row.id === selectedRows[ 1 ].row.id &&
					<Button active className="thumbnail-button" onClick={ () => useTablePanels.setState( { imageCompare: true } ) }>
						Show diff 2/2
					</Button>
					}
					<span className={ `thumbnail-wrapper ${ isSelected ? 'selected' : '' }` } style={ { maxWidth: '3.75rem' } }>
						<img src={ cell?.getValue().thumbnail } alt={ title } />
						{ isSelected && selectedRows?.length && cell.row.id === selectedRows[ 0 ].row.id &&
							<span className="thumbnail-selected-info fs-xm">1/2</span>
						}
					</span>
				</div>;
			},
			header: () => header.screenshot,
			size: 120,
		} ),
		columnHelper.accessor( 'last_seen', {
			cell: ( cell ) => <DateTimeFormat datetime={ cell.getValue() * 1000 } />,
			header: () => header.last_seen,
			size: 80,
		} ),
		columnHelper.accessor( 'last_changed', {
			cell: ( cell ) => <DateTimeFormat datetime={ cell.getValue() * 1000 } />,
			header: () => header.last_changed,
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
		columnHelper.accessor( 'load_duration', {
			cell: ( cell ) => `${ parseFloat( cell.getValue() / 1000 ).toFixed( 2 ) }\u00A0s`,
			header: () => header.load_duration,
			size: 150,
		} ),
		columnHelper.accessor( 'word_count', {
			header: () => header.word_count,
			size: 100,
		} ),
		columnHelper.accessor( 'requests', {
			header: () => header.requests,
			size: 150,
		} ),
		columnHelper.accessor( 'page_size', {
			cell: ( cell ) => `${ parseFloat( cell.getValue() / 1024 / 1024 ).toFixed( 2 ) }\u00A0MB`,
			header: () => header.page_size,
			size: 150,
		} ),
		columnHelper.display( {
			id: 'diff_actions',
			cell: ( cell ) => {
				if ( tableResult.data.length > 1 && cell.row.index < tableResult.data.length - 1 ) {
					return <DiffButton
						onClick={ () => {
							// removing selected rows
							setConsecutiveSelects( [
								cell.row.getAllCells()[ 0 ].getContext(),
								cell.table.getRow( cell.row.index + 1 ).getAllCells()[ 0 ].getContext(),
							] );
							selectedRows.forEach( ( row ) => {
								row.row.toggleSelected();
							} );
							clearRows();
						} }
					>{ __( 'Show Difference' ) }</DiffButton>;
				}

				return '';
			},
			size: 150,
		} ),
	];

	// const chartData = isSuccess && [ ...data ]?.reverse();

	return (
		<>
			{ selectedRows && selectedRows?.length === 2 &&
			<ImageCompare selectedRows={ selectedRows } />
			}

			{ tableResult.isSuccess && (
				<div className={ `urlslab-panel-wrap urlslab-panel-modal urlslab-changesPanel-wrap fadeInto` }>
					<div className="urlslab-panel urlslab-changesPanel customPadding">
						<div className="urlslab-panel-header">
							<h3>
								<a href={ title } target="_blank" rel="noreferrer">
									{ title }
									<IconAnchor />
								</a>
							</h3>
							<button className="urlslab-panel-close" onClick={ hidePanel }>
								<CloseIcon />
							</button>
						</div>
						{ chartResult.isSuccess &&
							<Chart data={ chartResult.data } header={ header } />
						}
						<div className="mt-l table-container" style={ { position: 'relative', top: 0, left: 0, zIndex: 1 } }>
							<Table
								slug={ slug }
								columns={ columns }
								data={ tableResult.isSuccess && tableResult.data }
							/>
						</div>
					</div>
				</div>
			) }

			{ ! tableResult.isLoading && ! tableResult.isSuccess && (
				<div className={ `urlslab-panel-wrap urlslab-panel-modal urlslab-changesPanel-wrap fadeInto` }>
					<div className="urlslab-panel urlslab-changesPanel customPadding">
						<div className="urlslab-panel-header">
							<h3>{ title }</h3>
							<button className="urlslab-panel-close" onClick={ hidePanel }>
								<CloseIcon />
							</button>
						</div>
						<div className="p-l">
							No Data found for this url. try to schedule this url to get data.
						</div>
					</div>
				</div>
			) }

		</>
	);
}

export default memo( ChangesPanel );
