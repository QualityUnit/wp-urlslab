import { memo, useCallback, useState } from 'react';

import {
	AreaChart as RechartsAreaChart,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from 'recharts';

import Box from '@mui/joy/Box';
import { Button, ButtonGroup } from '@mui/joy';
import SvgIcon from '../SvgIcon';

// set of colors that are used for chart lines if no color mapper is provided
const defaultColors = [ '#118AF7', '#9154CE', '#48C6CE', '#FFB928', '#B44B85', '#E5732F', '#43A047', '#FF7043', '#7986CB', '#FF8F00', '#5C6BC0', '#4DB6AC', '#FF5252', '#FFD600', '#607D8B' ];

const setColors = ( mapper ) => {
	const colorMapping = {};
	Object.keys( mapper ).forEach( ( key, index ) => {
		const colorIndex = index % defaultColors.length;
		const color = defaultColors[ colorIndex ];
		colorMapping[ key ] = color;
	} );
	return colorMapping;
};

/*
 *	chartsMapper: { chartKey1: chartName1, chartKey2: chartName2, ... }
		- main indicator of charts that going to be rendered, object of charts keys and their names
 *	colorsMapper: { chartKey1: #color, chartKey2: #color, ... }
		- colors for every chart key
 *	legendTitlesMapper: { chartKey1: shortenedChartName1, chartKey2: shortenedChartName2, ... }
		- if necessary, use shortened names in legend
*/
const AreaChart = ( { data, height, xAxisKey, chartsMapper, colorsMapper, legendTitlesMapper } ) => {
	const [ hiddenCharts, setHiddenCharts ] = useState( {} );
	// if colors are not provided, loop default colors and set them to chart lines
	const chartsColors = colorsMapper ? { ...colorsMapper } : setColors( chartsMapper );

	return (
		<Box>

			<Box
				sx={ ( theme ) => ( {
					height: 0,
					position: 'relative',
					paddingBottom: `${ height }px`,

					fontSize: theme.vars.fontSize.sm,
					'.recharts-responsive-container': {
						position: 'absolute',
						top: 0,
						left: 0,
					},
				} ) }
			>
				<ResponsiveContainer width="100%" height={ height }>
					<RechartsAreaChart
						height={ height }
						data={ data }
					>
						<defs>
							{
								Object.keys( chartsMapper ).map( ( key ) => {
									return <linearGradient key={ `fill${ key }` } id={ `fill-${ key }` } x1="0" y1="0" x2="0" y2="1">
										<stop offset="5%" stopColor={ chartsColors[ key ] } stopOpacity={ 0.2 } />
										<stop offset="95%" stopColor="#fff" stopOpacity={ 0 } />
									</linearGradient>;
								} )
							}
						</defs>
						<CartesianGrid vertical={ false } />
						<XAxis
							dataKey={ xAxisKey }
							includeHidden
						/>
						<YAxis
							domain={ [ 0, 'dataMax' ] }
							includeHidden
						/>
						<Tooltip content={ <ChartTooltipContent /> } />
						<Legend
							content={ <CustomLegend buttonsData={ { chartsMapper, chartsColors, legendTitlesMapper, hiddenCharts, setHiddenCharts } } /> }
							align="left"
							verticalAlign="top"
						/>
						{
							Object.entries( chartsMapper ).map( ( [ key, name ] ) => {
								return (
									<Area key={ key }
										type="monotone"
										dataKey={ key }
										name={ name }
										strokeWidth={ 4 }
										stroke={ chartsColors[ key ] }
										fill={ `url(#fill-${ key })` }
										dot={ false }
										activeDot={ hiddenCharts[ key ] ? false : {
											stroke: '#fff',
											fill: chartsColors[ key ],
											strokeWidth: 4,
											r: 10,
										} }
										hide={ hiddenCharts[ key ] }
									/>
								);
							} )
						}
					</RechartsAreaChart>
				</ResponsiveContainer>
			</Box>
		</Box>
	);
};

const CustomLegend = memo( ( props ) => {
	// availalbe is payload if necessary: const { payload } = props;
	const { buttonsData } = props;
	const { chartsMapper, chartsColors, legendTitlesMapper, hiddenCharts, setHiddenCharts } = buttonsData;

	const handleHiddenCharts = useCallback( ( key ) => {
		setHiddenCharts( ( s ) => {
			return { ...s, [ key ]: ! s[ key ] };
		} );
	}, [ setHiddenCharts ] );

	return (
		<>
			<ButtonGroup
				sx={ { mb: 2 } }
			>
				{ Object.entries( chartsMapper ).map( ( [ key, value ] ) => {
					return (
						<Button
							key={ key }
							variant="plain"
							size="sm"
							onClick={ () => handleHiddenCharts( key ) }
							startDecorator={
								hiddenCharts[ key ]
									? <SvgIcon name="legend-marker-disabled" />
									: <SvgIcon name="legend-marker" />
							}
							sx={ ( theme ) => ( {
								fontWeight: theme.vars.fontWeight.md,
								...( ! hiddenCharts[ key ] && {
									'--Icon-color': chartsColors[ key ],
								} ),

								/*
								// maybe keep styles to handle fully colored buttons background with custom colors opacity, if needed in future
								backgroundColor: chartsColors[ key ],
								color: theme.vars.palette.common.white,
								fontWeight: theme.vars.fontWeight.md,
								...( hiddenCharts[ key ] && { backgroundColor: `rgba(${ hexToRgbChannel( chartsColors[ key ] ) } / 0.35 )` } ),
								'&:hover': {
									backgroundColor: `rgba(${ hexToRgbChannel( chartsColors[ key ] ) } / 0.85 )`,
								},
								*/
							} ) }
							wider
						>
							{ legendTitlesMapper ? legendTitlesMapper[ key ] : value }
						</Button>
					);
				} ) }
			</ButtonGroup>
		</>
	);
} );

const ChartTooltipContent = memo( ( props ) => {
	const { active, payload, label } = props;

	if ( active && payload && payload.length ) {
		return (
			<Box sx={ ( theme ) => ( {
				fontSize: theme.vars.fontSize.sm,
				p: 1.5,
				background: theme.vars.palette.common.white,
				boxShadow: theme.vars.shadow.md,
				borderRadius: theme.vars.radius.md,
				'.title-part': {
					pb: 1, mb: 1, borderBottom: `1px solid ${ theme.vars.palette.divider }`,
				},
				'.data-part': {
					fontSize: theme.vars.fontSize.xs,
					m: 0,
					'&-item': {
						m: 0,
					},
				},
			} ) }>
				<Box className="title-part">{ label }</Box>
				<Box component="ul" className="data-part">
					{ payload.map( ( entry ) => {
						const { dataKey, color, name, value } = entry;
						return (
							<Box
								key={ dataKey }
								component="li"
								className="data-part-item"
								sx={ { color } }
							>
								{ `${ name }: ${ value }` }
							</Box>
						);
					} )
					}
				</Box>

			</Box>
		);
	}
	return null;
} );

export default memo( AreaChart );
