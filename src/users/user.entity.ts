import { AfterInsert, AfterUpdate, AfterRemove, Column, Entity, PrimaryGeneratedColumn, OneToMany} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Report } from 'src/reports/report.entity';

@Entity()
export class User{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
  /* //not a good approach
   @Exclude() //exclude this column when converting user entity into json whenever get is requested
  */ 
    password: string;

    @OneToMany(() => Report, (report) => report.user)
    reports: Report[];

    @AfterInsert() //this is a hook
    logInsert() {
        console.log('New user has been inserted with id: ', this.id)
    }

    @AfterUpdate() //this is a hook
    logUpdate() {
        console.log('User has been updated with id: ', this.id)
    }

    @AfterRemove() //this is a hook
    logRemove() {
        console.log('User has been removed with id: ', this.id)
    }
}