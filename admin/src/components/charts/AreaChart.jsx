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
	ReferenceLine,
	ReferenceArea,
	Label,
} from 'recharts';

import SvgIcon from '../../elements/SvgIcon';
import { setChartDataColors } from '../../lib/chartsHelpers';

import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import ButtonGroup from '@mui/joy/ButtonGroup';
import AbsoluteCoverBox from '../../elements/AbsoluteCoverBox';
import { ChartTooltipContent } from './elements';

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
 *
 * 		optionKey: "x axis text 2"
 *  	optionKey1: value11,
 * 		optionKey2: value22,
 * 		optionKey3: value33
 * 	}
 * ]}
 *
 *	chartsMapper={{
 *		optionKey1: "Text in popup",
 *		optionKey2: "Text in popup",
 *		optionKey3: "Text in popup"
 *	}}
 *
 *	legentTitlesMapper={{
 *		optionKey1: "shortened text in legend",
 *		optionKey2: "shortened text in legend",
 *		optionKey3: "shortened text in legend"
 *	}}
 *
 *	colorsMapper={{
 *		value1: "proper CSS color code or MUI theme colors",
 *		value2: "#ffffff",
 *		value3: theme.vars.palette.primary.mainBg
 *	}}
 *
 * @param {Object}        props                           - component props
 * @param {Array<Object>} props.data                      - data in required format used to render chart, refer to https://recharts.org/en-US/api
 * @param {number}        props.height                    - height of chart, use number in pixels
 * @param {string}        props.xAxisKey                  - optionKey from data used as x axis
 * @param {Object}        props.yAxisProps                - object with Y axis props
 * @param {Object}        props.xAxisProps                - object with X axis props
 * @param {Object}        props.cartesianGridProps        - object with CartesianGrid props
 * @param {Object}        props.chartsMapper              - object containing optionKeys from chart data and text that represent chart in popup
 * @param {Object}        props.legendTitlesMapper        - not required object with shortened options labels used in legend, if not provided, used are labels from chartsMapper
 * @param {Object}        props.colorsMapper              - mapper used to define color for specific option displayed popup
 * @param {boolean}       props.hideLegend                - do not show chart legend
 * @param {boolean}       props.hideYaxis                 - do not show chart Y axis
 * @param {boolean}       props.isReloading               - flag to cover chart with loader while reloading data
 * @param {Array<Object>} props.referenceLines            - data for ReferenceLine components
 * @param {Object}        props.referenceAreas            - data for ReferenceArea components
 * @param {Object}        props.actions                   - object with event functions for appropriate chart component
 * @param {Function}      props.appendTooltipContent      - function to append custom content after default tooltip data
 * @param {boolean}       props.colorizedTooltipValues    - show values in tooltip colored like chart, or use default text color
 * @param {boolean}       props.showReferenceAreasOnHover - reference areas will be displayed only on hover event
 * @param {Function}      props.handleTooltipValue        - function to customize default output of value in popup
 */
const AreaChart = ( { data, height, xAxisKey, chartsMapper, colorsMapper, legendTitlesMapper, xAxisProps, yAxisProps, cartesianGridProps, referenceLines, referenceAreas, hideLegend, hideYaxis, isReloading, actions, appendTooltipContent, colorizedTooltipValues, showReferenceAreasOnHover, handleTooltipValue } ) => {
	const [ hiddenCharts, setHiddenCharts ] = useState( {} );
	// if charts colors are not provided, loop default colors and set them to chart lines
	const chartsColors = colorsMapper ? { ...colorsMapper } : setChartDataColors( chartsMapper );

	return (
		<Box position="relative">
			<Box
				sx={ ( theme ) => ( {
					height: 0,
					position: 'relative',
					paddingBottom: `${ height }px`,
					fontSize: theme.vars.fontSize.sm,
					'.recharts-responsive-container': { position: 'absolute', top: 0, left: 0 },
					...( isReloading ? { opacity: 0.3 } : null ),
					...( showReferenceAreasOnHover ? {
						'.recharts-wrapper .recharts-reference-area > path': { opacity: 0, transition: `opacity ${ theme.transition.general.duration }` },
						'.recharts-wrapper:hover .recharts-reference-area > path': { opacity: 0.1 },
					} : null ),
				} ) }
			>
				<ResponsiveContainer width="100%" height={ height }>
					<RechartsAreaChart
						height={ height }
						data={ data }
						margin={ {
							top: hideLegend ? 15 : 5, // default: 5
						} }
						onMouseMove={ actions?.chart?.onMouseMove }
						onMouseEnter={ actions?.chart?.onMouseEnter }
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
						<CartesianGrid vertical={ false } { ...cartesianGridProps } />

						{ referenceLines && referenceLines.map( ( refLineData ) => (
							<ReferenceLine
								key={ refLineData.key }
								y={ refLineData.y }
								stroke={ refLineData.color }
								strokeWidth={ 1 }
								strokeDasharray="6"
								label={ refLineData.label && <Label position="bottom" { ...refLineData.label } /> }
							/>
						) ) }

						{ referenceAreas && referenceAreas.map( ( refAreaData ) => (
							<ReferenceArea
								key={ refAreaData.key }
								className={ refAreaData.key }
								x1={ refAreaData.start?.x }
								y1={ refAreaData.start?.y }
								x2={ refAreaData.end?.x }
								y2={ refAreaData.end?.y }
								fill={ refAreaData.color }
								opacity={ 1 }
								fillOpacity={ 1 }
								strokeWidth={ 0 }
								label={ refAreaData.label && <Label position="insideBottomLeft" { ...refAreaData.label } /> }
								ifOverflow="hidden"
							/>
						) ) }

						<XAxis dataKey={ xAxisKey } { ...xAxisProps } />

						{ ! hideYaxis &&
							<YAxis
								width={ yAxisProps?.tickCount === 0 ? 0 : undefined }
								domain={ yAxisProps?.domain || [ 'dataMin', 'dataMax' ] }
								{ ...yAxisProps }
							/>
						}

						<RechartsTooltip content={ <ChartTooltip appendContent={ appendTooltipContent } colorizedTooltipValues={ colorizedTooltipValues } handleTooltipValue={ handleTooltipValue } /> } />

						{ ! hideLegend &&
							<Legend
								content={ <CustomLegend buttonsData={ { chartsMapper, chartsColors, legendTitlesMapper, hiddenCharts, setHiddenCharts } } /> }
								align="left"
								verticalAlign="top"
							/>
						}

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
										connectNulls
										hide={ hiddenCharts[ key ] }
									/>
								);
							} )
						}
					</RechartsAreaChart>
				</ResponsiveContainer>
			</Box>
			{ isReloading && <AbsoluteCoverBox /> }
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
				sx={ { mb: 3 } }
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

const ChartTooltip = memo( ( props ) => {
	const { active, payload, label, appendContent, colorizedTooltipValues, handleTooltipValue } = props;
	if ( active && payload && payload.length ) {
		// customize wrapper around ChartTooltipContent to show the same tooltip through different chart types
		return (
			<Box sx={ ( theme ) => ( {
				fontSize: theme.vars.fontSize.sm,
				p: 1.5,
				background: theme.vars.palette.common.white,
				boxShadow: theme.vars.shadow.md,
				borderRadius: theme.vars.radius.sm,
			} ) }>
				<ChartTooltipContent
					title={ label }
					data={ payload.map( ( entry ) => ( {
						key: entry.dataKey,
						color: colorizedTooltipValues && entry.color ? entry.color : null,
						name: entry.name,
						value: handleTooltipValue ? handleTooltipValue( entry.value ) : entry.value,
					} ) ) }
					appendContent={ appendContent( payload ) }
				/>
			</Box>
		);
	}
	return null;
} );

export default memo( AreaChart );
