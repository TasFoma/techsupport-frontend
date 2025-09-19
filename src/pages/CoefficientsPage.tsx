import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Button,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress
} from '@mui/material';
import { Edit, Save, Cancel, Delete } from '@mui/icons-material';
import { CoefficientSetting } from '../types';
import { coefficientService } from '../services/api';

const CoefficientsPage: React.FC = () => {
  const [coefficients, setCoefficients] = useState<CoefficientSetting[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedCoefficient, setEditedCoefficient] = useState<Partial<CoefficientSetting>>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [coefficientToDelete, setCoefficientToDelete] = useState<CoefficientSetting | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  useEffect(() => {
    loadCoefficients();
  }, []);

  const loadCoefficients = async () => {
    try {
      const response = await coefficientService.getAll();
      setCoefficients(response.data);
    } catch (error) {
      console.error('Error loading coefficients:', error);
      setError('Ошибка загрузки коэффициентов');
    }
  };

  const handleEdit = (coefficient: CoefficientSetting) => {
    setEditingId(coefficient.id);
    setEditedCoefficient(coefficient);
  };

  const handleSave = async (id: number) => {
    try {
      await coefficientService.update(id, editedCoefficient as CoefficientSetting);
      setEditingId(null);
      setEditedCoefficient({});
      setSuccess('Коэффициент успешно обновлен');
      loadCoefficients();
    } catch (error) {
      console.error('Error updating coefficient:', error);
      setError('Ошибка обновления коэффициента');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedCoefficient({});
  };

  const handleChange = (field: keyof CoefficientSetting, value: any) => {
    setEditedCoefficient(prev => ({ ...prev, [field]: value }));
  };

  const handleDeleteClick = (coefficient: CoefficientSetting) => {
    setCoefficientToDelete(coefficient);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!coefficientToDelete) return;

    setLoading(true);
    try {
      await coefficientService.delete(coefficientToDelete.id);
      setSuccess('Коэффициент успешно удален');
      setDeleteDialogOpen(false);
      setCoefficientToDelete(null);
      loadCoefficients();
    } catch (error) {
      console.error('Error deleting coefficient:', error);
      setError('Ошибка удаления коэффициента');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setCoefficientToDelete(null);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Управление коэффициентами
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}

      <Paper sx={{ p: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Параметр</TableCell>
                <TableCell>Норма</TableCell>
                <TableCell>База</TableCell>
                <TableCell>Вес</TableCell>
                <TableCell>Тип</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {coefficients.map((coefficient) => (
                <TableRow key={coefficient.id}>
                  <TableCell>
                    {editingId === coefficient.id ? (
                      <TextField
                        value={editedCoefficient.parameterName || ''}
                        onChange={(e) => handleChange('parameterName', e.target.value)}
                        size="small"
                      />
                    ) : (
                      coefficient.parameterName
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === coefficient.id ? (
                      <TextField
                        type="number"
                        value={editedCoefficient.norm || 0}
                        onChange={(e) => handleChange('norm', Number(e.target.value))}
                        size="small"
                      />
                    ) : (
                      coefficient.norm
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === coefficient.id ? (
                      <TextField
                        type="number"
                        value={editedCoefficient.base || 0}
                        onChange={(e) => handleChange('base', Number(e.target.value))}
                        size="small"
                      />
                    ) : (
                      coefficient.base
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === coefficient.id ? (
                      <TextField
                        type="number"
                        value={editedCoefficient.weight || 0}
                        onChange={(e) => handleChange('weight', Number(e.target.value))}
                        size="small"
                      />
                    ) : (
                      coefficient.weight
                    )}
                  </TableCell>
                  <TableCell>
  {editingId === coefficient.id ? (
                     <TextField
                        select
                        value={editedCoefficient.coefficientType || ''}
                        onChange={(e) => handleChange('coefficientType', e.target.value)}
                        size="small"
                      >
                        <option value="положительный">Положительный</option>
                        <option value="негативный">Негативный</option>
                      </TextField>
                    ) : (
                      coefficient.coefficientType === 'положительный' ? 'Положительный' : 'Негативный'
                   )}
                  </TableCell>
                  <TableCell>
                    {editingId === coefficient.id ? (
                      <>
                        <IconButton onClick={() => handleSave(coefficient.id)} color="primary">
                          <Save />
                        </IconButton>
                        <IconButton onClick={handleCancel} color="secondary">
                          <Cancel />
                        </IconButton>
                      </>
                    ) : (
                      <>
                        <IconButton onClick={() => handleEdit(coefficient)} color="primary">
                          <Edit />
                        </IconButton>
                        <IconButton 
                          onClick={() => handleDeleteClick(coefficient)} 
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Диалог подтверждения удаления */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Подтверждение удаления</DialogTitle>
        <DialogContent>
          <Typography>
            Вы уверены, что хотите удалить коэффициент "{coefficientToDelete?.parameterName}"?
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Это действие нельзя отменить.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={loading}>
            Отмена
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CoefficientsPage;