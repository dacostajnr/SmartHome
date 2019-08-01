'use strict';
// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------
const { App } = require('jovo-framework');                             // inbuilt import from jovo
const { Alexa } = require('jovo-platform-alexa');                      // inbuilt import from jovo
const { GoogleAssistant } = require('jovo-platform-googleassistant');  // inbuilt import from jovo
const { JovoDebugger } = require('jovo-plugin-debugger');              // inbuilt import from jovo
const { FileDb } = require('jovo-db-filedb');                          // inbuilt import from jovo
const app = new App();
app.use(
    new Alexa(),
    new GoogleAssistant(),
    new JovoDebugger(),
    new FileDb()
);
// MY CUSTOM IMPORTS 

//-------------------------------------------------------------------- 
var sbusLib = require("../SB_GATEWAY/app");  // import the SBUS application.this app also imports sbus library
var devices = require("./devices");          // import devices.js.This file contains Promise Objects of json files(data) it reads
var dev_list = null;                         // initialize  to null
var HVAC_commands = null;                    // initialize to null
var colors = null;                           // initialize to null   
var that = this;                             // GET EXPLANATION 
devices.ReadConfig().then((res)=>{
    dev_list = res;
});
devices.ReadHVAC().then((res)=>{
    HVAC_commands = res;
});
devices.ReadRGBColors().then((res)=>{
    colors = res;
});
app.setHandler({
    LAUNCH() {
        return this.toIntent('HelloWorldIntent');
    },
    HelloWorldIntent() {
        this.ask('Smarthome here,how may I help you', 'Smarthome here');
    },
    MyNameIsIntent() {
        this.tell('Hey ' + this.$inputs.name.value + ', nice to meet you!');
    },
    LightOnIntent(){ // parameter => location
        let location = this.$inputs.location.value; // input variable
        console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
        console.log(this.$inputs);
        console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
        let where = dev_list.Lights.filter((light)=> light.location ==""+location.toLowerCase());
     
        if (where[0]!=null){ 
            sbusLib.LightingControl(where[0].subnetid,where[0].deviceid,where[0].channel,100,0);
            this.ask("Hey, "+location+" light turned on");
        }
        else{
            this.ask("Sorry,I couldn\'t find any matching device");
        }
    },
    LightOffIntent(){        
        let location = this.$inputs.location.value; // input variable
        console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
        console.log(this.$inputs);
        console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
        let where = dev_list.Lights.filter((light) => light.location == ""+location.toLowerCase());  
        if(where[0]!= null) 
        {
            sbusLib.LightingControl(where[0].subnetid, where[0].deviceid, where[0].channel,0,0);           
            this.ask('Hey, '  +location+ ' light turned off');
        }else{
            this.ask('Sorry, I couldn\'t find any matching device');
        }    
        
    },
    ItOffIntent(){
        let location = this.$inputs.location.value;  // input variable

        let where = dev_list.Lights.filter((light) => light.location == ""+location.toLowerCase() );
        if(where != null) 
        {
            sbusLib.LightingControl(where[0].subnetid, where[0].deviceid, 4, 0, 0);           
            this.ask('Hey, '  +location+ ' light turned off');
        }else{
            this.ask('Sorry, I couldn\'t find any matching device');
        }
        console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");    
        console.log("");
        console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");    
    },
    ItOnIntent(){
        let location = this.$inputs.location.value; // input variable
        let where = dev_list.Lights.filter((light) => light.location == ""+location.toLowerCase() ); 
        if(where[0] != null){
            sbusLib.LightingControl(where[0].subnetid, where[0].deviceid,where[0].channel, 100, 0);     
            this.ask('Hey, '  +location+ ' light turned on');
        }else{    
            this.tell('Sorry, I couldn\'t find any matching device');
        }
    },
    ACTempIntent(){
        let number = this.$inputs.number.value;  // input variable
        sbusLib.HvacControl(dev_list.ddp[0].subnetid, dev_list.ddp[0].deviceid, 4, number);
        console.log(number);
        this.ask('AC temperature set');
    },
    ACFanSpeedIntent(){
        let speed = this.$inputs.speed.value;   // input variable
        //var num;
        //acspeed == 'high'? num = 2 : acspeed == 'medium'? num = 1 : num = 0;
        console.log(speed.key);
        sbusLib.HvacControl(dev_list.ddp[0].subnetid, dev_list.ddp[0].deviceid, 5, speed.key);
        //console.log(speed);
        this.ask('Fan speed set');
    },
    ACOffIntent(){
        sbusLib.HvacControl(dev_list.ddp[0].subnetid, dev_list.ddp[0].deviceid, 3, 0);
        this.ask('air-conditioner turned off');
    },
    ACOffOnIntent(){
        sbusLib.HvacControl(dev_list.ddp[0].subnetid, dev_list.ddp[0].deviceid, 3, 1);
        this.ask('air-conditioner turned on');
    },  
    DimmerIntent(){
        let location = this.$inputs.location.value;     // input variable
        let number = this.$inputs.number.value;         // input variable
        let itlocation =this.$inputs.itlocation.value ; // input variable

        this.ask("Dimmer internt is working perfectly");
    },
    StatusCheckIntent(){
        let location = this.$inputs.location.value;       // input variable

        var where = dev_list.Lights.filter((light) => light.location == ""+location.toLowerCase());
        var that = this;
        it = where[0];
        if(where[0].status == 0){
            console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
            console.log("Saying status of light");
            console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
            this.ask(location + ' light is off');
        }else if(where[0].status >= 1){
            console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
            console.log("Saying status of light");
            console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
            this.ask(location + ' light is on');
        }
        console.log('here');
    },
    DimmerStatusIntent(){

        let location = this.$inputs.location.value;     // input variable

        var where = dev_list.Lights.filter((light) => light.location == ""+location.toLowerCase());
        var that = this;
        it = where[0];
        this.ask(location+' dimmer\'s brightness level is set to '+where[0].status+' percent' );
    },    
    LightBeepIntent(){
        console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
        console.log(this.$inputs);
        this.ask("Test worked correctly");
        console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
    },
    RGBIntent(){
        let color = this.$inputs.color.value;   // input variable        
        let value = colors.filter((col) => col.name == ""+color.toLowerCase());
        console.log(dev_list.led[0].subnetid);
        sbusLib.RGBW(dev_list.led[0].subnetid, dev_list.led[0].deviceid, value[0].r,value[0].g,value[0].b,value[0].w, 0);
        this.ask('ok');
        console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
        console.log(this.$inputs);
        console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");

        //this.ask("Test worked correctly");

    },
    LEDOffIntent(){
        console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
            console.log("Turning off LED");
            console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
        sbusLib.RGBW(dev_list.led[0].subnetid, dev_list.led[0].deviceid, 0,0,0,0, 0);
        this.ask('ok');  
    },
    PlayMusic(){
        console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
            console.log("Playing music");
            console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
        sbusLib.PlaySDsong(dev_list.music[0].subnetid, dev_list.music[0].deviceid);
        this.ask('ok');       
    },
    MusicAlbum(){
        if(this.$inputs.album.value == "next"){
            console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
            console.log("Playing next album");
            console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
            sbusLib.NextAlbum(dev_list.music[0].subnetid, dev_list.music[0].deviceid);
            this.ask('ok');
        }else if(this.$inputs.album.value == "previous"){
            console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
            console.log("Playing next album");
            console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
            sbusLib.PreviousAlbum(dev_list.music[0].subnetid, dev_list.music[0].deviceid);
            this.ask('ok');
        }

    },
    MusicTrack(){     // input parameters used in code block
        if(this.$inputs.album.value == "next"){
            console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
            console.log("Playing next track");
            console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
            sbusLib.NextTrack(dev_list.music[0].subnetid, dev_list.music[0].deviceid);
            this.ask('ok');
        }else if(this.$inputs.album.value == "previous"){
            console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
            console.log("Playing previous track");
            console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
            sbusLib.PreviousTrack(dev_list.music[0].subnetid, dev_list.music[0].deviceid);
            this.ask('ok');
        }

    },
    MusicVolume(){
        let number = this.$inputs.number.value;   // input parameter
        console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^")
        console.log("Setting music volume to"+number.toString());
        console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^")
        sbusLib.Volume(dev_list.music[0].subnetid, dev_list.music[0].deviceid, number);
        this.ask('ok');

    },
    StopMusic(){
        console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^")
        console.log("Stoping music");
        console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^")
         sbusLib.Stop(dev_list.music[0].subnetid, dev_list.music[0].deviceid);
        this.ask('ok');
    },
    PresentationIntent(){
        //console.log()
        this.ask(`My name is Alexa.............Today,presenting on the smart echo project.............Smart echo is  project that aims to integrate our smarthome solution with me.....Alexa....
It involves developing a product to enable Amazon's Alexa to be  used with the smarthome system............
It will work on android and IOS devices,as well as any echo device...............In this presentation,we are using the 3rd generation echo dot......
This project uses voice commands to interact with our smarthome system .......It will control home appliances such as lights and audio or music......
Alexa is a virtual assistant developed by Amazon which is capable of voice interaction and it is activated by a wake-word such as "Alexa"`);
    }
});

sbusLib.Events().on('relaystatus', (type, subnetID, deviceID, totalChannels, channelStatus,mbstate) => {
    var gadget = dev_list.Lights.filter(function (gad) { 
        return (subnetID == gad.subnetid && deviceID == gad.deviceid)
    });
    if(gadget != null){
        gadget[0].status = channelStatus[gadget[0].channel - 1];
        gadget[1].status = channelStatus[gadget[1].channel - 1];
        gadget[2].status = channelStatus[gadget[2].channel - 1];
        gadget[3].status = channelStatus[gadget[3].channel - 1];
    }  
},that);

module.exports.app = app; 
