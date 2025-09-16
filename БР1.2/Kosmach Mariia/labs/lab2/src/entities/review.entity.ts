import {BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {RentalAgreementEntity} from "./rental-agreement.entity";

@Entity({name: "reviews"})
export class ReviewEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => RentalAgreementEntity, {
        cascade: true,
        onDelete: 'CASCADE'
    })
    @JoinColumn({name: "rental_agreement_id"})
    rentalAgreement: RentalAgreementEntity

    @Column({type: "int", name: "rating"})
    rating: number;

    @Column({type: "text"})
    comment: string;

    @CreateDateColumn({name: "created_at"})
    createdAt: Date
}