import { Task } from '../../entities/task.entity';

export class ResponseTaskDto {
    id: Task['id'];
    title: Task['title'];
    description: Task['description'];
    done: Task['done'];
    dueDate: Task['dueDate'];

    private static build(data: {
        id: Task['id'];
        title: Task['title'];
        description: Task['description'];
        done: Task['done'];
        dueDate: Task['dueDate'];
    }): ResponseTaskDto {
        const dto = new ResponseTaskDto();
        dto.id = data.id;
        dto.title = data.title;
        dto.description = data.description;
        dto.done = data.done;
        dto.dueDate = data.dueDate;
        return dto;
    }

    static fromEntity(task: Task): ResponseTaskDto {
        return this.build(task);
    }

    static fromPlain(
        data: Pick<Task, 'id' | 'title' | 'description' | 'done' | 'dueDate'>,
    ): ResponseTaskDto {
        return this.build(data);
    }
}
