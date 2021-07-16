import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Flavor } from "./flavor.entity";

@Entity() // table name은 Lower case인 coffee가 된다
export class Coffee {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column()
    brand: string;

    @Column({ default: 0 })
    recommendations: number;

    @JoinTable()
    @ManyToMany(
        type => Flavor, 
        (flavor) => flavor.coffees, 
        {
            cascade: true,
        })
    flavors: Flavor[];
    
}