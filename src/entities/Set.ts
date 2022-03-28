import { Entity, PrimaryGeneratedColumn, Column, Unique, Index, ManyToOne, Check } from 'typeorm';
import { Match } from './Match';

/**
 * Game set db entity
 */
@Unique(['setNumber', 'matchId'])
@Entity()
export class GameSet {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Index()
    @Column('uuid')
    matchId: string;

    @Check('"set_number" >= 1 AND "set_number" <= 5')
    @Column()
    setNumber: number;

    @Check('"first_player_points" >= 0')
    @Column()
    firstPlayerPoints: number;

    @Check('"second_player_points" >= 0')
    @Column()
    secondPlayerPoints: number;

    @ManyToOne((type) => Match)
    match: Match;
}
