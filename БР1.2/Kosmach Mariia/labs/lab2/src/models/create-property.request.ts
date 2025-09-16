import { RentType } from "../entities/enums/rent.type";
import { RentalAdvertisementStatus } from "../entities/enums/rental-advertisment.status";

export interface CreatePropertyRequest {
    title: string;
    description: string;
    rentType: RentType;
    status?: RentalAdvertisementStatus;
    price: number;
}
