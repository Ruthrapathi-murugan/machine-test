import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CreateEmployee() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    designation: '',
    gender: '',
    courses: [],
    image: null,
  });
  const [errors, setErrors] = useState({});

  const designations = ['HR', 'Manager', 'Sales'];
  const availableCourses = ['MCA', 'BCA', 'BSC'];

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
      setErrors((prev) => ({ ...prev, image: '' })); // Clear previous file error
    } else {
      setErrors((prev) => ({ ...prev, image: 'Only jpg/png files are allowed' }));
    }
  };

  // Validation logic
  const validate = () => {
    const newErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobilePattern = /^[0-9]{10}$/;

    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailPattern.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.mobile) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!mobilePattern.test(formData.mobile)) {
      newErrors.mobile = 'Mobile number must be 10 digits';
    }
    if (!formData.designation) newErrors.designation = 'Designation is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (formData.courses.length === 0) newErrors.courses = 'At least one course must be selected';
    if (!formData.image) newErrors.image = 'Image upload is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit the form data
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
  
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === 'courses') {
        formData.courses.forEach((course) => data.append('courses', course));
      } else {
        data.append(key, formData[key]);
      }
    });
  
    try {
      // Make the API call to store in MongoDB
      const response = await axios.post(`${import.meta.env.VITE_BE_URL}/api/employees`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data', // Required for file uploads
        },
      });
      
      // Store employee data in local storage
      const newEmployee = response.data; // Assuming response contains the created employee object
      const existingEmployees = JSON.parse(localStorage.getItem('employees')) || [];
      localStorage.setItem('employees', JSON.stringify([...existingEmployees, newEmployee]));
  
      navigate('/employees'); // Redirect to employee list
    } catch (error) {
      console.error('Error creating employee:', error);
      setErrors({ submit: 'Failed to create employee. Please try again.' });
    }
  };
  

  return (
    <div className="container mt-5">
      <h2>Create Employee</h2>

      {/* Server-side error message */}
      {errors.submit && <div className="alert alert-danger">{errors.submit}</div>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Name */}
        <div className="form-group mb-3">
          <label>Name</label>
          <input
            type="text"
            name="name"
            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <div className="invalid-feedback">{errors.name}</div>}
        </div>

        {/* Email */}
        <div className="form-group mb-3">
          <label>Email</label>
          <input
            type="email"
            name="email"
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
        </div>

        {/* Mobile */}
        <div className="form-group mb-3">
          <label>Mobile</label>
          <input
            type="text"
            name="mobile"
            className={`form-control ${errors.mobile ? 'is-invalid' : ''}`}
            value={formData.mobile}
            onChange={handleChange}
          />
          {errors.mobile && <div className="invalid-feedback">{errors.mobile}</div>}
        </div>

        {/* Designation */}
        <div className="form-group mb-3">
          <label>Designation</label>
          <select
            name="designation"
            className={`form-control ${errors.designation ? 'is-invalid' : ''}`}
            value={formData.designation}
            onChange={handleChange}
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

        {/* Gender */}
        <div className="form-group mb-3">
          <label>Gender</label>
          <div>
            <input
              type="radio"
              name="gender"
              value="Male"
              checked={formData.gender === 'Male'}
              onChange={handleChange}
            /> Male
            <input
              type="radio"
              name="gender"
              value="Female"
              checked={formData.gender === 'Female'}
              onChange={handleChange}
            /> Female
          </div>
          {errors.gender && <div className="text-danger">{errors.gender}</div>}
        </div>

        {/* Courses */}
        <div className="form-group mb-3">
          <label>Courses</label>
          <div>
            {availableCourses.map((course) => (
              <div key={course} className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value={course}
                  onChange={handleCheckboxChange}
                  checked={formData.courses.includes(course)}
                />
                <label className="form-check-label">{course}</label>
              </div>
            ))}
          </div>
          {errors.courses && <div className="text-danger">{errors.courses}</div>}
        </div>

        {/* Image Upload */}
        <div className="form-group mb-3">
          <label>Upload Image (jpg/png)</label>
          <input
            type="file"
            className={`form-control ${errors.image ? 'is-invalid' : ''}`}
            onChange={handleFileChange}
          />
          {errors.image && <div className="invalid-feedback">{errors.image}</div>}
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
}

export default CreateEmployee;
