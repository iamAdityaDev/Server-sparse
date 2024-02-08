import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { PinCodes } from "./pincode";

@Entity()
@Unique(["merchant","pincode"])
export class Merchant{

    @PrimaryGeneratedColumn('uuid')
    merchid:string;

    @Column()
    merchant:string;

    @ManyToOne(()=> PinCodes,(pincodes)=>pincodes.merchants)
    pincode: PinCodes
}