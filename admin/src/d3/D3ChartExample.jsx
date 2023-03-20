import {useEffect, useRef} from 'react';
import {useQuery} from '@tanstack/react-query';
import * as d3 from 'd3';
import cloud from 'd3-cloud';

import {fetchData} from '../api/fetching';

import '../assets/styles/components/_OverviewTemplate.scss';

const D3ChartExample = ({slug, children}) => {
    const chartRef = useRef(null);

    const {data} = useQuery({
        queryKey: [slug, 'testChart'],
        queryFn: () => fetchData(`keyword/`).then((chartData) => {
            return chartData;
        }),
        refetchOnWindowFocus: false,
    });
    useEffect(() => {
        if (!data) return;
        // D3 word cloud code goes here
        const layout = cloud()
            .size([400, 400])
            .words(data.map(d => ({text: d.keyword, size: d.link_usage_count})))
            .padding(5)
            .rotate(() => ~~(Math.random() * 2) * 90)
            .font("Impact")
            .fontSize(d => d.size)
            .on("end", draw);

        layout.start();

        function draw(words) {
            d3.select(chartRef.current)
                .append("svg")
                .attr("width", layout.size()[0])
                .attr("height", layout.size()[1])
                .append("g")
                .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
                .selectAll("text")
                .data(words)
                .enter()
                .append("text")
                .style("font-size", d => d.size + "px")
                .style("font-family", "Impact")
                .style("fill", "#333")
                .attr("text-anchor", "middle")
                .attr("transform", d => "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")")
                .text(d => d.text);
        }
    }, [data]);

    return <div className="urlslab-overview urlslab-panel fadeInto">
        <div ref={chartRef}></div>
    </div>
}
export default D3ChartExample;

