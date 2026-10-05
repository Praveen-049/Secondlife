import {marketplaceComponentKey} from '../project-maker/services/marketplaceAdapter.js';

export const ROLE_CONFIG={
 project_maker:{title:'PROJECT MAKER',singular:'Project Maker',base:'/project-maker',icon:'circuit'},
 seller:{title:'SELLER',singular:'Seller',base:'/seller',icon:'package'},
 organization:{title:'ORGANIZATION',singular:'Organization',base:'/organization',icon:'building'}
};

export const ORGANIZATION_TYPES=['College','University','NGO','Company','Recycling Organization','Government Organization','Other'];
export const LISTING_TYPES=['DONATE','SELL'];
export const LISTING_STATES=['AVAILABLE','RESERVED','SOLD','TRANSFERRED','CANCELLED'];
export const DELIVERY_STATES=['REQUESTED','ACCEPTED','PACKED','PICKED_UP','IN_TRANSIT','DELIVERED'];

const demoProfiles=[
 {id:'maker-asha',full_name:'Asha Raman',role:'project_maker',location:'Chennai'},
 {id:'maker-ravi',full_name:'Ravi Kumar',role:'project_maker',location:'Bengaluru'},
 {id:'seller-arun',full_name:'Arun Electronics',role:'seller',location:'Chennai'},
 {id:'seller-priya',full_name:'Priya Tech Reuse',role:'seller',location:'Bengaluru'},
 {id:'seller-makers',full_name:'Chennai Makers',role:'seller',location:'Chennai'},
 {id:'org-ssit',full_name:'SSIT Innovation Lab',organization_name:'SSIT Innovation Lab',organization_type:'College',role:'organization',location:'Chennai'},
 {id:'org-ewaste',full_name:'Campus E-Waste Center',organization_name:'Campus E-Waste Center',organization_type:'Recycling Organization',role:'organization',location:'Coimbatore'},
 {id:'org-green',full_name:'GreenTech Foundation',organization_name:'GreenTech Foundation',organization_type:'NGO',role:'organization',location:'Bengaluru'}
];

export function demoProfileId(role,identityName){
 const normalized=identityName.trim().toLowerCase();
 const matched=demoProfiles.find(profile=>profile.role===role&&(profile.role==='organization'?profile.organization_name:profile.full_name)?.toLowerCase()===normalized);
 return matched?.id??`${role}:${normalized.replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}`;
}

function initialDemoData(){
 const inventories=[
  {id:'inv-arun-esp32',owner_id:'seller-arun',component_name:'ESP32 DevKit',category:'Microcontroller',owned_quantity:2,condition:'Good',location:'Chennai'},
  {id:'inv-arun-servo',owner_id:'seller-arun',component_name:'SG90 Servo',category:'Actuator',owned_quantity:3,condition:'Good',location:'Chennai'},
  {id:'inv-priya-uno',owner_id:'seller-priya',component_name:'Arduino Uno',category:'Microcontroller',owned_quantity:4,condition:'Excellent',location:'Bengaluru'},
  {id:'inv-priya-ldr',owner_id:'seller-priya',component_name:'LDR Sensor',category:'Sensor',owned_quantity:10,condition:'Good',location:'Bengaluru'},
  {id:'inv-makers-rfid',owner_id:'seller-makers',component_name:'RFID RC522',category:'Module',owned_quantity:3,condition:'Good',location:'Chennai'},
  {id:'inv-makers-oled',owner_id:'seller-makers',component_name:'0.96 OLED',category:'Display',owned_quantity:2,condition:'Good',location:'Chennai'},
  {id:'inv-makers-dht',owner_id:'seller-makers',component_name:'DHT11',category:'Sensor',owned_quantity:4,condition:'Good',location:'Chennai'},
  {id:'inv-makers-motor',owner_id:'seller-makers',component_name:'DC Motor',category:'Actuator',owned_quantity:5,condition:'Fair',location:'Chennai'},
  {id:'inv-ssit-relay',owner_id:'org-ssit',component_name:'Relay Module',category:'Module',owned_quantity:80,condition:'Good',location:'Chennai'},
  {id:'inv-ssit-esp',owner_id:'org-ssit',component_name:'ESP32 DevKit',category:'Microcontroller',owned_quantity:145,condition:'Good',location:'Chennai'},
  {id:'inv-ssit-mpu',owner_id:'org-ssit',component_name:'MPU6050',category:'Sensor',owned_quantity:44,condition:'Good',location:'Chennai'},
  {id:'inv-ewaste-battery',owner_id:'org-ewaste',component_name:'18650 Battery',category:'Power',owned_quantity:235,condition:'Fair',location:'Coimbatore'},
  {id:'inv-green-pi',owner_id:'org-green',component_name:'Raspberry Pi 3',category:'Computer',owned_quantity:18,condition:'Good',location:'Bengaluru'}
 ];
 const listings=[
  {id:'list-esp32-arun',inventory_id:'inv-arun-esp32',owner_id:'seller-arun',owner_type:'seller',owner_name:'Arun Electronics',component_name:'ESP32 DevKit',category:'Microcontroller',total_quantity:1,available_quantity:1,reserved_quantity:0,transferred_quantity:0,cancelled_quantity:0,condition:'Good',description:'Tested Wi-Fi and Bluetooth board, includes header pins.',location:'Chennai',distance_km:2.4,listing_type:'SELL',price_per_unit:220,status:'AVAILABLE',demo:true},
  {id:'list-servo-arun',inventory_id:'inv-arun-servo',owner_id:'seller-arun',owner_type:'seller',owner_name:'Arun Electronics',component_name:'SG90 Servo',category:'Actuator',total_quantity:2,available_quantity:2,reserved_quantity:0,transferred_quantity:0,condition:'Good',description:'Working micro servos from a robotics kit.',location:'Chennai',distance_km:3.1,listing_type:'DONATE',price_per_unit:0,status:'AVAILABLE',demo:true},
  {id:'list-uno-priya',inventory_id:'inv-priya-uno',owner_id:'seller-priya',owner_type:'seller',owner_name:'Priya Tech Reuse',component_name:'Arduino Uno',category:'Microcontroller',total_quantity:2,available_quantity:2,reserved_quantity:0,transferred_quantity:0,condition:'Excellent',description:'Inspected and tested original-format boards.',location:'Bengaluru',distance_km:4.8,listing_type:'SELL',price_per_unit:350,status:'AVAILABLE',demo:true},
  {id:'list-ldr-priya',inventory_id:'inv-priya-ldr',owner_id:'seller-priya',owner_type:'seller',owner_name:'Priya Tech Reuse',component_name:'LDR Sensor',category:'Sensor',total_quantity:6,available_quantity:4,reserved_quantity:2,transferred_quantity:0,condition:'Good',description:'Photoresistors salvaged from tested sensor kits.',location:'Bengaluru',distance_km:5.2,listing_type:'DONATE',price_per_unit:0,status:'AVAILABLE',demo:true},
  {id:'list-rfid-makers',inventory_id:'inv-makers-rfid',owner_id:'seller-makers',owner_type:'seller',owner_name:'Chennai Makers',component_name:'RFID RC522',category:'Module',total_quantity:2,available_quantity:2,reserved_quantity:0,transferred_quantity:0,condition:'Good',description:'RFID reader module with key fob.',location:'Chennai',distance_km:6.3,listing_type:'SELL',price_per_unit:95,status:'AVAILABLE',demo:true},
  {id:'list-oled-makers',inventory_id:'inv-makers-oled',owner_id:'seller-makers',owner_type:'seller',owner_name:'Chennai Makers',component_name:'0.96 OLED',category:'Display',total_quantity:1,available_quantity:1,reserved_quantity:0,transferred_quantity:0,condition:'Good',description:'I2C OLED display, pixel test passed.',location:'Chennai',distance_km:6.3,listing_type:'DONATE',price_per_unit:0,status:'AVAILABLE',demo:true},
  {id:'list-dht-makers',inventory_id:'inv-makers-dht',owner_id:'seller-makers',owner_type:'seller',owner_name:'Chennai Makers',component_name:'DHT11',category:'Sensor',total_quantity:2,available_quantity:2,reserved_quantity:0,transferred_quantity:0,condition:'Good',description:'Temperature and humidity sensor, readings verified.',location:'Chennai',distance_km:6.3,listing_type:'SELL',price_per_unit:45,status:'AVAILABLE',demo:true},
  {id:'list-motor-makers',inventory_id:'inv-makers-motor',owner_id:'seller-makers',owner_type:'seller',owner_name:'Chennai Makers',component_name:'DC Motor',category:'Actuator',total_quantity:3,available_quantity:3,reserved_quantity:0,transferred_quantity:0,condition:'Fair',description:'Small DC motors salvaged from working kits.',location:'Chennai',distance_km:6.3,listing_type:'DONATE',price_per_unit:0,status:'AVAILABLE',demo:true},
  {id:'list-esp-ssit',inventory_id:'inv-ssit-esp',owner_id:'org-ssit',owner_type:'organization',owner_name:'SSIT Innovation Lab',component_name:'ESP32 DevKit',category:'Microcontroller',total_quantity:120,available_quantity:100,reserved_quantity:15,transferred_quantity:5,condition:'Good',description:'Bulk lot from completed IoT workshop; boards tested.',location:'Chennai',distance_km:8.2,listing_type:'DONATE',price_per_unit:0,status:'AVAILABLE',demo:true},
  {id:'list-mpu-ssit',inventory_id:'inv-ssit-mpu',owner_id:'org-ssit',owner_type:'organization',owner_name:'SSIT Innovation Lab',component_name:'MPU6050',category:'Sensor',total_quantity:25,available_quantity:20,reserved_quantity:4,transferred_quantity:1,condition:'Good',description:'Bulk motion sensors, individually checked.',location:'Chennai',distance_km:8.2,listing_type:'SELL',price_per_unit:75,status:'AVAILABLE',demo:true},
  {id:'list-relay-ssit',inventory_id:'inv-ssit-relay',owner_id:'org-ssit',owner_type:'organization',owner_name:'SSIT Innovation Lab',component_name:'Relay Module',category:'Module',total_quantity:60,available_quantity:50,reserved_quantity:10,transferred_quantity:0,condition:'Good',description:'Bulk relay boards from an introductory automation course.',location:'Chennai',distance_km:8.2,listing_type:'SELL',price_per_unit:55,status:'AVAILABLE',demo:true},
  {id:'list-battery-ewaste',inventory_id:'inv-ewaste-battery',owner_id:'org-ewaste',owner_type:'organization',owner_name:'Campus E-Waste Center',component_name:'18650 Battery',category:'Power',total_quantity:80,available_quantity:65,reserved_quantity:10,transferred_quantity:5,condition:'Fair',description:'Capacity-tested reclaimed cells. Collection in person.',location:'Coimbatore',distance_km:41,listing_type:'DONATE',price_per_unit:0,status:'AVAILABLE',demo:true},
  {id:'list-pi-green',inventory_id:'inv-green-pi',owner_id:'org-green',owner_type:'organization',owner_name:'GreenTech Foundation',component_name:'Raspberry Pi 3',category:'Computer',total_quantity:12,available_quantity:10,reserved_quantity:2,transferred_quantity:0,condition:'Good',description:'Wiped, tested single-board computers from a lab refresh.',location:'Bengaluru',distance_km:7.6,listing_type:'SELL',price_per_unit:950,status:'AVAILABLE',demo:true}
 ];
 const projects=[
  {id:'project-demo-security',owner_id:'maker-asha',owner_name:'Asha Raman',name:'Smart Security System',description:'Build an IoT security system using reusable electronics.',location:'Chennai',budget:500,requirements:[{name:'ESP32 DevKit',quantity:1},{name:'RFID RC522',quantity:1},{name:'SG90 Servo',quantity:1},{name:'0.96 OLED',quantity:1}],demo:true},
  {id:'project-demo-plant',owner_id:'maker-ravi',owner_name:'Ravi Kumar',name:'Smart Plant Monitor',description:'Monitor soil and light conditions with a low-power controller.',location:'Bengaluru',budget:650,requirements:[{name:'Arduino Uno',quantity:1},{name:'LDR Sensor',quantity:1},{name:'MPU6050',quantity:1}],demo:true}
 ];
 const requests=[
  {id:'request-demo-1',listing_id:'list-servo-arun',project_id:'project-demo-security',maker_id:'maker-asha',maker_name:'Asha Raman',seller_id:'seller-arun',inventory_id:'inv-arun-servo',component_name:'SG90 Servo',quantity:1,status:'REQUESTED',delivery_status:'REQUESTED',created_at:'2026-10-03T09:30:00.000Z',timeline:[{status:'REQUESTED',at:'2026-10-03T09:30:00.000Z'}],demo:true},
  {id:'request-demo-2',listing_id:'list-ldr-priya',project_id:'project-demo-plant',maker_id:'maker-ravi',maker_name:'Ravi Kumar',seller_id:'seller-priya',inventory_id:'inv-priya-ldr',component_name:'LDR Sensor',quantity:2,status:'ACCEPTED',delivery_status:'PACKED',created_at:'2026-10-02T11:15:00.000Z',timeline:[{status:'REQUESTED',at:'2026-10-02T11:15:00.000Z'},{status:'ACCEPTED',at:'2026-10-02T11:18:00.000Z'},{status:'PACKED',at:'2026-10-02T14:00:00.000Z'}],demo:true},
  {id:'request-demo-3',listing_id:'list-esp-ssit',project_id:'project-demo-security',maker_id:'maker-asha',maker_name:'Asha Raman',seller_id:'org-ssit',inventory_id:'inv-ssit-esp',component_name:'ESP32 DevKit',quantity:5,status:'TRANSFERRED',delivery_status:'DELIVERED',created_at:'2026-09-28T10:15:00.000Z',timeline:[{status:'REQUESTED',at:'2026-09-27T09:00:00.000Z'},{status:'ACCEPTED',at:'2026-09-27T10:00:00.000Z'},{status:'PACKED',at:'2026-09-27T12:00:00.000Z'},{status:'PICKED_UP',at:'2026-09-28T08:00:00.000Z'},{status:'IN_TRANSIT',at:'2026-09-28T09:00:00.000Z'},{status:'DELIVERED',at:'2026-09-28T10:15:00.000Z'}],demo:true}
 ];
 return {profiles:demoProfiles,inventories,listings,projects,requests,feedback:[]};
}

const STORAGE_KEY='secondlife-marketplace-data-v2';

export function loadDemoData(){
 if(typeof window==='undefined')return initialDemoData();
 try{
  const stored=window.localStorage.getItem(STORAGE_KEY);
  if(stored){
   const parsed=JSON.parse(stored);
   const defaults=initialDemoData();
   return {...defaults,...parsed};
  }
 }catch{window.localStorage.removeItem(STORAGE_KEY)}
 return initialDemoData();
}

export function saveDemoData(data){
 window.localStorage.setItem(STORAGE_KEY,JSON.stringify(data));
 return data;
}

export function getRatingSummary(feedback,targetId){
 const scores=feedback.filter(item=>item.target_id===targetId).flatMap(item=>Object.values(item.rating??{})).map(Number).filter(value=>value>=1&&value<=5);
 return scores.length?{average:scores.reduce((sum,value)=>sum+value,0)/scores.length,count:scores.length}:null;
}

export function matchListings(project,listings,location=''){
 const required=new Map(project.requirements.map(item=>[marketplaceComponentKey(item.name),item.quantity]));
 return listings.filter(listing=>listing.available_quantity>0&&required.has(marketplaceComponentKey(listing.component_name))&&listing.status==='AVAILABLE')
  .map(listing=>{
   const needed=required.get(marketplaceComponentKey(listing.component_name));
   const quantityPoints=Math.round(Math.min(listing.available_quantity/needed,1)*20);
   const availabilityPoints=40;
   const compatibilityPoints=20;
   const distancePoints=listing.location.toLowerCase()===location.toLowerCase()?10:Math.max(3,10-Math.round(listing.distance_km/10));
  const priceRatio=project.budget?listing.price_per_unit*needed/project.budget:0;
  const pricePoints=Math.max(0,Math.round((1-Math.min(priceRatio,1))*10));
   const score=availabilityPoints+compatibilityPoints+quantityPoints+distancePoints+pricePoints;
   return {...listing,needed,match_score:Math.min(score,100),score_breakdown:{availability:availabilityPoints,compatibility:compatibilityPoints,quantity:quantityPoints,distance:distancePoints,price:pricePoints}};
  }).sort((left,right)=>right.match_score-left.match_score);
}

export function replaceListingQuantities(listing,updates){
 const next={...listing,...updates};
 next.status=next.available_quantity>0?'AVAILABLE':next.reserved_quantity>0?'RESERVED':next.transferred_quantity>=next.total_quantity?'TRANSFERRED':listing.status;
 return next;
}