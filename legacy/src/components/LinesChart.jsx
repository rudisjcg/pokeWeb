import { Bar} from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import PropTypes from "prop-types";
import { nameStat } from "../constants";
import { useEffect, useRef, useState } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);
import 'chart.js/auto';

const LinesChart = ({ pokestats, pokemon }) => {
  const [baseStatsArray, setBaseStatsArray] = useState([]);
  const ref = useRef();

  useEffect(() => {
    function obtenerBaseStats(array) {
      // Comprobamos que el argumento sea un array y no esté vacío
      if (!Array.isArray(array) || array?.length === 0) {
        return [];
      }
      // Utilizamos 'map' para obtener un nuevo array con solo los valores de 'base_stat'
      const baseStats = array.map((stat) => stat.base_stat);
      return baseStats;
    }
    const statsArray = obtenerBaseStats(pokestats);
    setBaseStatsArray(statsArray);
  }, [pokestats]);
  
  const statData = {
    labels: nameStat || [],
    datasets: [
      {
        label: pokemon,
        data: baseStatsArray || [],
        backgroundColor: `rgba(255,0,0,1)`,
        borderColor: "black",
        hoverBackgroundColor: `rgba(255,0,0,1)`,
        hoverBorderColor: "black",
      },
    ],
  };

  const myopts = {
    responsive: true,

    maintainAspectRatio: false,
    Animation: true,
    plugins: {
        legend: {
            display: false
        }
    },
    scales: {
        y: {
            display:false
        },
        x: {
            ticks: {color: '#fff'},
            grid: {
                display: false,

            },

        }
    }

  };

  return <Bar data={statData} options={myopts} ref={ref} />;
};

LinesChart.propTypes = {
  pokestats: PropTypes.object.isRequired,
  pokemon: PropTypes.string.isRequired,
};

export default LinesChart;
