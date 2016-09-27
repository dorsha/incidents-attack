import { observable } from 'mobx';
import { WORLD_WIDTH, POWER_MODE_PERIOD_SECONDS } from '../constants/Constants';
import cloneDeep from 'lodash/cloneDeep';

const initialCharacterState = { x: 0, y: 0 };
const initialPowerState = { x: WORLD_WIDTH, y: 0, hit: false, secondsLeft: POWER_MODE_PERIOD_SECONDS };

const initialEvilsState = {
  virus: { name: 'Virus', position: { x: WORLD_WIDTH, y: 0 }, hit: false, speed: 1 },
  malware: { name: 'Malware', position: { x: WORLD_WIDTH, y: 0 }, hit: false, speed: 1 },
  phishing: { name: 'Phishing', position: { x: WORLD_WIDTH, y: 0 }, hit: false, speed: 1 },
  devicelost: { name: 'DeviceLost', position: { x: WORLD_WIDTH, y: 0 }, hit: false, speed: 1 },
  unclassified: { name: 'Unclassified', position: { x: WORLD_WIDTH, y: 0 }, hit: false, speed: 1 },
  c2communication: { name: 'C2Communication', position: { x: WORLD_WIDTH, y: 0 }, hit: false, speed: 1 },
  ransomware: { name: 'Ransomware', position: { x: WORLD_WIDTH, y: 0 }, hit: false, speed: 1 },
  unknownbinary: { name: 'UnknownBinary', position: { x: WORLD_WIDTH, y: 0 }, hit: false, speed: 1 }
};

class GameStore {
  @observable characterPosition = cloneDeep(initialCharacterState);

  @observable power = cloneDeep(initialPowerState);

  @observable evils = cloneDeep(initialEvilsState);

  @observable score = 0;

  @observable stageX = 0;

  constructor() {
    this.initStore();
  }

  initStore() {
    this.characterPosition = cloneDeep(initialCharacterState);
    this.evils = cloneDeep(initialEvilsState);
    this.power = cloneDeep(initialPowerState);

    Object.keys(initialEvilsState).forEach((type) => {
      this.evils[type].speed = Math.floor(Math.random() * 10) + 1;
      this.evils[type].position = { x: WORLD_WIDTH, y: 0 };
    });

    this.score = 0;
    this.stageX = 0;
  }

  setCharacterPosition(position) {
    this.characterPosition = position;
  }

  setPowerMode() {
    this.power.hit = true;
    const interval = setInterval(() => {
      this.power.secondsLeft -= 1;
      if (this.power.secondsLeft < 0) {
        clearInterval(interval);
      }
    }, 1000);

    setTimeout(() => {
      this.power = initialPowerState;
      clearInterval(interval);
    }, POWER_MODE_PERIOD_SECONDS * 1000);
  }

  setPowerPosition(position) {
    if (!this.power.hit) {
      this.power.x = position.x;
      this.power.y = position.y;
    }
  }

  setEvilPosition(id, position) {
    if (!this.evils[id].hit && position.x < this.characterPosition.x) {
      this.score += 1;
      this.evils[id].hit = true;
    } else {
      this.evils[id].position = position;
    }
  }

  setStageX(x) {
    if (x > 0) {
      this.stageX = 0;
    } else if (x < -WORLD_WIDTH) {
      this.stageX = -WORLD_WIDTH;
    } else {
      this.stageX = x;
    }
  }
}

export function createStore() {
  return new GameStore();
}
