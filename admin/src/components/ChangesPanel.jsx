import { memo, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import { useI18n } from '@wordpress/react-i18n';
import { date, getSettings } from '@wordpress/date';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import { postFetch } from '../api/fetching';
import useCloseModal from '../hooks/useCloseModal';
import useTablePanels from '../hooks/useTablePanels';

import Table from './TableComponent';
import '../assets/styles/components/_ChangesPanel.scss';
import DateTimeFormat from '../elements/DateTimeFormat';

function ChangesPanel() {
	const { __ } = useI18n();
	const columnHelper = useMemo( () => createColumnHelper(), [] );
	const { CloseIcon, handleClose } = useCloseModal();
	const { title, slug } = useTablePanels( ( state ) => state.options.changesPanel );

	function hidePanel() {
		handleClose();
	}

	const { data, isSuccess } = useQuery( {
		queryKey: [ slug ],
		queryFn: async () => {
			const result = await postFetch( slug );
			return result.json();
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

	const chart = {
		status_code: '#118AF7',
		load_duration: '#B44B85',
		word_count: '#FFB928',
		requests: '#48C6CE',
		page_size: '#9154CE',
	};

	const renderLegend = ( props ) => {
		const { payload } = props;
		// console.log( props );

		return (
			<ul className="urlslab-chart-legend flex-align-center">
				{
					payload.map( ( entry, index ) => (
						<li key={ `item-${ index }` } style={ { backgroundColor: entry.color } }>
							<input type="checkbox" checked={ entry.payload.hide } onClick={ () => ! entry.payload.hide } />
							{ entry.value }
						</li>
					) )
				}
			</ul>
		);
	};

	const columns = [
		columnHelper.accessor( 'screenshot', {
			id: 'thumb',
			className: 'nolimit thumbnail',
			cell: ( cell ) => <img src={ cell?.getValue().thumbnail } className="video-thumbnail" alt={ title } />,
			header: () => header.screenshot,
			size: 120,
		} ),
		columnHelper.accessor( 'last_seen', {
			cell: ( cell ) => <DateTimeFormat datetime={ cell.getValue() } />,
			header: () => header.last_seen,
			size: 80,
		} ),
		columnHelper.accessor( 'last_changed', {
			cell: ( cell ) => <DateTimeFormat datetime={ cell.getValue() } />,
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
	];

	const renderTooltip = ( props ) => {
		const { dataKey, value } = props;

		if ( dataKey === 'page_size' ) {
			return `${ parseFloat( value / 1024 / 1024 ).toFixed( 2 ) }\u00A0MB`;
		}

		if ( dataKey === 'load_duration' ) {
			return `${ parseFloat( value / 1000 ).toFixed( 2 ) }\u00A0s`;
		}

		return value;
	};

	return (
		<div className={ `urlslab-panel-wrap urlslab-panel-modal urlslab-changesPanel-wrap fadeInto` }>
			<div className="urlslab-panel urlslab-changesPanel customPadding">
				<div className="urlslab-panel-header">
					<h3>{ title }</h3>
					<button className="urlslab-panel-close" onClick={ hidePanel }>
						<CloseIcon />
					</button>
				</div>
				<div style={ { position: 'relative', width: '100%', height: 0, paddingBottom: '21.5%' } }>
					<ResponsiveContainer width="100%" height="100%">
						<LineChart
							width={ 1400 }
							height={ 300 }
							data={ data }
							margin={ {
								top: 24,
								left: 24,
								right: 24,
								bottom: 0,
							} }
						>
							<CartesianGrid />
							<XAxis dataKey="last_seen" reversed={ true } tickFormatter={ ( val ) => date( getSettings().formats.date, val * 1000 ) } />
							<Tooltip
								formatter={ ( value, name, props ) => renderTooltip( props ) }
								labelFormatter={ ( val ) => date( getSettings().formats.date, val * 1000 ) } />
							<Legend content={ renderLegend } align="left" verticalAlign="top" />
							{
								Object.entries( chart ).map( ( [ key, color ] ) => {
									return <>
										<YAxis hide={ true } yAxisId={ key } domain={ [ 'dataMin', 'dataMax' ] } scale={ key === 'load_duration' ? 'time' : 'auto' } />
										<Line type="monotone" key={ key } name={ header[ key ] } hide={ key === 'status_code' } yAxisId={ key } dataKey={ key } stroke={ color } strokeWidth={ 4 } />
									</>;
								} )
							}
						</LineChart>
					</ResponsiveContainer>
				</div>
				<div className="mt-l table-container">
					<Table
						slug={ slug }
						columns={ columns }
						data={ isSuccess && data }
					/>
				</div>
			</div>
		</div>
	);
}

export default memo( ChangesPanel );
