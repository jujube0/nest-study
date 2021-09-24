# Nest 공부하기

Date: July 28, 2021 → July 28, 2021
Tags: study
link: https://docs.nestjs.com/first-steps

# 시작하기

`nest new {project-name}`

`nest g module user`

- 같은 방식으로 user와 post의 module, controller, service 만들어주기

> 또는 nest g resource [name] 를 이용하면 기본적인 CRUD가 존재하는 폴더가 생성된다.

`$npm install --save @types/express` - type definition for express

## controller

- receive specific requests for the application
- routing
- classes and decorators are used

## Routing

```
import { Controller, Get } from '@nestjs/common';

@Controller('user')
export class UserController {
  @Get()
  findAll(): string {
    return 'returns all users';
  }
}

```

- `@Controller('user')` : `/user` 의 path prefix를 갖도록 한다.
- `@Get()` : HTTP request method decorator,
string을 argument로 넣어 `/user` 뒤에 올 route path를 추가할 수 있다.
ex : `@Get('profile')` 을 접근하기 위해서는 `GET /user/profile` 로 접근한다.

> Manipulating Responses
built-in method를 통해 object나 array를 리턴하면 JSON으로 바꾸어 보내준다. status code는 200(POST는 201)이 자동으로 설정된다. @HttpCode(...) 데코레이터를 이용하여 변경할 수 있다.

> Library-specific
express 등의 라이브러리를 이용할 수 있다. method handler의 input으로 @Res 데코레이터를 넣어줄 수 있다(e.g., findAll(@Res() response)).
전송은 response.status(200).send()

## Request object

handler signature에 `@Req()`를 추가한다.

```
import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller('user')
export class UserController {
  @Get()
  findAll(@Req() request: Request): string {
    console.log(request);
    return 'returns all users';
  }
}

```

```
@Get()
findAll(@Query() paginationQuery) {
    const { limit, offset } = paginationQuery;
    return `This action returns all coffees Limit: ${limit}, offset: ${offset}`;
}

```

request object는 **request query string, parameter, HTTP headers, body property**를 가진다.
`@Query(key?: string)`, `@Param(key?: string)`, `@Body(key?: string)` 등의 decorator로 property에 직접 접근도 가능하다.

## HTTP Methods

- `POST` 를 사용하는 방법은 다음과 같다.

```
import { Controller, Get, Post, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller('user')
export class UserController {
  ...

  @Post()
  create(): string {
    return 'This action adds a new user';
  }
}

```

- 같은 방식으로 `@Get()`, `@Post()`, `@Put()`, 등의 HTTP Method를 이용할 수 있다.
- `@All()` 은 모든 것들을 다루는 endpoint를 생성한다.

## Status code

```
@Post()
@HttpCode(204)
create() {
  return 'This action adds a new user';
}

```

- `@nestjs/common` package
- 만약 같은 request에 대해 http code가 다르다면 `@Res` 를 이용한 library-specific method를 이용하자.

## Route parameters

```
@Get(':id')
findOne(@Param() params): string {
  console.log(params.id);
  return `This action returns a #${params.id} user`;
}

```

- 또는 직접 route parameter에 접근할 수도 있다.

```
@Get('profile/:id')
findProfile(@Param('id') id: string): string {
  console.log(id);
  return `This action returns a #${id} profile`;
}

```

## Asynchronicity

```
@Get()
async findAll(): Promise<any[]> {
  return [];
}

```

![https://images.velog.io/images/jujube0/post/72c6a223-3471-47a8-8264-ca1e9352c3ef/6A01367F-E8BE-47E8-9493-110DB3E50C75.png](https://images.velog.io/images/jujube0/post/72c6a223-3471-47a8-8264-ca1e9352c3ef/6A01367F-E8BE-47E8-9493-110DB3E50C75.png)

## Request payloads/h

`@Body()` 데코레이터를 이용하여 POST route가 클라이언트가 보낸 request body를 읽을 수 있도록 만들어보자.

- 일단 **DTO**(Data Transfer Object)를 만들어줘야 한다. 클래스나 인터페이스를 이용하여 만들 수 있는데, 클래스가 선호된다(클래스는 런타임에도 존재하지만 인터페이스는 제거됨).
- cli `nest generate class coffees/dto/create-coffee.dto --no-spec`

```
export class CreatePostDto {
  title: string;
  content: string;
}

```

- 

```
@Post()
create(@Body() createPostDto: CreatePostDto): string {
  return 'This action adds a new post';
}

```

## Library-specific approach

```
import { Body, Controller, Get, HttpStatus, Post, Res } from '@nestjs/common';
import { CreatePostDto } from './create-post.dto';
import { Response } from 'express';

@Controller('post')
export class PostController {
  // library specific approach
  @Get()
  findAll(@Res() res: Response) {
    res.status(HttpStatus.CREATED).send();
  }

  @Post()
  create(@Body() createPostDto: CreatePostDto, @Res() res: Response) {
    res.status(HttpStatus.OK).json(createPostDto);
  }
}

```

- Library-specific approach 단점?
    - 코드가 플랫폼에 의존성을 띄게 됨
    - 테스트가 어려워짐(response object를 만들어줘야함)
    - Nest standard response handling(`@HttpCode()`, `@Header()`, interceptors)을 이용할 수 없음 → 이를 고치기 위해서는 `@Res({ passthrough: true})` 를 추가해준다.

# Providers

- > it can inject dependency

# Error

nestjs/common을 이용하자.

```
const coffee =  this.coffees.find(item => item.id === +id);
if (!coffee) {
    throw new HttpException(`Coffee #${id} not found`, HttpStatus.NOT_FOUND);
}
return coffee;

```

- 또는

```
if (!coffee) {
    throw new NotFoundException(`Coffee #${id} not found`);
}

```

# Validation Pipe

```
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}

```

두번쨰줄 추가하기

`npm i class-validator class-transformer`

```
import { IsString } from "class-validator";

export class CreateCoffeeDto {
    @IsString()
    readonly name: string;

    @IsString()
    readonly brand: string;

    @IsString({ each: true })
    readonly flavors: string[];
}

```

정상적인 Request body를 보내지 않으면 다음과 같은 json을 리턴한다.

```
{
  "statusCode": 400,
  "message": [
    "name must be a string",
    "each value in flavors must be a string"
  ],
  "error": "Bad Request"
}

```

`npm i @nestjs/mapped-types`

```
import { PartialType } from "@nestjs/mapped-types";
import { CreateCoffeeDto } from "./create-coffee.dto";

export class UpdateCoffeeDto extends PartialType(CreateCoffeeDto){ }

```

# Docker

- docker-compose.yml

```
version: "3"
services:
  db:
    image:  postgres
    restart: always
    ports:
      - "5432:5432"
    environment:
       POSTGRES_PASSWORD: pass123

```

// Start containers in detached / background mode
`docker-compose up -d`

// Stop containers
`docker-compose down`

# Transaction

event.entity.ts

```
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Event {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    type: string;

    @Column()
    name: string;

    @Column('json')
    payload: Record<string, any>;
}

```

- coffees.service.ts

```
@Injectable()
export class CoffeesService {
  constructor(
    ...
    private readonly connection: Connection,
  ) {}

  ...
  async recommendCoffee(coffee: Coffee) {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      coffee.recommendations++;

      const recommendEvent = new Event();
      recommendEvent.name = 'recommend_coffee';
      recommendEvent.type = 'coffee';
      recommendEvent.payload = { coffeeId: coffee.id };

      await queryRunner.manager.save(coffee);
      await queryRunner.manager.save(recommendEvent);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}

```

# Migration

ormconfig.js 파일 만든 후,
shell에서
`npx typeorm migration:create -n CoffeeRefactor`

- > src/migration 에 migration file을 만들어줌

![https://images.velog.io/images/jujube0/post/6ad6f5d3-b6f8-49f0-9e3c-0f0ac58b5c64/AC7D3276-D3B4-4DA9-9183-35D35E4CE90D.png](https://images.velog.io/images/jujube0/post/6ad6f5d3-b6f8-49f0-9e3c-0f0ac58b5c64/AC7D3276-D3B4-4DA9-9183-35D35E4CE90D.png)

> coffee entity의 name 칼럼을 title 로 바꾸는 상황을 가정해보자.
단순히 name을 title로 바꿔버린다면, name에 있던 데이터들은 모두 날아가버릴 것이다.

migrations file을 바꿔준다.

```
import {MigrationInterface, QueryRunner} from "typeorm";

export class CoffeeRefactor1626325978666 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> { // what needs to be changed and how
        await queryRunner.query(
            `ALTER TABLE "coffee" RENAME COLUMN "name" TO "title"`
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> { // undo or roll back
        await queryRunner.query(
            `ALTER TABLE "coffee" RENAME COLUMN "title" TO "name"`
        )
    }

}

```

`num run buildnpx typeorm migration:run`
(`npx typeorm migration:revert`)

typeorm은 db의 entity와 현재 entity 파일을 비교하여 직접 migration 파일을 만들게 할 수도 있다.

`npm run buildnpx typeorm migration:generate -n SchemaSyncnpx typeorm migration:run`

# Dependency Injection

- technique where we delegated instantiation of dependency, to an "inversion of control"(IpC) container (Nestjs runtime system)

    ![https://images.velog.io/images/jujube0/post/22323d03-fae7-459f-9d87-681ab26b7b7c/749F6065-1F6B-477F-BFF0-0FA9660A85D2.png](https://images.velog.io/images/jujube0/post/22323d03-fae7-459f-9d87-681ab26b7b7c/749F6065-1F6B-477F-BFF0-0FA9660A85D2.png)

## CoffeeService를 참조(dependent)하는 CoffeeRatingService를 만들어보자

- coffees.module.ts에서 `CoffeesService` export

```
@Module({
    ...
    exports: [CoffeesService],
})

```

- coffee-rating.module.ts에서 `CoffeesModule` import

```
import { Module } from '@nestjs/common';
import { CoffeesModule } from 'src/coffees/coffees.module';
import { CoffeeRatingService } from './coffee-rating.service';

@Module({
  imports: [CoffeesModule],
  providers: [CoffeeRatingService]
})
export class CoffeeRatingModule {}

```

- coffee-rating.service.ts에서 `CoffeesService` import

```
import { Injectable } from '@nestjs/common';
import { CoffeesService } from 'src/coffees/coffees.service';

@Injectable()
export class CoffeeRatingService {
    constructor(private readonly coffeeService: CoffeesService) {}
}

```

모든 module은 provider들을 encapsulate한다 → 다른 module에서 이를 이용하려면 `exported` 에 직접 명시해주어 API에 포함시켜줘야한다.

## Custom Providers

좀 더 복잡한 provider를 이용할 때를 생각해보자.

- Creating a custom instance of our provider instead of having Nest instatiate that class for us
- want to reuse an existing class in a second dependency
- want to overwrite a class with a mock version for testing
- want to use a strategy pattern in which we can provide an abstract class

### Value based provider

```
@Module({
    imports: [TypeOrmModule.forFeature([Coffee, Flavor, Event])],
    controllers: [CoffeesController],
    providers: [{ provide : CoffeesService, useValue: CoffeesService}],
    exports: [CoffeesService],
})

```

실제 provider 구조는 다음과 같다. 우리가 쓰는 것은 shorthand

그래서

```
class MockCoffeeService {}

@Module({
    imports: [TypeOrmModule.forFeature([Coffee, Flavor, Event])],
    controllers: [CoffeesController],
    providers: [{ provide : CoffeesService, useValue: new MockCoffeeService()}],
    exports: [CoffeesService],
})
export class CoffeesModule {}

```

이렇게 이용할 수 있다는 말.

### Non-class-based Provider Token

- coffees.module.ts

```
@Module({
    ...
    providers: [CoffeesService, { provide: 'COFFEE_BRANDS', useValue: ['buddy brew', 'nescafe']}],
})

```

이용할 때에는

```
@Injectable()
export class CoffeesService {
  constructor(
    ...
    @Inject('COFFEE_BRANDS') coffeeBrands: string[],
  ) {}

```

`@Inject()` 데코레이터 안에 TOKEN을 넣으면 된다.
typo 오류 등을 방지하기 위해서 TOKEN들을 다른 파일에 저장해 놓는 것이 좋다.

### Class Provider

- "useClass" syntax

```
 providers: [
        CoffeesService,
        {
            provide: ConfigService,
            useClass: process.env.NODE_ENV === 'development' ? DevelopmentConfigService: ProductionConfigService
        }
    ],

```

### Factory Provider

- "useFactory" syntax
- can inject other providers needed to compute the returning result

```

@Module({
    imports: [TypeOrmModule.forFeature([Coffee, Flavor, Event])],
    controllers: [CoffeesController],
    providers: [
        CoffeesService,
        CoffeeBrandsFactory,
        {
            provide: COFFEE_BRANDS,
            useFactory: (brandsFactory: CoffeeBrandsFactory) => brandsFactory.create(),
            inject: [CoffeeBrandsFactory]
        }
    ],
    exports: [CoffeesService],
})

```

### Leverage Async Provider

```
// Asynchronous "useFactory" (async provider example)
{
  provide: 'COFFEE_BRANDS',
  // Note "async" here, and Promise/Async event inside the Factory function
  // Could be a database connection / API call / etc
  // In our case we're just "mocking" this type of event with a Promise
  useFactory: async (connection: Connection): Promise<string[]> => {
    // const coffeeBrands = await connection.query('SELECT * ...');
    const coffeeBrands = await Promise.resolve(['buddy brew', 'nescafe'])
    return coffeeBrands;
  },
  inject: [Connection],
},

```

해당 provider에 의존하는 클래스를 instantiate하기 전에 위 promise를 먼저 resolve하게 된다.

### Create a Dynamic Module

위에서 다룬 모듈들은 static module이었다.
static modules can't have their providers be configured by a module that is consuming it

```
// Generate a DatabaseModule
nest g mo database

// Initial attempt at creating "CONNECTION" provider, and utilizing useValue for values */
{
  provide: 'CONNECTION',
  useValue: createConnection({
    type: 'postgres',
    host: 'localhost',
    port: 5432
  }),
}

// Creating static register() method on DatabaseModule
export class DatabaseModule {
  static register(options: ConnectionOptions): DynamicModule {  }
}

// Improved Dynamic Module way of creating CONNECTION provider
export class DatabaseModule {
  static register(options: ConnectionOptions): DynamicModule {
    return {
      module: DatabaseModule,
      providers: [
        {
          provide: 'CONNECTION', // 👈
          useValue: createConnection(options),
        }
      ]
    }
  }
}

// Utilizing the dynamic DatabaseModule in another Modules imports: []
imports: [
  DatabaseModule.register({ // 👈 passing in dynamic values
    type: 'postgres',
    host: 'localhost',
    password: 'password',
  })
]

```

![https://images.velog.io/images/jujube0/post/e0c5813b-5912-4107-8c15-8adbd2045e1e/7558CA53-A827-4168-87A4-60AA0B8D1C94.png](https://images.velog.io/images/jujube0/post/e0c5813b-5912-4107-8c15-8adbd2045e1e/7558CA53-A827-4168-87A4-60AA0B8D1C94.png)

![https://images.velog.io/images/jujube0/post/cb848560-4ada-46fa-8680-b261f4d7e42d/0F3C4A9B-D954-42AD-8651-E8AF40D9CBF5.png](https://images.velog.io/images/jujube0/post/cb848560-4ada-46fa-8680-b261f4d7e42d/0F3C4A9B-D954-42AD-8651-E8AF40D9CBF5.png)

### Control Providers Scope

- Node는 싱글 스레드임
- Nest에서 모든 provider는 기본적으로 singleton임

```
@Injectable({ scope: Scope.DEFAULT })
export class CoffeesService {
}

```

- Application이 `bootstrap()` 되면,모든 singleton provider가 instantiate됨.
- provider가 request-based lifetime을 갖기를 원하면?

두가지 scope option이 있다.

1. **Transient**
- NOT shared across consumers

```
@Injectable({ scope: Scope.TRANSIENT })
export class CoffeesService {

```

- coffeeService를 `TRANSIENT` 로 바꾸면, 해당 provider를 inject하는 컨수머들은 모두 새로운 인스턴스를 갖게된다.
-> 실제로 constructor body에 console을 찍어보면 확인 가능함.
- custom provider에서도 scope option을 추가할 수 있다.
1. **Request-Scoped**
- creates a new instance of the provider exclusively for EACH incoming request.
- automately Garbage collected after the request has completed
- `npm run start` 를 해도 instance 가 만들어지지 않는다.
- REQUEST 를 하나 보낼 떄마다 하나의 instantiated console이 뜬다.
- 근데, service를 이용하는 controller는 아직 싱글톤이자나!!!
-> Injection chain의 bubble-up이 일어난다. Request-scoped에 의존하는 controller 클래스도 Request-scoped가 된다는 것
- also can inject the original Request Object {}

```
// Injecting the ORIGINAL Request object
@Injectable({ scope: Scope.REQUEST })
export class CoffeesService {
  constructor(@Inject(REQUEST) private request: Request) {} // 👈
}

```

- performance 저하 -> 왠만하면 singleton쓰자.

# Introducing the Config Module

- `npm i @nestjs/config`
- root dir에 `.env` 파일을 만들어주자.
- env 파일은 key-value로 민감한 정보들 / config 정보들을 저장하게 된다.

    ![https://images.velog.io/images/jujube0/post/1c7ba3d1-7ce6-445e-bac6-907fd6e41bac/6253E1AF-A615-4B53-A1C0-487D92FF6DB9.png](https://images.velog.io/images/jujube0/post/1c7ba3d1-7ce6-445e-bac6-907fd6e41bac/6253E1AF-A615-4B53-A1C0-487D92FF6DB9.png)

- 이런식으로 이용할 수 있다. default로 value는 string으로 가져오게 된다.

```
TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),

```

## Custom Environment File Path

- 기본적으로 ConfigModule은 root 디렉토리의 `.env` 파일을 찾는다. 이를 바꿔주려면?

```
ConfigModule.forRoot({
  envFilePath: '.environment’,
});

```

- string array를 넘겨줄 수도 있다.
- production 환경에서 추후에 .env파일을 이용하지 않게 된 경우 `ignoreEnvFile: true` 를 옵션으로 넣어주자.

## Schema Validation

- env 변수가 존재하지 않거나, 룰을 따르지 않을 경우의 예외처리
- joi package를 이용한다. object schema를 정의할 수 있다.

```
// Install neccessary dependencies
$ npm install @hapi/joi
$ npm install --save-dev @types/hapi__joi

// Use Joi validation
ConfigModule.forRoot({
  validationSchema: Joi.object({
    DATABASE_HOST: Joi.required(),
    DATABASE_PORT: Joi.number().default(5432),
  }),
}),

```

- by default, 모든 스키마 키는 optional이다.
- `Joi.required()`를 이용하여 `DATABASE_HOST` 를 필수로 만들었다.
- `Joi.number` 로 number로 parsable한 조건을 추가하고, 디폴트 값을 5432로 설정했다.

## Config Service

- 모든 config value에 대해 `get()`
- 이용하기 위해서는 해당 모듈에 import 해줘야한다.

```
@Module({
    imports: [TypeOrmModule.forFeature([Coffee, Flavor, Event]), ConfigModule],
    ...
})

```

```
/* Utilize ConfigService */
import { ConfigService } from '@nestjs/config';

constructor(
  private readonly configService: ConfigService, // 👈
) {}

/* Accessing process.env variables from ConfigService */
const databaseHost = this.configService.get<string>('DATABASE_HOST');
console.log(databaseHost);

```

- get에 default value를 second param으로 넣어줄 수 있다.

## Custom Configuration Files

- group related settings
- 하나의 파일에 한 그룹을 관리해보도록 하자 .
- /src/config에 app.config.ts 파일 생성

```
/* /src/config/app.config.ts File */
export default () => ({
  environment: process.env.NODE_ENV || 'development',
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432
  }
});
/* Setting up "appConfig" within our Application */
import appConfig from './config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig], // 👈
    }),
  ],
})
export class AppModule {}

// ---------

/**
 * Grabbing this nested property within our App
 * via "dot notation" (a.b)
 */
const databaseHost = this.configService.get('database.host', 'localhost');

```

- default value를 설정하거나, parsing을 할 수도 있다.
- 이용하기 위해서는 app.module에 `load` 옵션을 추가해준다.
- configService.get에 들어가는 param은 path가 된다.

## Configuration Namespaces and Partial Registration

- when we have very complex project structure

```jsx
/* /src/coffees/coffees.config.ts File */
export default registerAs('coffees', () => ({ // 👈
  foo: 'bar', // 👈
}));

/* Partial Registration of coffees namespaced configuration */
@Module({
  imports: [ConfigModule.forFeature(coffeesConfig)], // 👈
})
export class CoffeesModule {}

// ---------
// ⚠️ sub optimal ways of retrieving Config ⚠️

/* Grab coffees config within App */
const coffeesConfig = this.configService.get('coffees');
console.log(coffeesConfig);

/* Grab nested property within coffees config */
const foo = this.configService.get('coffees.foo');
console.log(foo);

// ---------
// 💡 Optimal / Best-practice 💡

constructor(
  @Inject(coffeesConfig.KEY)
  private coffeesConfiguration: ConfigType<typeof coffeesConfig>,
) {
  // Now strongly typed, and able to access properties via:
  console.log(coffeesConfiguration.foo);
}

```

- > 실제 도메인과 가까운 곳에 config파일을 위치시킬 수 있다.
- type inference가 가능하고, key로 직접 접근하기 때문에 typo 오류 등의 자잘한 오류를 방지할 수 있다.

## Asynchronously Configure Dynamic Modules

```
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig]
    }),
    CoffeesModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
    CoffeeRatingModule,
  ],

```

- 위의 app.module.ts 파일에서 ConfigModule과 TypeormModule을 import해주는 순서를 바꿔주면 에러가 난다. → process.env파일에서 key 값을 가져올 수 없기 때문.
- 이를 해결하기 위해서 비동기적으로 configuration option을 가져오는 `forRootAsync()` method를 이용할 수 있다.

```
/* forRootAsync() */
TypeOrmModule.forRootAsync({ // 👈
  useFactory: () => ({
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: +process.env.DATABASE_PORT,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    autoLoadEntities: true,
    synchronize: true,
  }),
}),

```

# Other Building Blocks

- Exception filters
handling and processing unhandled exceptions
- Pipes
handle transformation(transform input data to the desired output) and validstion(invalidate input data)
- Guard
determine whether a given Request meets certain conditions, like authentication, authorization, roles, ACLs...
- @ Interceptors
bind extra logic before or after the method call
transform the result returned from a method
extend basic method behavior
override a method

## Understanding Binding Techniques

- GLOBAL-scoped
- CONTROLLER-scoped
- METHOD-scoped
- PARAM-scoped(Pipes only)
-> useful when the validation logic concern ONLY ONE specific parameter

`UsePipes`

![https://images.velog.io/images/jujube0/post/f621a43f-842a-468b-8e69-2bf5c908fab0/0E808697-EC98-4BC8-8C8F-0037154F570E.png](https://images.velog.io/images/jujube0/post/f621a43f-842a-468b-8e69-2bf5c908fab0/0E808697-EC98-4BC8-8C8F-0037154F570E.png)

## Catch Exceptions with Filters

- NESTJS의 built-in exception layer
- 우리가 처리하지 않은 예외는 자동으로 위의 레이어로 이동한다.

```
// Generate Filter with Nest CLI
nest g filter common/filters/http-exception

// Catch decorator
@Catch(HttpException)

/* HttpExceptionFilter final code */
import { Catch, HttpException, ExceptionFilter, ArgumentsHost } from "@nestjs/common";
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter<T extends HttpException> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    const error =
      typeof response === 'string'
        ? { message: exceptionResponse }
        : (exceptionResponse as object);

    response.status(status).json({
      ...error,
      timestamp: new Date().toISOString(),
    });
  }
}

```

- HttpExeption이 일어날 때마다 하고 싶은 행동을 추가할 수 있다.

## Protect Routes With Guards

- request에 permission/roles/ACLs 등이 필요할 때
- AUthentication / Authorization
- authorization Header에 API_KEY가 존재하는지 확인하고,
- 접근한 route가 public인지 확인해보자

```jsx
// Generate ApiKeyGuard with Nest CLI
nest g guard common/guards/api-key

// Apply ApiKeyGuard globally
app.useGlobalGuards(new ApiKeyGuard());

/* ApiKeyGuard code */
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.header('Authorization');
    return authHeader === process.env.API_KEY;
  }
}

```

- `canActivate` : 현 request가 허용되었는지의 여부를 boolean으로 리턴한다.
- Promise를 추가할 수도 있다.
- false이면 403 forbidde을 리턴한다.

## Using Metadata to Build Generic Guards or Interceptors

- create custom Metadata by `@SetMetadata('key', 'value');`
- value에는 type이 들어간다.

```jsx
/* public.decorator.ts FINAL CODE */
import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

/* ApiKeyGuard FINAL CODE */
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.get(IS_PUBLIC_KEY, context.getHandler());
    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.header('Authorization');
    return authHeader === this.configService.get('API_KEY');
  }
}

```

- **Reflector** : allow to retrieve metadata within a specific context
- global guards that depend on other classes must be registered within a @Module context
- `useGlobalGuard` 는 다른 모듈에 의존성을 갖지 않을 때만 이용이 가능하다.
- public 인 문서에는 API_KEY 없이 접근 가능해졌다!!(왕씬끼)

## Add Pointcuts with Interceptors

- interceptor : 코드를 수정하지 않으면서 기능을 추가할 수 있다
- method 실행 전/ 후로 로직을 추가하거나,
- 결과를 transform
- exeption transform
- override method
- extend basic method behavior
- 모든 response에 결과가 data property로 들어가길 원한다고 가정해보자.
- rxjs : alternative to Promise or callbacks

```
// Generate WrapResponseInterceptor with Nest CLI
nest g interceptor common/interceptors/wrap-response

/* WrapResponseInterceptor FINAL CODE */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class WrapResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before...');

    return next.handle().pipe(map(data => ({ data })));
  }
}

// Apply Interceptor globally in main.ts file
app.useGlobalInterceptors(new WrapResponseInterceptor());

```

## Handling Timeouts with Interceptors

- another technique with interceptor

```
/* Generate TimeoutInterceptor with Nest CLI */
nest g interceptor common/interceptors/timeout

/* Apply TimeoutInterceptor globally in main.ts file */

app.useGlobalInterceptors(
  new WrapResponseInterceptor(),
  new TimeoutInterceptor(), // 👈
);

/* Add manual timeout to force timeout interceptor to work */
await new Promise(resolve => setTimeout(resolve, 5000));

/* TimeoutInterceptor FINAL CODE */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  RequestTimeoutException,
} from '@nestjs/common';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      timeout(3000),
      catchError(err => {
        if (err instanceof TimeoutError) {
          return throwError(new RequestTimeoutException());
        }
        return throwError(err);
      }),
    );
  }
}

```

## Creating Custom Pipes

Pipes have two typical use cases:
Transformation: where we transform input data to the desired output
& validation: where we evaluate input data and if valid, simply pass it through unchanged. If the data is NOT valid - we want to throw an exception.
In both cases, pipes operate on the arguments being processed by a controller’s route handler.

NestJS triggers a pipe just before a method is invoked.

Pipes also receive the arguments meant to be passed on to the method. Any transformation or validation operation takes place at this time - afterwards the route handler is invoked with any (potentially) transformed arguments.

- Imcoming string을 Int로 바꾸는 파이프를 만들어보자

```
// Generate ParseIntPipe with Nest CLI
nest g pipe common/pipes/parse-int

/* ParseIntPipe FINAL CODE */
import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ParseIntPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new BadRequestException(
        `Validation failed. "${val}" is not an integer.`,
      );
    }
    return val;
  }
}

```

- value : input value
- metadata: metadata of currently processed value

## Add Request Logging with Middleware

Middleware functions have access to the request and response objects, and are not specifically tied to any method, but rather to a specified route PATH.

Middleware functions can perform the following tasks:

- executing code
- making changes to the request and the response objects.
- ending the request-response cycle.
- Or even calling the next middleware function in the call stack.

When working with middleware, if the current middleware function does not END the request-response cycle, it must call the next() method, which passes control to the next middleware function.

Otherwise, the request will be left hanging - and never complete.

- could be either function or class
class : stateless, can not inject dependency

```
// Generate LoggingMiddleware with Nest CLI
nest g middleware common/middleware/logging

// Apply LoggingMiddleware in our AppModule
consumer
  .apply(LoggingMiddleware)
  .forRoutes(‘*’);

/* LoggingMiddleware FINAL CODE */
import {
  Injectable,
  NestMiddleware,
} from '@nestjs/common';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    console.time('Request-response time');
    console.log('Hi from middleware!');

    res.on('finish', () => console.timeEnd('Request-response time'));
    next();
  }
}

```

- common.module.ts

```
@Module({
  imports: [ConfigModule],
  providers: [{ provide: APP_GUARD, useClass: ApiKeyGuard }]
})
export class CommonModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
    //OR
    //     consumer.apply(LoggingMiddleware).forRoutes({ path: 'coffees', method: RequestMethod.GET});

  }
}

```

## Create Custom Param Decorators

```
// Using the Protocol decorator
@Protocol(/* optional defaultValue */)

/* @Protocal() decorator FINAL CODE */
import {
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';

export const Protocol = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.protocol;
  },
);

```

- `@Protocol(data)`에 넣은 data는 createParamDecorator의 첫번째 인자가 된다.

# Generating OpenAPI Specification

## Swagger Module

- > use the OpenAPI specification. The OpenAPI specification is a language-agnostic definition format used to describe RESTful APIs.

An OpenAPI document allows us to describe our entire API, including:

- Available operations (endpoints)
- Operation parameters: Input and output for each operation
- Authentication methods
- Contact information, license, terms of use and other information.

```
/**
 * Installing @nestjs/swagger
 * & Swagger UI for Express.js (which our application uses)
 * 💡 Note: If your application is using Fastiy, install `fastify-swagger` instead
 */
npm install --save @nestjs/swagger swagger-ui-express

// Setting up Swagger document main.ts bootstrap()
const options = new DocumentBuilder()
  .setTitle('Iluvcoffee')
  .setDescription('Coffee application')
  .setVersion('1.0')
  .build();

const document = SwaggerModule.createDocument(app, options);

SwaggerModule.setup('api', app, document);

/**
 * With the App running (npm run start:dev if not)
 * To view the Swagger UI go to:
 * <http://localhost:3000/api>
 */

```

# Testing

```bash
$ npm run test # for unit tests
$ npm run test:cov # for test converage
$ npm run test:e2e # for e2e tests
```

- 테스트 파일은 `*.spec.ts` 의 구조를 가져야 Nest 가 test file로 식별할 수 있다.
- For e2e tests, these files are typically located in a dedicated `test` directory by default. e2e tests are typically grouped into separate files by the feature or functionality that they test. The file extension must be (dot).e2e-spec.ts.
- unit test가 각각의 함수/클래스 테스트에 초점을 맞춘다면, end to end 테스트는 전체 시스템에 초점을 맞춘다.

---

```tsx
import { Test, TestingModule } from '@nestjs/testing';
import { CoffeesService } from './coffees.service';

describe('CoffeesService', () => {
  let service: CoffeesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoffeesService],
    }).compile();

    service = module.get<CoffeesService>(CoffeesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
```

- 기본적으로 `describe()` 함수가 여러개의 테스트 함수들을 그룹으로 묶는다.
- `beforeEach` → 모든 테스트 이전에 할 행동들을 정의한다.

    : Test class → full Nest 'runtime'을 mock한, application execution context를 제공한다. 

    .compile() → module을 bootstrap한다. 모듈 인스턴스를 리턴한다. 

    모듈 인스턴스가 컴파일 되면, `.get()` method를 통해 모든 정적 인스턴스를 가져올 수 있다. 

    (request/transient-scoped provider의 경우 `.resolve()`

    `it` → individual test

    : unit test는 독립된 상태에서 이루어지는 것이 정석이다. 하지만 데이터베이스나 다른 provider들에 의존하고 있는 경우라면? → mock을 해주자. 

    provider들 중에서 필요한 기능들만 mock해주면 되는 것.

    ```jsx
    // Basic / empty "Mocks" for Entities in our CoffeesService 
    providers: [
      CoffeesService,
      { provide: Connection, useValue: {} },
      { provide: getRepositoryToken(Flavor), useValue: {} }, // 👈
      { provide: getRepositoryToken(Coffee), useValue: {} }, // 👈
    ]
    ```

    *getRepositoryToken은 nestjs/typeorm 에서 import 해야한다.

    ```jsx
    /* 
      coffees-service.spec.ts - FINAL CODE
    */
    import { Test, TestingModule } from '@nestjs/testing';
    import { CoffeesService } from './coffees.service';
    import { Connection, Repository } from 'typeorm';
    import { getRepositoryToken } from '@nestjs/typeorm';
    import { Flavor } from './entities/flavor.entity';
    import { Coffee } from './entities/coffee.entity';
    import { NotFoundException } from '@nestjs/common';

    type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
    const createMockRepository = <T = any>(): MockRepository<T> => ({
      findOne: jest.fn(),
      create: jest.fn(),
    });

    describe('CoffeesService', () => {
      let service: CoffeesService;
      let coffeeRepository: MockRepository;

      beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
          providers: [
            CoffeesService,
            { provide: Connection, useValue: {} },
            {
              provide: getRepositoryToken(Flavor),
              useValue: createMockRepository(),
            },
            {
              provide: getRepositoryToken(Coffee),
              useValue: createMockRepository(),
            },
          ],
        }).compile();

        service = module.get<CoffeesService>(CoffeesService);
        coffeeRepository = module.get<MockRepository>(getRepositoryToken(Coffee));
      });

      it('should be defined', () => {
        expect(service).toBeDefined();
      });

      describe('findOne', () => {
        describe('when coffee with ID exists', () => {
          it('should return the coffee object', async () => {
            const coffeeId = '1';
            const expectedCoffee = {};

            coffeeRepository.findOne.mockReturnValue(expectedCoffee);
            const coffee = await service.findOne(coffeeId);
            expect(coffee).toEqual(expectedCoffee);
          });
        });
        describe('otherwise', () => {
          it('should throw the "NotFoundException"', async (done) => {
            const coffeeId = '1';
            coffeeRepository.findOne.mockReturnValue(undefined);

            try {
              await service.findOne(coffeeId);
              done();
            } catch (err) {
              expect(err).toBeInstanceOf(NotFoundException);
              expect(err.message).toEqual(`Coffee #${coffeeId} not found`);
            }
          });
        });
      });
    });
    ```

    ## e2e Tests

    ```jsx
    import { Test, TestingModule } from '@nestjs/testing';
    import { INestApplication } from '@nestjs/common';
    import * as request from 'supertest';
    import { AppModule } from './../src/app.module';

    describe('AppController (e2e)', () => {
      let app: INestApplication;

      beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
          imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
      });

      it('/ (GET)', () => {
        return request(app.getHttpServer())
          .get('/')
          .expect(200)
          .expect('Hello World!');
      });
    });
    ```

    `createNestApplication` 을 이용하여 `app` variable 을 생성한다.

    `it`:  supertest 에서 request를 가져와서 이용하고 있다.

    ```jsx
    npm run test:e2e
    ```

    ```jsx
    /* 
      app.e2e-spec.ts - FINAL CODE 
    */
    import { Test, TestingModule } from '@nestjs/testing';
    import { INestApplication } from '@nestjs/common';
    import * as request from 'supertest';
    import { AppModule } from './../src/app.module';

    describe('AppController (e2e)', () => {
      let app: INestApplication;

      beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
          imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
      });

      it('/ (GET)', () => {
        return request(app.getHttpServer()) // 👈 
          .get('/')
          .set('Authorization', process.env.API_KEY) // 👈 
          .expect(200)
          .expect('Hello World!');
      });

      afterAll(async () => {
        await app.close();
      });
    });
    ```

    app.close → data base connection을 닫아준다. 

    ---

    module 을 isolation 상태에서 테스트해보자.

    ```jsx
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
    ```

    1. Mock interactions with the database

        → full isolation, but time consuming, error-prone, hard to maintain

        → we can not test any interaction with a real database or queries

    2. use a disk-based database

        → dont need to mock, easy to maintain, easy to setup, fast

        → DBMS 에 특화된 feature를 이용하지 못한다. 

    3. add an additional testing database

        → get same flow with real db

3번째 방법을 이용할 예정

```jsx
/*
  docker-compose.yml - FINAL CODE 
*/
version: "3"

services:
  db:
    image: postgres
    restart: always
    ports:
      - "5432:5432"
    environment:
      POSTGRES_PASSWORD: pass123
  test-db:
    image: postgres
    restart: always
    ports:
      - "5433:5432" # 👈 Note the 5433 port (since we are using 5432 for our regular db)
    environment:
      POSTGRES_PASSWORD: pass123

/*
 package.json pre & post hook additions
*/

"pretest:e2e": "docker-compose up -d test-db",
"posttest:e2e": "docker-compose stop test-db && docker-compose rm -f test-db"

/*

/* 
  test/coffees/coffees.e2e-spec.ts - FINAL CODE 
*/
import { INestApplication } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { CoffeesModule } from '../../src/coffees/coffees.module';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('[Feature] Coffees - /coffees', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        CoffeesModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5433,
          username: 'postgres',
          password: 'pass123',
          database: 'postgres',
          autoLoadEntities: true,
          synchronize: true,
        }),
      ],
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
```

- test-db를 추가했다.

    : 주의할 점은, port간 충돌이 일어나선 안된다.

- app은 우리가 main.ts에서 정의한 application isnstance와 동일하게 동작하여야한다. 즉, 모든 configuration은 여기에도 추가되어야한다는 것.

```jsx
/* 
  test/coffees/coffees.e2e-spec.ts - FINAL CODE 
*/
import { INestApplication, ValidationPipe, HttpStatus, HttpServer } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { CoffeesModule } from '../../src/coffees/coffees.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { CreateCoffeeDto } from 'src/coffees/dto/create-coffee.dto';
import { UpdateCoffeeDto } from 'src/coffees/dto/update-coffee.dto';

describe('[Feature] Coffees - /coffees', () => {
  const coffee = {
    name: 'Shipwreck Roast',
    brand: 'Buddy Brew',
    flavors: ['chocolate', 'vanilla'],
  };
  const expectedPartialCoffee = jasmine.objectContaining({
    ...coffee,
    flavors: jasmine.arrayContaining(
      coffee.flavors.map(name => jasmine.objectContaining({ name })),
    ),
  });
  let app: INestApplication;
  let httpServer: HttpServer;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        CoffeesModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5433,
          username: 'postgres',
          password: 'pass123',
          database: 'postgres',
          autoLoadEntities: true,
          synchronize: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    await app.init();
    httpServer = app.getHttpServer();
  });

  it('Create [POST /]', () => {
    return request(httpServer)
      .post('/coffees')
      .send(coffee as CreateCoffeeDto)
      .expect(HttpStatus.CREATED)
      .then(({ body }) => {
        expect(body).toEqual(expectedPartialCoffee);
      });
  });

  it('Get all [GET /]', () => {
    return request(httpServer)
      .get('/coffees')
      .then(({ body }) => {
        console.log(body)
        expect(body.length).toBeGreaterThan(0);
        expect(body[0]).toEqual(expectedPartialCoffee);
      });
  });

  it('Get one [GET /:id]', () => {
    return request(httpServer)
      .get('/coffees/1')
      .then(({ body }) => {
        expect(body).toEqual(expectedPartialCoffee);
      });
  });

  it('Update one [PATCH /:id]', () => {
    const updateCoffeeDto: UpdateCoffeeDto = {
      ...coffee,
      name: 'New and Improved Shipwreck Roast'
    }
    return request(httpServer)
      .patch('/coffees/1')
      .send(updateCoffeeDto)
      .then(({ body }) => {
        expect(body.name).toEqual(updateCoffeeDto.name);

        return request(httpServer)
          .get('/coffees/1')
          .then(({ body }) => {
            expect(body.name).toEqual(updateCoffeeDto.name);
          });
      });
  });

  it('Delete one [DELETE /:id]', () => {
    return request(httpServer)
      .delete('/coffees/1')
      .expect(HttpStatus.OK)
      .then(() => {
        return request(httpServer)
          .get('/coffees/1')
          .expect(HttpStatus.NOT_FOUND);
      })
  });

  afterAll(async () => {
    await app.close();
  });
});
```
