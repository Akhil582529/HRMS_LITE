from fastapi import FastAPI, HTTPException
from database import employee_collection, attendance_collection
from models import Employee, Attendance
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Employee endpoints
@app.get("/employees")
def get_employees():
    employees = list(employee_collection.find({}, {"_id": 0}))
    return employees

@app.post("/employees")
def add_employee(employee: Employee):
    employee_collection.insert_one(employee.dict())
    return {"message": "Employee added successfully"}

@app.delete("/employees/{employee_id}")
def delete_employee(employee_id: str):
    result = employee_collection.delete_one({"id": employee_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Employee not found")
    return {"message": "Employee deleted successfully"}

# Attendance endpoints
@app.get("/attendance/{date}")
def get_attendance(date: str):
    attendance = list(attendance_collection.find({"date": date}, {"_id": 0}))
    return attendance

@app.post("/attendance")
def mark_attendance(attendance: Attendance):
    # Check if attendance already exists for this employee on this date
    existing = attendance_collection.find_one({
        "employee_id": attendance.employee_id,
        "date": attendance.date
    })
    
    if existing:
        # Update existing record
        attendance_collection.update_one(
            {"employee_id": attendance.employee_id, "date": attendance.date},
            {"$set": {"status": attendance.status, "employee_name": attendance.employee_name}}
        )
    else:
        # Insert new record
        attendance_collection.insert_one(attendance.dict())
    
    return {"message": "Attendance marked successfully"}