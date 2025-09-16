import dataSource from "../config/data-source";
import { ComfortsEntity } from "../entities/comforts.entity";
import { PropertyEntity } from "../entities/property.entity";
import { BadRequest, NotFound } from "http-errors";

export interface CreateComfortRequest {
    propertyId: number;
    name: string;
    description?: string;
}

class ComfortsService {
    private repo = dataSource.getRepository(ComfortsEntity);
    private propertyRepo = dataSource.getRepository(PropertyEntity);

    public async getForProperty(propertyId: number): Promise<ComfortsEntity[]> {
        const property = await this.propertyRepo.findOne({ where: { id: propertyId } });
        if (!property) throw new NotFound("Property not found");

        return this.repo.find({
            where: { property: { id: propertyId } },
            relations: ["property"],
        });
    }

    public async create(body: CreateComfortRequest): Promise<ComfortsEntity> {
        const property = await this.propertyRepo.findOne({ where: { id: body.propertyId } });
        if (!property) throw new BadRequest("Property not found");

        const entity = this.repo.create({
            property,
            name: body.name,
            description: body.description,
        });

        return await this.repo.save<ComfortsEntity>(entity);
    }

    public async delete(id: number): Promise<void> {
        const res = await this.repo.delete(id);
        if (!res.affected) throw new NotFound("Comfort not found");
    }
}

export default new ComfortsService();
