import {BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {UserEntity} from "./user.entity";
import {PropertyEntity} from "./property.entity";
import {RentalStatus} from "./enums/rental.status";
import {ReviewEntity} from "./review.entity";

@Entity({name: 'rentals'})
export class RentalAgreementEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => PropertyEntity)
    @JoinColumn({name: "property_id"})
    property: PropertyEntity;

    @ManyToOne(() => UserEntity)
    @JoinColumn({name: "renter_id"})
    renter: UserEntity;

    @Column({type: "decimal", name: "total_price"})
    totalPrice: number;

    @Column({type: "timestamptz", name: "start_date"})
    startDate: Date;

    @Column({type: "timestamptz", name: "end_date"})
    endDate: Date;

    @Column({
        type: "enum",
        enum: RentalStatus,
        name: "status"
    })
    status: RentalStatus;

    @OneToMany(() => ReviewEntity, review => review.rentalAgreement)
    reviews: ReviewEntity[];
}