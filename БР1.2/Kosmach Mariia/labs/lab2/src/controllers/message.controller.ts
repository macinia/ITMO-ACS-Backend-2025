import {Body, Controller, Delete, Get, Path, Post, Put, Request, Response, Route, Security, SuccessResponse, Tags} from "tsoa";
import {EntityNotFoundErrorResponse} from "../models/entity-not-found.model";
import {MessageEntity} from "../entities/message.entity";
import messageService from "../services/message.service";
import {CreateMessageRequest} from "../models/create-message.request";
import {UpdateMessageRequest} from "../models/update-message.request";

@Route("messages")
@Tags("Messages")
export class MessageController extends Controller {
    @Get("{id}")
    @SuccessResponse("200", "Ok")
    @Response<EntityNotFoundErrorResponse>(404, "Message not found")
    public async getById(@Path() id: number): Promise<MessageEntity> {
        return messageService.getById(id);
    }

    @Get("property/{propertyId}")
    @SuccessResponse("200", "Ok")
    public async getForProperty(@Path() propertyId: number): Promise<MessageEntity[]> {
        return messageService.getForProperty(propertyId);
    }

    @Post()
    @SuccessResponse("201", "Created")
    @Response<EntityNotFoundErrorResponse>(400, "Sender, Receiver or Property not found")
    @Security("jwt")
    public async create(@Body() body: CreateMessageRequest, @Request() req: any): Promise<MessageEntity> {
        return messageService.create(body, req.user.id);
    }

    @Put("{id}")
    @SuccessResponse("200", "Updated")
    @Response<EntityNotFoundErrorResponse>(404, "Message not found")
    public async update(
        @Path() id: number,
        @Body() body: UpdateMessageRequest
    ): Promise<MessageEntity> {
        return messageService.update(id, body);
    }

    @Delete("{id}")
    @SuccessResponse("204", "Deleted")
    @Response<EntityNotFoundErrorResponse>(404, "Message not found")
    public async delete(@Path() id: number): Promise<void> {
        await messageService.delete(id);
        return;
    }
}
