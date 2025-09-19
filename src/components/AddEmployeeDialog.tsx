import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  MenuItem 
} from '@mui/material';
import { Employee } from '../types';
import { employeeService } from '../services/api';

interface AddEmployeeDialogProps {
  open: boolean;
  onClose: () => void;
  onEmployeeAdded: () => void;
}

const AddEmployeeDialog: React.FC<AddEmployeeDialogProps> = ({ 
  open, 
  onClose, 
  onEmployeeAdded 
}) => {
  const [formData, setFormData] = useState<Partial<Employee>>({
    firstName: '',
    lastName: '',
    middleName: '',
    position: 'operator',
    status: 'active'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Проверяем обязательные поля
    if (!formData.lastName || !formData.firstName) {
      alert('Пожалуйста, заполните фамилию и имя');
      return;
    }

    try {
      // Создаем объект с гарантированно заполненными полями
      const employeeData: Omit<Employee, 'id'> = {
        lastName: formData.lastName!,
        firstName: formData.firstName!,
        middleName: formData.middleName,
        position: formData.position || 'operator',
        status: formData.status || 'active'
      };
      
      await employeeService.create(employeeData);
      onEmployeeAdded();
      onClose();
      
      // Сбрасываем форму
      setFormData({
        firstName: '',
        lastName: '',
        middleName: '',
        position: 'operator',
        status: 'active'
      });
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Добавить нового сотрудника</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Фамилия *"
            fullWidth
            value={formData.lastName}
            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
            required
          />
          <TextField
            margin="dense"
            label="Имя *"
            fullWidth
            value={formData.firstName}
            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
            required
          />
          <TextField
            margin="dense"
            label="Отчество"
            fullWidth
            value={formData.middleName}
            onChange={(e) => setFormData({...formData, middleName: e.target.value})}
          />
          <TextField
            margin="dense"
            label="Должность"
            select
            fullWidth
            value={formData.position}
            onChange={(e) => setFormData({...formData, position: e.target.value})}
          >
          <MenuItem value="operator">Оператор</MenuItem>
          <MenuItem value="senior_operator">Старший оператор</MenuItem>
          <MenuItem value="super_operator">Супероператор</MenuItem>
          <MenuItem value="manager">Руководитель</MenuItem>
          </TextField>
          <TextField
            margin="dense"
            label="Статус"
            select
            fullWidth
            value={formData.status}
            onChange={(e) => setFormData({...formData, status: e.target.value})}
          >
          <MenuItem value="active">Активен</MenuItem>
          <MenuItem value="inactive">Неактивен</MenuItem>
          <MenuItem value="fired">Уволен</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Отмена</Button>
          <Button type="submit" variant="contained">
            Сохранить
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddEmployeeDialog;