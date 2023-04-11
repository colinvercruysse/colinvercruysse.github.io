import { IGame } from "../data/interfaces";
import { Uno } from "./Uno";

export interface IGameFactory {
    getGame(name: string): IGame;
    getGames(): IGame[];
}

export class GameFactory implements IGameFactory{
    private games: Map<string, IGame>;

    constructor() {
        this.games = new Map<string, IGame>();
        this.games.set("Uno", new Uno());
    }

    getGames(): IGame[] {
        let res: IGame[]= [];

        this.games.forEach((value, key) => {
            res.push(value);
        })

        return res;
    }

    getGame(name: string): IGame {
        return this.games.get(name)!;
    }

}