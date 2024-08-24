import express from 'express';
import userRoutes from './routes/user.routes';
import cashOutRoutes from './routes/cashout.routes';
import cashInRoutes from './routes/cashin.routes';
import sendMoneyRoutes from './routes/sendmoney.routes';

const app = express();

app.use(express.json());

app.use('/users', userRoutes);
app.use('/cashout', cashOutRoutes);
app.use('/cashin', cashInRoutes);
app.use('/sendmoney', sendMoneyRoutes);

export default app;
