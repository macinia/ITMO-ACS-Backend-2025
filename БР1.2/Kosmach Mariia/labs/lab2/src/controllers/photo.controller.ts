import {
    Body,
    Controller,
    Delete,
    Get,
    Path,
    Post,
    Response,
    Route,
    SuccessResponse,
    Tags
} from "tsoa";
import { PhotoEntity } from "../entities/photo.entity";
import photoService, { CreatePhotoRequest } from "../services/photo.service";
import { EntityNotFoundErrorResponse } from "../models/entity-not-found.model";

@Route("photos")
@Tags("Photos")
export class PhotoController extends Controller {
    @Get("property/{propertyId}")
    @SuccessResponse("200", "Ok")
    @Response<EntityNotFoundErrorResponse>(404, "Property not found")
    public async getForProperty(@Path() propertyId: number): Promise<PhotoEntity[]> {
        return photoService.getForProperty(propertyId);
    }

    @Post()
    @SuccessResponse("201", "Created")
    @Response<EntityNotFoundErrorResponse>(400, "Property not found")
    public async create(@Body() body: CreatePhotoRequest): Promise<PhotoEntity> {
        return photoService.create(body);
    }

    @Delete("{id}")
    @SuccessResponse("204", "Deleted")
    @Response<EntityNotFoundErrorResponse>(404, "Photo not found")
    public async delete(@Path() id: number): Promise<void> {
        await photoService.delete(id);
        return;
    }
}
