import React, { useEffect, useState } from 'react';
import {
  DataGrid,
  GridColDef,
} from '@mui/x-data-grid';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { OperatorStatistic, Employee, WorkShift } from '../types'; 
import { statisticService, employeeService, shiftService } from '../services/api';
const StatisticsPage: React.FC = () => {
  const [statistics, setStatistics] = useState<OperatorStatistic[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [shifts, setShifts] = useState<WorkShift[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | number>('all');

  useEffect(() => {
    loadEmployees();
    loadShifts();
    loadStatistics();
  }, []);

  useEffect(() => {
    if (selectedEmployeeId === 'all') {
      loadStatistics();
    } else {
      loadEmployeeStatistics(selectedEmployeeId as number);
    }
  }, [selectedEmployeeId]);

  const loadStatistics = async () => {
    try {
      const response = await statisticService.getAll();
      // Обогащаем статистику данными о сменах
      const enrichedStats = response.data.map(stat => {
        const shift = shifts.find(s => s.id === stat.shiftId);
        return { ...stat, workShift: shift };
      });
      setStatistics(enrichedStats);
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  };

const loadShifts = async () => {
  try {
    const response = await shiftService.getAll();  
    setShifts(response.data);
  } catch (error) {
    console.error('Error loading shifts:', error);
  }
};

  const loadEmployeeStatistics = async (employeeId: number) => {
    try {
      const response = await statisticService.getByEmployee(employeeId);
      // Обогащаем статистику данными о сменах
      const enrichedStats = response.data.map(stat => {
        const shift = shifts.find(s => s.id === stat.shiftId);
        return { ...stat, workShift: shift };
      });
      setStatistics(enrichedStats);
    } catch (error) {
      console.error('Error loading employee statistics:', error);
    }
  };

  const loadEmployees = async () => {
    try {
      const response = await employeeService.getAll();
      setEmployees(response.data);
    } catch (error) {
      console.error('Error loading employees:', error);
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { 
      field: 'employeeName', 
      headerName: 'Сотрудник', 
      width: 200,
      valueGetter: (value: any, row: OperatorStatistic) => 
        `${row.employee?.lastName} ${row.employee?.firstName}`
    },
    { 
      field: 'parameterName', 
      headerName: 'Параметр', 
      width: 150 
    },
    { 
      field: 'value', 
      headerName: 'Значение', 
      width: 100,
      type: 'number'
    },
    { 
      field: 'date', 
      headerName: 'Дата', 
      width: 150,
      valueGetter: (value: any, row: OperatorStatistic) => 
        new Date(row.date).toLocaleDateString()
    },
    { 
      field: 'shiftInfo', 
      headerName: 'Смена', 
      width: 150,
      valueGetter: (value: any, row: OperatorStatistic) => 
        row.workShift ? `Смена #${row.workShift.id}` : 'Без смены'
    },
  ]; 

  return (
    <div>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <h2>Статистика операторов</h2>
        
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Сотрудник</InputLabel>
          <Select
            value={selectedEmployeeId}
            label="Сотрудник"
            onChange={(e) => setSelectedEmployeeId(e.target.value)}
          >
            <MenuItem value="all">Все сотрудники</MenuItem>
            {employees.map((employee) => (
              <MenuItem key={employee.id} value={employee.id}>
                {employee.lastName} {employee.firstName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={statistics}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}
        />
      </div>
    </div>
  );
};

export default StatisticsPage;