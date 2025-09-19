import axios from 'axios';
import { 
  Employee, 
  CoefficientSetting, 
  WorkShift, 
  Break, 
  OperatorStatistic, 
  SalaryCalculation  
} from '../types';

const API_BASE_URL = 'http://localhost:5259';
const api = axios.create({
  baseURL: API_BASE_URL,
});

export const employeeService = {
  getAll: () => api.get<Employee[]>('/api/employees'), 
  create: (employee: Omit<Employee, 'id'>) => api.post('/api/employees', employee), 
  update: (id: number, employee: Employee) => api.put(`/api/employees/${id}`, employee), 
  delete: (id: number) => api.delete(`/api/employees/${id}`), 
};

export const coefficientService = {
  getAll: () => api.get<CoefficientSetting[]>('/api/coefficientsettings'), 
  create: (setting: Omit<CoefficientSetting, 'id'>) => api.post('/api/coefficientsettings', setting), 
  update: (id: number, setting: CoefficientSetting) => api.put(`/api/coefficientsettings/${id}`, setting),
  delete: (id: number) => api.delete(`/api/coefficientsettings/${id}`),
};
 
export const shiftService = {
  getAll: () => api.get<WorkShift[]>('/api/WorkShifts'),
  start: (employeeId: number) => api.post<WorkShift>('/api/WorkShifts/start', { employeeId }),
  end: (id: number) => api.put(`/api/WorkShifts/${id}/end`),
  delete: (id: number) => api.delete(`/api/WorkShifts/${id}`),
};

export const breakService = {
  getAll: () => api.get<Break[]>('/api/Breaks'),
  start: (workShiftId: number) => api.post<Break>('/api/Breaks/start', { workShiftId }),
  end: (id: number) => api.put(`/api/Breaks/${id}/end`),
  delete: (id: number) => api.delete(`/api/Breaks/${id}`),
};

export const statisticService = {
  getAll: () => api.get<OperatorStatistic[]>('/api/OperatorStatistics'),
  getByEmployee: (employeeId: number) => api.get<OperatorStatistic[]>(`/api/OperatorStatistics/employee/${employeeId}`),
  create: (statistic: Omit<OperatorStatistic, 'id'>) => api.post('/api/OperatorStatistics', statistic),
  delete: (id: number) => api.delete(`/api/OperatorStatistics/${id}`),
};

export const salaryService = {
  calculate: (employeeId: number, period: string) => 
    api.post<SalaryCalculation>('/api/Salary/calculate', { employeeId, period }),
  
  getByEmployee: (employeeId: number) => 
    api.get<SalaryCalculation[]>(`/api/Salary/employee/${employeeId}`),
  
  getAll: () => api.get<SalaryCalculation[]>('/api/Salary')
};