import { Link } from 'react-router-dom';
import { AiOutlineHome, AiOutlineUser } from 'react-icons/ai';
import { BiAnalyse } from 'react-icons/bi';

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-800 h-screen text-white p-6">
      <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>
      <ul>
        <li className="mb-4">
          <Link to="/" className="flex items-center">
            <AiOutlineHome className="mr-2" />
            <p>Dashboard</p>
          </Link>
        </li>
        <li className="mb-4">
          <Link to="/users" className="flex items-center">
            <AiOutlineUser className="mr-2" />
            <p>Users</p> 
          </Link>
        </li>
        <li className="mb-4 ">
          <Link to="/analytics" className='flex items-center'>
            <BiAnalyse className="mr-2" />
            <p>Analytics</p>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
