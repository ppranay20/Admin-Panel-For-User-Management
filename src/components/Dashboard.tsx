import { Line, Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { AiOutlineUser, AiOutlineUserAdd, AiOutlineRise } from 'react-icons/ai';
import { FiUsers } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import axios from 'axios';

Chart.register(CategoryScale,LinearScale,PointElement,LineElement,BarElement,Title,Tooltip,Legend);

interface user {
  id : number,
  name : string,
  email : string,
  role : string,
  createdAt : string
}

const Dashboard = () => {
  const [users, setUsers] = useState<user[]>([]);
  const [newUserCount,setNewUserCount] = useState<number>(0);

  const fetchData = async () => {
    const res = await axios.get('http://localhost:3000/users');
    setUsers(res.data);
  };
  
  useEffect(() => {
    fetchData();
  },[]);


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

  const findNewUsersToday = (users: user[]) => {
    let count = 0; 
  
    users.forEach((user) => {
      const createdAtDate = new Date(user.createdAt);
      const today = new Date();
  
      if (createdAtDate.getFullYear() === today.getFullYear() && createdAtDate.getMonth() === today.getMonth() && createdAtDate.getDate() === today.getDate()) {
        count++;
      }
    });
  
    setNewUserCount(count);
  };
  

  useEffect(() => {
    findNewUsersToday(users)
  },[users])

  return (
    <div className="space-y-10 px-3 pt-5">
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-purple-500 text-white p-4 rounded-lg flex items-center justify-between">
          <div>
            <h3>Total Users</h3>
            <p>{users.length}</p>
            <p className="text-sm">+20.1% from last month</p>
          </div>
          <AiOutlineUser size={30} />
        </div>
        <div className="bg-green-500 text-white p-4 rounded-lg flex items-center justify-between">
          <div>
            <h3>Active Users</h3>
            <p>789</p>
            <p className="text-sm">+10.5% from last month</p>
          </div>
          <FiUsers size={30} />
        </div>
        <div className="bg-orange-500 text-white p-4 rounded-lg flex items-center justify-between">
          <div>
            <h3>New Users (Today)</h3>
            <p>{newUserCount}</p>
            <p className="text-sm">{((newUserCount/users.length)*100).toFixed(2)}% from yesterday</p>
          </div>
          <AiOutlineUserAdd size={30} />
        </div>
        <div className="bg-pink-500 text-white p-4 rounded-lg flex items-center justify-between">
          <div>
            <h3>User Growth Rate</h3>
            <p>2.5%</p>
            <p className="text-sm">+0.3% from last week</p>
          </div>
          <AiOutlineRise size={30} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h4 className="font-semibold mb-4">User Registration Trend</h4>
          <Line data={lineChartData} />
        </div>
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h4 className="font-semibold mb-4">Revenue Overview</h4>
          <Bar data={barChartData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
