import MBSSeedData from './mbs';

class Seed {
  async run() {
    await MBSSeedData.run();
  }
}

const seed = new Seed();
seed.run();

export default seed;
