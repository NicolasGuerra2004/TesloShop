import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";



@Entity()
export class ProductImage {


    @PrimaryGeneratedColumn()
    id:number;

    @Column('text')
    url: string;
}