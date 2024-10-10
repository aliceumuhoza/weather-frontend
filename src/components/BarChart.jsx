import { useTheme } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { tokens } from "../theme";
import React, { useEffect, useState } from "react";

const BarChart = ({ isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productResponse = await fetch("http://localhost:4000/products");
        const productData = await productResponse.json();

        // Prepare data for the bar chart, using market_id.name for markets
        const markets = [...new Set(productData.map(product => product.market_id?.name || "Unknown Market"))]; // Unique markets
        const products = [...new Set(productData.map(product => product.name))]; // Unique products

        const data = markets.map(market => {
          const marketEntry = { market }; // Use market name as a string
          products.forEach(product => {
            const productInfo = productData.find(item => item.market_id?.name === market && item.name === product);
            marketEntry[product] = productInfo ? productInfo.price : 0; // Default to 0 if not found
          });
          return marketEntry;
        });

        setChartData(data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  // Get all product names for keys
  const keys = chartData.length > 0 ? Object.keys(chartData[0]).filter(key => key !== "market") : [];

  return (
    <ResponsiveBar
      data={chartData}
      keys={keys} // Use product names as keys
      indexBy="market" // Use market as index
      theme={{
        axis: {
          domain: {
            line: {
              stroke: colors.grey[100],
            },
          },
          legend: {
            text: {
              fill: colors.grey[100],
            },
          },
          ticks: {
            line: {
              stroke: colors.grey[100],
              strokeWidth: 1,
            },
            text: {
              fill: colors.grey[100],
            },
          },
        },
        legends: {
          text: {
            fill: colors.grey[100],
          },
        },
      }}
      margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
      padding={0.3}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={{ scheme: "nivo" }}
      axisTop={null}
      axisRight={null}
      axisBottom={null}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : "Price in $",
        legendPosition: "middle",
        legendOffset: -40,
      }}
      enableLabel={false}
      labelSkipWidth={12}
      labelSkipHeight={12}
      legends={[
        {
          dataFrom: "keys",
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 120,
          translateY: 0,
          itemsSpacing: 2,
          itemWidth: 100,
          itemHeight: 20,
          itemDirection: "left-to-right",
          itemOpacity: 0.85,
          symbolSize: 20,
        },
      ]}
      role="application"
      barAriaLabel={(e) =>
        `${e.id}: ${e.formattedValue} in market: ${e.indexValue}`
      }
    />
  );
};

export default BarChart;
