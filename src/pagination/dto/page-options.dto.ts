import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';

import { Order } from '@/pagination/constants/order';

export enum SortField {
  WEIGHTED_RATING = 'weightedRating',
  COMMENTS_COUNT = 'commentsCount',
  AVG_RATING = 'avgRating',
}

export class PageOptionsDto {
  @ApiPropertyOptional({ enum: SortField, default: SortField.WEIGHTED_RATING })
  @IsEnum(SortField)
  @IsOptional()
  readonly sortBy: SortField = SortField.WEIGHTED_RATING;

  @ApiPropertyOptional({ enum: Order, default: Order.ASC })
  @IsEnum(Order)
  @IsOptional()
  readonly order: Order = Order.DESC;

  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page: number = 1;

  @ApiPropertyOptional({ minimum: 1, maximum: 50, default: 10 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  readonly take: number = 10;

  get skip(): number {
    return (this.page - 1) * this.take;
  }
}
