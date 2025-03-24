const express = require("express");
let config;
try {
    config = require("./config.js");
} catch (err) {
    console.error("Failed to load config file:", err);
    process.exit(1);
}
const PORT = config.DefaultPort;
const os = require("os");
const { execSync } = require("child_process");
const app = express();
const cors = require("cors");
const diskusage = require("diskusage");
const requirepassword = config.requirepassword;
if (requirepassword) {
    console.log('Password is required for access.')
} else {
    console.log('No password required for access.')
}

app.use(cors({
    origin: "*",
    methods: ["GET", "POST"], 
    allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

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

updateNetworkStats();
setInterval(updateNetworkStats, 1000);

const getRamUsage = () => {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    return ((totalMem - freeMem) / totalMem) * 100;
};

const getNetworkUsage = () => {
    return {
        totalReceived: (currentRxBytes - lastRxBytes) / 1024,
        totalSent: (currentTxBytes - lastTxBytes) / 1024
    };
};

const getGpuUsage = () => {
    try {
        // First try NVIDIA
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
        } catch (nvidiaError) {
            // NVIDIA check failed, try AMD
        }

        // Try AMD on Windows (using Radeon Software CLI)
        try {
            const amdInfo = execSync(
                'amd-cli --stats'
            ).toString().trim();
            
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
        } catch (amdError) {
            // AMD check failed
        }

        // Try AMD on Linux (using rocm-smi)
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
        } catch (rocmError) {
            // ROCm check failed
        }

        // If no GPU detected
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
    } catch (err) {
        return {
            DB_used: 0,
            DB_all: 0
        };
    }
};

app.post("/login", (req, res) => {
    if (requirepassword === false) {
        const diskUsage = getDiskUsage();
        return res.json({
            "DB_used": diskUsage.DB_used,
            "DB_all": diskUsage.DB_all,
            "SysUsage": getSystemUsage(),
            "RamUsage": getRamUsage(),
            "NetworkUsage": getNetworkUsage(),
            "GpuUsage": getGpuUsage(),
            "status": "Production system running smoothly"
        });
    }
    
    const { username, password } = req.body;
    
    if (username === config.defaultusername && password === config.defaultpassword) {
        const diskUsage = getDiskUsage();
        res.json({
            "DB_used": diskUsage.DB_used,
            "DB_all": diskUsage.DB_all,
            "SysUsage": getSystemUsage(),
            "RamUsage": getRamUsage(),
            "NetworkUsage": getNetworkUsage(),
            "GpuUsage": getGpuUsage(),
            "status": "Production system running smoothly"
        });
    } else {
        res.status(401).json({ "error": "Unauthorized" });
    }
});

//app.listen(PORT, () => {
//    console.log(`Server running on http://localhost:${PORT}`);
//});

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});