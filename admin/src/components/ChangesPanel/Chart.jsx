/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import { memo, useCallback, useState } from 'react';
import { date, getSettings } from '@wordpress/date';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Chart = ( { data, header } ) => {
	const [ lineVisibility, setLineVisibility ] = useState( {} );

	const chart = {
		status_code: '#118AF7',
		load_duration: '#B44B85',
		word_count: '#FFB928',
		requests: '#48C6CE',
		page_size: '#9154CE',
	};

	const renderLegend = useCallback( ( props ) => {
		const { payload } = props;

		return (
			<ul className="urlslab-chart-legend flex-align-center">
				{
					payload.map( ( entry, index ) => {
						const { dataKey, color, name, inactive, value } = entry;
						if ( dataKey === 'status_code' ) {
							return null;
						}
						return <li key={ `item-${ index }` } style={ { backgroundColor: color } }>
							<label onClick={ ( event ) => setLineVisibility( ( obj ) => {
								const val = lineVisibility[ dataKey ];
								// console.log( val );

								return { [ dataKey ]: ! val, ...obj };
							} ) }>
								<input type="checkbox" defaultChecked={ ! lineVisibility[ dataKey ] } />
								{ value }
							</label>
						</li>;
					} )
				}
			</ul>
		);
	}, [ lineVisibility ] );

	// console.log( lineVisibility );

	const renderTooltip = ( props ) => {
		const { dataKey, value } = props;

		if ( dataKey === 'status_code' ) {
			const status = value;
			if ( status >= 200 && status <= 299 ) {
				return <span className="c-saturated-green">OK</span>;
			}
			if ( status >= 300 && status <= 399 ) {
				return <span className="c-saturated-orange">Redirect</span>;
			}
			return <span className="c-saturated-red">{ status }</span>;
		}

		if ( dataKey === 'page_size' ) {
			return `${ parseFloat( value / 1024 / 1024 ).toFixed( 2 ) }\u00A0MB`;
		}

		if ( dataKey === 'load_duration' ) {
			return `${ parseFloat( value / 1000 ).toFixed( 2 ) }\u00A0s`;
		}

		return value;
	};

	const XAxisTick = ( props ) => {
		const { x, y, payload } = props;

		return (
			<g transform={ `translate(${ x },${ y })` }>
				<text x={ 0 } y={ 0 } dy={ 16 } textAnchor="end" fill="#050505" fontSize={ 13 }>
					{ date( getSettings().formats.date, payload.value * 1000 ) }
				</text>
			</g>
		);
	};

	return <div style={ { position: 'relative', width: '100%', height: 0, paddingBottom: '21.5%' } }>
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
				<XAxis dataKey="last_seen" includeHidden={ true } tick={ <XAxisTick /> } />
				<Tooltip
					active={ true }
					formatter={ ( value, name, props ) => renderTooltip( props ) }
					labelFormatter={ ( val ) => (
						<div className="flex flex-align-center">
							{ date( getSettings().formats.date, val * 1000 ) }
							<span className="ma-left">{ date( getSettings().formats.time, val ).replace( /: /, ':' ) }</span>
						</div>
					) }
				/>
				<Legend content={ renderLegend } align="left" verticalAlign="top" />
				{
					Object.entries( chart ).map( ( [ key, color ] ) => {
						return <>
							<YAxis hide={ true } yAxisId={ key } domain={ [ 'dataMin', 'dataMax' ] } scale={ key === 'load_duration' ? 'time' : 'auto' } />
							<Line type="monotone" key={ key } name={ `${ header[ key ] } ${ key === 'status_code' ? 'hidden' : '' }` } yAxisId={ key } hide={ lineVisibility[ key ] } dataKey={ key } stroke={ color } strokeWidth={ 4 } activeDot={ key === 'status_code' || lineVisibility[ key ] ? false : { stroke: '#fff', fill: color, strokeWidth: 4, r: 10 } } />
						</>;
					} )
				}
			</LineChart>
		</ResponsiveContainer>
	</div>;
};

export default memo( Chart );
