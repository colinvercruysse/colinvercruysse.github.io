import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { GameState, IGame, Player } from '../data/interfaces';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class GameStateService {
    private dbPath = '/gamestates';
    private dbNamePath = '/players';
    private selectedGame$ = new BehaviorSubject<IGame | undefined>(undefined);

    gameStatesRef: AngularFireList<GameState>;
    namesRef: AngularFireList<Player>;

    constructor(private db: AngularFireDatabase) {
        this.gameStatesRef = db.list(this.dbPath);
        this.namesRef = db.list(this.dbNamePath);
    }

    getAll(): AngularFireList<GameState> {
        return this.gameStatesRef;
    }

    create(state: GameState): any {
        return this.gameStatesRef.push(state);
    }

    update(key: string, value: any): Promise<void> {
        return this.gameStatesRef.update(key, value);
    }

    delete(key: string): Promise<void> {
        return this.gameStatesRef.remove(key);
    }

    deleteAll(): Promise<void> {
        return this.gameStatesRef.remove();
    }

    getSelectedGame(): BehaviorSubject<IGame | undefined> {
        return this.selectedGame$;
    }

    setSelectedGame(game: IGame): void {
        if (this.selectedGame$.value && this.selectedGame$.value.name === game.name) return;

        this.selectedGame$.next(game);
    }

    getAllPlayers(): AngularFireList<Player> {
        return this.namesRef;
    }

    addPlayer(player: Player): any {
        return this.namesRef.push(player);
    }
}