import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Button,
  MenuItem,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  CircularProgress
} from '@mui/material';
import { Employee, SalaryCalculation, CoefficientSetting } from '../types';
import { employeeService, salaryService, coefficientService } from '../services/api';

const SalaryPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [coefficients, setCoefficients] = useState<CoefficientSetting[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);
  const [period, setPeriod] = useState<string>('');
  const [calculations, setCalculations] = useState<SalaryCalculation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  useEffect(() => {
    loadEmployees();
    loadCoefficients();
    loadCalculations();
    setPeriod(getCurrentMonth());
  }, []);

  function getCurrentMonth(): string {
    const now = new Date();
    return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
  }

  const loadEmployees = async () => {
    try {
      const response = await employeeService.getAll();
      setEmployees(response.data);
    } catch (error) {
      console.error('Error loading employees:', error);
      setError('Ошибка загрузки сотрудников');
    }
  };

  const loadCoefficients = async () => {
    try {
      const response = await coefficientService.getAll();
      setCoefficients(response.data);
    } catch (error) {
      console.error('Error loading coefficients:', error);
    }
  };

  const loadCalculations = async () => {
    try {
      const response = await salaryService.getAll();
      setCalculations(response.data);
    } catch (error) {
      console.error('Error loading calculations:', error);
    }
  };

  const handleCalculateSalary = async () => {
    if (!selectedEmployee) {
      setError('Выберите сотрудника');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const [year, month] = period.split('-');
      const periodDate = `${year}-${month}-01`;
      
      await salaryService.calculate(selectedEmployee, periodDate);
      setSuccess('Зарплата успешно рассчитана');
      loadCalculations();
    } catch (error: any) {
      console.error('Error calculating salary:', error);
      setError(error.response?.data?.message || 'Ошибка расчета зарплаты');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Расчет заработной платы
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
        <Box sx={{ flex: '1 1 400px' }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Новый расчет
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                select
                label="Сотрудник"
                value={selectedEmployee || ''}
                onChange={(e) => setSelectedEmployee(Number(e.target.value))}
              >
                <MenuItem value="">Выберите сотрудника</MenuItem>
                {employees.map((employee) => (
                  <MenuItem key={employee.id} value={employee.id}>
                    {employee.lastName} {employee.firstName} ({employee.position})
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                type="month"
                label="Период расчета"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />

              <Button
                variant="contained"
                onClick={handleCalculateSalary}
                disabled={loading || !selectedEmployee}
                size="large"
              >
                {loading ? <CircularProgress size={24} /> : 'Рассчитать зарплату'}
              </Button>
            </Box>
          </Paper>
        </Box>

        <Box sx={{ flex: '1 1 400px' }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Настройки коэффициентов
            </Typography>
            <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
              {coefficients.map((coeff) => (
                <Typography key={coeff.id} variant="body2" sx={{ mb: 1 }}>
                  {coeff.parameterName}: норма={coeff.norm}, база={coeff.base}, вес={coeff.weight}
                </Typography>
              ))}
            </Box>
          </Paper>
        </Box>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          История расчетов
        </Typography>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Сотрудник</TableCell>
                <TableCell>Период</TableCell>
                <TableCell>Параметр</TableCell>
                <TableCell>Значение</TableCell>
                <TableCell>Результат</TableCell>
                <TableCell>Дата расчета</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {calculations.map((calculation) => (
                <TableRow key={calculation.id}>
                  <TableCell>
                    {calculation.employee?.lastName} {calculation.employee?.firstName}
                  </TableCell>
                  <TableCell>
                    {calculation.period || calculation.calculationPeriod || 'Период'}
                  </TableCell>
                  <TableCell>Общий коэффициент</TableCell>
                  <TableCell>1.0</TableCell>
                  <TableCell>
                    {(calculation.result || calculation.finalResult || 0)?.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {new Date(calculation.calculationDate).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {calculations.length === 0 && (
          <Typography sx={{ p: 2, textAlign: 'center' }}>
            Нет данных о расчетах
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default SalaryPage;