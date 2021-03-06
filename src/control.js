import {Actions} from 'actions';
import {Direction} from 'utils/direction';
import {Components} from 'components';
import {EntityPrototypes} from 'entity_prototypes';
import {makeEnum, substituteValues, makeTable} from 'utils/enum';
import * as Input from 'utils/input';
import {Turn} from 'engine/turn';
import {renderText, HelpText} from 'text';
import {degreesToRadians as d2r} from 'utils/angle';

export const ControlTypes = makeEnum([
    'West',
    'South',
    'North',
    'East',
    'NorthWest',
    'NorthEast',
    'SouthWest',
    'SouthEast',
    'Wait',
    'Close',
    'Shoot'
], true);

const ControlChars = substituteValues(ControlTypes, {
    'h': 'West',
    'j': 'South',
    'k': 'North',
    'l': 'East',
    'y': 'NorthWest',
    'u': 'NorthEast',
    'b': 'SouthWest',
    'n': 'SouthEast',
    '.': 'Wait',
    'c': 'Close',
    'f': 'Shoot'
});

const ControlNonChars = substituteValues(ControlTypes, {
    [Input.NonChar.LEFT_ARROW]: 'West',
    [Input.NonChar.RIGHT_ARROW]: 'East',
    [Input.NonChar.UP_ARROW]: 'North',
    [Input.NonChar.DOWN_ARROW]: 'South',
    [Input.NonChar.HOME]: 'NorthWest',
    [Input.NonChar.PAGE_UP]: 'NorthEast',
    [Input.NonChar.PAGE_DOWN]: 'SouthEast',
    [Input.NonChar.END]: 'SouthWest',
    [Input.NonChar.NUMPAD_5]: 'Wait',
});

const DirectionTable = makeTable(ControlTypes, {
    West:       Direction.West,
    South:      Direction.South,
    North:      Direction.North,
    East:       Direction.East,
    NorthWest:  Direction.NorthWest,
    NorthEast:  Direction.NorthEast,
    SouthWest:  Direction.SouthWest,
    SouthEast:  Direction.SouthEast
});

async function getDirection() {
    let key = await Input.getNonModifierKey();
    let controlType = getControlTypeFromKey(key);
    let direction = DirectionTable[controlType];
    if (direction == undefined) {
        return null;
    }
    return direction;
}

function toggleDoor(entity) {
    for (let neighbour of entity.cell.neighbours) {
        let door = neighbour.find(Components.Door);
        if (door != null && door.get(Components.Door).open) {
            return new Actions.CloseDoor(entity, door);
        }
    }
    for (let neighbour of entity.cell.neighbours) {
        let door = neighbour.find(Components.Door);
        if (door != null && !door.get(Components.Door).open) {
            return new Actions.OpenDoor(entity, door);
        }
    }
    return null;
}

async function aimFire(entity) {
    entity.ecsContext.hud.message = "Shoot in which direction?";
    let direction = await getDirection();
    if (direction == null) {
        entity.ecsContext.hud.message = "That wasn't a direction!";
        return null;
    } else {
        entity.ecsContext.hud.message = "";
        return new Actions.Shoot(entity, direction, 5);
    }
}

export const ControlTable = makeTable(ControlTypes, {
    West:       entity => new Actions.Walk(entity, Direction.West),
    South:      entity => new Actions.Walk(entity, Direction.South),
    North:      entity => new Actions.Walk(entity, Direction.North),
    East:       entity => new Actions.Walk(entity, Direction.East),
    NorthWest:  entity => new Actions.Walk(entity, Direction.NorthWest),
    NorthEast:  entity => new Actions.Walk(entity, Direction.NorthEast),
    SouthWest:  entity => new Actions.Walk(entity, Direction.SouthWest),
    SouthEast:  entity => new Actions.Walk(entity, Direction.SouthEast),
    Wait:       entity => new Actions.Wait(entity),
    Close:      toggleDoor,
    Shoot:      aimFire
});

export function getControlTypeFromKey(key) {
    let type = undefined;
    if (Input.keyIsChar(key)) {
        type = ControlChars[Input.getCharFromKey(key)];
    } else if (Input.keyIsNonChar(key)) {
        type = ControlNonChars[Input.getNonCharFromKey(key)];
    }
    if (type == undefined) {
        return null;
    }
    return type;
}

export function getControlFromKey(key) {
    let type = getControlTypeFromKey(key);
    let control = ControlTable[type];
    if (control == undefined) {
        return null;
    }
    return control;
}

export async function getControl() {
    var key = await Input.getNonModifierKey();
    return getControlFromKey(key);
}
