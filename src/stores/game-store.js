import { observable } from 'mobx';
import { WORLD_WIDTH, POWER_MODE_PERIOD_SECONDS } from '../constants/Constants';
import cloneDeep from 'lodash/cloneDeep';

const initialCharacterState = { x: 0, y: 0 };
const initialPowerState = { x: WORLD_WIDTH, y: 0, hit: false, secondsLeft: POWER_MODE_PERIOD_SECONDS };

const initialEvilsState = {
  e1: {
    name: 'BruteForce',
    position: { x: WORLD_WIDTH / 2, y: 0 },
    hit: false,
    minSpeed: 3,
    maxSpeed: 4
  },
  e2: {
    name: 'RogueWifi',
    position: { x: WORLD_WIDTH / 2, y: 0 },
    hit: false,
    minSpeed: 2,
    maxSpeed: 4
  },
  e3: {
    name: 'Backdoor',
    position: { x: WORLD_WIDTH / 3, y: 0 },
    hit: false,
    minSpeed: 2,
    maxSpeed: 6
  },
  e4: {
    name: 'Honeypot',
    position: { x: WORLD_WIDTH / 3, y: 0 },
    hit: false,
    minSpeed: 1,
    maxSpeed: 4
  },
  e5: {
    name: 'Malware',
    position: { x: WORLD_WIDTH, y: 0 },
    hit: false,
    minSpeed: 1,
    maxSpeed: 4
  },
  e6: {
    name: 'Phishing',
    position: { x: WORLD_WIDTH, y: 0 },
    hit: false,
    minSpeed: 1,
    maxSpeed: 6
  },
  e7: {
    name: 'DeviceLost',
    position: { x: WORLD_WIDTH, y: 0 },
    hit: false,
    minSpeed: 1,
    maxSpeed: 7
  },
  e8: {
    name: 'Unclassified',
    position: { x: WORLD_WIDTH, y: 0 },
    hit: false,
    minSpeed: 1,
    maxSpeed: 7
  },
  e9: {
    name: 'C2Communication',
    position: { x: WORLD_WIDTH, y: 0 },
    hit: false,
    minSpeed: 4,
    maxSpeed: 7
  },
  e10: {
    name: 'Ransomware',
    position: { x: WORLD_WIDTH, y: 0 },
    hit: false,
    minSpeed: 1,
    topSpeed: 7
  },
  e11: {
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

    window.clearInterval(this.powerModeInterval);
  }

  setCharacterPosition(position) {
    this.characterPosition = position;
  }

  setPowerMode() {
    if (this.power.hit) {
      return;
    }

    this.power.hit = true;
    this.powerModeInterval = setInterval(() => {
      this.power.secondsLeft = Math.max(this.power.secondsLeft - 1, 0);
      if (this.power.secondsLeft < 0) {
        if (this.powerModeInterval) {
          window.clearInterval(this.powerModeInterval);
        }
      }
    }, 1000);

    setTimeout(() => {
      if (this.powerModeInterval) {
        window.clearInterval(this.powerModeInterval);
        if (this.power.hit) {
          this.power.hit = false;
        }
      }
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
