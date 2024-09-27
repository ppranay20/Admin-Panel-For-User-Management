import { Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import User from "./components/User";
import Analytics from "./components/Analytics";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  return (
    <div className="flex">
        <Sidebar />
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<User />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </div>
      <ToastContainer />
    </div>
  )
}