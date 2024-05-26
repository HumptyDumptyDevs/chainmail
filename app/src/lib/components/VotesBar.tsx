import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";

const VotesBar = ({ voteForBuyer, votesForSeller }) => {
  const [chartOptions, setChartOptions] = useState(null);

  useEffect(() => {
    const initialVotes = voteForBuyer === 0 && votesForSeller === 0;
    const buyerVotes = initialVotes ? 50 : voteForBuyer;
    const sellerVotes = initialVotes ? 50 : votesForSeller;

    setChartOptions({
      chart: {
        type: "bar",
        stacked: true,
        stackType: "100%",
        toolbar: {
          show: false,
        },
      },
      series: [
        {
          name: "Buyer",
          data: [buyerVotes],
        },
        {
          name: "Seller",
          data: [sellerVotes],
        },
      ],
      plotOptions: {
        bar: {
          horizontal: true,
        },
      },
      dataLabels: {
        dropShadow: {
          enabled: true,
        },
        formatter: function (val, { seriesIndex }) {
          const labels = ["Buyer", "Seller"];
          return `${labels[seriesIndex]} (${val.toFixed(1)}%)`;
        },
      },
      stroke: {
        width: 0,
      },
      grid: {
        show: false,
        padding: {
          top: 0,
          bottom: 0,
          right: 0,
          left: 0,
        },
      },
      xaxis: {
        categories: ["Votes"],
        labels: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      yaxis: {
        show: false,
      },
      fill: {
        opacity: 1,
        type: "gradient",
        gradient: {
          shade: "dark",
          type: "vertical",
          shadeIntensity: 0.35,
          gradientToColors: undefined,
          inverseColors: false,
          opacityFrom: 0.85,
          opacityTo: 0.85,
          stops: [90, 0, 100],
        },
        colors: ["#16968E", "#9CC2C9"],
      },
      tooltip: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      selection: {
        enabled: false,
      },
    });
  }, [voteForBuyer, votesForSeller]);

  return (
    <div id="chart">
      {chartOptions && (
        <ReactApexChart
          options={chartOptions}
          series={chartOptions.series}
          type="bar"
          height={120}
        />
      )}
    </div>
  );
};

export default VotesBar;
