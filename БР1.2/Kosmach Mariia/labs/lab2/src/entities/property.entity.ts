import {BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {UserEntity} from "./user.entity";
import {RentalAdvertisementStatus} from "./enums/rental-advertisment.status";
import {RentType} from "./enums/rent.type";
import {PhotoEntity} from "./photo.entity";
import {MessageEntity} from "./message.entity";
import {ComfortsEntity} from "./comforts.entity";

@Entity({name: 'advertisements'})
export class PropertyEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UserEntity)
    @JoinColumn({name: "owner_id"})
    owner: UserEntity;

    @Column({type: "text"})
    title: string;

    @Column({type: "text"})
    description: string;

    @Column({
        type: "enum",
        enum: RentType,
        name: "rent_type"
    })
    rentType: RentType;

    @Column({
        type: "enum",
        enum: RentalAdvertisementStatus,
        default: RentalAdvertisementStatus.PENDING
    })
    status: RentalAdvertisementStatus;

    @Column({type: "decimal", name: "price"})
    price: number;

    @OneToMany(() => PhotoEntity, photo => photo.property)
    photos: PhotoEntity[];

    @OneToMany(() => MessageEntity, message => message.property)
    messages: MessageEntity[];

    @OneToMany(() => ComfortsEntity, comforts => comforts.property)
    comforts: ComfortsEntity[];
}