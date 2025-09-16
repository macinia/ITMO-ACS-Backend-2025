import dataSource from "../config/data-source";
import { BadRequest, NotFound } from "http-errors";
import {MessageEntity} from "../entities/message.entity";
import {UserEntity} from "../entities/user.entity";
import {PropertyEntity} from "../entities/property.entity";
import {CreateMessageRequest} from "../models/create-message.request";
import {UpdateMessageRequest} from "../models/update-message.request";


class MessageService {
    private repo = dataSource.getRepository(MessageEntity);
    private userRepo = dataSource.getRepository(UserEntity);
    private propertyRepo = dataSource.getRepository(PropertyEntity);

    public async getById(id: number): Promise<MessageEntity> {
        const entity = await this.repo.findOne({
            where: { id },
            relations: ["sender", "receiver", "property"],
        });
        if (!entity) throw new NotFound("Message not found");
        return entity;
    }

    public async getForProperty(propertyId: number): Promise<MessageEntity[]> {
        return this.repo.find({
            where: { property: { id: propertyId } },
            relations: ["sender", "receiver", "property"],
        });
    }

    public async create(req: CreateMessageRequest, ownerId: number): Promise<MessageEntity> {
        const [sender, receiver, property] = await Promise.all([
            this.userRepo.findOne({ where: { id: ownerId } }),
            this.userRepo.findOne({ where: { id: req.receiverId } }),
            this.propertyRepo.findOne({ where: { id: req.propertyId } }),
        ]);

        const missing = [
            !sender && "sender",
            !receiver && "receiver",
            !property && "property",
        ].filter(Boolean);

        if (missing.length) {
            throw new BadRequest(`Not found: ${missing.join(", ")}`);
        }

        const entity = this.repo.create({
            sender: sender!,
            receiver: receiver!,
            property: property!,
            message: req.message,
            createdAt: new Date(),
        });

        return await this.repo.save<MessageEntity>(entity);
    }

    public async update(id: number, req: UpdateMessageRequest): Promise<MessageEntity> {
        const entity = await this.repo.findOne({ where: { id } });
        if (!entity) throw new NotFound("Message not found");

        Object.assign(entity, req);
        return await this.repo.save<MessageEntity>(entity);
    }

    public async delete(id: number): Promise<void> {
        const res = await this.repo.delete(id);
        if (!res.affected) throw new NotFound("Message not found");
    }
}

export default new MessageService();
