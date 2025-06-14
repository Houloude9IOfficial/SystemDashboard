const express = require("express");
const WebSocket = require('ws');
const http = require('http');
const cors = require("cors");
const os = require("os");
const fs = require("fs");
const { execSync } = require("child_process");
const diskusage = require("diskusage");
const { color } = require('./custom/colors.js')
const { getparttext } = require('./custom/get_part.js')
const errors = require('./custom/errors.js');
const { on } = require("events");
const { json } = require("stream/consumers");
console.clear()

let config;
try {
    config = require("./config.js");

    if (config.log === false) {
        const originalLog = console.log;

        console.log = function(message, ...optionalParams) {
            if (typeof message === 'string' && message.includes("Server running on port:")) {
                originalLog.call(console, message, ...optionalParams);
            }
        };
    }

} catch (err) {
    console.error("Failed to load config file:", err);
    process.exit(1);
}

const getErrorByCode = (code) => errors.find(e => e.code === code);

console.log(getparttext(`Welcome to ${config.serverName}`, null));
console.log(getparttext(`Server version: ${require('./package.json').version}`, null));
console.log(getparttext('Starting server...', undefined));



const PORT = config.DefaultPort;
const PPORT = config.PublicDefaultPort;
const requirepassword = config.requirepassword;

console.log(getparttext(requirepassword ? 'Password is required for access.' : 'No password required for access.', undefined));

const app = express();
const public = express();

const privateserver = http.createServer(app);
const privatewss = new WebSocket.Server({ port: config.PrivateWWSPort });

const publicserver = http.createServer(public);
const publicwss = new WebSocket.Server({ port: config.PublicWWSPort });

app.use(cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
}));

public.use(cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
}));

privatewss.on('connection', (ws) => {
  let authenticated = !requirepassword;

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);

      if (!authenticated) {
        const { username, password } = data;

        if (username === config.defaultusername && password === config.defaultpassword) {
          authenticated = true;
          ws.send(JSON.stringify({ success: true, report: generateSystemReport() }));
        } else {
          ws.send(JSON.stringify({ error: getErrorByCode(401) }));
          ws.close();
        }

      } else {
        if (data.request === "refresh") {
          ws.send(JSON.stringify({ report: generateSystemReport() }));
        }
      }

    } catch (e) {
      ws.send(JSON.stringify({ error: "Invalid message format" }));
    }
  });
});

publicwss.on('connection', (ws) => {
  let authenticated = !requirepassword;

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);

      if (!authenticated) {
        const { username, password } = data;

        if (username === config.defaultusername && password === config.defaultpassword) {
          authenticated = true;
          ws.send(JSON.stringify({ success: true, report: generateSystemReport() }));
        } else {
          ws.send(JSON.stringify({ error: getErrorByCode(401) }));
          ws.close();
        }

      } else {
        if (data.request === "refresh") {
          ws.send(JSON.stringify({ report: generateSystemReport() }));
        }
      }

    } catch (e) {
      ws.send(JSON.stringify({ error: "Invalid message format" }));
    }
  });
});

app.use(express.json());
public.use(express.json());

const getSystemUsage = () => {
    const cpus = os.cpus();
    let totalIdle = 0, totalTick = 0;
    
    cpus.forEach((cpu) => {
        for (let type in cpu.times) {
            totalTick += cpu.times[type];
        }
        totalIdle += cpu.times.idle;
    });
    
    return 1 - totalIdle / totalTick;
};

const getRamUsage = () => {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    return ((totalMem - freeMem) / totalMem) * 100;
};

let lastRxBytes = 0;
let lastTxBytes = 0;
let currentRxBytes = 0;
let currentTxBytes = 0;

const getWindowsNetworkStats = () => {
    try {
        const command = `Get-NetAdapterStatistics | Select-Object Name,ReceivedBytes,SentBytes | ConvertTo-Json`;
        const result = execSync(`powershell -Command "${command}"`, { encoding: 'utf-8' });
        const adapters = JSON.parse(result);
        
        let totalRx = 0;
        let totalTx = 0;
        
        adapters.forEach(adapter => {
            totalRx += adapter.ReceivedBytes;
            totalTx += adapter.SentBytes;
        });
        
        return { totalRx, totalTx };
    } catch (error) {
        console.error("Error getting network stats:", error);
        return { totalRx: 0, totalTx: 0 };
    }
};

const updateNetworkStats = () => {
    lastRxBytes = currentRxBytes;
    lastTxBytes = currentTxBytes;
    
    const stats = getWindowsNetworkStats();
    currentRxBytes = stats.totalRx;
    currentTxBytes = stats.totalTx;
};

setInterval(updateNetworkStats, 1000);
updateNetworkStats();

const getNetworkUsage = () => {
    return {
        totalReceived: (currentRxBytes - lastRxBytes) / 1024,
        totalSent: (currentTxBytes - lastTxBytes) / 1024
    };
};

const getGpuUsage = () => {
    try {
        try {
            const nvidiaInfo = execSync(
                'nvidia-smi --query-gpu=utilization.gpu,memory.used,memory.total,temperature.gpu,name --format=csv,noheader,nounits'
            ).toString().trim();

            if (nvidiaInfo) {
                const [utilization, memUsed, memTotal, temp, name] = nvidiaInfo.split(', ').map(item => item.trim());
                return {
                    type: 'nvidia',
                    name: name,
                    gpu_usage: parseInt(utilization),
                    gpu_mem_used: parseInt(memUsed),
                    gpu_mem_total: parseInt(memTotal),
                    gpu_temp: parseInt(temp)
                };
            }
        } catch {}

        try {
            const amdInfo = execSync('amd-cli --stats').toString().trim();
            if (amdInfo) {
                const lines = amdInfo.split('\n');
                const utilization = lines.find(line => line.includes('GPU Usage')).split(':')[1].trim().replace('%', '');
                const temp = lines.find(line => line.includes('Temperature')).split(':')[1].trim().replace('°C', '');
                const memLine = lines.find(line => line.includes('Memory Usage'));
                const [memUsed, memTotal] = memLine.split(':')[1].trim().split('/').map(s => s.trim().replace('MB', ''));
                return {
                    type: 'amd',
                    name: 'AMD GPU',
                    gpu_usage: parseInt(utilization),
                    gpu_mem_used: parseInt(memUsed),
                    gpu_mem_total: parseInt(memTotal),
                    gpu_temp: parseInt(temp)
                };
            }
        } catch {}

        try {
            const amdInfo = execSync(
                'rocm-smi --showuse --showtemp --showmemuse --json'
            ).toString().trim();
            if (amdInfo) {
                const info = JSON.parse(amdInfo);
                const card = info.card0 || info.card1 || {};
                return {
                    type: 'amd',
                    name: card['Card SKU'] || 'AMD GPU',
                    gpu_usage: parseInt(card['GPU use (%)'] || 0),
                    gpu_mem_used: parseInt(card['Memory use (MB)'] || 0),
                    gpu_mem_total: parseInt(card['Memory size (MB)'] || 0),
                    gpu_temp: parseInt(card['Temperature (Sensor edge) (C)'] || 0)
                };
            }
        } catch {}

        return null;
    } catch (err) {
        console.error("Error getting GPU info:", err);
        return null;
    }
};

const getDiskUsage = () => {
    try {
        const disk = diskusage.checkSync("/");
        const usedDisk = disk.total - disk.free;
        return {
            DB_used: usedDisk / (1024 * 1024 * 1024),
            DB_all: disk.total / (1024 * 1024 * 1024)
        };
    } catch {
        return {
            DB_used: 0,
            DB_all: 0
        };
    }
};

const getSystemStatusShort = (DB_used, DB_all, RamUsage, GPUUsage, NetworkUsage) => {
    const DBPercent = (DB_used / DB_all) * 100;
    const RamPercent = RamUsage;
    const GpuPercent = GPUUsage?.gpu_usage || 0;

    const statuses = [
        {
            message: 'System is running optimally',
            color: '#4CAF50',
            condition: () => DBPercent < 70 && RamPercent < 70 || GpuPercent < 50
        },
        {
            message: 'System is under moderate load',
            color: '#FFC107',
            condition: () => DBPercent < 85 && RamPercent < 85 || GpuPercent < 70
        },
        {
            message: 'System is experiencing high load',
            color: '#FF5722',
            condition: () => DBPercent < 95 && RamPercent < 90 || GpuPercent < 85
        },
        {
            message: 'System is critically overloaded!',
            color: '#F44336',
            condition: () => DBPercent >= 95 || RamPercent >= 95 || GpuPercent >= 90
        },
        {
            message: 'System is mostly idle',
            color: '#2196F3',
            condition: () => DBPercent < 20 && RamPercent < 20 && GpuPercent < 10
        }
    ];

    const match = statuses.find(status => status.condition()) || {
        message: 'Unable to determine system status',
        color: '#9E9E9E'
    };

    return {
        status: match.message,
        status_color: match.color
    };
};

const generateSystemReport = () => {
    const diskUsage = getDiskUsage();
    const sysUsage = getSystemUsage();
    const ramUsage = getRamUsage();
    const netUsage = getNetworkUsage();
    const gpuUsage = getGpuUsage();

    const statusResult = getSystemStatusShort(
        diskUsage.DB_used,
        diskUsage.DB_all,
        ramUsage,
        gpuUsage
    );

return {
    DB_used: diskUsage.DB_used,
    DB_all: diskUsage.DB_all,
    SysUsage: sysUsage,
    RamUsage: ramUsage,
    NetworkUsage: netUsage,
    GpuUsage: gpuUsage,
    status: statusResult.status,
    status_color: statusResult.status_color
};

};

app.post("/login", (req, res) => {
    if (!requirepassword) {
        res.json("Success");
        //return res.json(generateSystemReport());
        return;
    }

    const { username, password } = req.body;

    if (username === config.defaultusername && password === config.defaultpassword) {
        //res.json(generateSystemReport());
        res.json("Success");
    } else {
        res.status(401).json({ error: getErrorByCode(401) });
    }
});

app.post("/refresh", (req, res) => {
    if (!requirepassword) {
        return res.json(generateSystemReport());
    }

    const { username, password } = req.body;

    if (username === config.defaultusername && password === config.defaultpassword) {
        res.json(generateSystemReport());
    } else {
        res.status(401).json({ error: getErrorByCode(401) });
    }
});

public.post("/login", (req, res) => {
    if (!requirepassword) {
        res.json("Success");
        //return res.json(generateSystemReport());
        return;
    }

    const { username, password } = req.body;

    if (username === config.defaultusername && password === config.defaultpassword) {
        //res.json(generateSystemReport());
        res.json("Success");
    } else {
        res.status(401).json({ error: getErrorByCode(401) });
    }
});

public.post("/refresh", (req, res) => {
    if (!requirepassword) {
        return res.json(generateSystemReport());
    }

    const { username, password } = req.body;

    if (username === config.defaultusername && password === config.defaultpassword) {
        res.json(generateSystemReport());
    } else {
        res.status(401).json({ error: getErrorByCode(401) });
    }
});

app.get("/", (req, res) => {
    fs.readFile("./index.html", "utf8", (err, data) => {
        if (err) {
            console.error("Error reading index.html:", err);
            res.status(500).send(getErrorByCode(500));
        } else {
            res.send(data);
        }
    });
});

app.get("/config.js", (req, res) => {
    fs.readFile("./config.js", (err, data) => {
        if (err) {
            console.error("Error reading config.js:", err);
            res.status(500).send(getErrorByCode(500));
        } else {
            res.send(data);
        }
    });
});

function getAllEndpoints(app) {
    let endpoints = [];
    app._router.stack.forEach((middleware) => {
      if (middleware.route) {
        const route = middleware.route;
        const methods = Object.keys(route.methods).map(m => m.toUpperCase()).join(', ');
        endpoints.push(`${methods} ${route.path}`);
      } else if (middleware.name === 'router') {
        middleware.handle.stack.forEach((handler) => {
          if (handler.route) {
            const route = handler.route;
            const methods = Object.keys(route.methods).map(m => m.toUpperCase()).join(', ');
            endpoints.push(`${methods} ${route.path}`);
          }
        });
      }
    });
    return endpoints;
  }

app.listen(PORT, () => {
  const endpoints = getAllEndpoints(app);
  
  let result = `Private Server running on port: ${PORT}\nMain page : http://localhost:${PORT}\n\nEndpoints:\n`;
  endpoints.forEach(ep => {
    result += ` - http://localhost:${PORT}${ep.split(' ')[1]} (${ep.split(' ')[0]})\n`;
  });

  console.log(getparttext(result, true));
});

public.listen(PPORT, () => {
  const endpoints = getAllEndpoints(public);
  
  let result = `Public Server running on port: ${PPORT}\nMain page : http://localhost:${PPORT}\n\nEndpoints:\n`;
  endpoints.forEach(ep => {
    result += ` - http://localhost:${PPORT}${ep.split(' ')[1]} (${ep.split(' ')[0]})\n`;
  });

  console.log(getparttext(result, true));
});