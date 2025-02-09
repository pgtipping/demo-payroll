import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  salary: number;
  payGrade?: {
    name: string;
  };
  createdAt: string;
}

export interface EmployeeDetails extends Employee {
  salaryComponents: Array<{
    type: string;
    amount: number;
    description?: string;
  }>;
  deductions: Array<{
    amount: number;
    deductionType: {
      name: string;
      description?: string;
    };
  }>;
}

const employeeApi = {
  // Get all employees (admin only)
  getEmployees: async (): Promise<Employee[]> => {
    const response = await axios.get(`${API_URL}/employees`);
    return response.data.employees;
  },

  // Get employee by ID (admin or self)
  getEmployeeById: async (id: string): Promise<EmployeeDetails> => {
    const response = await axios.get(`${API_URL}/employees/${id}`);
    return response.data.employee;
  },

  // Create new employee (admin only)
  createEmployee: async (
    employeeData: Partial<Employee>
  ): Promise<Employee> => {
    const response = await axios.post(`${API_URL}/employees`, employeeData);
    return response.data.employee;
  },

  // Update employee (admin or self)
  updateEmployee: async (
    id: string,
    updates: Partial<Employee>
  ): Promise<Employee> => {
    const response = await axios.put(`${API_URL}/employees/${id}`, updates);
    return response.data.employee;
  },

  // Delete employee (admin only)
  deleteEmployee: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/employees/${id}`);
  },
};

export default employeeApi;
