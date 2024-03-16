import React, { useEffect, useRef } from 'react';
import { scaleLinear, scaleTime } from 'd3-scale';
import { line } from 'd3-shape';
import { select } from 'd3-selection';
import { axisBottom, axisLeft } from 'd3-axis';

export default function SampleLineGraph() {
  const svgRef = useRef<SVGSVGElement>(null);

  const width = 600;
  const height = 600;

  useEffect(() => {
    const data = [
      { date: new Date(2024, 0, 1), value: 1000 },
      { date: new Date(2024, 0, 2), value: 123.7 },
      { date: new Date(2024, 0, 3), value: 153.12 },
      { date: new Date(2024, 0, 4), value: 299 },
      { date: new Date(2024, 0, 5), value: 364 },
      { date: new Date(2024, 0, 6), value: 1000.12 },
    ];

    const svg = select(svgRef.current);

    // Clear existing SVG contents
    svg.selectAll('*').remove();

    const margin = { top: 40, right: 30, bottom: 60, left: 80 }; // Adjusted margins
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xScale = scaleTime()
      .domain([new Date(2024, 0, 1), new Date(2024, 0, 6)])
      .range([0, innerWidth]);

    const yMin = Math.min(...data.map(d => d.value)); // Calculate the minimum value
    const yMax = Math.max(...data.map(d => d.value)); // Calculate the maximum value

    const yScale = scaleLinear()
      .domain([yMin, yMax]) // Adjusted y-axis domain
      .range([innerHeight, 0]);

    const lineGenerator = line<{ date: Date; value: number }>()
      .x(d => xScale(d.date))
      .y(d => yScale(d.value));

    svg.selectAll('path').data([data])
      .join('path')
      .attr('d', lineGenerator)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 2)
      .attr('transform', `translate(${margin.left}, 0)`); // Translate the line graph horizontally

    svg.selectAll('circle').data(data)
      .enter().append('circle')
      .attr('cx', d => xScale(d.date) + margin.left) // Adjusted x position to account for margin
      .attr('cy', d => yScale(d.value))
      .attr('r', 4)
      .attr('fill', 'steelblue');

    svg.append('g')
      .attr('transform', `translate(${margin.left}, ${innerHeight})`) // Adjusted x position to account for margin
      .call(axisBottom(xScale).ticks(6)); // Display ticks for each day

    svg.append('g')
      .attr('transform', `translate(${margin.left}, 0)`) // Moved the y-axis to the right by adjusting transform
      .call(axisLeft(yScale).ticks(18)); // Display ticks with increment of $50

    // Add x-axis label
    svg.append('text')
      .attr('transform', `translate(${width / 2},${height - margin.bottom / 3})`) // Position label in the middle of x-axis
      .style('text-anchor', 'middle')
      .text('Days');

    // Add y-axis label
    svg.append('text')
      .attr('transform', `translate(${margin.left / 2},${height / 2})rotate(-90)`) // Position label in the middle of y-axis and rotate
      .style('text-anchor', 'middle')
      .text('Money');
  }, []);

  return (
    <svg ref={svgRef} width={width} height={height} style={{ display: 'block', margin: '0 auto', backgroundColor: 'white' }}></svg>
  );
}
