import { observable } from 'mobx';
import { WORLD_WIDTH, POWER_MODE_PERIOD_SECONDS } from '../constants/Constants';
import cloneDeep from 'lodash/cloneDeep';

const initialCharacterState = { x: 0, y: 0 };
const initialPowerState = { x: WORLD_WIDTH, y: 0, hit: false, secondsLeft: POWER_MODE_PERIOD_SECONDS };

const initialEvilsState = {
  virus1: {
    name: 'Virus1',
    position: { x: WORLD_WIDTH / 2, y: 0 },
    hit: false,
    minSpeed: 3,
    maxSpeed: 4
  },
  virus2: {
    name: 'Virus2',
    position: { x: WORLD_WIDTH / 2, y: 0 },
    hit: false,
    minSpeed: 2,
    maxSpeed: 4
  },
  virus3: {
    name: 'Virus3',
    position: { x: WORLD_WIDTH / 3, y: 0 },
    hit: false,
    minSpeed: 2,
    maxSpeed: 6
  },
  virus4: {
    name: 'Virus4',
    position: { x: WORLD_WIDTH / 3, y: 0 },
    hit: false,
    minSpeed: 1,
    maxSpeed: 4
  },
  malware: {
    name: 'Malware',
    position: { x: WORLD_WIDTH, y: 0 },
    hit: false,
    minSpeed: 1,
    maxSpeed: 4
  },
  phishing: {
    name: 'Phishing',
    position: { x: WORLD_WIDTH, y: 0 },
    hit: false,
    minSpeed: 1,
    maxSpeed: 6
  },
  devicelost: {
    name: 'DeviceLost',
    position: { x: WORLD_WIDTH, y: 0 },
    hit: false,
    minSpeed: 1,
    maxSpeed: 7
  },
  unclassified: {
    name: 'Unclassified',
    position: { x: WORLD_WIDTH, y: 0 },
    hit: false,
    minSpeed: 1,
    maxSpeed: 7
  },
  c2communication: {
    name: 'C2Communication',
    position: { x: WORLD_WIDTH, y: 0 },
    hit: false,
    minSpeed: 4,
    maxSpeed: 7
  },
  ransomware: {
    name: 'Ransomware',
    position: { x: WORLD_WIDTH, y: 0 },
    hit: false,
    minSpeed: 1,
    topSpeed: 7
  },
  unknownbinary: {
    name: 'UnknownBinary',
    position: { x: WORLD_WIDTH, y: 0 },
    hit: false,
    minSpeed: 5,
    maxSpeed: 8
  }
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
      const evil = initialEvilsState[type];
      this.evils[type].speed = Math.floor(Math.random() * evil.maxSpeed) + evil.minSpeed;
      this.evils[type].position = evil.position;
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
      this.power.secondsLeft = Math.max(this.power.secondsLeft - 1, 0);
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
