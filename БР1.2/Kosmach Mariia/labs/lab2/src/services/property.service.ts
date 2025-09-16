import dataSource from "../config/data-source";
import { PropertyEntity } from "../entities/property.entity";
import {BadRequest, NotFound} from "http-errors";
import {CreatePropertyRequest} from "../models/create-property.request";
import {UpdatePropertyRequest} from "../models/update-property.request";
import {UserEntity} from "../entities/user.entity";

class PropertyService {
    private repo = dataSource.getRepository(PropertyEntity);
    private userRepo = dataSource.getRepository(UserEntity);

    public async getAll(): Promise<PropertyEntity[]> {
        return this.repo.find();
    }

    public async getById(id: number): Promise<PropertyEntity> {
        const entity = await this.repo.findOne({ where: { id } });
        if (!entity) throw new NotFound("Property not found");
        return entity;
    }

    public async create(body: CreatePropertyRequest, userId: number): Promise<PropertyEntity> {
        const owner = await this.userRepo.findOne({ where: { id: userId } });
        if (!owner) throw new BadRequest("Owner not found");
        const entity = this.repo.create({
            owner,
            title: body.title,
            description: body.description,
            rentType: body.rentType,
            price: body.price,
            status: body.status,
        });
        return await this.repo.save<PropertyEntity>(entity);
    }

    public async update(id: number, body: UpdatePropertyRequest): Promise<PropertyEntity> {
        const entity = await this.repo.findOne({ where: { id } });
        if (!entity) throw new NotFound("Property not found");
        Object.assign(entity, body);
        return await this.repo.save<PropertyEntity>(entity);
    }

    public async delete(id: number): Promise<void> {
        const res = await this.repo.delete(id);
        if (!res.affected) throw new NotFound("Property not found");
    }
}

export default new PropertyService();
