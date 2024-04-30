# ma2akaifire v 1.0 by ArtGateOne


Hello everyone - I've finally written the code version for controlling Grand MA2 software using the Akai Fire MIDI controller. It's a quite handy and sturdy controller, and although it doesn't have sliders, it has many buttons that can illuminate in full color and several encoders, which are very useful for programming shows.

The program (code) is written and generated for Node.js version 14.17 - so make sure to install this version to ensure everything works correctly.

The program connects via a web remote interface - so make sure to enable "Login Enabled" in the global settings and add a new user named "akaifire" with the password "remote".

Once you have set up your MA2 (remember not to select your controller in the MIDI settings - otherwise, my code won't be able to control it), proceed with the installation and launch...

First, download and install Node.js version 14.17 from this link ....--> https://nodejs.org/dist/v14.17.0/node-v14.17.0-x64.msi

From GitHub, download the entire archive (ZIP) and then extract everything to any location (the archive contains a demo show - for MA2, you can copy it to ProgramData......, or to your USB drive - you surely know how to do it)

Once you have installed Node.js, open the folder with my code, and in the file properties, change the program that runs this file to node.exe from the nodejs folder in Program Files.

Once you change it, the icon should change to green.

Now, simply double-click to run the code - everything is already set up and automated.

By editing my code in Notepad, you can change some parameters - such as color display mode and how to switch pages, or control onpc pages from the MIDI controller.

-----

By default, encoders control onpc encoders. The switch on the left side (mode) allows you to select three more working modes, MIXER - controls speed master 1 - 4, the other modes user1 and user 2 - control user attributes (you can change them in the code) - by default, it's PAN TILT FOCUS ZOOM, and COLORS RED GREEN BLUE WHITE.

The switches on the left side allow you to switch between 4 pages 1-4.

The buttons in the middle control our executors (Action Buttons) - you can set them arbitrarily - as TOGGLE, FLASH, TEMP, SWOP, etc. (not all modes are available via web remote - e.g., GO TO :( )

Remember not to set more ROWS for the executor - it will cause the program not to work.

At the top of the controller, there are UP DOWN buttons - which allow you to change brightness. This works in color modes 0 and 1; in color mode 2 - brightness and color are controlled directly from ma2 via Apperance.

If you prepare your file as in the demo - i.e., place speed masters in executors 161 162 163 164 - you will be able to control them with the bottom controls (if the speed master is stopped - the control light is red, if it's set to default 60 - the control light is yellow - if the speed is different - the control light will blink according to the BPM tempo.

By pressing the controls - you increase the speed master tempo - so it's very convenient - and additionally, you can control it smoothly from the encoder mode (in mixer mode)

Holding down the ACCENT or ALT key - you can set the default value for the Speed master or stop it...

-----

The button at the top with the encoder is the Grand Master control - You can press the encoder - it's turning on BO in toggle mode (although BO is active - you can set the grand master to a different value - which will be set after turning off BO), The button next to the encoder - allows you to turn on BO in flash mode (allows you to release locked BO in toggle mode). If the grand master is at 100% - the control light is red - and if the grand master is below 100 or BO is turned on - the control light is blinking.

The buttons at the top right are Toggles for Exec Time and Prog Time - they are not synchronized with the program - so be careful what you have enabled at startup - so they don't confuse you during work.

-----

There is also the option to save Executor from the controller - it's an additional option and may not be as convenient as doing it on the screen or console - but it speeds up work.

If you already have a scene selected in the programmer - press and hold the REC key, and click any executor. The scene should be saved..
If the executor you're trying to save the scene to is not empty, four controls on the right side will light up in different colors. This is confirmation of the save (as in the console) - so you choose whether to [MERGE, REMOVE, OVERWRITE, CREATE SECOND CUE) - at least that's how it works in the dot2 version - unfortunately, I haven't tested this option in the MA2 version.

There is an option to save STORE LOOK - Press and hold ACCNET - press and hold REC - click on the executor.

There is an option to delete executors - Hold ACCENT and ALT - and select the Executor. (if it's running - you may get a prompt to confirm the operation - controls on the bottom right will appear)

And that's it! The code is free! Enjoy testing!


If the save and delete function doesn't work well for you, simply don't use it and just control your show with Akai Fire - which automatically illuminates active controls! :D

There is an option to save STORE LOOK - Press and hold ACCNET - press and hold REC - click on the executor.

There is an option to delete executors - Hold ACCENT and ALT - and select the Executor. (if it's running - you may get a prompt to confirm the operation - controls on the bottom right will appear)

And that's it! The code is free! Enjoy testing!


-------
I've recorded a video on how to do it - there was even a problem because I connected the controller to another computer and it wasn't visible in the system :D but you'll see how to check what error occurred from the CMD - it's very simple.

In my repositories, you'll find other versions of this code - for MA2 and dot2 systems - for different controllers (Akai APC Mini - basic and Mk2 versions, BCF2000, Akai APC20, Midicon, etc.)

https://www.youtube.com/watch?v=39BKf5KaMmI

----

Oh, one more important thing - three color display modes for executors.

You can change this by editing the file in Notepad.

colors = 1; //auto color executor 0 = off, 1 = on (color from executor Name), 2 = on (color from appearance - brightness)

colors = 0;
This mode where executors are clear - not illuminated - saved executor is orange - running executor is green.

colors = 1;
The program recognizes color names - if you give the executor a name like Red, Green, or Fern Green (colors from the MA2 table) - the executor will automatically change color.

colors = 2;
Colors are generated automatically based on your Appearance in the executor.

Other settings:

blink = 0; //blink run executor 0 = off, 1 = on (blink works only when colors mode is on)
page_flash = 0; // 0=off (normal switch pages), 1=on (click and hold page button to select page, when release button - back to page 1);
onpc_switch_page = 1; //switch page on PC from Akai 0 = off, 1 = on
grandmaster_level = 1; //display grandmaster level 0 = off, 1 = white, 2 = hue

I think it's clear - everything is in the descriptions!

If u have problem with rum my code - u can contact with Me wia FB page https://www.facebook.com/ArtGate512/

I can help wia AnyDesk

ps: code not work with old MA2 software 3.1.2.5 !
