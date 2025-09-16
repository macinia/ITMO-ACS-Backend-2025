import {BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {UserEntity} from "./user.entity";
import {PropertyEntity} from "./property.entity";

@Entity({name: "messages"})
export class MessageEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UserEntity)
    @JoinColumn({name: "sender_id"})
    sender: UserEntity;

    @ManyToOne(() => UserEntity)
    @JoinColumn({name: "receiver_id"})
    receiver: UserEntity;

    @ManyToOne(() => UserEntity)
    @JoinColumn({name: "property_id"})
    property: PropertyEntity;

    @Column({type: "text"})
    message: string;

    @CreateDateColumn({name: "created_at"})
    createdAt: Date
}