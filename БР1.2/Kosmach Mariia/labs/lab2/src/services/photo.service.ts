import dataSource from "../config/data-source";
import { PhotoEntity } from "../entities/photo.entity";
import { PropertyEntity } from "../entities/property.entity";
import { BadRequest, NotFound } from "http-errors";

export interface CreatePhotoRequest {
    propertyId: number;
    path: string;
}

class PhotoService {
    private repo = dataSource.getRepository(PhotoEntity);
    private propertyRepo = dataSource.getRepository(PropertyEntity);

    public async getForProperty(propertyId: number): Promise<PhotoEntity[]> {
        const property = await this.propertyRepo.findOne({ where: { id: propertyId } });
        if (!property) throw new NotFound("Property not found");

        return this.repo.find({
            where: { property: { id: propertyId } },
            relations: ["property"],
        });
    }

    public async create(body: CreatePhotoRequest): Promise<PhotoEntity> {
        const property = await this.propertyRepo.findOne({ where: { id: body.propertyId } });
        if (!property) throw new BadRequest("Property not found");

        const entity = this.repo.create({
            property,
            path: body.path,
        });

        return await this.repo.save<PhotoEntity>(entity);
    }

    public async delete(id: number): Promise<void> {
        const res = await this.repo.delete(id);
        if (!res.affected) throw new NotFound("Photo not found");
    }
}

export default new PhotoService();
