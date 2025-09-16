import {Body, Controller, Delete, Get, Path, Post, Put, Response, Route, SuccessResponse, Tags} from "tsoa";
import dataSource from "../config/data-source";
import {EntityNotFoundErrorResponse} from "../models/entity-not-found.model";
import {RentalAgreementEntity} from "../entities/rental-agreement.entity";
import {PropertyEntity} from "../entities/property.entity";
import {UserEntity} from "../entities/user.entity";
import {CreateRentalAgreementRequest} from "../models/create-rental-agreement.request";
import {UpdateRentalStatusRequest} from "../models/update-rental-status.request";

@Route("rental-agreements")
@Tags("RentalAgreements")
export class RentalAgreementController extends Controller {
    private repository = dataSource.getRepository(RentalAgreementEntity);

    @Get("{id}")
    @SuccessResponse("200", "Ok")
    @Response<EntityNotFoundErrorResponse>(404, "Rental Agreement not found")
    public async getById(@Path() id: number): Promise<RentalAgreementEntity> {
        const rental = await this.repository.findOne({
            where: { id },
            relations: ["property", "renter", "reviews"],
        });

        if (!rental) {
            this.setStatus(404);
            throw { message: "Rental Agreement not found" };
        }
        return rental;
    }

    @Get("renter/{renterId}")
    @SuccessResponse("200", "Ok")
    public async getForRenter(@Path() renterId: number): Promise<RentalAgreementEntity[]> {
        return this.repository.find({
            where: { renter: { id: renterId } },
            relations: ["property", "reviews"],
        });
    }

    @Post()
    @SuccessResponse("201", "Created")
    @Response<EntityNotFoundErrorResponse>(400, "Property or Renter not found")
    public async create(@Body() body: CreateRentalAgreementRequest): Promise<RentalAgreementEntity> {
        const property = await dataSource.getRepository(PropertyEntity).findOne({ where: { id: body.propertyId } });
        const renter = await dataSource.getRepository(UserEntity).findOne({ where: { id: body.renterId } });

        if (!property || !renter) {
            this.setStatus(400);
            throw { message: "Property or Renter not found" };
        }

        const rentalAgreement = this.repository.create({
            property,
            renter,
            totalPrice: body.totalPrice,
            startDate: body.startDate,
            endDate: body.endDate,
            status: body.status,
        });

        return await this.repository.save(rentalAgreement);
    }

    @Put("{id}/status")
    @SuccessResponse("200", "Updated")
    @Response<EntityNotFoundErrorResponse>(404, "Rental Agreement not found")
    public async updateStatus(
        @Path() id: number,
        @Body() body: UpdateRentalStatusRequest
    ): Promise<RentalAgreementEntity> {
        const rentalAgreement = await this.repository.findOne({ where: { id } });
        if (!rentalAgreement) {
            this.setStatus(404);
            throw { message: "Rental Agreement not found" };
        }
        rentalAgreement.status = body.status;
        return await this.repository.save(rentalAgreement);
    }

    @Delete("{id}")
    @SuccessResponse("204", "Deleted")
    @Response<EntityNotFoundErrorResponse>(404, "Rental Agreement not found")
    public async delete(@Path() id: number): Promise<void> {
        const result = await this.repository.delete(id);
        if (result.affected === 0) {
            this.setStatus(404);
            throw { message: "Rental Agreement not found" };
        }
        return;
    }
}
