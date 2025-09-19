import React, { useEffect, useState } from 'react';
import {
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridRowId,
  GridRowParams
} from '@mui/x-data-grid';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  TextField,
  Box,
  Snackbar,
  Alert
} from '@mui/material';
import { PlayArrow, Stop, Delete } from '@mui/icons-material';
import { WorkShift, Employee } from '../types';
import { shiftService, employeeService } from '../services/api';

const ShiftsPage: React.FC = () => {
  const [shifts, setShifts] = useState<WorkShift[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [openStartDialog, setOpenStartDialog] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | ''>('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    loadShifts();
    loadEmployees();
  }, []);

  const loadShifts = async () => {
    try {
      const response = await shiftService.getAll();
      setShifts(response.data);
    } catch (error) {
      showSnackbar('Ошибка загрузки смен', 'error');
    }
  };

  const loadEmployees = async () => {
    try {
      const response = await employeeService.getAll();
      setEmployees(response.data);
    } catch (error) {
      showSnackbar('Ошибка загрузки сотрудников', 'error');
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleStartShift = async () => {
    if (!selectedEmployeeId) return;

    try {
      await shiftService.start(selectedEmployeeId);
      setOpenStartDialog(false);
      setSelectedEmployeeId('');
      showSnackbar('Смена начата', 'success');
      loadShifts();
    } catch (error) {
      showSnackbar('Ошибка начала смены', 'error');
    }
  };

  const handleEndShift = async (id: number) => {
    try {
      await shiftService.end(id);
      showSnackbar('Смена завершена', 'success');
      loadShifts();
    } catch (error) {
      showSnackbar('Ошибка завершения смены', 'error');
    }
  };

  const handleDeleteShift = async (id: GridRowId) => {
    if (window.confirm('Удалить эту смену?')) {
      try {
        await shiftService.delete(id as number);
        showSnackbar('Смена удалена', 'success');
        loadShifts();
      } catch (error) {
        showSnackbar('Ошибка удаления смены', 'error');
      }
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { 
      field: 'employeeName', 
      headerName: 'Сотрудник', 
      width: 200,
      valueGetter: (value: any, row: WorkShift) => 
        `${row.employee?.lastName} ${row.employee?.firstName}`
    },
    { 
      field: 'startDate', 
      headerName: 'Начало', 
      width: 180,
      valueGetter: (value: any, row: WorkShift) => 
        new Date(row.startDate).toLocaleString()
    },
    { 
      field: 'endDate', 
      headerName: 'Конец', 
      width: 180,
      valueGetter: (value: any, row: WorkShift) => 
        row.endDate ? new Date(row.endDate).toLocaleString() : 'В процессе'
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Действия',
      width: 150,
      getActions: (params: GridRowParams) => {
        const actions = [
          <GridActionsCellItem
            key="delete"
            icon={<Delete />}
            label="Удалить"
            onClick={() => handleDeleteShift(params.id)}
          />
        ];

        // Добавляем кнопку завершения только если смена не завершена
        if (!params.row.endDate) {
          actions.unshift(
            <GridActionsCellItem
              key="end"
              icon={<Stop />}
              label="Завершить смену"
              onClick={() => handleEndShift(params.row.id)}
            />
          );
        }

        return actions;
      }
    }
  ];

  return (
    <div>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <h2>Управление сменами</h2>
        <Button
          variant="contained"
          startIcon={<PlayArrow />}
          onClick={() => setOpenStartDialog(true)}
        >
          Начать смену
        </Button>
      </Box>

      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={shifts}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}
        />
      </div>

      <Dialog open={openStartDialog} onClose={() => setOpenStartDialog(false)}>
        <DialogTitle>Начать новую смену</DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            margin="normal"
            label="Сотрудник"
            value={selectedEmployeeId}
            onChange={(e) => setSelectedEmployeeId(Number(e.target.value))}
          >
            {employees.map((employee) => (
              <MenuItem key={employee.id} value={employee.id}>
                {employee.lastName} {employee.firstName}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenStartDialog(false)}>Отмена</Button>
          <Button 
            variant="contained" 
            onClick={handleStartShift}
            disabled={!selectedEmployeeId}
          >
            Начать смену
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity as 'success' | 'error'}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ShiftsPage;