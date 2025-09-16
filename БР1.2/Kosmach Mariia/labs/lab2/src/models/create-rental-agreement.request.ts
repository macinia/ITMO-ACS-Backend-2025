import {RentalStatus} from "../entities/enums/rental.status";

export interface CreateRentalAgreementRequest {
    propertyId: number;
    renterId: number;
    totalPrice: number;
    startDate: string;
    endDate: string;
    status: RentalStatus;
}