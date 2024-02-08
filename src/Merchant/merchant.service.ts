import { AppSataSource } from "..";
import { MerchSet, pincodeMap } from "../DataStruct";
import { Merchant } from "../entities/merchants";
import { PinCodes } from "../entities/pincode";

export class MerchantService {
    static async addPincode(body: any): Promise<any> {
        const myDataSource = AppSataSource;
        const userRepository = myDataSource.getRepository(PinCodes);
        const user = userRepository.create(body);
        return await userRepository.save(user);
    }

    static async getPincode(body: string): Promise<any> {
        const myDataSource = AppSataSource;
        const userRepository = myDataSource.getRepository(PinCodes);
        const pincode =await userRepository.findOne({ 
            relations: ["merchants"],
            where: { pincode: body } 
        })
        let data=[];
        if(pincode?.merchants)
            for(const element of pincode?.merchants)
            {
                data.push(element.merchant);
            }
        return data;
    }

    static async initDataStruct():Promise<any>{
        const myDataSource = AppSataSource;
        console.log('Initializing Data Structure........')
        const userRepository = myDataSource.getRepository(PinCodes);
        const pincode = await userRepository.find({
            relations: ["merchants"]
        });
        for(const element of pincode)
        {
            const pin = element.pincode;

            if(element.merchants)
            {
                let merchSet:MerchSet = new Set([])
                for(const merch of element.merchants)
                {
                    merchSet.add(merch.merchant)
                }
                pincodeMap.set(pin,merchSet);
            }
        }
        // console.log(pincodeMap)
        return pincodeMap;
    }

    static async getAllPins():Promise<any>{
        const myDataSource = AppSataSource;
        const userRepository = myDataSource.getRepository(PinCodes);
        const pincode = await userRepository.find({});
        let arr=[]
        for(const elem of pincode)
        {
            arr.push(elem.pincode)
        }
        console.log(arr)
        return arr;
    }

    static async getDataStructure():Promise<any>{
        return pincodeMap;
    }

    static async addMerchants(body: any):Promise<any> {

        try{
        const myDataSource = AppSataSource;
        const userRepository = myDataSource.getRepository(PinCodes);
        const merchRepository = myDataSource.getRepository(Merchant);
        const array= body.deliveryPin;
        let data=[];
        for (const element of array) {
            let getPincode =await userRepository.findOne({ 
                where: { pincode: element } 
            })
            if(!getPincode)
            {
                await this.addPincode({pincode:element})
                getPincode =await userRepository.findOne({ 
                    where: { pincode: element } 
                })
            }
            console.log(getPincode)
            if(getPincode)
            {   
                const newMerch = new Merchant();
                newMerch.merchant=body.merchantId;
                newMerch.pincode = getPincode as PinCodes;
                const savedMerch = await merchRepository.save(newMerch);
                data.push(savedMerch);
            }
        }
        await this.initDataStruct();
        console.log(data);
        return data;
    }catch(e){
        return {error: 'Already exist'}
    }
        
    }

    static async initMerch():Promise<any>{
        const myDataSource = AppSataSource;
        const pincodeRepo = myDataSource.getRepository(PinCodes);
        const merchRepository = myDataSource.getRepository(Merchant);
        const pincode = await pincodeRepo.find();

        for(const element of pincode)
        {
            const rand=Math.floor(Math.random() * (1000 - 1 + 1)) + 1;
            for(let i=rand;i<=rand+25;i++)
            {
                console.log(i);
                const newMerch = new Merchant();
                newMerch.merchant='M'+i.toString();
                newMerch.pincode=element as PinCodes;
                const savedMerch = await merchRepository.save(newMerch);

            }
        }

        return pincode;
    }
}