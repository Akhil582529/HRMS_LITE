import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ATTENDANCE.css';

const Attendance = () => {
    const [employees, setEmployees] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(false);

    const BASE_URL = "http://127.0.0.1:8000";

    const fetchEmployees = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/employees`);
            setEmployees(res.data);
        } catch (error) {
            console.error("Error fetching employees:", error);
        }
    };

    const fetchAttendance = async (date) => {
        try {
            const res = await axios.get(`${BASE_URL}/attendance/${date}`);
            setAttendance(res.data);
        } catch (error) {
            console.error("Error fetching attendance:", error);
            setAttendance([]);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    useEffect(() => {
        if (selectedDate) {
            fetchAttendance(selectedDate);
        }
    }, [selectedDate]);

    const getAttendanceStatus = (employeeId) => {
        const record = attendance.find(att => att.employee_id === employeeId);
        return record ? record.status : null;
    };

    const markAttendance = async (employeeId, employeeName, status) => {
        setLoading(true);
        try {
            await axios.post(`${BASE_URL}/attendance`, {
                employee_id: employeeId,
                employee_name: employeeName,
                date: selectedDate,
                status: status
            });
            alert(`Marked ${employeeName} as ${status}`);
            fetchAttendance(selectedDate);
        } catch (err) {
            console.error("Error marking attendance:", err);
            alert("Failed to mark attendance");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='attendance-container'>
            <div className='attendance-header'>
                <h1>Employee Attendance</h1>
                <div className='date-selector'>
                    <label>Select Date: </label>
                    <input 
                        type="date" 
                        value={selectedDate} 
                        onChange={(e) => setSelectedDate(e.target.value)}
                        max={new Date().toISOString().split('T')[0]}
                    />
                </div>
            </div>

            <table className='attendance-table'>
                <thead>
                    <tr>
                        <th>Employee ID</th>
                        <th>Name</th>
                        <th>Department</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.length > 0 ? (
                        employees.map(emp => {
                            const status = getAttendanceStatus(emp.id);
                            return (
                                <tr key={emp.id}>
                                    <td>{emp.id}</td>
                                    <td>{emp.name}</td>
                                    <td>{emp.department}</td>
                                    <td>
                                        <span className={`status-badge ${status ? status.toLowerCase() : 'unmarked'}`}>
                                            {status || 'Not Marked'}
                                        </span>
                                    </td>
                                    <td>
                                        <button 
                                            className='present-btn' 
                                            onClick={() => markAttendance(emp.id, emp.name, 'Present')}
                                            disabled={loading || status === 'Present'}
                                        >
                                            Present
                                        </button>
                                        <button 
                                            className='absent-btn' 
                                            onClick={() => markAttendance(emp.id, emp.name, 'Absent')}
                                            disabled={loading || status === 'Absent'}
                                        >
                                            Absent
                                        </button>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan="5" style={{ textAlign: 'center' }}>No employees found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Attendance;