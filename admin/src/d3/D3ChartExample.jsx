import { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import * as d3 from 'd3';

import { fetchData } from '../api/fetching';

import '../assets/styles/components/_OverviewTemplate.scss';

export default function D3ChartExample( { slug, children } ) {
	const chart = useRef( null );
	const { data } = useQuery( {
		queryKey: [ slug, 'testChart' ],
		queryFn: () => fetchData( `${ slug }/` ).then( ( chartData ) => {
			return chartData;
		} ),
		refetchOnWindowFocus: false,
	} );

	useEffect( () => {
		const svgElement = d3.select( chart.current );
		const chartData = data ? data : [ 12, 5, 6, 6, 9, 10 ];
		svgElement.attr( 'width', 700 ).attr( 'height', 300 );
	}, [ data ] );

	return (
		<div className="urlslab-overview urlslab-panel fadeInto">
			<svg ref={ chart } />
		</div>
	);
}
