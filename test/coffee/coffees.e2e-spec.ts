import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { CoffeesModule } from 'src/coffees/coffees.module';

describe('[Feature] Coffees - /coffees', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CoffeesModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it.todo('Create [POST /]');
  it.todo('Get all [GET /]');
  it.todo('Get one [GET /:id]');
  it.todo('Update one [PATCH /:id]');
  it.todo('Delete one [DELETE /:id]');

  afterAll(async () => {
    await app.close();
  });
});
