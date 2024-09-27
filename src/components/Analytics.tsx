import { Bar, Line } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import axios from "axios";
import { useEffect, useState } from "react";

Chart.register(CategoryScale,LinearScale,PointElement,LineElement,BarElement,Title,Tooltip,Legend)

interface user {
    id : number,
    name : string,
    email : string,
    role : string,
    createdAt : string
}

export default function Analytics() {
    const [users, setUsers] = useState<user[]>([]);

  const fetchData = async () => {
    const res = await axios.get('http://localhost:3000/users');
    setUsers(res.data);
  };
  
  useEffect(() => {
    fetchData();
  }, []);

    const lineChartData = {
        labels: ['2020', '2021', '2022', '2023', '2024'],
        datasets: [
        {
            label: 'User Registrations',
            data: [0, 0, 0, 0, 0],
            borderColor: '#4f46e5',
        },
        ],
    };

    const barChartData = {
        labels: ['2020', '2021', '2022', '2023', '2024'],
        datasets: [
        {
            label: 'Revenue in $',
            data: [200, 350, 400, 600, 450],
            backgroundColor: '#34d399',
        },
        ],
    };

      users.forEach((user) => {
        const year = new Date(user.createdAt).getFullYear();
        console.log(year);
        const index = lineChartData.labels.indexOf(year.toString());
        console.log(index)
        if (index !== -1) {
          lineChartData.datasets[0].data[index] += 1;
        }
      });

  return (
    <div className="grid grid-cols-2 gap-4 pt-20">
        <div className="bg-white p-4 rounded-lg shadow-lg">
            <h4 className="font-semibold mb-4">User Registration Trend</h4>
            <Line data={lineChartData} />
        </div>
        <div className="bg-white p-4 rounded-lg shadow-lg">
            <h4 className="font-semibold mb-4">Revenue Overview</h4>
            <Bar data={barChartData} />
        </div>
    </div>
  )
}
