import {Config} from 'config';

import {Components} from 'components';
import {Tiles} from 'tiles';

import * as Shadowcast from 'shadowcast';
import * as Omniscient from 'omniscient';

import * as Abilities from 'abilities';

import {PlayerTurnTaker} from 'player_control';
import {MoveTowardsPlayer} from 'move_towards_player';

import {makeEnum} from 'utils/enum';

export const CombatGroups = makeEnum([
    'Friendly',
    'Hostile'
]);

export function PlayerCharacter(x, y) {
    let observe;
    if (Config.OMNISCIENT) {
        observe = Omniscient.detectVisibleArea;
    } else {
        observe = Shadowcast.detectVisibleArea;
    }

    let computeUpgrade = (depth) => {
        return depth * 10;
    }

    return [
        new Components.Position(x, y),
        new Components.Tile(Tiles.PlayerCharacter, 3),
        new Components.TurnTaker(new PlayerTurnTaker()),
        new Components.Collider(),
        new Components.PlayerCharacter(),
        new Components.Observer(observe, 15),
        new Components.Health(10),
        new Components.Combatant(CombatGroups.Friendly),
        new Components.Attack(2),
        new Components.Defense(1),
        new Components.Accuracy(80),
        new Components.Dodge(10),
        new Components.Unfamiliar(),
        new Components.CurrentWeapon(null),
        new Components.UpgradesOnDescent(computeUpgrade, 1),
        new Components.Name("You"),
        new Components.Description("You. A faithful servant of the Pyro God. You returned to the former home of your ancestors in search of his ancient cathedral, only to find the city in ruins.")
    ];
}

function GenericCharacter(x, y, tile, health, walkTime, burnTime = 5, healthRecovery = 0.1) {
    return [
        new Components.Position(x, y),
        new Components.Tile(tile, 3),
        new Components.TurnTaker(new MoveTowardsPlayer()),
        new Components.Collider(),
        new Components.Observer(Shadowcast.detectVisibleArea, 20, true),
        new Components.Health(health),
        new Components.MaxHealth(health),
        new Components.Combatant(CombatGroups.Hostile),
        new Components.Unfamiliar(),
        new Components.Flamable(burnTime),
        new Components.HealthRecovery(healthRecovery),
        new Components.WalkTime(walkTime)
    ];
}
