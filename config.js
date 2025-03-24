// CONFIG | CUSTOMIZE EVERYTHING IN HERE:


// FRONT END

const dashboardname = 'System Dashboard'
const laglock = true // Disables values under 1 in realtime sync to prevent massive fps drops
const allowwatermark = true // Please do not disable this if you want to help us :)

// BACK END

const DefaultPort = 2453; // You can set your default port here
const requirepassword = true; // Require password to get into the dashboard
const defaultpassword = "admin"; // If require password is true
const defaultusername = "admin"; // If require password is true



// FOR MORE CHECK: https://github.com/Houloude9IOfficial





// NOT AVAILABLE
//const iplogs = true; // IP LOGGING (Can slightly reduce performance)
//const consoleMenu = true; // Custom menu for the server




// DO NOT MODIFY
module.exports = {
    DefaultPort: DefaultPort, // You can set your default port here
    requirepassword: requirepassword, // Require password to get into the dashboard
    defaultpassword: defaultpassword, // If require password is true
    defaultusername: defaultusername, // If require password is true
    //consoleMenu: consoleMenu,    // Set to true to enable the console menu
    //iplogs: iplogs,          // Set to true to enable IP logging
    serverName: dashboardname // Optional: Set a name for your server
};