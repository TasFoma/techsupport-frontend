import React, { useEffect, useState } from 'react';
import {
  DataGrid,
  GridColDef,
  GridActionsCellItem,   
  GridRowId
} from '@mui/x-data-grid';
import { Button, IconButton } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';  // иконки
import { Employee } from '../types';
import { employeeService } from '../services/api';
import AddEmployeeDialog from '../components/AddEmployeeDialog';

const EmployeesPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const response = await employeeService.getAll();
      setEmployees(response.data);
    } catch (error) {
      console.error('Error loading employees:', error);
    }
  };

  const handleDelete = async (id: GridRowId) => {
    if (window.confirm('Удалить этого сотрудника?')) {
      try {
        await employeeService.delete(id as number);
        loadEmployees(); // Перезагружаем список после удаления
      } catch (error) {
        console.error('Error deleting employee:', error);
      }
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'lastName', headerName: 'Фамилия', width: 150 },
    { field: 'firstName', headerName: 'Имя', width: 150 },
    { field: 'middleName', headerName: 'Отчество', width: 150 },
    { field: 'position', headerName: 'Должность', width: 200 },
    { field: 'status', headerName: 'Статус', width: 130 },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Действия',
      width: 120,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<Delete />}
          label="Delete"
          onClick={() => handleDelete(params.id)}
        />
      ]
    }
  ];

  return (
    <div style={{ height: 400, width: '100%' }}>
      <Button 
        variant="contained" 
        sx={{ mb: 2 }}
        onClick={() => setOpenDialog(true)}
      >
        Добавить сотрудника
      </Button>
      
      <AddEmployeeDialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)} 
        onEmployeeAdded={loadEmployees}
      />
      
      <DataGrid
        rows={employees}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
      />
    </div>
  );
};

export default EmployeesPage;