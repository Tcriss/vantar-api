import { PartialType } from '@nestjs/swagger';

import { CreateCategoryDTO } from './create-category.dto';

export class EditCategoryDTO extends PartialType(CreateCategoryDTO) {}