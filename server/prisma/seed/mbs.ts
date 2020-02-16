import path from 'path';
import ProgressBar from 'progress';
import fs from 'fs';
import xml2js from 'xml2js';
import get from 'lodash/get';
import { prisma } from '../generated/prisma-client';

const parser = xml2js.Parser();

class MBSSeedData {
  async run() {
    const data = fs.readFileSync(
      path.resolve(__dirname, '../../../../common/assets/mbs.xml'),
      'utf8'
    );
    parser.parseString(data, async (err, result) => {
      const arr = get(result, 'MBS_XML.Data') || [];
      const newMappedArray = arr.map((item) => {
        return {
          MBSScheduleFee: Number(get(item, 'ScheduleFee[0]') || 0),
          description: get(item, 'Description[0]'),
          isActive: true,
        };
      });
      const bar = new ProgressBar('Processing MBS Data [:bar] :percent', {
        total: arr.length,
      });
      for (let index = 0; index < newMappedArray.length; index++) {
        const item = newMappedArray[index];
        await prisma.createMedicareService(item);
        bar.tick();
      }
      console.log('Completed');
    });
  }
}

export default new MBSSeedData();
