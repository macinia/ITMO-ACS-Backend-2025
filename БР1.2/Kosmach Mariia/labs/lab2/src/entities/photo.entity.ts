import {BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {PropertyEntity} from "./property.entity";

@Entity({name: 'photos'})
export class PhotoEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => PropertyEntity, property => property.photos, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({name: "property_id"})
    property: PropertyEntity

    @Column({type: "text"})
    path: string
}