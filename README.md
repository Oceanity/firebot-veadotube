# Veadotube Integration by Oceanity <sub style="color:gray">v0.5.0</sub>

This is a Firebot Script that will allow you to integrate Veadotube functionality and information into your Firebot setup.

1. [Setup](#Setup)
2. [Features](#Features)

<div id="Setup" />

### Setup

- Download the latest (currently 2.0a) version of [Veadotube](https://veado.tube/)
- In Veadotube, click `program settings` (icon with a cursor on it) and set the `server address` field to ensure the IP address and port do not change when program is reopened
  - To serve locally, set it to something like `127.0.0.1:65456` (if the port has issues, just change it to another 5 digit number)
- In Firebot, go to Settings > Scripts
  - Enable Custom Scripts if they are not currently enabled
  - Click Manage Startup Scripts
  - Click Add New Script
  - Click the "scripts folder" link to open the Scripts Folder and place `oceanityVeadotube.js` there
  - Refresh the list of scripts and pick `oceanityVeadotube.js` from the dropdown
  - In Server Address field, type the Server Address you set in the first step
  - In the Instance Type field, type `mini`, `live`, or `editor` based on the type of Veadotube you are using
- You should now have the ability to use this script's Effects, Events and Replace Variables in Firebot

### Updating

- Overwrite existing `oceanityVeadotube.js` with new version
- Restart Firebot

<div id="Features" />

### Features

This script adds the following features to Firebot

- Effects
  - Veadotube Change State
    - Changes active Veadotube State from a dropdown list, by name through a string or replace variable, or randomly

- Replace Variables
  - `$veadotubeState`: `string`
    - Outputs the name of the current State

- Events
  - Veadotube State Changed
    - `$veadotubeState` will reflect the new form if used in the Event
