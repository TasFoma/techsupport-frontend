export interface Employee {
  id: number;
  lastName: string;
  firstName: string;
  middleName?: string;
  position: string;
  status: string;
}

export interface CoefficientSetting {
  id: number;
  parameterName: string;
  norm: number;
  base: number;
  weight: number;
  coefficientType: string;
}

export interface WorkShift {
  id: number;
  startDate: string;
  endDate?: string;
  employeeId: number;
  employee?: Employee;
}

export interface Break {
  id: number;
  startDate: string;
  endDate?: string;
  employeeId: number;
  shiftId: number;
  employee?: Employee;
  shift?: WorkShift;
}

export interface OperatorStatistic {
  id: number;
  date: Date;
  parameterName: string;
  value: number;
  employeeId: number;
  employee?: Employee;
  shiftId: number;  
  workShift?: WorkShift;
}
export interface SalaryCalculation {
  id: number;
  employeeId: number;
  period?: string;                    // Для совместимости со старым форматом
  calculationPeriod?: string;         // Для нового формата  
  result?: number;                    // Для совместимости со старым форматом
  finalResult?: number;               // Для нового формата
  calculationDate: string;
  employee?: Employee;
}