import { IsString } from 'class-validator';

export class CreateCoffeeDto {
  /**
   * A name of the coffee
   * @example saltyCoffee
   */
  @IsString()
  readonly name: string;

  /**
   * A brand of the coffee
   * @example starbucks
   */
  @IsString()
  readonly brand: string;

  /**
   * flavor list of the coffee
   * @example [salty, sweet]
   */
  @IsString({ each: true })
  readonly flavors: string[];
}
