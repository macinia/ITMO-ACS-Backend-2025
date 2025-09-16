import {RentalStatus} from "../entities/enums/rental.status";

export interface UpdateRentalStatusRequest {
    status: RentalStatus;
}