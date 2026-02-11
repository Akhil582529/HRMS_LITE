from pydantic import BaseModel
from typing import Optional

class Employee(BaseModel):
    id: str
    name: str
    department: str

class Attendance(BaseModel):
    employee_id: str
    employee_name: str
    date: str
    status: str  