import { extname } from 'path';

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiConsumes,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { diskStorage } from 'multer';

import { CreateFeatureDto } from '@/features/dto/create-feature.dto';
import { UpdateFeatureDto } from '@/features/dto/update-feature.dto';
import { FeaturesService } from '@/features/features.service';

@ApiTags('features')
@Controller('features')
export class FeaturesController {
  constructor(private readonly featuresService: FeaturesService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/features',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `feature-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    })
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create a new feature with optional image' })
  @ApiBody({
    description: 'Feature data with optional image',
    schema: {
      type: 'object',
      required: ['name'],
      properties: {
        name: {
          type: 'string',
          example: 'WiFi',
          description: 'Name of the feature',
        },
        image: {
          type: 'string',
          format: 'binary',
          description: 'Feature icon image (optional)',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Feature created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  create(
    @Body() createFeatureDto: CreateFeatureDto,
    @UploadedFile() image?: Express.Multer.File
  ) {
    return this.featuresService.create(createFeatureDto, image);
  }

  @Get()
  @ApiOperation({ summary: 'Get all features' })
  @ApiResponse({ status: 200, description: 'Returns all features' })
  findAll() {
    return this.featuresService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get feature by ID' })
  @ApiResponse({ status: 200, description: 'Returns the feature' })
  @ApiResponse({ status: 404, description: 'Feature not found' })
  findOne(@Param('id') id: string) {
    return this.featuresService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/features',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `feature-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    })
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update feature' })
  @ApiBody({
    description: 'Update feature data',
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'WiFi',
          description: 'Name of the feature (optional)',
        },
        image: {
          type: 'string',
          format: 'binary',
          description: 'New feature icon image (optional)',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Feature updated successfully' })
  @ApiResponse({ status: 404, description: 'Feature not found' })
  update(
    @Param('id') id: string,
    @Body() updateFeatureDto: UpdateFeatureDto,
    @UploadedFile() image?: Express.Multer.File
  ) {
    return this.featuresService.update(+id, updateFeatureDto, image);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete feature' })
  @ApiResponse({ status: 200, description: 'Feature deleted successfully' })
  @ApiResponse({ status: 404, description: 'Feature not found' })
  remove(@Param('id') id: string) {
    return this.featuresService.remove(+id);
  }
}
