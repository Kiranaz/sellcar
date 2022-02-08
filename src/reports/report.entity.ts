import { User } from "src/users/user.entity";
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";

@Entity()
export class Report{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    price: number;

    @Column()
    make: string;

    @Column()
    model: string;

    @Column()
    year: number;

    @Column()
    mileage: number;

    @Column()
    lng: number;

    @Column()
    ltd: number;

    @ManyToOne(() => User, (user) => user.reports) //after comma clause ----> if we ever get an instance of a user, 
    //so if we fetch user out of the database or something like that, we can get an access to all the different reports tied to this user
    user: User;
}