import React from 'react';
import { type Employee } from 'src/types/interfaces'; // Import the interface

interface EmployeeListProps {
  employees: Employee[];
}

export function EmployeeList({ employees }: EmployeeListProps) {
  return (
    <ul className="space-y-4">
      {employees.map((employee) => (
        <li key={employee.id} className="border p-4 rounded-lg shadow-sm">
          <h3 className="font-semibold text-lg">{employee.firstName} {employee.lastName}</h3>
          <p>Email: <span className="text-gray-600">{employee.email}</span></p>
          <p>Telephone: <span className="text-gray-600">{employee.telephoneNumber ?? 'N/A'}</span></p>
          <p>Manager: <span className="text-gray-600">{employee.manager?.firstName ?? 'No Manager Assigned'}</span></p>
          <p>Status: <span className={`text-sm ${employee.status === 'Active' ? 'text-green-500' : 'text-red-500'}`}>
            {employee.status ?? 'Unknown'}
          </span></p>
        </li>
      ))}
    </ul>
  );
}

  
