
const mongoose = require('mongoose');
const data = require('C:/Users/Krushna/OneDrive/Desktop/Project1/First-FullStack-Project/init/data.js')
const listing = require('C:/Users/Krushna/OneDrive/Desktop/Project1/First-FullStack-Project/collections/listing');


main().then(()=>{
    console.log("DB connected")
})

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/plot_dekho');
}

const setup = async () =>{
    await listing.deleteMany().then(()=>{
    console.log("alldelete")
    }).catch((err)=>{
    console.log("cant del",err)
    })

    await listing.insertMany(data.data).then(()=>{
    console.log("yusss")
    }).catch((err)=>{
    console.log("error occur",err);
    })
}

setup();




