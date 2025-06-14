// CONFIG | CUSTOMIZE EVERYTHING IN HERE:



// READ THIS:
// index.html is ready for backend use, for frontend use public.html and configure the variables at the top of the page

// FRONT END

const dashboardname = 'System Dashboard';

const default_theme = 'light'; // or 'dark'

const show_welcome_message = true

const laglock = true; // Disables values under 1 in real-time sync to prevent massive FPS drops

const allowwatermark = false; // Please do not disable this if you want to help us :)


// BACK END

const allow_logs = true; // Enables or disables logging

const PrivateDefaultPort = 2453; // Default private port
const PublicDefaultPort = 9998; // Default public port

const PrivateWWSPort = 2454; // Default private websocket port
const PublicWWSPort = 9999; // Default public websocket port

const requirelogin = true; // Requires login to access the dashboard
const defaultpassword = "admin"; // Used if requirepassword is true
const defaultusername = "admin"; // Used if requirepassword is true



// FOR MORE CHECK: https://github.com/Houloude9IOfficial




















// NOT AVAILABLE
//const iplogs = true; // IP LOGGING (Can slightly reduce performance)
//const consoleMenu = true; // Custom menu for the server

// DO NOT MODIFY
module.exports = {
    PrivateWWSPort: PrivateWWSPort,
    PublicWWSPort: PublicWWSPort,
    DefaultPort: PrivateDefaultPort, // You can set your default port here
    requirepassword: requirelogin, // Require password to get into the dashboard
    defaultpassword: defaultpassword, // If require password is true
    defaultusername: defaultusername, // If require password is true
    //consoleMenu: consoleMenu,    // Set to true to enable the console menu
    //iplogs: iplogs,          // Set to true to enable IP logging
    serverName: dashboardname, // Optional: Set a name for your server
    allowwatermark: allowwatermark,
    laglock: laglock,
    default_theme: default_theme,
    PublicDefaultPort: PublicDefaultPort,
    log: allow_logs,
    show_welcome_message: show_welcome_message,
};