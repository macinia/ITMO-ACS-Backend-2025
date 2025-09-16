import {BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {PropertyEntity} from "./property.entity";

@Entity({name: "comforts"})
export class ComfortsEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => PropertyEntity, {
        cascade: true,
        onDelete: 'CASCADE'
    })
    @JoinColumn({name: "property_id"})
    property: PropertyEntity

    @Column({type: "text"})
    name: string;

    @Column({type: "text"})
    description: string;
}