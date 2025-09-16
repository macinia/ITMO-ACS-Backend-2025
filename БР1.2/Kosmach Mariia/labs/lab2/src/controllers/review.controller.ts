import {Body, Controller, Delete, Get, Path, Post, Response, Route, SuccessResponse, Tags} from "tsoa";
import dataSource from "../config/data-source";
import {EntityNotFoundErrorResponse} from "../models/entity-not-found.model";
import {ReviewEntity} from "../entities/review.entity";
import {RentalAgreementEntity} from "../entities/rental-agreement.entity";
import {CreateReviewRequest} from "../models/create-review.request";

@Route("reviews")
@Tags("Reviews")
export class ReviewController extends Controller {
    private repository = dataSource.getRepository(ReviewEntity);


    @Get("{id}")
    @SuccessResponse("200", "Ok")
    @Response<EntityNotFoundErrorResponse>(404, "Review not found")
    public async getById(@Path() id: number): Promise<ReviewEntity> {
        const review = await this.repository.findOne({
            where: {id},
            relations: ["rentalAgreement"],
        });

        if (!review) {
            this.setStatus(404);
            throw {message: "Review not found"};
        }
        return review;
    }

    @Get("rental-agreement/{rentalAgreementId}")
    @SuccessResponse("200", "Ok")
    public async getForRentalAgreement(
        @Path() rentalAgreementId: number
    ): Promise<ReviewEntity[]> {
        return this.repository.find({
            where: {rentalAgreement: {id: rentalAgreementId}},
            relations: ["rentalAgreement"],
        });
    }

    @Post()
    @SuccessResponse("201", "Created")
    @Response<EntityNotFoundErrorResponse>(400, "Rental Agreement not found")
    public async create(@Body() body: CreateReviewRequest): Promise<ReviewEntity> {
        const rentalAgreement = await dataSource
            .getRepository(RentalAgreementEntity)
            .findOne({where: {id: body.rentalAgreementId}});

        if (!rentalAgreement) {
            this.setStatus(400);
            throw {message: "Rental Agreement not found"};
        }

        const review = this.repository.create({
            rentalAgreement,
            rating: body.rating,
            comment: body.comment,
            createdAt: new Date(),
        });

        return await this.repository.save(review);
    }

    @Delete("{id}")
    @SuccessResponse("204", "Deleted")
    @Response<EntityNotFoundErrorResponse>(404, "Review not found")
    public async delete(@Path() id: number): Promise<void> {
        const review = await this.repository.findOne({where: {id}});
        if (!review) {
            this.setStatus(404);
            throw {message: "Review not found"};
        }
        await this.repository.remove(review);
        return;
    }
}
