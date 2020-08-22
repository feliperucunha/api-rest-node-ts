import express, { response } from 'express';
import ClassesController from './controllers/ClassesController';

const routes = express.Router();
const classesControllers = new ClassesController();


routes.post("/classes", classesControllers.create);

export default routes;