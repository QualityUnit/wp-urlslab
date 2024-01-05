import { memo, useMemo, useCallback, useState } from 'react';
import { __ } from '@wordpress/i18n';

import {
	ComposableMap,
	Geographies,
	Geography,
	Sphere,
	Graticule,
} from 'react-simple-maps';

import countriesChartData from '../../app/countriesChartData.json';
import { setChartDataColors } from '../../lib/chartsHelpers';
import SvgIcon from '../../elements/SvgIcon';

import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Tooltip from '@mui/joy/Tooltip';
import { useTheme } from '@mui/joy';
import AbsoluteCoverBox from '../../elements/AbsoluteCoverBox';

// get min and max value of defined countryColorKey used to set color shade of country
const getMinMaxValues = ( data, countryColorKey ) => {
	const counts = Object.values( data ).map( ( countryData ) => {
		const value = countryData[ countryColorKey ];
		return value !== undefined ? value : 0;
	} );
	const min = Math.min( ...counts );
	const max = Math.max( ...counts );
	return { min, max };
};

// get data for tooltip, loop passed optionsMapper to get only wanted data, ie. only filtered parameter
const getTooltipData = ( countryData, optionsMapper ) => {
	const tooltipData = [];
	for ( const optionKey in optionsMapper ) {
		if ( countryData[ optionKey ] !== undefined ) {
			tooltipData.push( {
				optionKey,
				optionName: optionsMapper[ optionKey ],
				optionValue: countryData[ optionKey ],
			} );
		}
	}
	return tooltipData;
};

/**
 *
 * @example
 * data={{
 * 	us: { value1: 1, value2: 2, value3: 3 },
 * 	ca: { value1: 1, value2: 2, value3: 3 }
 * }}
 *
 * optionsMapper={{
 * 	value1: "Text in popup for value 1",
 * 	value2: "Text in popup for value 2",
 * 	value3: "Text in popup for value 3"
 * }}
 *
 * colorsMapper={{
 * 	value1: "proper CSS color code or MUI theme colors",
 * 	value2: "#ffffff",
 * 	value3: theme.vars.palette.primary.mainBg
 * }}
 *
 * countryColorKey="value2" // country color shades calculated on the base of values in value2 of countries data
 *
 * @param {Object}  props                 - component props
 * @param {Object}  props.data            - data in required format used to render chart, country key in 'alpha-2' two-letter format
 * @param {Object}  props.optionsMapper   - options displayed for country in popup, keys of optionsMapper should be available also in country data values as keys
 * @param {Object}  props.colorsMapper    - mapper used to define color for specific option displayed in country popup
 * @param {string}  props.countryColorKey - optionKey string that is used to determine color shade of country on the base of optionKey value
 * @param {boolean} props.allowZoom       - shows button to enable/disable map zoom and pan
 * @param {boolean} props.isReloading     - flag to cover chart with loader while reloading data
 */
const WorldMapChart = ( { data, optionsMapper, colorsMapper, countryColorKey, allowZoom = false, isReloading } ) => {
	// do not use allowZoom until isn't fixed https://github.com/zcreativelabs/react-simple-maps/issues/343
	const theme = useTheme();
	const primaryColors = theme.vars.palette.primary;
	const [ allowZoomState, setAllowZoomState ] = useState( false );
	const [ tooltip, setTooltip ] = useState( '' );
	const { min, max } = useMemo( () => countryColorKey ? getMinMaxValues( data, countryColorKey ) : {}, [ data, countryColorKey ] );

	// if data colors are not provided, loop default colors and set them to data in country popup
	const dataColors = colorsMapper ? { ...colorsMapper } : setChartDataColors( optionsMapper );

	const getCountryColor = useCallback( ( value ) => {
		if ( value < min || value > max || min === max ) {
			// fallback, even should not happen
			return 'var(--CountryMap-fill-active)';
		}
		// percentual position of value in min-max range
		const position = ( ( value - min ) / ( max - min ) ) * 100;
		if ( position < 20 ) {
			return primaryColors[ 300 ];
		}
		if ( position >= 20 && position < 40 ) {
			return primaryColors[ 400 ];
		}
		if ( position >= 40 && position < 60 ) {
			return primaryColors[ 500 ];
		}
		if ( position >= 60 && position < 80 ) {
			return primaryColors[ 600 ];
		}
		if ( position >= 80 ) {
			return primaryColors[ 700 ];
		}
	}, [ max, min, primaryColors ] );

	return (
		<Box
			sx={ {
				'--CountryMap-fill': theme.vars.palette.neutral[ 300 ],
				'--CountryMap-fill-active': theme.vars.palette.primary[ 500 ],
				position: 'relative',
				maxWidth: 2000,
				margin: '0 auto',
			} }
		>

			{ allowZoom && <ZoomToggleButton allowZoomState={ allowZoomState } setAllowZoomState={ setAllowZoomState } /> }

			<Tooltip
				title={ tooltip }
				placement="right"
				countryMapTooltip
				followCursor
			>
				<Box
					sx={ {
						position: 'relative',
						...( isReloading ? { opacity: 0.3 } : null ),
					} }
				>

					<ComposableMap
					// optimal aspect ratio and scale for used projection
						width={ 680 }
						height={ 320 }
						projection="geoEqualEarth"
						projectionConfig={ {
							scale: 120,
						} }
					>

						<Sphere stroke="#e5e5e5" strokeWidth={ 0.5 } />
						<Graticule stroke="#e5e5e5" strokeWidth={ 0.5 } />
						<Geographies geography={ countriesChartData }>
							{ ( { geographies } ) =>
								geographies.map( ( geo ) => {
									const currentCode = geo.properties[ 'alpha-2' ].toLowerCase();
									const countryData = data[ currentCode ];
									let fillColor = 'var(--CountryMap-fill)';
									if ( countryData ) {
										fillColor = 'var(--CountryMap-fill-active)';
										if ( countryColorKey ) {
											fillColor = getCountryColor( countryData[ countryColorKey ] === undefined ? min : countryData[ countryColorKey ] );
										}
									}
									return <Geography
										strokeWidth={ 32 }
										key={ geo.rsmKey }
										geography={ geo }
										onMouseEnter={ () => {
											if ( countryData ) {
												const tooltipData = getTooltipData( countryData, optionsMapper );
												if ( tooltipData.length ) {
													setTooltip(
														<ChartTooltipContent
															title={ geo.properties.name }
															tooltipData={ tooltipData }
															dataColors={ dataColors }
														/>
													);
												}
											}
										} }
										onMouseLeave={ () => {
											setTooltip( '' );
										} }
										style={ {
											default: {
												fill: fillColor,
												outline: 'none',
											},
											hover: {
												fill: fillColor,
												outline: 'none',
											},
											pressed: {
												fill: fillColor,
												outline: 'none',
											},
										} }
									/>;
								} )
							}
						</Geographies>
					</ComposableMap>
				</Box>
			</Tooltip>
			{ isReloading && <AbsoluteCoverBox /> }
		</Box>
	);
};

const ChartTooltipContent = memo( ( { title, tooltipData, dataColors } ) => (
	<>
		<Box
			sx={ ( theme ) => ( {
				fontSize: theme.vars.fontSize.sm,
				fontWeight: theme.vars.fontWeight.xl,
				pb: 1, mb: 1, borderBottom: `1px solid ${ theme.vars.palette.divider }`,
			} ) }
		>{ title }</Box>
		<Box component="ul"
			sx={ ( theme ) => ( {
				fontSize: theme.vars.fontSize.xs,
				m: 0,
				li: { m: 0 },
			} ) }>
			{ tooltipData.map( ( item, key ) => {
				return (
					<Box
						key={ `${ key }-${ item.optionValue }` }
						component="li"
						className="data-part-item"
						sx={ { ...( dataColors[ item.optionKey ] ? { color: dataColors[ item.optionKey ] } : null ) } }
					>
						{ `${ item.optionName }: ${ item.optionValue }` }
					</Box>
				);
			} )
			}
		</Box>
	</>
) );

const ZoomToggleButton = memo( ( { allowZoomState, setAllowZoomState } ) => (
	<Button
		variant="soft"
		color={ allowZoomState ? 'primary' : 'neutral' }
		onClick={ () => setAllowZoomState( ( s ) => ! s ) }
		startDecorator={
			allowZoomState
				? <SvgIcon name="legend-marker-disabled" />
				: <SvgIcon name="search-zoom-in" />
		}
		sx={ {
			position: 'absolute',
			bottom: 2,
			right: 2,
		} }
	>
		{ allowZoomState ? __( 'Disable zoom' ) : __( 'Enable zoom' ) }
	</Button>
) );

export default memo( WorldMapChart );
