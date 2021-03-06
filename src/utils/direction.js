import {Vec2} from 'utils/vec2';
import {makeEnum} from 'utils/enum';
import {SQRT2} from 'utils/constants';
import {bit} from 'utils/bit';

export const DirectionType = makeEnum([
    'Cardinal',
    'Ordinal'
]);

class DirectionInfo {
    constructor(x, y, name, type, index, subIndex, multiplier, vec2Index) {
        this.vector = new Vec2(x, y);
        this.name = name;
        this.type = type;
        this.index = index;
        this.subIndex = subIndex;
        this.opposite = null;
        this.left45 = null;
        this.left90 = null;
        this.right45 = null;
        this.right90 = null;
        this.multiplier = multiplier;
        this.vec2Index = vec2Index;
        this.bitfield = bit(index);
    }

    get cardinal() {
        return this.type == DirectionType.Cardinal;
    }

    get ordinal() {
        return this.type == DirectionType.Ordinal;
    }
}

function d(x, y, name, type, index, subIndex, multiplier, vec2Index = -1) {
    return new DirectionInfo(x, y, name, type, index, subIndex, multiplier, vec2Index);
}

const C = DirectionType.Cardinal;
const O = DirectionType.Ordinal;

export const Direction = makeEnum({
    North:      d(+0, -1, 'North',      C, 0, 0, 1, Vec2.Y_IDX),
    East:       d(+1, +0, 'East',       C, 1, 1, 1, Vec2.X_IDX),
    South:      d(+0, +1, 'South',      C, 2, 2, 1, Vec2.Y_IDX),
    West:       d(-1, +0, 'West',       C, 3, 3, 1, Vec2.X_IDX),
    NorthEast:  d(+1, -1, 'NorthEast',  O, 4, 0, SQRT2),
    SouthEast:  d(+1, +1, 'SouthEast',  O, 5, 1, SQRT2),
    SouthWest:  d(-1, +1, 'SouthWest',  O, 6, 2, SQRT2),
    NorthWest:  d(-1, -1, 'NorthWest',  O, 7, 3, SQRT2)
});

const Combinations = [
    /* North */ [
        /* North */ null,
        /* East */  Direction.NorthEast,
        /* South */ null,
        /* West */  Direction.NorthWest
    ],
    /* East */ [
        /* North */ Direction.NorthEast,
        /* East */  null,
        /* South */ Direction.SouthEast,
        /* West */  null
    ],
    /* South */ [
        /* North */ null,
        /* East */  Direction.SouthEast,
        /* South */ null,
        /* West */  Direction.SouthWest
    ],
    /* West */ [
        /* North */ Direction.NorthWest,
        /* East */  null,
        /* South */ Direction.SouthWest,
        /* West */  null
    ]
];

export function combine(a, b) {
    return Combinations[a.subIndex][b.subIndex];
}

/* Opposite Directions */
Direction.North.opposite = Direction.South;
Direction.South.opposite = Direction.North;
Direction.East.opposite = Direction.West;
Direction.West.opposite = Direction.East;
Direction.NorthWest.opposite = Direction.SouthEast;
Direction.SouthEast.opposite = Direction.NorthWest;
Direction.SouthWest.opposite = Direction.NorthEast;
Direction.NorthEast.opposite = Direction.SouthWest;

/* Relative Directions */
Direction.North.left45 = Direction.NorthWest;
Direction.North.left90 = Direction.West;
Direction.North.right45 = Direction.NorthEast;
Direction.North.right90 = Direction.East;

Direction.East.left45 = Direction.NorthEast;
Direction.East.left90 = Direction.North;
Direction.East.right45 = Direction.SouthEast;
Direction.East.right90 = Direction.South;

Direction.South.left45 = Direction.SouthEast;
Direction.South.left90 = Direction.East;
Direction.South.right45 = Direction.SouthWest;
Direction.South.right90 = Direction.West;

Direction.West.left45 = Direction.SouthWest;
Direction.West.left90 = Direction.South;
Direction.West.right45 = Direction.NorthWest;
Direction.West.right90 = Direction.North;

Direction.NorthEast.left45 = Direction.North;
Direction.NorthEast.left90 = Direction.NorthWest;
Direction.NorthEast.right45 = Direction.East;
Direction.NorthEast.right90 = Direction.SouthEast;

Direction.SouthEast.left45 = Direction.East;
Direction.SouthEast.left90 = Direction.NorthEast;
Direction.SouthEast.right45 = Direction.South;
Direction.SouthEast.right90 = Direction.SouthWest;

Direction.SouthWest.left45 = Direction.South;
Direction.SouthWest.left90 = Direction.SouthEast;
Direction.SouthWest.right45 = Direction.West;
Direction.SouthWest.right90 = Direction.NorthWest;

Direction.NorthWest.left45 = Direction.West;
Direction.NorthWest.left90 = Direction.SouthWest;
Direction.NorthWest.right45 = Direction.North;
Direction.NorthWest.right90 = Direction.NorthEast;


export const Directions = Direction.values;
export const CardinalDirections = Directions.filter(dir => dir.cardinal);
export const OrdinalDirections = Directions.filter(dir => dir.ordinal);
export const DirectionIndices = Directions.map(dir => dir.index);
export const CardinalDirectionIndices = CardinalDirections.map(dir => dir.index);
export const OrdinalDirectionIndices = OrdinalDirections.map(dir => dir.index);

export const AllDirectionBits = 0xff;
export const NumDirections = 8;
