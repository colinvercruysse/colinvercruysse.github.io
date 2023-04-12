import { IGame } from "../data/interfaces";
import { ChineesPoepen } from "./ChineesPoepen";
import { Nullenspel } from "./Nullenspel";
import { Phase10 } from "./Phase10";
import { Uno } from "./Uno";

export interface IGameFactory {
    getGame(name: string): IGame;
    getGames(): IGame[];
}

export class GameFactory implements IGameFactory {
    private games: Map<string, IGame>;

    constructor() {
        this.games = new Map<string, IGame>();
        this.games.set("Uno", new Uno());
        this.games.set("Chinees Poepen", new ChineesPoepen());
        this.games.set("Nullenspel", new Nullenspel());
        this.games.set("Phase 10", new Phase10());
    }

    getGames(): IGame[] {
        let res: IGame[] = [];

        this.games.forEach((value, key) => {
            res.push(value);
        })

        return res;
    }

    getGame(name: string): IGame {
        return this.games.get(name)!;
    }

}