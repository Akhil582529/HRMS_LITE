import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './DASHBOARD.css';

const Dashboard = () => {

    const [employee, setEmployee] = useState({ id: '', name: '', department: '' });
    const [employeeDetails, setEmployeeDetails] = useState([]);
    const [formShow, setFormShow] = useState(false);

    const BASE_URL = "http://127.0.0.https://hrms-lite-backend-fk36.onrender.com:8000";

    const fetchEmployees = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/employees`);
            setEmployeeDetails(res.data); 
        } catch (error) {
            console.error("Error fetching employees:", error);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleChange = (e) => {
        setEmployee({ ...employee, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${BASE_URL}/employees`, employee);
            alert("Employee added successfully");
            setEmployee({ id: '', name: '', department: '' });
            setFormShow(false);
            fetchEmployees();  
        } catch (err) {
            console.error("Error adding employee:", err);
            alert("Failed to add employee");
        }
    };

    const handleDelete = async (id, name) => {
        // Confirm before deleting
        if (!window.confirm(`Are you sure you want to delete ${name}?`)) {
            return;
        }

        try {
            await axios.delete(`${BASE_URL}/employees/${id}`);
            alert("Employee deleted successfully");
            fetchEmployees(); // Refresh the employee list
        } catch (err) {
            console.error("Error deleting employee:", err);
            alert("Failed to delete employee");
        }
    };

    return (
        <div className='dashboard'>
            <div className='heading'>
                <h1>Employee Details</h1>
                <button className='add-btn' onClick={() => setFormShow(true)}>Add Employee</button>
            </div>

            <table className='employee-table'>
                <thead>
                    <tr>
                        <th>Employee ID</th>
                        <th>Name</th>
                        <th>Department</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {employeeDetails.length > 0 ? (
                        employeeDetails.map(emp => (
                            <tr key={emp.id}>
                                <td>{emp.id}</td>
                                <td>{emp.name}</td>
                                <td>{emp.department}</td>
                                <td>
                                    <button 
                                        className='delete-btn' 
                                        onClick={() => handleDelete(emp.id, emp.name)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" style={{ textAlign: 'center' }}>No employees found</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {formShow && (
                <div className='modal-overlay' onClick={() => setFormShow(false)}>
                    <form className='employee-form' onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
                        <input type="text" name='id' placeholder='Employee Id' value={employee.id} onChange={handleChange} required />
                        <input type="text" name='name' placeholder='Employee Name' value={employee.name} onChange={handleChange} required />
                        <input type="text" name='department' placeholder='Department' value={employee.department} onChange={handleChange} required />
                        <button type="submit">Submit</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Dashboard;