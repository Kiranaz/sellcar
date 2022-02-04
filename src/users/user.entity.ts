import { AfterInsert, AfterUpdate, AfterRemove, Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class User{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    password: string;

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