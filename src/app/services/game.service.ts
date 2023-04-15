import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { GameState } from '../data/interfaces';

@Injectable({
    providedIn: 'root'
})
export class GameStateService {
    private dbPath = '/gamestates';

    gameStatesRef: AngularFireList<GameState>;

    constructor(private db: AngularFireDatabase) {
        this.gameStatesRef = db.list(this.dbPath);
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
}