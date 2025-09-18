import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Task } from '../entities/task.entity';
import { User } from '../entities/user.entity';
import { EditTaskDto } from './dto/edit-task.dto';
import { ResponseTaskDto } from './dto/response.dto';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private readonly tasksRepository: Repository<Task>,
    ) {}

    async listTasks(userId: User['id']) {
        const tasks = await this.tasksRepository.find({
            where: { owner: { id: userId } },
        });
        return tasks.map(ResponseTaskDto.fromEntity);
    }

    async getTask(id: EditTaskDto['id'], userId: User['id']) {
        const task = await this.tasksRepository
            .createQueryBuilder('task')
            .where('task.owner.id = :userId', { userId })
            .andWhere('task.id = :id', { id })
            .getOne();

        if (!task) {
            throw new ForbiddenException([
                'Task not found or you do not have permission to view it',
            ]);
        }

        return ResponseTaskDto.fromEntity(task);
    }

    async editTask(taskData: EditTaskDto, userId: User['id']) {
        const { id, ...updatable } = taskData;
        const dataSource = await this.tasksRepository
            .createQueryBuilder()
            .update(Task)
            .set({
                ...updatable,
                id: () => 'id',
            })
            .where('ownerId = :userId', { userId })
            .andWhere('id = :id', { id })
            .execute();

        if (dataSource.affected === 0) {
            throw new ForbiddenException([
                'Task not found or you do not have permission to edit it',
            ]);
        }

        return ResponseTaskDto.fromPlain({...updatable, id});
    }
}
