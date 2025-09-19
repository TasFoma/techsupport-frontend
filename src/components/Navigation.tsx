import React from 'react';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/employees', label: 'Сотрудники' },
    { path: '/coefficients', label: 'Коэффициенты' },
    { path: '/shifts', label: 'Смены' },
    { path: '/statistics', label: 'Статистика' },
    { path: '/salary', label: 'Расчет ЗП' },
  ];

  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {menuItems.map((item) => (
            <Button
              key={item.path}
              color="inherit"
              onClick={() => navigate(item.path)}
              variant={location.pathname === item.path ? 'outlined' : 'text'}
            >
              {item.label}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;