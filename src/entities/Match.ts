import { Entity, PrimaryGeneratedColumn, Column, Index, ManyToOne } from 'typeorm';
import { Player } from './Player';

/**
 * Match db entity
 */
@Entity()
export class Match {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Index()
    @Column('uuid')
    firstPlayerId: string;

    @Index()
    @Column('uuid')
    secondPlayerId: string;

    @Index()
    @Column('uuid')
    winnerPlayerId: string;

    @Index()
    @Column('uuid')
    loserPlayerId: string;

    @ManyToOne((type) => Player)
    firstPlayer: Player;

    @ManyToOne((type) => Player)
    secondPlayer: Player;

    @ManyToOne((type) => Player)
    winnerPlayer: Player;

    @ManyToOne((type) => Player)
    loserPlayer: Player;

    constructor(payload: Omit<Match, 'id' | 'firstPlayer' | 'secondPlayer' | 'winnerPlayer' | 'loserPlayer'>) {
        if (payload) {
            this.firstPlayerId = payload.firstPlayerId;
            this.secondPlayerId = payload.secondPlayerId;
            this.winnerPlayerId = payload.winnerPlayerId;
            this.loserPlayerId = payload.loserPlayerId;
        }
    }
}
