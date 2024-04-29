//ma2 Akai Fire control code v 1.0 by ArtGateOne

var easymidi = require('easymidi');
var W3CWebSocket = require('websocket')
    .w3cwebsocket;
var client = new W3CWebSocket('ws://localhost:80/'); //U can change localhost(127.0.0.1) to Your console IP address


//CONFIG
midi_in = 'FL STUDIO FIRE';     //set correct midi in device name
midi_out = 'FL STUDIO FIRE';    //set correct midi out device name
colors = 1; //auto color executor 0 = off, 1 = on (color from executor Name), 2 = on (color from apperance - brightnes)
blink = 0;  //blink run executor 0 = off, 1 = on (blink work only when colors mode is on)
page_flash = 0; // 0=off (normal switch pages), 1=on (klick and hold page button to select page, when release button - back to page 1);
onpc_switch_page = 1;   //switch page on pc from akai 0 = off, 1 = on
grandmaster_level = 1;    //display grandmaster level 0 = off, 1 = white, 2 = hue

//-----------------------------------------------------------------------------------

var user1_encoder1 = "PAN";
var user1_encoder2 = "TILT";
var user1_encoder3 = "FOCUS";
var user1_encoder4 = "ZOOM";

var user2_encoder1 = "COLORRGB1";   //Red
var user2_encoder2 = "COLORRGB2";   //Green
var user2_encoder3 = "COLORRGB3";   //Blue
var user2_encoder4 = "COLORRGB5";   //White

//-----------------------------------------------------------------------------------

var encoder_y = 418;

var encoder_1_x = 968;
var encoder_2_x = 1127;
var encoder_3_x = 1287;
var encoder_4_x = 1446;

//-----------------------------------------------------------------------------------END

var speedmaster1 = 60;
var speedmaster2 = 60;
var speedmaster3 = 60;
var speedmaster4 = 60;

var ExecTime = 0;
var ProgTime = 0;

var grandmaster = 100;
var blackout = 0;

var cmd = '';
var interval_on = 0;

var shift = 1;
var alt = 0;
var encoder_pressed = 0;
var encodervalue = 0;

var input = new easymidi.Input(midi_in);
var output = new easymidi.Output(midi_out);

//display all midi devices
console.log("Midi IN");
console.log(easymidi.getInputs());
console.log("Midi OUT");
console.log(easymidi.getOutputs());

//Global var
var B1 = 0;
var B2 = 0;
var B3 = 0;
var C1 = 8;
var C2 = 16;
var C3 = 0;
var C4 = 1;

grandmaster_level_indicator();

var interval1 = setInterval(() => {//Speed Master 1 BPM
    if (led_speedmaster1 == 0) {
        led_speedmaster1 = 1;
        output.send('cc', { controller: 45, value: 1, channel: 0 });
    } else {
        led_speedmaster1 = 0;
        output.send('cc', { controller: 45, value: 0, channel: 0 });
    }
}, (60000 / speedmaster1));


var interval2 = setInterval(() => {//Speed Master 2 BPM
    if (led_speedmaster2 == 0) {
        led_speedmaster2 = 1;
        output.send('cc', { controller: 46, value: 1, channel: 0 });
    } else {
        led_speedmaster2 = 0;
        output.send('cc', { controller: 46, value: 0, channel: 0 });
    }
}, (60000 / speedmaster2));
var interval3 = setInterval(() => {//Speed Master 3 BPM
    if (led_speedmaster3 == 0) {
        led_speedmaster3 = 1;
        output.send('cc', { controller: 47, value: 1, channel: 0 });
    } else {
        led_speedmaster3 = 0;
        output.send('cc', { controller: 47, value: 0, channel: 0 });
    }
}, (60000 / speedmaster3));
var interval4 = setInterval(() => {//Speed Master 4 BPM
    if (led_speedmaster4 == 0) {
        led_speedmaster4 = 1;
        output.send('cc', { controller: 48, value: 1, channel: 0 });
    } else {
        led_speedmaster4 = 0;
        output.send('cc', { controller: 48, value: 0, channel: 0 });
    }
}, (60000 / speedmaster4));

var led_speedmaster1 = 3;
var led_speedmaster2 = 3;
var led_speedmaster3 = 3;
var led_speedmaster4 = 3;
var request = 0;
var confirm = 0;
var pageIndex = 0;
var encoder_mode = 0;   //encoder mode 0 = speed masters, 1 = on screen encoder, 2 = user 1, 3 = user 2
var x = 0;
var y = 0;
var buttons = [100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 159];
var array = [240, 71, 127, 67, 101];//sysex
//0xF0, 0x47, 0x7F, 0x43, 0x65, 0x00, 0x40,
array[5] = 2;//hh
array[6] = 0;//ll
array[7] = 0;//index
array[8] = 16;//r
array[9] = 0;//g
array[10] = 0;//b
array[267] = 247;//end

//Speed Master 1 - 4 BPM blink Stop
clearInterval(interval1);
clearInterval(interval2);
clearInterval(interval3);
clearInterval(interval4);

output.send('cc', { controller: 127, value: 0, channel: 0 });//off all led

buttons_brightness();   //control buttons led on


input.on('noteon', function (msg) {
    if (msg.note == 16) {//Encoder 1 touch

        if (encoder_mode == 1 && encoder_pressed == 0) {

            encoder_pressed = 1;

            y = encoder_y;
            x = encoder_1_x;

        }
    }

    else if (msg.note == 17) {//Encoder 2 touch

        if (encoder_mode == 1 && encoder_pressed == 0) {

            encoder_pressed = 2;

            y = encoder_y;
            x = encoder_2_x;

        }
    }


    else if (msg.note == 18) {//Encoder 3 touch

        if (encoder_mode == 1 && encoder_pressed == 0) {

            encoder_pressed = 3;

            y = encoder_y;
            x = encoder_3_x;

        }
    }

    else if (msg.note == 19) {//Encoder 4 touch

        if (encoder_mode == 1 && encoder_pressed == 0) {

            encoder_pressed = 4;

            y = encoder_y;
            x = encoder_4_x;

        }
    }

    else if (msg.note == 25) {//Grand Master encoder click Toggle B.O.

        if (blackout == 0) {
            blackout = 1;
            client.send('{"command":"SpecialMaster 2.1 At 0","session":' + session + ',"requestType":"command","maxRequests":0}');

        } else {
            blackout = 0;
            client.send('{"command":"SpecialMaster 2.1 At ' + grandmaster + '","session":' + session + ',"requestType":"command","maxRequests":0}');
        }
    }

    else if (msg.note == 26) {//select encoder mode

        encoder_mode++;

        if (encoder_mode > 3) {
            encoder_mode = 0;
        }
        buttons_brightness();
    }

    else if (msg.note == 31) {//Brightness +
        if (C2 < 127) {
            C1 = C1 * 2;
            C2 = C2 * 2;
        }

        if (C2 == 128) {
            C2 = 127;
        }
        buttons_brightness();
    }

    else if (msg.note == 32) {//Brightness -

        if (C2 == 127) {
            C2 = 128;
        }

        if (C1 > 1) {
            C1 = C1 * 0.5;
            C2 = C2 * 0.5;
        }
        buttons_brightness();
    }

    else if (msg.note == 33) {//B.O. on
        blackout = 1;
        client.send('{"command":"SpecialMaster 2.1 At 0","session":' + session + ',"requestType":"command","maxRequests":0}');
    }

    else if (msg.note == 34) {//Toggle ExecTime
        if (ExecTime == 0) {
            ExecTime = 1;
            output.send('cc', { controller: 34, value: C4, channel: 0 });
        } else {
            ExecTime = 0;
            output.send('cc', { controller: 34, value: 0, channel: 0 });
        }
        client.send('{"command":"Toggle SpecialMaster 2.3","session":' + session + ',"requestType":"command","maxRequests":0}');
    }

    else if (msg.note == 35) {//Toggle ProgTime
        if (ProgTime == 0) {
            ProgTime = 1;
            output.send('cc', { controller: 35, value: C4, channel: 0 });
        } else {
            ProgTime = 0;
            output.send('cc', { controller: 35, value: 0, channel: 0 });
        }
        client.send('{"command":"Toggle SpecialMaster 2.2","session":' + session + ',"requestType":"command","maxRequests":0}');
    }

    else if (msg.note == 36) {//Page 1
        pageIndex = 0;
        buttons_brightness();
        if (onpc_switch_page == 1) {
            client.send('{"command":"ButtonPage 1","session":' + session + ',"requestType":"command","maxRequests":0}');
        }
    }

    else if (msg.note == 37) {//Page 2
        pageIndex = 1;
        buttons_brightness();
        if (onpc_switch_page == 1) {
            client.send('{"command":"ButtonPage 2","session":' + session + ',"requestType":"command","maxRequests":0}');
        }
    }

    else if (msg.note == 38) {//Page 3
        pageIndex = 2;
        buttons_brightness();
        if (onpc_switch_page == 1) {
            client.send('{"command":"ButtonPage 3","session":' + session + ',"requestType":"command","maxRequests":0}');
        }
    }

    else if (msg.note == 39) {//Page 4
        pageIndex = 3;
        buttons_brightness();
        if (onpc_switch_page == 1) {
            client.send('{"command":"Page 4","session":' + session + ',"requestType":"command","maxRequests":0}');
        }
    }

    else if (msg.note == 44 && shift == 1) {//Shift
        shift = 2;//Rate1 mode
        if (confirm == 0) {
            output.send('cc', { controller: 44, value: 1, channel: 0 });   //Led highlight (shift)
            output.send('cc', { controller: 49, value: 1, channel: 0 });   //Led highlight delete (alt)
            output.send('cc', { controller: 53, value: 2, channel: 0 });   //Led highlight rec
        }
    }

    else if (msg.note == 45) {//Speed Master 1 Learn/Rate1
        if (shift == 2) {
            client.send('{"command":"Rate1 SpecialMaster 3.1","session":' + session + ',"requestType":"command","maxRequests":0}');
        }
        else if (alt == 1) {
            client.send('{"command":"SpecialMaster 3.1 at 0","session":' + session + ',"requestType":"command","maxRequests":0}');
        }
        else {
            client.send('{"command":"Learn SpecialMaster 3.1","session":' + session + ',"requestType":"command","maxRequests":0}');
        }
    }

    else if (msg.note == 46) {//Speed Master 2 Learn/Rate1
        if (shift == 2) {
            client.send('{"command":"Rate1 SpecialMaster 3.2","session":' + session + ',"requestType":"command","maxRequests":0}');
        }
        else if (alt == 1) {
            client.send('{"command":"SpecialMaster 3.2 at 0","session":' + session + ',"requestType":"command","maxRequests":0}');
        }
        else {
            client.send('{"command":"Learn SpecialMaster 3.2","session":' + session + ',"requestType":"command","maxRequests":0}');
        }
    }

    else if (msg.note == 47) {//Speed Master 3 Learn/Rate1
        if (shift == 2) {
            client.send('{"command":"Rate1 SpecialMaster 3.3","session":' + session + ',"requestType":"command","maxRequests":0}');
        }
        else if (alt == 1) {
            client.send('{"command":"SpecialMaster 3.3 at 0","session":' + session + ',"requestType":"command","maxRequests":0}');
        } else {
            client.send('{"command":"Learn SpecialMaster 3.3","session":' + session + ',"requestType":"command","maxRequests":0}');
        }
    }

    else if (msg.note == 48) {//Speed Master 4 Learn/Rate1
        if (shift == 2) {
            client.send('{"command":"Rate1 SpecialMaster 3.4","session":' + session + ',"requestType":"command","maxRequests":0}');
        }
        else if (alt == 1) {
            client.send('{"command":"SpecialMaster 3.4 at 0","session":' + session + ',"requestType":"command","maxRequests":0}');
        }
        else {
            client.send('{"command":"Learn SpecialMaster 3.4","session":' + session + ',"requestType":"command","maxRequests":0}');
        }
    }

    else if (msg.note == 49) {//Delete
        if (cmd == '' && shift == 2) {
            cmd = 'Delete';
            output.send('cc', { controller: 49, value: 2, channel: 0 });   //REC button red
        } else if (alt == 0) {//alt on
            alt = 1;
            output.send('cc', { controller: 49, value: 1, channel: 0 });
        }
    }

    else if (msg.note == 50) {//Save confirm Merge
        if (confirm == 1) {
            client.send('{"requestType":"commandConfirmationResult","result":2,"option":[],"session":' + session + ',"maxRequests":0}'); //Merge
            confirm_off();
        }
    }

    else if (msg.note == 51) {//Save confirm Remove
        if (confirm == 1) {
            client.send('{"requestType":"commandConfirmationResult","result":4,"option":[],"session":' + session + ',"maxRequests":0}'); //Remove
            confirm_off();
        } else {//exec 711
            client.send('{"requestType":"playbacks_userInput","cmdline":"' + cmd + '","execIndex":710,"pageIndex":0,"buttonId":0,"pressed":true,"released":false,"type":0,"session":' + session + ',"maxRequests":0}');
        }
    }

    else if (msg.note == 52) {//Save confirm Overwrite
        if (confirm == 1) {
            client.send('{"requestType":"commandConfirmationResult","result":1,"option":[],"session":' + session + ',"maxRequests":0}'); //Overwrite
            confirm_off();
        } else {//Exec 710
            client.send('{"requestType":"playbacks_userInput","cmdline":"' + cmd + '","execIndex":709,"pageIndex":0,"buttonId":0,"pressed":true,"released":false,"type":0,"session":' + session + ',"maxRequests":0}');
        }
    }

    else if (msg.note == 53) {//REC button
        if (cmd == '' && confirm == 0 && shift == 2) {
            cmd = 'StoreLook';
            output.send('cc', { controller: 53, value: 1, channel: 0 });   //REC button red
        }
        if (cmd == '' && confirm == 0) {
            cmd = 'Store';
            output.send('cc', { controller: 53, value: 1, channel: 0 });   //REC button red
        } else if (confirm == 1) {//Save confirm Create second cue
            client.send('{"requestType":"commandConfirmationResult","result":6,"option":[],"session":' + session + ',"maxRequests":0}'); //Create second cue
            confirm_off();
        }
    }

    else if (msg.note == 69 || msg.note == 85 || msg.note == 101 || msg.note == 117) {// not used

    }

    else if (msg.note >= 54 && msg.note <= 117) {//Executor down
        client.send('{"requestType":"playbacks_userInput","cmdline":"' + cmd + '","execIndex":' + buttons[(msg.note - 54)] + ',"pageIndex":' + pageIndex + ',"buttonId":0,"pressed":true,"released":false,"type":0,"session":' + session + ',"maxRequests":0}');
    }

});


input.on('noteoff', function (msg) {

    if (msg.note == 16 && encoder_pressed == 1 && encoder_mode == 1) {//Encoder touch off
        encoder_pressed = 0;

    }

    else if (msg.note == 17 && encoder_pressed == 2 && encoder_mode == 1) {//Encoder touch off
        encoder_pressed = 0;

    }

    else if (msg.note == 18 && encoder_pressed == 3 && encoder_mode == 1) {//Encoder touch off
        encoder_pressed = 0;

    }

    else if (msg.note == 19 && encoder_pressed == 4 && encoder_mode == 1) {//Encoder touch off
        encoder_pressed = 0;

    }

    else if (msg.note == 33) {
        blackout = 0;
        client.send('{"command":"SpecialMaster 2.1 At ' + grandmaster + '","session":' + session + ',"requestType":"command","maxRequests":0}');
    }

    else if (msg.note >= 36 && msg.note <= 39) {//Page 1

        if (page_flash == 1) {
            pageIndex = 0;
            buttons_brightness();
            if (onpc_switch_page == 1) {
                client.send('{"command":"ButtonPage 1","session":' + session + ',"requestType":"command","maxRequests":0}');
            }
        }
    }

    else if (msg.note == 44 && shift == 2) {
        shift = 1;//Learn mode
        output.send('cc', { controller: 44, value: 2, channel: 0 });   //Learn Rate1
        if (confirm == 0) {
            confirm_off();
        }
    }

    else if (msg.note == 49) {//Delete off led
        if (cmd == 'Delete') {
            cmd = '';
            confirm_off();
        }
        else if (alt == 1) {
            alt = 0;
            output.send('cc', { controller: 49, value: 0, channel: 0 });
        }
    }

    else if (msg.note == 51) {//Exec 711
        if (confirm != 1) {
            client.send('{"requestType":"playbacks_userInput","cmdline":"' + cmd + '","execIndex":710,"pageIndex":0,"buttonId":0,"pressed":false,"released":true,"type":0,"session":' + session + ',"maxRequests":0}');
        }
    }

    else if (msg.note == 52) {//Exec 710
        if (confirm != 1) {
            {
                client.send('{"requestType":"playbacks_userInput","cmdline":"' + cmd + '","execIndex":709,"pageIndex":0,"buttonId":0,"pressed":false,"released":true,"type":0,"session":' + session + ',"maxRequests":0}');
            }
        }
    }

    else if (msg.note == 53) {
        if (cmd == 'Store' || cmd == 'StoreLook') {
            cmd = '';
            if (shift == 2) {
                output.send('cc', { controller: 53, value: 2, channel: 0 });   //REC button yellow
            }

            else {
                output.send('cc', { controller: 53, value: 0, channel: 0 });   //REC button off
            }

        }
    }

    else if (msg.note == 69 || msg.note == 85 || msg.note == 101 || msg.note == 117) {// not used

    }

    else if (msg.note >= 54 && msg.note <= 117) {//Executor up
        client.send('{"requestType":"playbacks_userInput","cmdline":"","execIndex":' + buttons[(msg.note - 54)] + ',"pageIndex":' + pageIndex + ',"buttonId":0,"pressed":false,"released":true,"type":0,"session":' + session + ',"maxRequests":0}');
    }
});


input.on('cc', function (msg) {

    if (msg.controller == 16 || msg.controller == 17 || msg.controller == 18 || msg.controller == 19) {//Encoder rotate

        if (encoder_mode == 0) { //Channel Encoder

            if (msg.value > 60) {
                encodervalue = msg.value - 128;
            } else {
                encodervalue = msg.value;
            }

            if (msg.controller == 16) {//Channel Encoder 1
                client.send('{"command":LUA "gma.canbus.encoder(0,' + encodervalue + ',nil)","session":' + session + ',"requestType":"command","maxRequests":0}');
            }

            else if (msg.controller == 17) {//Channel Encoder 2
                client.send('{"command":LUA "gma.canbus.encoder(1,' + encodervalue + ',nil)","session":' + session + ',"requestType":"command","maxRequests":0}');
            }

            else if (msg.controller == 18) {//Channel Encoder 3
                client.send('{"command":LUA "gma.canbus.encoder(2,' + encodervalue + ',nil)","session":' + session + ',"requestType":"command","maxRequests":0}');
            }

            else if (msg.controller == 19) {//Channel Encoder 4
                client.send('{"command":LUA "gma.canbus.encoder(3,' + encodervalue + ',nil)","session":' + session + ',"requestType":"command","maxRequests":0}');
            }

        }

        else if (encoder_mode == 1) {// MIXER Speed masters

            if (msg.controller == 16) {//SpeedMaster 1
                if (msg.value < 60) {
                    speedmaster1 = speedmaster1 + msg.value;
                } else {
                    speedmaster1 = speedmaster1 + (msg.value - 128)
                }
                if (speedmaster1 < 0) {
                    speedmaster1 = 0;
                }
                client.send('{"command":"SpecialMaster 3.1 At ' + speedmaster1 + '","session":' + session + ',"requestType":"command","maxRequests":0}');
            }

            if (msg.controller == 17) {//SpeedMaster 2
                if (msg.value < 60) {
                    speedmaster2 = speedmaster2 + msg.value;
                } else {
                    speedmaster2 = speedmaster2 + (msg.value - 128)
                }
                if (speedmaster2 < 0) {
                    speedmaster2 = 0;
                }
                client.send('{"command":"SpecialMaster 3.2 At ' + speedmaster2 + '","session":' + session + ',"requestType":"command","maxRequests":0}');
            }

            if (msg.controller == 18) {//SpeedMaster 3
                if (msg.value < 60) {
                    speedmaster3 = speedmaster3 + msg.value;
                } else {
                    speedmaster3 = speedmaster3 + (msg.value - 128)
                }
                if (speedmaster3 < 0) {
                    speedmaster3 = 0;
                }
                client.send('{"command":"SpecialMaster 3.3 At ' + speedmaster3 + '","session":' + session + ',"requestType":"command","maxRequests":0}');
            }

            if (msg.controller == 19) {//SpeedMaster 4
                if (msg.value < 60) {
                    speedmaster4 = speedmaster4 + msg.value;
                } else {
                    speedmaster4 = speedmaster4 + (msg.value - 128)
                }
                if (speedmaster4 < 0) {
                    speedmaster4 = 0;
                }
                client.send('{"command":"SpecialMaster 3.4 At ' + speedmaster4 + '","session":' + session + ',"requestType":"command","maxRequests":0}');
            }
        }

        else if (encoder_mode == 2) {

            if (msg.controller == 16) {//User1 Encoder 1
                if (msg.value < 60) {
                    client.send('{"requestType":"encoder","name":' + user1_encoder1 + ',"value":' + (msg.value) + ',"session":' + session + '","maxRequests":0}');

                } else {
                    client.send('{"requestType":"encoder","name":' + user1_encoder1 + ',"value":' + (msg.value - 128) + ',"session":' + session + '","maxRequests":0}');
                }
            }

            else if (msg.controller == 17) {//User1 Encoder 2
                if (msg.value < 60) {
                    client.send('{"requestType":"encoder","name":' + user1_encoder2 + ',"value":' + (msg.value) + ',"session":' + session + '","maxRequests":0}');

                } else {
                    client.send('{"requestType":"encoder","name":' + user1_encoder2 + ',"value":' + (msg.value - 128) + ',"session":' + session + '","maxRequests":0}');
                }
            }

            else if (msg.controller == 18) {//User1 Encoder 3
                if (msg.value < 60) {
                    client.send('{"requestType":"encoder","name":' + user1_encoder3 + ',"value":' + (msg.value) + ',"session":' + session + '","maxRequests":0}');

                } else {
                    client.send('{"requestType":"encoder","name":' + user1_encoder3 + ',"value":' + (msg.value - 128) + ',"session":' + session + '","maxRequests":0}');
                }
            }
            else if (msg.controller == 19) {//User1 Encoder 4
                if (msg.value < 60) {
                    client.send('{"requestType":"encoder","name":' + user1_encoder4 + ',"value":' + (msg.value) + ',"session":' + session + '","maxRequests":0}');

                } else {
                    client.send('{"requestType":"encoder","name":' + user1_encoder4 + ',"value":' + (msg.value - 128) + ',"session":' + session + '","maxRequests":0}');
                }
            }

        }

        else if (encoder_mode == 3) {

            if (msg.controller == 16) {//User2 Encoder 1
                if (msg.value < 60) {
                    client.send('{"requestType":"encoder","name":' + user2_encoder1 + ',"value":' + (msg.value) + ',"session":' + session + '","maxRequests":0}');

                } else {
                    client.send('{"requestType":"encoder","name":' + user2_encoder1 + ',"value":' + (msg.value - 128) + ',"session":' + session + '","maxRequests":0}');
                }
            }

            else if (msg.controller == 17) {//User2 Encoder 2
                if (msg.value < 60) {
                    client.send('{"requestType":"encoder","name":' + user2_encoder2 + ',"value":' + (msg.value) + ',"session":' + session + '","maxRequests":0}');

                } else {
                    client.send('{"requestType":"encoder","name":' + user2_encoder2 + ',"value":' + (msg.value - 128) + ',"session":' + session + '","maxRequests":0}');
                }
            }

            else if (msg.controller == 18) {//User2 Encoder 3
                if (msg.value < 60) {
                    client.send('{"requestType":"encoder","name":' + user2_encoder3 + ',"value":' + (msg.value) + ',"session":' + session + '","maxRequests":0}');

                } else {
                    client.send('{"requestType":"encoder","name":' + user2_encoder3 + ',"value":' + (msg.value - 128) + ',"session":' + session + '","maxRequests":0}');
                }
            }
            else if (msg.controller == 19) {//User2 Encoder 4
                if (msg.value < 60) {
                    client.send('{"requestType":"encoder","name":' + user2_encoder4 + ',"value":' + (msg.value) + ',"session":' + session + '","maxRequests":0}');

                } else {
                    client.send('{"requestType":"encoder","name":' + user2_encoder4 + ',"value":' + (msg.value - 128) + ',"session":' + session + '","maxRequests":0}');
                }
            }

        }
    }

    else if (msg.controller == 118) {//grand master
        if (msg.value < 60) {
            grandmaster = grandmaster + msg.value;
        } else {
            grandmaster = grandmaster + (msg.value - 128);
        }

        if (grandmaster > 100) {
            grandmaster = 100;
        } else if (grandmaster < 0) {
            grandmaster = 0;
        }

        if (blackout == 0) {//SpecialMaster "grandmaster" . "grand" At
            client.send('{"command":"SpecialMaster 2.1 At ' + grandmaster + '","session":' + session + ',"requestType":"command","maxRequests":0}');
        } else if (blackout == 1) {
            //do nothing
        }
        grandmaster_level_indicator();
    }
});

console.log("Connecting to ma2 ...");

//WEBSOCKET-------------------
client.onerror = function () {

    console.log('Connection Error');

};

client.onopen = function () {

    console.log('WebSocket Client Connected');

    function sendNumber() {

        if (client.readyState === client.OPEN) {
            var number = Math.round(Math.random() * 0xFFFFFF);
            client.send(number.toString());
            setTimeout(sendNumber, 1000);
        }
    }
    //sendNumber();
};

client.onclose = function () {

    console.log('Client Closed');
    output.send('cc', { controller: 127, value: 0, channel: 0 });//off all led
    input.close();
    output.close();
    process.exit();

};

client.onmessage = function (e) {

    if (request >= 11) {
        client.send('{"session":' + session + '}');
        client.send('{"requestType":"getdata","data":"set","session":' + session + ',"maxRequests":1}');
        request = 0;
    }

    if (typeof e.data == 'string') {

        obj = JSON.parse(e.data);

        if (obj.status == "server ready") {
            console.log("SERVER READY");
            client.send('{"session":0}')
        }

        if (obj.forceLogin == true) {
            console.log("LOGIN ...");
            session = (obj.session);
            client.send('{"requestType":"login","username":"akaifire","password":"2c18e486683a3db1e645ad8523223b72","session":' + obj.session + ',"maxRequests":10}')
        }

        if (obj.session == 0) {
            console.log("CONNECTION ERROR");
            client.send('{"session":' + session + '}');
        }

        if (obj.session) {
            if (obj.session == -1) {
                console.log("Please turn on Login Enabled, and add user \"akaifire\" and set password \"remote\"");
                output.send('cc', { controller: 127, value: 0, channel: 0 });//off all
                input.close();
                output.close();
                process.exit();
            } else {
                session = (obj.session);
            }
        }

        if (obj.page) {
            console.log(obj.page);
        }

        if (obj.text) {
            cmd = obj.text;
            if (obj.text == 'Store' || obj.text == 'StoreLook') {
                output.send('cc', { controller: 53, value: 1, channel: 0 });   //REC button led on Red
            }

            else if (obj.text == 'Delete') {
                output.send('cc', { controller: 49, value: 1, channel: 0 });   //REC button led on Red
            }

            else {
                confirm = 1;
                output.send('cc', { controller: 50, value: 1, channel: 0 });   //Merge button led on green
                output.send('cc', { controller: 51, value: 1, channel: 0 });   //Remove button led on green
                output.send('cc', { controller: 52, value: 1, channel: 0 });   //Overwrite button led on yellow
                output.send('cc', { controller: 53, value: 2, channel: 0 });   //Create second cue button led on yellow
            }

            console.log(obj.text);
            text = obj.text;
        }

        if (obj.responseType == "login" && obj.result == true) {
            if (interval_on == 0) {
                interval_on = 1;
                setInterval(interval, 100);//80
            }

            console.log("...LOGGED");
            console.log("SESSION " + session);
            if (onpc_switch_page == 1) {
                client.send('{"command":"ButtonPage 1","session":' + session + ',"requestType":"command","maxRequests":0}');
            }
        }
        else if (obj.responseType == "playbacks") {

            request++;

            BO_led_indicator();

            if (obj.responseSubType == 3) {

                var k = 0;
                var l = 0;
                var key = 0;
                var index = 7;

                for (var k = 0; k < 4; k++) {

                    for (var j = 0; j < 3; j++) {

                        for (i = 0; i < 5; i++) {

                            array[index] = key;
                            if (obj.itemGroups[0].items[l][i].isRun == 1) {
                                array[index + 1] = 0;
                                array[index + 2] = C2;
                                array[index + 3] = 0;
                                if (colors == 1) {
                                    exec_name_color(index, (obj.itemGroups[0].items[l][i].tt.t), 1);
                                } else if (colors == 2) {
                                    apperance_color(index, (obj.itemGroups[0].items[l][i].bdC), 1);
                                }
                            } else if ((obj.itemGroups[0].items[l][i].i.c) == "#000000") {
                                array[index + 1] = 0;
                                array[index + 2] = 0;
                                array[index + 3] = 0;
                            } else {
                                array[index + 1] = C2;
                                array[index + 2] = C1;
                                array[index + 3] = 0;
                                if (colors == 1) {
                                    exec_name_color(index, (obj.itemGroups[0].items[l][i].tt.t), 0);
                                } else if (colors == 2) {
                                    apperance_color(index, (obj.itemGroups[0].items[l][i].bdC), 0);
                                }
                            }

                            index = index + 4;
                            key++;

                        }
                        l++;
                    }
                    array[index] = key;
                    array[index + 1] = B1;
                    array[index + 2] = B2;
                    array[index + 3] = B3;
                    index = index + 4;
                    key++;
                }

                output.send('sysex', array);    //send led data to midi



                //Speed Master led control
                if (obj.itemGroups[0].items[12][0].tt.t == "Spd 1") {//led interval BPM
                    if (led_speedmaster1 == 3) {//if correct Speed Master is stored -> led yellow
                        led_speedmaster1 = 0;
                        output.send('cc', { controller: 45, value: 2, channel: 0 });// led yellow
                    }

                    if (speedmaster1 != parseFloat(obj.itemGroups[0].items[12][0].cues.items[0].t)) {   //check change speed
                        if ((obj.itemGroups[0].items[12][0].cues.items[0].t) == "Stop") {   //set speed master at 0 - oFF
                            speedmaster1 = 0;
                        } else {
                            speedmaster1 = parseFloat(obj.itemGroups[0].items[12][0].cues.items[0].t); //read speed from dot2 and set to val
                        }

                        clearInterval(interval1);   //stop interval
                        output.send('cc', { controller: 45, value: 2, channel: 0 });// led yellow

                        if (speedmaster1 != 60 && speedmaster1 != 0) {//if speed != 0 and 60 -> turn on interval and blink led
                            interval1 = setInterval(() => {
                                if (led_speedmaster1 == 0) {
                                    led_speedmaster1 = 1;
                                    output.send('cc', { controller: 45, value: 2, channel: 0 });// led yellow
                                } else {
                                    led_speedmaster1 = 0;
                                    output.send('cc', { controller: 45, value: 0, channel: 0 });// led off
                                }
                            }, (30000 / speedmaster1));
                        } else if (speedmaster1 == 0) { //if speed = 0 (Stop) - set led to red
                            output.send('cc', { controller: 45, value: 1, channel: 0 });// led red
                        }
                    }
                }

                if (obj.itemGroups[0].items[12][1].tt.t == "Spd 2") {//led interval BPM
                    if (led_speedmaster2 == 3) {//if correct Speed Master is stored -> led yellow
                        led_speedmaster2 = 0;
                        output.send('cc', { controller: 46, value: 2, channel: 0 });// led yellow
                    }

                    if (speedmaster2 != parseFloat(obj.itemGroups[0].items[12][1].cues.items[0].t)) {   //check change speed
                        if ((obj.itemGroups[0].items[12][1].cues.items[0].t) == "Stop") {   //set speed master at 0 - oFF
                            speedmaster2 = 0;
                        } else {
                            speedmaster2 = parseFloat(obj.itemGroups[0].items[12][1].cues.items[0].t); //read speed from dot2 and set to val
                        }

                        clearInterval(interval2);   //stop interval
                        output.send('cc', { controller: 46, value: 2, channel: 0 });// led yellow

                        if (speedmaster2 != 60 && speedmaster2 != 0) {//if speed != 0 and 60 -> turn on interval and blink led
                            interval2 = setInterval(() => {
                                if (led_speedmaster2 == 0) {
                                    led_speedmaster2 = 1;
                                    output.send('cc', { controller: 46, value: 2, channel: 0 });// led yellow
                                } else {
                                    led_speedmaster2 = 0;
                                    output.send('cc', { controller: 46, value: 0, channel: 0 });// led off
                                }
                            }, (30000 / speedmaster2));
                        } else if (speedmaster2 == 0) { //if speed = 0 (Stop) - set led to red
                            output.send('cc', { controller: 46, value: 1, channel: 0 });// led red
                        }
                    }
                }

                if (obj.itemGroups[0].items[12][2].tt.t == "Spd 3") {//led interval BPM
                    if (led_speedmaster3 == 3) {//if correct Speed Master is stored -> led yellow
                        led_speedmaster3 = 0;
                        output.send('cc', { controller: 47, value: 2, channel: 0 });// led yellow
                    }

                    if (speedmaster3 != parseFloat(obj.itemGroups[0].items[12][2].cues.items[0].t)) {   //check change speed
                        if ((obj.itemGroups[0].items[12][2].cues.items[0].t) == "Stop") {   //set speed master at 0 - oFF
                            speedmaster3 = 0;
                        } else {
                            speedmaster3 = parseFloat(obj.itemGroups[0].items[12][2].cues.items[0].t); //read speed from dot2 and set to val
                        }

                        clearInterval(interval3);   //stop interval
                        output.send('cc', { controller: 47, value: 2, channel: 0 });// led yellow

                        if (speedmaster3 != 60 && speedmaster3 != 0) {//if speed != 0 and 60 -> turn on interval and blink led
                            interval3 = setInterval(() => {
                                if (led_speedmaster3 == 0) {
                                    led_speedmaster3 = 1;
                                    output.send('cc', { controller: 47, value: 2, channel: 0 });// led yellow
                                } else {
                                    led_speedmaster3 = 0;
                                    output.send('cc', { controller: 47, value: 0, channel: 0 });// led off
                                }
                            }, (30000 / speedmaster3));
                        } else if (speedmaster3 == 0) { //if speed = 0 (Stop) - set led to red
                            output.send('cc', { controller: 47, value: 1, channel: 0 });// led red
                        }
                    }
                }

                if (obj.itemGroups[0].items[12][3].tt.t == "Spd 4") {//led interval BPM
                    if (led_speedmaster4 == 3) {//if correct Speed Master is stored -> led yellow
                        led_speedmaster4 = 0;
                        output.send('cc', { controller: 48, value: 2, channel: 0 });// led yellow
                    }

                    if (speedmaster4 != parseFloat(obj.itemGroups[0].items[12][3].cues.items[0].t)) {   //check change speed
                        if ((obj.itemGroups[0].items[12][3].cues.items[0].t) == "Stop") {   //set speed master at 0 - oFF
                            speedmaster4 = 0;
                        } else {
                            speedmaster4 = parseFloat(obj.itemGroups[0].items[12][3].cues.items[0].t); //read speed from dot2 and set to val
                        }

                        clearInterval(interval4);   //stop interval
                        output.send('cc', { controller: 48, value: 2, channel: 0 });// led yellow

                        if (speedmaster4 != 60 && speedmaster4 != 0) {//if speed != 0 and 60 -> turn on interval and blink led
                            interval4 = setInterval(() => {
                                if (led_speedmaster4 == 0) {
                                    led_speedmaster4 = 1;
                                    output.send('cc', { controller: 48, value: 2, channel: 0 });// led yellow
                                } else {
                                    led_speedmaster4 = 0;
                                    output.send('cc', { controller: 48, value: 0, channel: 0 });// led off
                                }
                            }, (30000 / speedmaster4));
                        } else if (speedmaster4 == 0) { //if speed = 0 (Stop) - set led to red
                            output.send('cc', { controller: 48, value: 1, channel: 0 });// led red
                        }
                    }
                }
            }
        }
    }
};

//interval send data to server function
function interval() {
    if (session > 0) {
        client.send('{"requestType":"playbacks","startIndex":[100],"itemsCount":[90],"pageIndex":' + pageIndex + ',"itemsType":[3],"view":3,"execButtonViewMode":2,"buttonsViewMode":0,"session":' + session + ',"maxRequests":1}');
    }
}

function exec_name_color(index, execname, isRun) {//colors

    if (execname == "White") {
        array[index + 1] = C2;
        array[index + 2] = C2;
        array[index + 3] = C2;
    } else if (execname == "Red") {
        array[index + 1] = C2;
        array[index + 2] = 0;
        array[index + 3] = 0;
    } else if (execname == "Orange") {
        array[index + 1] = C2;
        array[index + 2] = C1;
        array[index + 3] = 0;
    } else if (execname == "Yellow") {
        array[index + 1] = C2;
        array[index + 2] = C2;
        array[index + 3] = 0;
    } else if (execname == "Fern Green") {
        array[index + 1] = C1;
        array[index + 2] = C2;
        array[index + 3] = 0;
    } else if (execname == "Green") {
        array[index + 1] = 0;
        array[index + 2] = C2;
        array[index + 3] = 0;
    } else if (execname == "Sea Green") {
        array[index + 1] = 0;
        array[index + 2] = C2;
        array[index + 3] = C1;
    } else if (execname == "Cyan") {
        array[index + 1] = 0;
        array[index + 2] = C2;
        array[index + 3] = C2;
    } else if (execname == "Lavender") {
        array[index + 1] = 0;
        array[index + 2] = C1;
        array[index + 3] = C2;
    } else if (execname == "Blue") {
        array[index + 1] = 0;
        array[index + 2] = 0;
        array[index + 3] = C2;
    } else if (execname == "Violet") {
        array[index + 1] = C1;
        array[index + 2] = 0;
        array[index + 3] = C2;
    } else if (execname == "Magenta") {
        array[index + 1] = C2;
        array[index + 2] = 0;
        array[index + 3] = C2;
    } else if (execname == "Pink") {
        array[index + 1] = C2;
        array[index + 2] = 0;
        array[index + 3] = C1;
    } else if (execname == "Grey") {
        array[index + 1] = C1;
        array[index + 2] = C1;
        array[index + 3] = C1;
    } else if (execname == "CTO") {
        array[index + 1] = C2;
        array[index + 2] = C2;
        array[index + 3] = C2 - C1;
    } else if (execname == "CTB") {
        array[index + 1] = C2 - C1;
        array[index + 2] = C2;
        array[index + 3] = C2;
    } else if (execname == "Deep Red") {
        array[index + 1] = C1;
        array[index + 2] = 0;
        array[index + 3] = 0;
    } else if (execname == "Black") {
        array[index + 1] = 0;
        array[index + 2] = 0;
        array[index + 3] = 0;
    }

    if (isRun == 1 && blink == 1 && request < 6) {//Blink

        array[index + 1] = 0;
        array[index + 2] = 0;
        array[index + 3] = 0;

    }

    return;
}

function apperance_color(index, bdC, isRun) {//colors


    // Conversion of color to RGB components
    var red = parseInt(bdC.slice(1, 3), 16) / 2; // Extracting the red component
    var green = parseInt(bdC.slice(3, 5), 16) / 2; // Extracting the green component
    var blue = parseInt(bdC.slice(5, 7), 16) / 2; // Extracting the blue component

    //console.log(C1);

    // Writing RGB components to the array
    array[index + 1] = red; // Red component
    array[index + 2] = green; // Green component
    array[index + 3] = blue; // Blue component




    if (isRun == 1 && blink == 1 && request < 6) {//Blink

        array[index + 1] = 0;
        array[index + 2] = 0;
        array[index + 3] = 0;

    }

    return;
}

function buttons_brightness() {

    output.send('cc', { controller: 27, value: (encoder_mode), channel: 0 });   //encoder_mode led

    if (C2 > 16) {//led buttons brightness hi 
        C3 = 4; //Led green hi
        C4 = 2; //GM led Hi
    }

    else if (C2 <= 16) {//led button brightness low
        C3 = 2; //Led Green low
        C4 = 1;
    }

    if (C2 == 64) {
        C3 = 1; // Red low
    } else if (C2 == 127) {
        C3 = 3; // Red Hi
    }

    output.send('cc', { controller: 31, value: C4, channel: 0 });   //button up
    output.send('cc', { controller: 32, value: C4, channel: 0 });   //utton down
    output.send('cc', { controller: 33, value: C4, channel: 0 });   //B.O.
    output.send('cc', { controller: 36, value: C4, channel: 0 });   //button page 1
    output.send('cc', { controller: 37, value: C4, channel: 0 });   //button page 2
    output.send('cc', { controller: 38, value: C4, channel: 0 });   //button page 3
    output.send('cc', { controller: 39, value: C4, channel: 0 });   //button page 4

    if (ExecTime == 1) {//ExecTime led
        output.send('cc', { controller: 34, value: C4, channel: 0 });
    } else {
        output.send('cc', { controller: 34, value: 0, channel: 0 });
    }

    if (ProgTime == 1) {//ProgTime led
        output.send('cc', { controller: 35, value: C4, channel: 0 });
    } else {
        output.send('cc', { controller: 35, value: 0, channel: 0 });
    }

    if (pageIndex == 0) {//page led
        output.send('cc', { controller: 40, value: C3, channel: 0 });   //page 1 led
    } else {
        output.send('cc', { controller: 40, value: 0, channel: 0 });    //off
    }

    if (pageIndex == 1) {
        output.send('cc', { controller: 41, value: C3, channel: 0 });   //page 2 led
    } else {
        output.send('cc', { controller: 41, value: 0, channel: 0 });
    }

    if (pageIndex == 2) {
        output.send('cc', { controller: 42, value: C3, channel: 0 });   //page 3 led
    } else {
        output.send('cc', { controller: 42, value: 0, channel: 0 });
    }

    if (pageIndex == 3) {
        output.send('cc', { controller: 43, value: C3, channel: 0 });   //page 3 led
    } else {
        output.send('cc', { controller: 43, value: 0, channel: 0 });
    }

    if (shift == 1) {
        output.send('cc', { controller: 44, value: 2, channel: 0 }); //Learn Rate1 + Shift Led
    }
}

function confirm_off() {

    if (shift == 2) {
        output.send('cc', { controller: 49, value: 1, channel: 0 });   //Learn Rate1
        output.send('cc', { controller: 53, value: 2, channel: 0 });   //Learn Rate1
    }

    else {
        cmd = '';
        confirm = 0;
        output.send('cc', { controller: 49, value: 0, channel: 0 });   //Off led
        output.send('cc', { controller: 50, value: 0, channel: 0 });   //Off led
        output.send('cc', { controller: 51, value: 0, channel: 0 });   //Off led
        output.send('cc', { controller: 52, value: 0, channel: 0 });   //Off led
        output.send('cc', { controller: 53, value: 0, channel: 0 });   //Off led
    }
}

function BPM_Led_speedmaster1() {
    if (led_speedmaster1 == 0) {
        led_speedmaster1 = 1;
        output.send('cc', { controller: 45, value: 1, channel: 0 });
    } else {
        led_speedmaster1 = 0;
        output.send('cc', { controller: 45, value: 0, channel: 0 });
    }
}

function BO_led_indicator() {

    if (blackout == 1 && request < 6 || grandmaster < 100 && request < 6) {//Blink

        output.send('cc', { controller: 33, value: 0, channel: 0 });   //B.O.

    }

    else {
        output.send('cc', { controller: 33, value: C4, channel: 0 });   //B.O.}
    }

    return;
}

function grandmaster_level_indicator() {

    if (grandmaster_level == 1){
        B1 = grandmaster;
        B2 = grandmaster;
        B3 = grandmaster;
    } else if (grandmaster_level == 2){

        [B1, B2, B3] = grandmaster_color_indicator(grandmaster);
        //console.log(`grandmaster = ${grandmaster}, B1 = ${B1}, B2 = ${B2}, B3 = ${B3}`);
    }

    return;
}

function grandmaster_color_indicator(grandmaster) {
    if (grandmaster === 0) {
        return [0, 0, 0];
    }

    const hue = (1 - grandmaster / 100) * 240;
    const rgb = hsvToRgb(hue / 360, 1, 1);
    const B1 = Math.round(rgb[0] * 127);
    const B2 = Math.round(rgb[1] * 127);
    const B3 = Math.round(rgb[2] * 127);

    return [B1, B2, B3];
}

// Funkcja konwertująca HSV na RGB
function hsvToRgb(h, s, v) {
    let r, g, b, i, f, p, q, t;
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return [r, g, b];
}



