import { PartialType } from "@nestjs/mapped-types";
import { CreateGroupDto } from "./create-group.dto";

export class UpdateUserDto extends PartialType(CreateGroupDto) {}