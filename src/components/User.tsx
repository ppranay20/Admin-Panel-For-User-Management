import axios from 'axios';
import { useEffect, useState } from 'react';
import { AiOutlineDelete } from 'react-icons/ai';
import { toast } from 'react-toastify';

interface user {
  id : number,
  name : string,
  email : string,
  role : string,
  createdAt : string
}

interface newUser {
  name : string,
  email : string,
  role : string
}

const User = () => {
  const [searchUser, setSearchUser] = useState("");
  const [searchField, setSearchField] = useState("name");
  const [users, setUsers] = useState<user[]>([]);
  const [selectedUser, setSelectedUser] = useState<user | null>(null);
  const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);
  const [isAddUserModalOpen, setAddUserModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isEditMode, setEditMode] = useState<boolean>(false);
  const [userToDelete, setUserToDelete] = useState<user | null>(null);
  const [newUser,setNewUser] = useState<newUser>({
    name : "",
    email : "",
    role : "user"
  });

  const fetchUsers = async () => {
    try{
      const res = await axios.get("http://localhost:3000/users");
      setUsers(res.data);
    }catch(err){
      console.log(err);
    }
  }

  const handleShowDetails = (user : user) => {
    setSelectedUser(user);
    setDetailsModalOpen(true);
  };

  const handleDeleteUserClick = (user : user) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const confirmDeleteUser = () => {
    if(userToDelete){
      deleteUser(userToDelete.id)
    }
  };

  const filteredUsers = users.filter(user => {
    if (searchField === 'name') {
      return user.name.toLowerCase().startsWith(searchUser.toLowerCase());
    } else if (searchField === 'email') {
      return user.email.toLowerCase().startsWith(searchUser.toLowerCase());
    } else if (searchField === 'role') {
      return user.role.toLowerCase().startsWith(searchUser.toLowerCase());
    } else if (searchField === 'date') {
      return user.createdAt.startsWith(searchUser);
    }
    return false;
  });

  const formatDate = (date : string) : string => {
    const formattedDate = new Date(date);
    return formattedDate.toLocaleDateString('en-GB',{
      day : 'numeric',
      month : 'long',
      year : 'numeric'
    })
  }

  const handleInputChange = (e:any) => {
    const { name, value } = e.target;
    setNewUser((prevUser) => ({...prevUser,[name]: value}));
  };
  
  const deleteUser = async (userId: number) => {
    try {
      const res = await axios.delete(`http://localhost:3000/users/${userId}`);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      setDeleteModalOpen(false);
      toast.success('User deleted successfully!', {
        position: 'top-center',
      });
    } catch (error) {
      console.error('Error deleting user', error);
      toast.error('Failed to delete user', {
        position: 'top-center',
      });
    }
  };

  const handleAddUser = async (newUser: newUser) => {
    try {
      const userWithDate = {
        ...newUser,
        createdAt: new Date().toISOString(),
      }; 
      const res = await axios.post('http://localhost:3000/users', userWithDate);
      setUsers((prevUsers) => [...prevUsers, res.data]);
      setAddUserModalOpen(false);
      toast.success("User added successfully", {
        position: 'top-center',
      });
      setNewUser({
        name : "",
        email : "",
        role : "user"
      })
    } catch (error) {
      console.error('Error adding user', error);
      toast.error("Failed to add user", {
        position: 'top-center',
      });
    }
  };
  

  const handleUpdateUser = async () => {
    if (selectedUser) {
      try {
        await axios.put(`http://localhost:3000/users/${selectedUser.id}`, selectedUser);
        setUsers((prevUsers) =>
          prevUsers.map((user) => (user.id === selectedUser.id ? selectedUser : user))
        );
        setDetailsModalOpen(false);
        toast.success("User updated successfully", {
          position: 'top-center',
        });
      } catch (error) {
        console.error("Error updating user", error);
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  },[])

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Users</h2>
        <button onClick={() => setAddUserModalOpen(true)} className="bg-black text-white px-4 py-2 rounded-md">Add New User</button>
      </div>
      <div className="mt-6 flex items-center space-x-4">
        <select className="border border-gray-300 p-2 rounded-md" value={searchField} onChange={(e) => setSearchField(e.target.value)}>
          <option value="name">Name</option>
          <option value="email">Email</option>
          <option value="role">Role</option>
          <option value="date">Date Registered</option>
        </select>
        <input type="text" className="border border-gray-300 p-2 rounded-md w-full" placeholder={`Search by ${searchField}`} onChange={(e) => setSearchUser(e.target.value)} />
      </div>
      <div className="mt-6 overflow-x-auto max-h-104 overflow-y-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-left">Role</th>
              <th className="py-2 px-4 text-left">Date Registered</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id} className="border-t border-gray-200">
                <td className="py-2 px-4">{user.name}</td>
                <td className="py-2 px-4">{user.email}</td>
                <td className="py-2 px-4">{user.role}</td>
                <td className="py-2 px-4">{formatDate(user.createdAt)}</td>
                <td className="py-2 px-4 flex items-center">
                  <button onClick={() => handleShowDetails(user)} className="text-blue-500 mr-4">Show Details</button>
                  <button onClick={() => handleDeleteUserClick(user)} className="text-red-500 flex items-center">
                    <AiOutlineDelete className="mr-1" />
                    <p>Delete</p>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isDetailsModalOpen && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-xl mb-4">{isEditMode ? 'Edit User' : 'User Details'}</h3>

            {isEditMode ? (
              <div>
                <input
                  type="text"
                  value={selectedUser.name}
                  onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                  className="block w-full mb-4 p-2 border border-gray-300 rounded-md"
                />
                <input
                  type="email"
                  value={selectedUser.email}
                  onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                  className="block w-full mb-4 p-2 border border-gray-300 rounded-md"
                />
                <select
                  value={selectedUser.role}
                  onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                  className="block w-full mb-4 p-2 border border-gray-300 rounded-md"
                >
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                  <option value="Manager">Manager</option>
                </select>
                <button onClick={handleUpdateUser} className="px-4 py-2 bg-black text-white rounded-md">
                  Save
                </button>
              </div>
            ) : (
              <div>
                <p>
                  <strong>Name:</strong> {selectedUser.name}
                </p>
                <p>
                  <strong>Email:</strong> {selectedUser.email}
                </p>
                <p>
                  <strong>Role:</strong> {selectedUser.role}
                </p>
                <p>
                  <strong>Date Registered:</strong> {formatDate(selectedUser.createdAt)}
                </p>
              </div>
            )}

            <div className="mt-4 flex justify-between">
              <button onClick={() => setDetailsModalOpen(false)} className="px-4 py-2 bg-gray-500 text-white rounded-md">
                Close
              </button>
              {!isEditMode && (
                <button onClick={() => setEditMode(true)} className="px-4 py-2 bg-blue-500 text-white rounded-md">
                  Edit
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {isAddUserModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-xl mb-4">Add New User</h3>
            <input type="text" placeholder="Name" className="block w-full mb-4 p-2 border border-gray-300 rounded-md" onChange={handleInputChange} name="name" value={newUser?.name} />
            <input type="email" placeholder="Email" className="block w-full mb-4 p-2 border border-gray-300 rounded-md" onChange={handleInputChange} name="email" value={newUser?.email} />
            <select className="block w-full mb-4 p-2 border border-gray-300 rounded-md" onChange={handleInputChange} name="role" value={newUser?.role}>
              <option>User</option>
              <option>Admin</option>
              <option>Manager</option>
            </select>
            <button className="px-4 py-2 bg-black text-white rounded-md mx-2" onClick={() => handleAddUser(newUser)}>Add User</button>
            <button className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-md" onClick={() => setAddUserModalOpen(false)}>Close</button>
          </div>
        </div>
      )}

      {isDeleteModalOpen && userToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-xl mb-4">Confirm Delete</h3>
            <p>Are you sure you want to delete <strong>{userToDelete.name}</strong>?</p>
            <div className="flex justify-end mt-4">
              <button className="px-4 py-2 bg-red-600 text-white rounded-md mr-2" onClick={confirmDeleteUser}>Confirm</button>
              <button className="px-4 py-2 bg-gray-500 text-white rounded-md" onClick={() => setDeleteModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default User;
