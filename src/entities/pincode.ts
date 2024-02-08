import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Merchant } from "./merchants";

@Entity()
@Unique(["pincode"])
export class PinCodes{

    @PrimaryGeneratedColumn('uuid')
    pinid:string;

    @Column()
    pincode:string;

    @OneToMany(()=> Merchant, (merchant)=> merchant.pincode)
    merchants?: Merchant[]
}