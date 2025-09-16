import {Body, Controller, Delete, Get, Path, Post, Response, Route, SuccessResponse, Tags,} from "tsoa";
import {ComfortsEntity} from "../entities/comforts.entity";
import comfortsService, {CreateComfortRequest} from "../services/comforts.service";
import {EntityNotFoundErrorResponse} from "../models/entity-not-found.model";

@Route("comforts")
@Tags("Comforts")
export class ComfortsController extends Controller {
    @Get("property/{propertyId}")
    @SuccessResponse("200", "Ok")
    @Response<EntityNotFoundErrorResponse>(404, "Property not found")
    public async getForProperty(@Path() propertyId: number): Promise<ComfortsEntity[]> {
        const list = await comfortsService.getForProperty(propertyId);
        if (!list.length) {
          this.setStatus(404);
          throw { message: "Property not found" };
        }
        return list;
    }

    @Post()
    @SuccessResponse("201", "Created")
    @Response<EntityNotFoundErrorResponse>(400, "Property not found")
    public async create(@Body() body: CreateComfortRequest): Promise<ComfortsEntity> {
        return comfortsService.create(body);
    }

    @Delete("{id}")
    @SuccessResponse("204", "Deleted")
    @Response<EntityNotFoundErrorResponse>(404, "Comfort not found")
    public async delete(@Path() id: number): Promise<void> {
        await comfortsService.delete(id);
        return;
    }
}
