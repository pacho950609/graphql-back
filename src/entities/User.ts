import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

/**
 * User db entity
 */
@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Index()
    @Column({ unique: true })
    email: string;

    @Column()
    password: string;
}
