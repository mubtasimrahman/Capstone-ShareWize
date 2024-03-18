import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios'; // Import axios
import { scaleLinear, scaleTime } from 'd3-scale';
import { select } from 'd3-selection';
import { axisBottom, axisLeft } from 'd3-axis';
import { RootState } from '../../App/store/store';
import { useSelector } from 'react-redux';

interface Expense {
  ExpenseId: string;
  Description: string;
  Amount: number;
  DatePaid: Date;
  GroupName: string;
}

interface UserObject {
  UserId: number;
  GoogleId: string;
  DisplayName: string;
  Email: string;
}

export default function SampleLineGraph() {
  const svgRef = useRef<SVGSVGElement>(null);
  const googleId = useSelector((state: RootState) => state.auth.user?.sub);
  const [currentUser, setCurrentUser] = useState<UserObject | undefined>();
  const [data, setData] = useState<{ date: Date; value: number }[]>([]);

  const width = 600;
  const height = 600;

  // Function to format date string to Date object
  const formatDate = (dateString: string) => {
    const monthMap: {[key: string]: number} = {
      "Jan": 0, "Feb": 1, "Mar": 2, "Apr": 3, "May": 4, "Jun": 5,
      "Jul": 6, "Aug": 7, "Sep": 8, "Oct": 9, "Nov": 10, "Dec": 11
    };

    const [, monthName, day, year] = dateString.split(" ");
    const month = monthMap[monthName];
    const numericDay = parseInt(day);
    const numericYear = parseInt(year);

    return new Date(numericYear, month, numericDay);
  };

  const fetchUser = async () => {
    try {
      const response = await axios.get<UserObject>(
        `http://localhost:8000/getUser/${googleId}`
      );
      setCurrentUser(response.data);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  useEffect(() => {
    if (googleId) {
      fetchUser();
    } else {
      console.log("Error: googleId is undefined");
    }
  }, [googleId]);

  useEffect(() => {
    const data = [
      { date: "Mon Mar 18 2024 20:00:00 GMT-0400 (Eastern Daylight Saving Time)", value: 1000 },
      { date: "Tue Mar 19 2024 20:00:00 GMT-0400 (Eastern Daylight Saving Time)", value: 123.7 },
      { date: "Wed Mar 20 2024 20:00:00 GMT-0400 (Eastern Daylight Saving Time)", value: 153.12 },
      { date: "Thu Mar 21 2024 20:00:00 GMT-0400 (Eastern Daylight Saving Time)", value: 299 },
      { date: "Fri Mar 22 2024 20:00:00 GMT-0400 (Eastern Daylight Saving Time)", value: 364 },
      { date: "Sat Mar 23 2024 20:00:00 GMT-0400 (Eastern Daylight Saving Time)", value: 1000.12 }
    ];
    const formattedData = data.map(item => ({
      date: formatDate(item.date),
      value: item.value
    }));
    setData(formattedData);
  }, []);

  useEffect(() => {
    const svg = select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 60, right: 60, bottom: 60, left: 80 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xScale = scaleTime()
      .domain([new Date(2024, 0, 1), new Date(2024, 0, 7)])
      .range([0, innerWidth]);

    const yMin = Math.min(...data.map(d => d.value));
    const yMax = Math.max(...data.map(d => d.value));
    const topMargin = 50;

    const yScale = scaleLinear()
      .domain([0, yMax + topMargin])
      .range([innerHeight, topMargin]);

    svg.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (d, i) => xScale(d.date) + margin.left)
      .attr('y', d => yScale(d.value - 120))
      .attr('width', (innerWidth / data.length) * 0.8)
      .attr('height', d => innerHeight - yScale(d.value))
      .attr('fill', 'steelblue');

    svg.append('g')
      .attr('transform', `translate(${margin.left}, ${innerHeight + topMargin})`)
      .call(axisBottom(xScale).ticks(7));

    svg.append('g')
      .attr('transform', `translate(${margin.left}, ${topMargin})`)
      .call(axisLeft(yScale).ticks(18));

    svg.append('text')
      .attr('transform', `translate(${width / 2},${height - margin.bottom / 3})`)
      .style('text-anchor', 'middle')
      .text('Days');

    svg.append('text')
      .attr('transform', `translate(${margin.left / 2},${height / 2})rotate(-90)`)
      .style('text-anchor', 'middle')
      .text('Money');
  }, [data]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <button className="btn btn-success" style={{ backgroundColor: 'green', color: 'white', padding: '10px', marginBottom: '10px', marginRight: '10px' }}>Date Range</button>
        <button className="btn btn-success" style={{ backgroundColor: 'green', color: 'white', padding: '10px', marginBottom: '10px', marginRight: '10px' }}>Previous Month</button>
      </div>
      <svg ref={svgRef} width={width} height={height} style={{ backgroundColor: 'white' }}></svg>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {/* <button className="btn btn-success" style={{ backgroundColor: 'green', color: 'white', padding: '10px', marginBottom: '10px', marginRight: '10px' }}>Date Range</button> */}
        <button className="btn btn-success" style={{ backgroundColor: 'green', color: 'white', padding: '10px', marginBottom: '10px', marginRight: '10px' }}>Next Month</button>
      </div>
    </div>
  );
}

 // Commented out the useEffect fetching expenses from the API
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get<Expense[]>(
  //         `http://localhost:8000/users/${currentUser!.UserId}/expenses`
  //       );
  //       const formattedExpenses = response.data.map((expense) => ({
  //         ...expense,
  //         DatePaid: new Date(expense.DatePaid),
  //       }));
  //       setExpenses(formattedExpenses);
  //     } catch (error) {
  //       console.error("Error fetching expenses:", error);
  //     }
  //   };

  //   fetchData();
  // }, [currentUser]); // Re-fetch when currentUser changes