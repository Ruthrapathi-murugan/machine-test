import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const defaultEmployees = [
    {
      _id: '1',
      image: '', // Placeholder for image URL
      name: 'Hukum',
      email: 'hcgupta@cstech.in',
      mobile: '954010044',
      designation: 'HR',
      gender: 'Male',
      courses: ['MCA'],
      createdAt: '2021-02-13T00:00:00Z',
    },
    {
      _id: '2',
      image: '', // Placeholder for image URL
      name: 'Manish',
      email: 'manish@cstech.in',
      mobile: '954010033',
      designation: 'Sales',
      gender: 'Male',
      courses: ['BCA'],
      createdAt: '2021-02-12T00:00:00Z',
    },
    {
      _id: '3',
      image: '', // Placeholder for image URL
      name: 'Yash',
      email: 'yash@cstech.in',
      mobile: '954010022',
      designation: 'Manager',
      gender: 'Male',
      courses: ['BSC'],
      createdAt: '2021-02-11T00:00:00Z',
    },
    {
      _id: '4',
      image: '', // Placeholder for image URL
      name: 'Abhishek',
      email: 'abhishek@cstech.in',
      mobile: '954010033',
      designation: 'HR',
      gender: 'Male',
      courses: ['MCA'],
      createdAt: '2021-02-13T00:00:00Z',
    },
  ];

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BE_URL}/api/employees`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setEmployees(response.data);
      } catch (error) {
        setError('Failed to fetch employees. Using default data.');
        setEmployees(defaultEmployees); // Set default data on error
      }
    };

    fetchEmployees();
  }, []);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const filteredEmployees = employees.filter((employee) => {
    return (
      employee.name.toLowerCase().includes(search.toLowerCase()) ||
      employee.email.toLowerCase().includes(search.toLowerCase())
    );
  });


  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_BE_URL}/api/employees/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        // Remove the deleted employee from the state
        setEmployees(employees.filter((employee) => employee._id !== id));
      } catch (error) {
        console.error('Error deleting employee:', error);
        setError('Failed to delete employee.');
      }
    }
  };
  
  return (
    <div className="container mt-5">
      <h2>Employee List</h2>
      {error && <div className="text-danger">{error}</div>}
      
      {/* Search and Employee Count */}
      <div className="d-flex justify-content-between mb-3">
        <div>Total Count: {filteredEmployees.length}</div>
        <input
          type="text"
          placeholder="Enter Search Keyword"
          value={search}
          onChange={handleSearchChange}
          className="form-control w-25"
        />
      </div>

      {/* Employee Table */}
      <table className="table table-bordered">
        <thead className="thead-light">
          <tr>
            <th>Unique ID</th>
            <th>Image</th>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile No</th>
            <th>Designation</th>
            <th>Gender</th>
            <th>Course</th>
            <th>Create Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map((employee, index) => (
            <tr key={employee._id}>
              <td>{index + 1}</td>
              <td>
  <img
    src={employee.image || 'https://via.placeholder.com/50'} // Use a placeholder image if no image URL
    alt="Employee"
    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
  />
</td>

              <td>{employee.name}</td>
              <td>
                <a href={`mailto:${employee.email}`}>{employee.email}</a>
              </td>
              <td>{employee.mobile}</td>
              <td>{employee.designation}</td>
              <td>{employee.gender}</td>
              <td>{employee.courses.join(', ')}</td>
              <td>{new Date(employee.createdAt).toLocaleDateString()}</td>

              <td>
                <Link to={`/edit-employee/${employee._id}`} className="btn btn-warning btn-sm">
                  Edit
                </Link>{' '}
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(employee._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Add Employee Button */}
      <Link to="/create-employee" className="btn btn-primary">Create Employee</Link>
    </div>
  );
}

export default EmployeeList;
