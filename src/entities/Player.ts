import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Player {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    lastName: string;

    constructor(payload: Omit<Player, 'id'> = null) {
        if (payload) {
            this.name = payload.name;
            this.lastName = payload.lastName;
        }
    }
}
