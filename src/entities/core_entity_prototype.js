import {Components} from 'components';
import {Tiles} from 'tiles';

export function Wall(x, y) {
    return [
        new Components.Position(x, y),
        new Components.WallTile(Tiles.WallFront, Tiles.WallTop, 1),
        new Components.Solid(),
        new Components.Opacity(1),
        new Components.Name("Wall")
    ];
}

export function Window(x, y) {
    return [
        new Components.Position(x, y),
        new Components.WallTile(Tiles.WindowFront, Tiles.WindowTop, 1),
        new Components.Solid(),
        new Components.Name("Window")
    ];
}

export function Door(x, y) {
    return [
        new Components.Position(x, y),
        new Components.Tile(Tiles.Door, 1),
        new Components.Door(false, Tiles.OpenDoor, Tiles.Door),
        new Components.Opacity(1),
        new Components.Solid(),
        new Components.Name("Door")
    ];
}

export function Floor(x, y) {
    return [
        new Components.Position(x, y),
        new Components.Tile(Tiles.Floor, 0),
        new Components.Name("Floor")
    ];
}

export function Fireball(x, y) {
    return [
        new Components.Position(x, y),
        new Components.Tile(Tiles.Fireball, 3),
        new Components.Projectile(),
        new Components.FireStarter(),
        new Components.Name("FireBall")
    ];
}

export function DownStairs(x, y) {
    return [
        new Components.Position(x, y),
        new Components.Tile(Tiles.DownStairs, 1),
        new Components.DownStairs(),
        new Components.Name("Downwards Staircase")
    ];
}

export function UpStairs(x, y) {
    return [
        new Components.Position(x, y),
        new Components.Tile(Tiles.UpStairs, 1),
        new Components.UpStairs(),
        new Components.Name("Upwards Staircase")
    ];
}

export function Water(x, y) {
    return [
        new Components.Position(x, y),
        new Components.RandomlyAnimatedTile(Tiles.WaterAnimationTiles,
                /* depth */ 2, /* min time */ 0, /* max time */ 3),
        new Components.Water(),
        new Components.Name("Water")
    ];
}

export function Void(x, y) {
    return [
        new Components.Position(x, y),
        new Components.RandomlyChosenTile({
            Void: 20,
            Stars0: 1,
            Stars1: 1,
            Stars2: 1,
            Stars3: 1,
        }, 0),
        new Components.Name("Nothing")
    ];
}
