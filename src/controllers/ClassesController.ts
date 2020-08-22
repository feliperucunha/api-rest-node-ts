import {Request, Response} from 'express';
 
import db from '../database/connection';
import converHourToMinutes from '../utils/convertHourToMinutes';

interface ScheduleItem {
    week_day: number;
    from: string;
    to: string;
}

export default class ClassesController {
    async index(req: Request, res: Response) {
        const filters = req.query;
        const subject = filters.subject as string;
        const week_day = filters.week_day as string;
        const time = filters.time as string;

        //verifica se o filtro está vazio
        if(!filters.subject || !filters.week_day || !filters.time) {
            return res.status(400).json({
                error: 'Missing filters to search classes'
            })
        }

        const timeInMinutes = converHourToMinutes(time);

        const classes = await db('classes')
            //verifica se tem horário disponível
            .whereExists(function() {
                this.select('class_schedule.*')
                    .from('class_schedule')
                    //verifica se os horários cadastrados estão de acordo com os filtrados
                    .whereRaw('`class_schedule`.`class_id` = `classes`.`id`')
                    .whereRaw('`class_schedule`.`week_day` = ??', [Number(week_day)])
                    .whereRaw('`class_schedule`.`from` <= ??', [timeInMinutes])
            })
            .where('classes.subject', '=', subject)
            .join('users', 'classes.user_id', '=', 'users.id')
            .select(['classes.*', 'users.*']);

        return res.json(classes);
    }


    async create(req: Request, res: Response) {
        const {
            name,
            avatar,
            whatsapp,
            bio,
            subject,
            cost,
            schedule
        } = req.body;
    
        const trx = await db.transaction();
    
        try {
            const insertedUsersIds = await trx('users').insert({
                name,
                avatar,
                whatsapp,
                bio,
            });
        
            const user_id = insertedUsersIds[0];
        
            const insertedClassesIds = await trx('classes').insert({
                subject,
                cost,
                whatsapp,
                bio,
                user_id,
            });
        
            const class_id = insertedClassesIds[0];
        
            const classSchedule = schedule.map((scheduleItem: ScheduleItem) => {
                return {
                    class_id,
                    week_day: scheduleItem.week_day,
                    from: converHourToMinutes(scheduleItem.from),
                    to: converHourToMinutes(scheduleItem.to),
                };
            })
        
            await trx('class_schedule').insert(classSchedule);
        
            await trx.commit();
        
            return res.status(201).send();
        } catch (error) {
            console.log(error)
            await trx.rollback();
            return res.status(400).json({
                error: 'Unexpected error while creating new class'
            })
        }
    }
}