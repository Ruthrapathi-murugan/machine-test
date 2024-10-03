import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function EditEmployee() {
  const { id } = useParams(); // Get employee ID from route params
  const navigate = useNavigate(); // Hook for navigation
  const [formData, setFormData] = useState({
    name: '', 
    email: '',
    mobile: '',
    designation: '',
    gender: '',
    courses: [],
    image: null,
  });
  const [existingImage, setExistingImage] = useState(null); // To store the existing image
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // Loading state

  const designations = ['HR', 'Manager', 'Sales']; // Static dropdown values for designation
  const availableCourses = ['MCA', 'BCA', 'BSC']; // Static course checkbox values

  // Fetch employee data when component mounts
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        console.log('Fetching employee with ID:', id);
        const response = await axios.get(`${import.meta.env.VITE_BE_URL}/api/employees/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        console.log('Fetched employee data:', response.data);
        if (response.data) {
          setFormData({
            ...response.data,
            courses: response.data.courses || [],
          });
          setExistingImage(response.data.image || '');
        } else {
          console.error('No employee data found for the provided ID');
        }
      } catch (error) {
        console.error('Error fetching employee:', error.message);
        if (error.response) {
          console.error('Error details:', error.response.data);
        }
      }
    };
    fetchEmployee();
  }, [id]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle checkbox changes for courses
  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const courses = checked
        ? [...prev.courses, value]
        : prev.courses.filter((course) => course !== value);
      return { ...prev, courses };
    });
  };

  // Handle file changes for image upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      setFormData((prev) => ({ ...prev, image: file }));
    } else {
      alert('Please select a valid image (JPEG or PNG)');
    }
  };

  // Validate form inputs
  const validate = () => {
    const validationErrors = {};
    if (!formData.name) validationErrors.name = 'Name is required';
    if (!formData.email) validationErrors.email = 'Email is required';
    if (!formData.mobile) validationErrors.mobile = 'Mobile is required';
    if (!formData.designation) validationErrors.designation = 'Designation is required';
    if (!formData.gender) validationErrors.gender = 'Gender is required';
    if (formData.courses.length === 0) validationErrors.courses = 'At least one course is required';
    return validationErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const formDataToSubmit = new FormData();
    formDataToSubmit.append('name', formData.name);
    formDataToSubmit.append('email', formData.email);
    formDataToSubmit.append('mobile', formData.mobile);
    formDataToSubmit.append('designation', formData.designation);
    formDataToSubmit.append('gender', formData.gender);
    formDataToSubmit.append('courses', JSON.stringify(formData.courses));
    if (formData.image) {
      formDataToSubmit.append('image', formData.image);
    }

    setLoading(true); // Start loading state
    try {
      await axios.put(`${import.meta.env.VITE_BE_URL}/api/employees/${id}`, formDataToSubmit, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate('/employees'); // Redirect to the employees list
    } catch (error) {
      console.error('Error updating employee:', error);
      setErrors({ submit: 'Failed to update employee. Please try again.' }); // Set a submit error message
    } finally {
      setLoading(false); // End loading state
    }
  };

  return (
    <div className="container mt-5">
      <h2>Edit Employee</h2>
      {loading && <div>Loading...</div>}
      <form onSubmit={handleSubmit}>
        {/* Display existing image */}
        {existingImage && (
  <div>
    <img
      src={existingImage}
      alt="Existing Employee"
      style={{ width: '100px', height: '100px', objectFit: 'cover' }}
    />
  </div>
)}

        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
          />
          {errors.name && <div className="invalid-feedback">{errors.name}</div>}
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
          />
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
        </div>
        <div className="mb-3">
          <label className="form-label">Mobile</label>
          <input
            type="text"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            className={`form-control ${errors.mobile ? 'is-invalid' : ''}`}
          />
          {errors.mobile && <div className="invalid-feedback">{errors.mobile}</div>}
        </div>
        <div className="mb-3">
          <label className="form-label">Designation</label>
          <select
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            className={`form-select ${errors.designation ? 'is-invalid' : ''}`}
          >
            <option value="">Select Designation</option>
            {designations.map((designation) => (
              <option key={designation} value={designation}>
                {designation}
              </option>
            ))}
          </select>
          {errors.designation && <div className="invalid-feedback">{errors.designation}</div>}
        </div>
        <div className="mb-3">
          <label className="form-label">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className={`form-select ${errors.gender ? 'is-invalid' : ''}`}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          {errors.gender && <div className="invalid-feedback">{errors.gender}</div>}
        </div>
        <div className="mb-3">
          <label className="form-label">Courses</label>
          {availableCourses.map((course) => (
            <div key={course} className="form-check">
              <input
                type="checkbox"
                value={course}
                checked={formData.courses.includes(course)}
                onChange={handleCheckboxChange}
                className="form-check-input"
              />
              <label className="form-check-label">{course}</label>
            </div>
          ))}
          {errors.courses && <div className="text-danger">{errors.courses}</div>}
        </div>
        <div className="mb-3">
          <label className="form-label">Upload Image</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="form-control"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Update Employee
        </button>
      </form>
    </div>
  );
}

export default EditEmployee;
