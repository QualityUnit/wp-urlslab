import {useEffect, useRef} from 'react';
import {useQuery} from '@tanstack/react-query';
import * as d3 from 'd3';
import { interpolateRainbow } from 'd3-scale-chromatic';
import cloud from 'd3-cloud';

import {fetchData} from '../api/fetching';

import '../assets/styles/components/_OverviewTemplate.scss';

const D3WordCloud = ({slug, children}) => {
    const chartRef = useRef(null);

    const {data} = useQuery({
        queryKey: [slug, 'keyword-cloud'],
        queryFn: () => fetchData(`keyword?filter_kw_usage_count=%7B%22op%22%3A%22%3E%22%2C%22val%22%3A0%7D&sort_column=link_usage_count&sort_direction=DESC&rows_per_page=1000`).then((chartData) => {
            return chartData;
        }),
        refetchOnWindowFocus: false,
    });


    useEffect(() => {
        if (!data || !Array.isArray(data)) return;

        const minCount = d3.min(data, d => d.kw_usage_count);
        const maxCount = d3.max(data, d => d.kw_usage_count);
        const fontSizeScale = d3.scaleLinear().domain([minCount, maxCount]).range([10, 150]);
        const colorScale = d3.scaleSequential(interpolateRainbow).domain([0, data.length]);

        // D3 word cloud code goes here
        const layout = cloud()
            .size([900, 700])
            .words(data.map(d => ({text: d.keyword, kw_usage_count: d.kw_usage_count})))
            .padding(5)
            .rotate(() => ~~(Math.random() * 2) * 90)
            .font("Impact")
            .fontSize(d => fontSizeScale(d.kw_usage_count))
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
                .style("font-size", d => fontSizeScale(d.kw_usage_count))
                .style("font-family", "Impact")
                .style("fill", (d, i) => colorScale(i))
                .attr("text-anchor", "middle")
                .attr("transform", d => "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")")
                .text(d => d.text);
        }
    }, [data]);

    return <div className="urlslab-overview urlslab-panel fadeInto">
        <div ref={chartRef}></div>
    </div>
}
export default D3WordCloud;

