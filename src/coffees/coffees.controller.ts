import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Res,
  SetMetadata,
  UsePipes,
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { ParseIntPipe } from 'src/common/pipes/parse-int.pipe';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';

@ApiTags('coffees')
@Controller('coffees')
export class CoffeesController {
  // visibility modifier(private) 또는 Readonly를 가진 constructor parameter는 class property로 자동 정의된다.
  constructor(private readonly coffeesService: CoffeesService) {}

  @Public()
  @Get()
  @ApiResponse({ status: 200, description: '모든 커피를 가져왔습니다.' })
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.coffeesService.findAll(paginationQuery);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.coffeesService.findOne(id);
  }

  @Post()
  create(@Body() createCoffeeDto: CreateCoffeeDto) {
    return this.coffeesService.create(createCoffeeDto);
  }

  @Post('test')
  @ApiBody({ type: [CreateCoffeeDto] })
  test(@Body() createCoffeeDto: CreateCoffeeDto[]) {
    return createCoffeeDto.map((item) => this.coffeesService.create(item));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCoffeeDto: UpdateCoffeeDto) {
    return this.coffeesService.update(id, updateCoffeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coffeesService.remove(id);
  }
}
