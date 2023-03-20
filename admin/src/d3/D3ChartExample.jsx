import {useEffect, useRef} from 'react';
import {useQuery} from '@tanstack/react-query';
import * as d3 from 'd3';
import cloud from 'd3-cloud';

import {fetchData} from '../api/fetching';

import '../assets/styles/components/_OverviewTemplate.scss';

const D3ChartExample = ({slug, children}) => {
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

        console.log(data);
        // D3 word cloud code goes here
        const layout = cloud()
            .size([800, 800])
            .words(data.map(d => ({text: d.keyword, size: d.link_usage_count})))
            .padding(5)
            .rotate(() => ~~(Math.random() * 2) * 90)
            .font("Impact")
            .fontSize(d => (d.link_usage_count * 10) + "px")
            .on("end", draw);

        layout.start();
        console.log(layout.words());

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
                .style("font-size", "20px")
                .style("font-family", "Impact")
                .style("fill", "#000000")
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

