import express from "express";
import "reflect-metadata";
import { DataSource } from "typeorm";
import cors from "cors";
import { PinCodes } from "./entities/pincode";
import { MerchantService } from "./Merchant/merchant.service";
import { pincodeMap } from "./DataStruct";

const app = express();
const PORT = 5050;

app.use(express.json());
app.use(cors());

export const AppSataSource = new DataSource({
  type: "postgres",
  host: "ep-lively-fog-a58gh9b4.us-east-2.aws.neon.tech",
  port: 5432,
  username: "anand2002ksingh",
  password: "1PZiCSGWlEw7",
  database: "buildBharat",
  ssl: {
    rejectUnauthorized: false,
  },
  entities: ["src/entities/*{.ts,.js}"],
  synchronize: true,
  logging: true,
});

app.post('/addPincode', async(req,res)=>{ 
    const body = req.body;
    const added= await MerchantService.addPincode(body)
    res.json(added);
})

app.get('/getPincode', async(req,res)=>{
  const body=req.body;
  const data= await MerchantService.getPincode(body.pincode)
  res.json(data);
})

//final
app.post('/merchantAvail', async(req,res)=>{
  const pin= req.body.pincode;
  if(pincodeMap.size===0)
  {
    MerchantService.initDataStruct();
    const data= await MerchantService.getPincode(pin)
    if (data.length!==0) {
      res.json(data);
    } else {
      res.status(404).json({ error: 'Pincode not found' });
    }
  }
  else{
    const mp= pincodeMap.get(pin);
  if (mp) {
    const mpArray = Array.from(mp);
    res.json(mpArray);
  } else {
    res.status(404).json({ error: 'Pincode not found' });
  }
  }
  
})

app.post('/addMerchant',async(req,res)=>{
  const body=req.body;
  const data = await MerchantService.addMerchants(body);
  res.json(data);
})

app.get('/getAllPins', async(req,res)=>{
  const data= await MerchantService.getAllPins();
  res.json(data)
})

async function connectDB() {
  await AppSataSource.initialize()
    .then(() => {
      console.log("Connected to database");
    })
    .catch((e) => console.log(e));
}

app.listen(PORT, async () => {
  await connectDB();
  if(pincodeMap.size===0)
  {
    await MerchantService.initDataStruct();
  }
  console.log(`Application running on ${PORT}`);
});
