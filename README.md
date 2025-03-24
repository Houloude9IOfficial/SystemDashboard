
# System Monitoring Dashboard

  

A Simple Dashboard For System Stats

  

## Features

### Status Categories

  

- CPU (Usage)

- GPU (Core Usage/VRAM Usage)

- RAM (Usage)

- Storage (Used/Free)

- Network (Traffic)

  

### Customization

  

- Color customization (Blue, Orange, Purple, Pink, Green)

- Theme customization (Dark, Light)

  

### Functionalities

  

- Login System (Optional)

- Performance Settings

- Port Preference (Localhost)

- Realtime Sync

- Smooth Animations

  
## Installation
### Localhost

Open the folder that contains the following:

 1. server.js
 2. index.html
 3. config.js

##### Visual Studio Code

 1. Open the folder in **VSCODE**
 2. Open the terminal (**CTRL+SHIFT+`**)
 3. In the terminal write start the server using: `node server.js`
 4. Once it says `Server running on port: {YourPort}` open the index.html in your browser using another server or as a local file
 5. It may prompt you to login using a password and a username, they are in the `config.js` file. (Default values are `admin` for both)
 6. Once you login it will show you all the stats for your system

## Requirements

### Localhost

Operating System: Windows 10+

You must have [Node.js](https://nodejs.org) installed on your system

  

npm install express cors diskusage

  

## Other

This simple dashboard is 100% free and customizable to your own needs.

For now, the GPU chart is only available for NVIDIA and AMD GPUs (AMD has NOT been tested!). If you have an NVIDIA GPU, make sure `nvidia-smi` is installed.

## Credits

 - Icons: [fontawesome.com](https://fontawesome.com/)
 - Status Data: [NVIDIA](https://www.nvidia.com), [NPM](https://www.npmjs.com), [Express.js](https://expressjs.com), [Chart.js](https://www.chartjs.org)

***Developed by [Houloude9](https://github.com/Houloude9IOfficial)***

***