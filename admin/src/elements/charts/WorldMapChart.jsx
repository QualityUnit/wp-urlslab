import { memo, useMemo, useCallback, useState } from 'react';

import {
	ComposableMap,
	Geographies,
	Geography,
	Sphere,
	Graticule,
} from 'react-simple-maps';

import countriesChartData from '../../app/countriesChartData.json';

import { useTheme } from '@mui/joy';
import Box from '@mui/joy/Box';
import Tooltip from '@mui/joy/Tooltip';

// get min and max value of key used to set color shade of country
const getMinMaxValues = ( data, colorKey ) => {
	if ( ! colorKey ) {
		return {};
	}
	const counts = Object.values( data ).map( ( entry ) => parseFloat( entry[ colorKey ] ) );
	const min = Math.min( ...counts );
	const max = Math.max( ...counts );
	return { min, max };
};

// get data for tooltip, loop passed optionsMapper and get only available data
const getTooltipData = ( countryData, optionsMapper ) => {
	const tooltipData = [];
	for ( const optionKey in optionsMapper ) {
		if ( countryData[ optionKey ] !== undefined ) {
			tooltipData.push( {
				optionName: optionsMapper[ optionKey ],
				optionValue: countryData[ optionKey ],
			} );
		}
	}
	return tooltipData;
};

/*
 *	data: { countryKey1 : { values }, countryKey2 : { values }, }
 *	optionsMapper: { optionKey1: "option name 1", optionKey2: "option name 2", ... }
 *		- options displayed for country in popup, optionKeys should be passed to map via 'data' object
 *	colorKey: data key used to fill countries with different color shades
 *	allowZoom: disabled usage until isn't fixed https://github.com/zcreativelabs/react-simple-maps/issues/343
		- disabling and enabling of <ZoomableGroup> component doesn't work
*/

const WorldMapChart = ( { data, optionsMapper, colorKey /*allowZoom = false*/ } ) => {
	const theme = useTheme();
	const primaryColors = theme.vars.palette.primary;
	// disabled usage until isn't fixed https://github.com/zcreativelabs/react-simple-maps/issues/343
	//const [ allowZoomState, setAllowZoomState ] = useState( allowZoom );
	const [ tooltip, setTooltip ] = useState( '' );
	const { min, max } = useMemo( () => getMinMaxValues( data, colorKey ), [ data, colorKey ] );

	const getCountryColor = useCallback( ( value ) => {
		if ( value < min || value > max || min === max ) {
			// fallback, even should not happen
			return 'var(--CountryMap-fill-active)';
		}
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
			} }
		>
			{ /*
			// disabled usage until isn't fixed https://github.com/zcreativelabs/react-simple-maps/issues/343
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
			*/ }
			<Tooltip
				title={ tooltip }
				placement="right"
				sx={ {
					p: 1.5,
					color: theme.vars.palette.text.secondary,
					background: theme.vars.palette.common.white,
					boxShadow: theme.vars.shadow.md,
					minWidth: '8rem',
					'.title-part': {
						fontSize: theme.vars.fontSize.sm,
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
				} }
				followCursor
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
									if ( colorKey ) {
										fillColor = getCountryColor( parseFloat( countryData[ colorKey ] ) );
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
			</Tooltip>
		</Box>
	);
};

const ChartTooltipContent = memo( ( { title, tooltipData } ) => (
	<>
		<Box className="title-part">{ title }</Box>
		<Box component="ul" className="data-part">
			{ tooltipData.map( ( item, key ) => {
				return (
					<Box
						key={ `${ key }-${ item.optionValue }` }
						component="li"
						className="data-part-item"
					>
						{ `${ item.optionName }: ${ item.optionValue }` }
					</Box>
				);
			} )
			}
		</Box>

	</>
) );

export default memo( WorldMapChart );
