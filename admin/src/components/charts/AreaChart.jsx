import { memo, useCallback, useState } from 'react';

import {
	AreaChart as RechartsAreaChart,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip as RechartsTooltip,
	Legend,
	ResponsiveContainer,
} from 'recharts';

import SvgIcon from '../../elements/SvgIcon';
import { setChartDataColors } from '../../lib/chartsHelpers';

import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import ButtonGroup from '@mui/joy/ButtonGroup';

/**
 *
 * @example
 * data={[
 * 	{
 * 		optionKey: "x axis text 1"
 * 		optionKey1: value1,
 * 		optionKey2: value2,
 * 		optionKey3: value3
 * 	},
 * 	{
 * 		optionKey: "x axis text 2"
 * 		optionKey1: value11,
 * 		optionKey2: value22,
 * 		optionKey3: value33
 * 	}
 * ]}
 *
 * chartsMapper={{
 * 	optionKey1: "Text in popup",
 * 	optionKey2: "Text in popup",
 * 	optionKey3: "Text in popup"
 * }}
 *
 * legentTitlesMapper={{
 * 	optionKey1: "shortened text in legend",
 * 	optionKey2: "shortened text in legend",
 * 	optionKey3: "shortened text in legend"
 * }}
 *
 * colorsMapper={{
 * 	value1: "proper CSS color code or MUI theme colors",
 * 	value2: "#ffffff",
 * 	value3: theme.vars.palette.primary.mainBg
 * }}
 *
 * @param {Object}        props                    - component props
 * @param {Array<Object>} props.data               - data in required format used to render chart, refer to https://recharts.org/en-US/api
 * @param {number}        props.height             - height of chart, use number in pixels
 * @param {string}        props.xAxisKey           - optionKey from data used as x axis
 * @param {Object}        props.chartsMapper       - object containing optionKeys from chart data and text that represent chart in popup
 * @param {Object}        props.legendTitlesMapper - not required object with shortened options labels used in legend, if not provided, used are labels from chartsMapper
 * @param {Object}        props.colorsMapper       - mapper used to define color for specific option displayed in country popup
 */
const AreaChart = ( { data, height, xAxisKey, chartsMapper, colorsMapper, legendTitlesMapper } ) => {
	const [ hiddenCharts, setHiddenCharts ] = useState( {} );
	// if charts colors are not provided, loop default colors and set them to chart lines
	const chartsColors = colorsMapper ? { ...colorsMapper } : setChartDataColors( chartsMapper );

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
						<RechartsTooltip content={ <ChartTooltipContent /> } />
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
							size="xs"
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
					color: theme.vars.palette.text.secondary,
					fontWeight: theme.vars.fontWeight.xl,
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
