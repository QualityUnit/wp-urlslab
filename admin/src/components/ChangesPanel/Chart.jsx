/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import { memo, useCallback, useState } from 'react';
import { date, getSettings } from '@wordpress/date';
import {
	AreaChart,
	LineChart,
	Area,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from 'recharts';

const Chart = ( { data, header } ) => {
	const [ lineVisibility, setLineVisibility ] = useState( {} );

	const chart = {
		status_code: '#118AF7',
		load_duration: '#B44B85',
		word_count: '#FFB928',
		requests: '#48C6CE',
		page_size: '#9154CE',
	};

	const renderLegend = useCallback( ( { payload } ) => {
		return (
			<ul className="urlslab-chart-legend flex-align-center">
				{
					payload.map( ( entry, index ) => {
						const { dataKey, color, value } = entry;
						if ( dataKey === 'status_code' ) {
							return null;
						}
						return <li key={ `item-${ index }` } style={ { backgroundColor: color } }>
							<label
								onClick={ () => {
									setLineVisibility( ( obj ) => {
										return { ...obj, [ dataKey ]: ! obj[ dataKey ] };
									} );
								} }
							>
								<input type="checkbox" defaultChecked={ ! lineVisibility[ dataKey ] } />
								{ value }
							</label>
						</li>;
					} )
				}
			</ul>
		);
	}, [ lineVisibility ] );

	const renderTooltip = ( { active, label, payload } ) => {
		if ( active && payload && payload.length ) {
			return (

				<div className="recharts-default-tooltip">
					<div className="recharts-tooltip-label fs-xm flex flex-align-center">
						{ date( getSettings().formats.date, label * 1000 ) }
						<span className="ma-left">{ date( getSettings().formats.time, label ).replace( /: /, ':' ) }</span>
					</div>
					<ul className="recharts-tooltip-item-list">
						{ payload.map( ( entry ) => {
							const { dataKey, color, name, value } = entry;
							return ( <li key={ dataKey } style={ { color: `${ color }` } }>
								{ `${ name.replace( / ?hidden/, '' ) }: ` }
								{ dataKey !== 'status_code' && dataKey !== 'page_size' && dataKey !== 'load_duration' &&
                                    value
								}

								{ dataKey === 'status_code' &&
								<>
									{
										value >= 200 && value <= 299 &&
										<span className="c-saturated-green">OK</span>
									}
									{
										value >= 300 && value <= 399 &&
										<span className="c-saturated-orange">Redirect</span>
									}
									{ ( value >= 400 || value < 0 ) &&
									<span className="c-saturated-red">{ value }</span>
									}
								</>
								}
								{
									dataKey === 'page_size' &&
                                    `${ parseFloat( value / 1024 / 1024 ).toFixed( 2 ) }\u00A0MB`
								}

								{ dataKey === 'load_duration' &&
                                    `${ parseFloat( value / 1000 ).toFixed( 2 ) }\u00A0s`
								}
							</li> );
						} )
						}
					</ul>
					<div>
						<span className="urlslab-tooltip-thumbnail" style={ { maxWidth: '15rem' } }>
							{
								payload[ 0 ].payload.screenshot && <img src={ payload[ 0 ].payload.screenshot.thumbnail } alt="thumbnail" />
							}
						</span>
					</div>
				</div>
			);
		}
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
			<AreaChart
				width={ 1400 }
				height={ 300 }
				data={ data }
				margin={ {
					top: 24,
					left: 24,
					right: 24,
					bottom: 0,
				} }
				style={ { position: 'absolute', top: 0, left: 0, zIndex: 5 } }
			>
				<defs>
					{
						Object.entries( chart ).map( ( [ key, color ] ) => {
							return <linearGradient key={ `fill${ key }` } id={ `fill-${ key }` } x1="0" y1="0" x2="0" y2="1">
								<stop offset="5%" stopColor={ color } stopOpacity={ 0.2 } />
								<stop offset="95%" stopColor="#fff" stopOpacity={ 0 } />
							</linearGradient>;
						} )
					}
				</defs>
				<CartesianGrid />
				<XAxis dataKey="last_seen" includeHidden={ true } tick={ <XAxisTick /> } />
				<Tooltip content={ renderTooltip } />
				<Legend content={ renderLegend } align="left" verticalAlign="top" />
				{
					Object.entries( chart ).map( ( [ key, color ] ) => {
						return <>
							<YAxis hide={ true } yAxisId={ key } domain={ [ 'dataMin', 'dataMax' ] }
								scale={ key === 'load_duration' ? 'time' : 'auto' } />
							<Area type="monotone" key={ key }
								name={ `${ header[ key ] } ${ key === 'status_code' ? 'hidden' : '' }` } yAxisId={ key }
								hide={ lineVisibility[ key ] } dataKey={ key } stroke={ color } strokeWidth={ 4 }
								fill={ `url(#fill-${ key })` } dot={ false }
								activeDot={ key === 'status_code' || lineVisibility[ key ] ? false : {
									stroke: '#fff',
									fill: color,
									strokeWidth: 4,
									r: 10,
								} } />
						</>;
					} )
				}
			</AreaChart>
		</ResponsiveContainer>
	</div>;
};

export default memo( Chart );
