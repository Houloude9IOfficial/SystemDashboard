### Status: Project Archived
The most stable release is **[v1](https://github.com/Houloude9IOfficial/SystemDashboard/releases/tag/1)**. Version **[v2](https://github.com/Houloude9IOfficial/SystemDashboard/releases/tag/2)** is available but may have some issues when used with public and private instances.

---

# 🖥️ System Monitoring Dashboard

A simple, customizable real-time dashboard to monitor key system stats including CPU, GPU, RAM, Storage, and Network. Built for local usage with smooth animations and optional login.

---

## 🚀 Features

### ✅ System Stats
- **CPU Usage**
- **GPU Core/VRAM Usage** (NVIDIA supported, AMD untested)
- **RAM Usage**
- **Storage (Used / Free Space)**
- **Network Traffic**

### 🎨 Customization
- **Color Themes:** Blue, Orange, Purple, Pink, Green
- **Theme Modes:** Dark & Light

### ⚙️ Functionalities
- Optional **Login System**
- **Performance Settings**
- **Port Preference** (Runs on localhost)
- **Real-time Data Sync**
- **Smooth UI Animations**

---

## 🔧 Requirements

- **Operating System:** Windows 10 or higher  
- **Node.js:** Download & install from [nodejs.org](https://nodejs.org)  
- Run:  
  ```bash
  npm install
  ```

---
## 📦 Installation

### 💻 Localhost Setup

> Prerequisites:  
> ✅ Windows 10 or newer  
> ✅ [Node.js](https://nodejs.org) installed  

#### 1. Prepare the files:
Ensure the following files are in your working directory:
- `server.js`
- `index.html`
- `config.js`

#### 2. Launch via VS Code:
1. Open the folder in **Visual Studio Code**
2. Open the terminal (`CTRL + SHIFT + \``)
3. Run the server:  
   ```bash
   npm start
   ```
4. Once the server says `Server running on port: {YourPort}`, open `index.html` using:
   - A local server (e.g., Live Server)
   - Or as a local file

5. If prompted to log in, use credentials from `config.js`  
   > Default: **Username:** `admin` | **Password:** `admin`

---


## 📌 Notes

- Fully free and open-source. Modify it as you like.
- GPU monitoring requires `nvidia-smi` (NVIDIA GPUs only; AMD support is experimental).

---

## 🙌 Credits

- **Icons:** [FontAwesome](https://fontawesome.com/)  
- **Data Sources:** [NVIDIA](https://www.nvidia.com), [Chart.js](https://www.chartjs.org), [Express.js](https://expressjs.com), [WebSocket](https://www.npmjs.com/package/websocket)  

---

## 👨‍💻 Developer

**Developed by [Houloude9](https://github.com/Houloude9IOfficial)**  
Feel free to fork, improve, and contribute!
