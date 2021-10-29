import { EntityRepository, Repository } from 'typeorm';
import { Record } from './record.entity';

@EntityRepository(Record)
export class RecordRepository extends Repository<Record> {
  public async findByUid(uid: string): Promise<Record> {
    const record = await this.findOne({
      where: { uid },
      relations: ['rent_route'],
    });
    return record;
  }

  public async findByRunnerId(runnerId: number): Promise<Record[]> {
    const records = await this.find({
      where: { runnerId },
      relations: ['rent_route'],
    });
    return records;
  }
}
