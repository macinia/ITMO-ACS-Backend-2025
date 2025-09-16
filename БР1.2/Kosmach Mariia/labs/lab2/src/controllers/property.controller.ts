import {
    Body,
    Controller,
    Delete,
    Get,
    Path,
    Post,
    Put,
    Response,
    Request,
    Route, Security,
    SuccessResponse,
    Tags
} from "tsoa";
import { PropertyEntity } from "../entities/property.entity";
import { EntityNotFoundErrorResponse } from "../models/entity-not-found.model";
import {CreatePropertyRequest} from "../models/create-property.request";
import propertyService from "../services/property.service";
import {UpdatePropertyRequest} from "../models/update-property.request";

@Route("properties")
@Tags("Properties")
export class PropertyController extends Controller {
    @Get()
    @SuccessResponse("200", "Ok")
    public async getAllProperties(): Promise<PropertyEntity[]> {
        return propertyService.getAll();
    }

    @Get("{id}")
    @SuccessResponse("200", "Ok")
    @Response<EntityNotFoundErrorResponse>(404, "Property not found")
    public async getPropertyById(@Path() id: number): Promise<PropertyEntity> {
        return propertyService.getById(id);
    }

    @Post()
    @SuccessResponse("201", "Created")
    @Security("jwt")
    public async create(@Body() body: CreatePropertyRequest, @Request() req: any): Promise<PropertyEntity> {
        return propertyService.create(body, req.user.id);
    }

    @Put("{id}")
    @SuccessResponse("200", "Updated")
    @Response<EntityNotFoundErrorResponse>(404, "Property not found")
    public async update(
        @Path() id: number,
        @Body() body: UpdatePropertyRequest
    ): Promise<PropertyEntity> {
        return propertyService.update(id, body);
    }

    @Delete("{id}")
    @SuccessResponse("204", "Deleted")
    @Response<EntityNotFoundErrorResponse>(404, "Property not found")
    public async delete(@Path() id: number): Promise<void> {
        await propertyService.delete(id);
        return;
    }
}
