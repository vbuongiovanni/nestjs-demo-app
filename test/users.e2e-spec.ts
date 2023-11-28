import { INestApplication, HttpServer, HttpStatus } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersModule } from '../src/modules';
import * as request from 'supertest';
import { CreateUserRequestDTO, UpdateUserRequestDTO, UserResponseDTO } from '../src/modules/users/user.dto';
import { UserDocument } from 'src/mongodb';
import { plainToInstance } from 'class-transformer';

describe('[Feature] Users - /users', () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  let initialUser: UserResponseDTO;
  const users: UserResponseDTO[] = [];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        UsersModule,
        MongooseModule.forRoot(
          'mongodb://admin:password@localhost:27015/demo-app?retryWrites=true&connectTimeoutMS=10000&authSource=demo-app&authMechanism=SCRAM-SHA-1',
        ),
      ],
    }).compile();
    const userModel: Model<UserDocument> = moduleFixture.get('UserModel');
    await userModel.deleteMany({}).exec();
    const createdUser = await userModel
      .create({
        name: 'Initial User - Added during test setup',
        email: 'someone@somewhere.com',
        password: 'password1234',
      })
      .then((user) => user.toObject());

    initialUser = plainToInstance(UserResponseDTO, createdUser, { excludeExtraneousValues: true });

    app = moduleFixture.createNestApplication();
    await app.init();
    httpServer = app.getHttpServer();
  });

  const createUserRequestBody: CreateUserRequestDTO = {
    name: 'Test User',
    email: 'aVeryValidEmail@gmail.com',
    password: 'PASSword1234!',
  };

  const updateUserRequestBody: Partial<UpdateUserRequestDTO> = { name: 'updated name', email: 'aDifferentEmail@gmail.com' };

  it('Get all users [GET /]', async () => {
    return request(httpServer)
      .get('/users')
      .expect(HttpStatus.OK)
      .then(({ body }) => {
        expect(body).toEqual([initialUser]);
      });
  });

  it('Add user [Post /]', async () => {
    return request(httpServer)
      .post('/users')
      .expect(HttpStatus.CREATED)
      .send(createUserRequestBody)
      .then(({ body }: { body: UserResponseDTO }) => {
        expect(body.name).toEqual(createUserRequestBody.name);
        expect(body.email).toEqual(createUserRequestBody.email);
      });
  });

  it('Get user [GET /]', async () => {
    return request(httpServer)
      .get(`/users/${initialUser._id}`)
      .expect(HttpStatus.OK)
      .then(({ body }) => {
        expect(body).toEqual(initialUser);
      });
  });

  it('Update user [patch /]', async () => {
    return request(httpServer)
      .patch(`/users/${initialUser._id}`)
      .expect(HttpStatus.OK)
      .send(updateUserRequestBody)
      .then(({ body }) => {
        expect(body).toEqual({ ...initialUser, ...updateUserRequestBody });
      });
  });

  it('remove user [DELETE /]', async () => {
    return request(httpServer)
      .delete(`/users/${initialUser._id}`)
      .expect(HttpStatus.OK)
      .then(({ body }) => {
        expect(body).toEqual({ ...initialUser, ...updateUserRequestBody });
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
