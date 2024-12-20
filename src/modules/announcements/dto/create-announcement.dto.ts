import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class CreateAnnouncementDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  details: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsOptional()
  phoneNumber?: string;
}