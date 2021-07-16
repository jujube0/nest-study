import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Res } from '@nestjs/common';
import { PaginationQueryDto } from 'src/common/dt/pagination-query.dto';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';

@Controller('coffees')
export class CoffeesController {

    // visibility modifier(private) 또는 Readonly를 가진 constructor parameter는 class property로 자동 정의된다.
    constructor(private readonly coffeesService: CoffeesService) {}

    @Get()
    findAll(@Query() paginationQuery: PaginationQueryDto) {

        return this.coffeesService.findAll(paginationQuery);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return  this.coffeesService.findOne(id);
    }

    @Post()
    create(@Body() createCoffeeDto: CreateCoffeeDto) {
        return this.coffeesService.create(createCoffeeDto);
    }

    @Patch(':id')
    update(@Param('id') id:  string, @Body() updateCoffeeDto: UpdateCoffeeDto) {
        return this.coffeesService.update(id, updateCoffeeDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.coffeesService.remove(id);
    }

}
