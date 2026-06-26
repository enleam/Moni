const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const categoriaRoutes = require('./routes/categoria.routes');
const movimientoRoutes = require('./routes/movimiento.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const presupuestoRoutes = require('./routes/presupuesto.routes');

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    mensaje: 'API FinTrack Personal funcionando correctamente.'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/movimientos', movimientoRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/presupuestos', presupuestoRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor backend ejecutándose en puerto ${PORT}`);
});