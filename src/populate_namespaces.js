/* Import the namespace objects */
import {TerrainGenerators} from 'terrain_generators';
import {EntityPrototypes} from 'entity_prototypes';
import {Components} from 'components';
import {Actions} from 'actions';

/* Import names with which to populate namespaces */
import * as EngineComponents from 'engine/engine_components';
import * as CoreComponent from 'components/core_component';
import * as GeneratedComponent from 'components/generated_components.js';

import * as CoreEntityPrototype from 'entities/core_entity_prototype';
import * as CharacterEntityPrototype from 'entities/character_entity_prototype';

import * as StringTerrainGenerator from 'string_terrain_generator';

import * as CoreAction from 'actions/core_action';

function populateNamespace(sources, dest) {
    let count = 0;

    for (let src of sources) {
        for (let name in src) {
            let exported = src[name];

            if (typeof exported == 'function') {
                if (exported.type == undefined) {
                    exported.type = count;
                    count++;
                } else {
                    count = Math.max(count, exported.type + 1);
                }

                dest[name] = exported;
            }
        }
    }

    dest.length = count;
}

populateNamespace([StringTerrainGenerator], TerrainGenerators);
populateNamespace([CoreEntityPrototype, CharacterEntityPrototype], EntityPrototypes);
populateNamespace([CoreComponent, EngineComponents, GeneratedComponent], Components);
populateNamespace([CoreAction], Actions);
