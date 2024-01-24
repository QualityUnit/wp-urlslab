import { useMemo } from 'react';
import { __ } from '@wordpress/i18n';
import { useTheme } from '@mui/joy';
import useColumnTypesQuery from '../queries/useColumnTypesQuery';

export const defualtMetric = 'L';
export const metricRatingTitles = {
	g: __( 'Good' ),
	n: __( 'Needs improvement' ),
	p: __( 'Poor' ),
};
export const metricsRatingBreakpoints = {
	L: { g: 2.5, n: 4 }, //sec
	F: { g: 100, n: 300 }, //ms
	P: { g: 1.8, n: 3 }, //sec
	C: { g: 0.1, n: 0.25 },
	T: { g: 0.8, n: 1.8 }, //sec
	I: { g: 200, n: 500 }, //ms
};

export const metricsUnits = {
	L: 's',
	F: 'ms',
	P: 's',
	C: '',
	T: 's',
	I: 'ms',
};

// get metric value with appropriate unit
export const getMetricWithUnit = ( value, metric ) => `${ value }${ metricsUnits[ metric ] }`;

export const useMetricRatingColors = () => {
	const theme = useTheme();
	return {
		g: theme.palette.success[ 400 ],
		n: theme.palette.warning[ 400 ],
		p: theme.palette.danger[ 400 ],
	};
};

export const useMetricTypes = ( slug ) => {
	const { columnTypes } = useColumnTypesQuery( slug );
	if ( columnTypes?.metric_type?.values ) {
		const metricTypes = columnTypes.metric_type.values;
		const shortenedMetricTypes = {};
		for ( const m in metricTypes ) {
			shortenedMetricTypes[ m ] = metricTypes[ m ].split( ' ' )[ 0 ];
		}
		return { metricTypes, shortenedMetricTypes };
	}
	return {};
};

// get rating code by rating value considering defined breakpoints
export const getMetricRatingCode = ( value, breakpoints ) => {
	if ( value <= breakpoints.g ) {
		return 'g';
	}
	if ( value > breakpoints.g && value <= breakpoints.n ) {
		return 'n';
	}
	if ( value > breakpoints.n ) {
		return 'p';
	}
};

// get min max values for area chart to render properly reference lines and areas
const getMinMaxMetric = ( data, selectedMetric ) => {
	if ( ! data ) {
		return {};
	}
	return data.reduce( ( { minMetric, maxMetric }, item ) => {
		const value = item[ selectedMetric ] || 0;
		return {
			minMetric: Math.min( minMetric, value ),
			maxMetric: Math.max( maxMetric, value ),
		};
	}, { minMetric: Number.POSITIVE_INFINITY, maxMetric: Number.NEGATIVE_INFINITY } );
};

export const useMetricReferenceLines = ( { data, selectedMetric } ) => {
	const metricRatingColors = useMetricRatingColors();
	return useMemo( () => {
		const { maxMetric } = getMinMaxMetric( data, selectedMetric );
		const ratingBreakpoints = metricsRatingBreakpoints[ selectedMetric ];
		const yValues = {
			g: maxMetric < ratingBreakpoints.g ? maxMetric : ratingBreakpoints.g,
			n: maxMetric < ratingBreakpoints.n ? maxMetric : ratingBreakpoints.n,
			p: maxMetric,
		};
		return [
			{
				key: `${ selectedMetric }-referenceLine-good`,
				y: yValues.g,
				color: metricRatingColors.g,
				label: { value: getMetricWithUnit( yValues.g, selectedMetric ), position: 'left', fill: metricRatingColors.g },
			},
			...( maxMetric > ratingBreakpoints.g ? [
				{
					key: `${ selectedMetric }-referenceLine-needs_improvement`,
					y: yValues.n,
					color: metricRatingColors.n,
					label: { value: getMetricWithUnit( yValues.n, selectedMetric ), position: 'left', fill: metricRatingColors.n },
				},
			] : [] ),
			...( maxMetric > ratingBreakpoints.n ? [
				{
					key: `${ selectedMetric }-referenceLine-poor`,
					y: yValues.p,
					color: metricRatingColors.p,
					label: { value: getMetricWithUnit( yValues.p, selectedMetric ), position: 'left', fill: metricRatingColors.p },
				},
			] : [] ),
		];
	}
	, [ data, metricRatingColors, selectedMetric ] );
};

export const useMetricReferenceAreas = ( { data, selectedMetric } ) => {
	const metricRatingColors = useMetricRatingColors();
	return useMemo( () => {
		const { minMetric, maxMetric } = getMinMaxMetric( data, selectedMetric );
		const ratingBreakpoints = metricsRatingBreakpoints[ selectedMetric ];
		return data && data.length
			? [
				...( minMetric < ratingBreakpoints.g ? [
					{
						key: `${ selectedMetric }-referenceArea-good`,
						start: {
							x: data[ 0 ].time_bucket_formatted,
							y: minMetric,
						}, //2.5
						end: {
							x: data[ data.length - 1 ].time_bucket_formatted,
							y: maxMetric < ratingBreakpoints.g ? maxMetric : ratingBreakpoints.g, // 0
						}, //48.77
						color: metricRatingColors.g,
						label: { value: __( 'Good' ), position: 'insideTop', fill: metricRatingColors.g },
					},
				] : [] ),
				...( maxMetric > ratingBreakpoints.g ? [
					{
						key: `${ selectedMetric }-referenceArea-needs_improvement`,
						start: { x: data[ 0 ].time_bucket_formatted, y: ratingBreakpoints.g },
						end: { x: data[ data.length - 1 ].time_bucket_formatted, y: maxMetric < ratingBreakpoints.n ? maxMetric : ratingBreakpoints.n },
						color: metricRatingColors.n,
						label: { value: __( 'Needs improvement' ), position: 'insideTop', fill: metricRatingColors.n },
					},
				] : [] ),
				...( maxMetric > ratingBreakpoints.n ? [
					{
						key: `${ selectedMetric }-referenceArea-poor`,
						start: { x: data[ 0 ].time_bucket_formatted, y: ratingBreakpoints.n },
						end: { x: data[ data.length - 1 ].time_bucket_formatted, y: maxMetric },
						color: metricRatingColors.p,
						label: { value: __( 'Poor' ), position: 'insideTop', fill: metricRatingColors.p },
					},
				] : [] ),
			]
			: [];
	}
	, [ data, selectedMetric, metricRatingColors ] );
};
