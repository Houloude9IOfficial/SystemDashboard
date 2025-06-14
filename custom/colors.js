const color = {
  reset: "\x1b[0m",

  // Basic foreground colors
  black: (text) => `\x1b[30m${text}${color.reset}`,
  red: (text) => `\x1b[31m${text}${color.reset}`,
  green: (text) => `\x1b[32m${text}${color.reset}`,
  yellow: (text) => `\x1b[33m${text}${color.reset}`,
  blue: (text) => `\x1b[34m${text}${color.reset}`,
  magenta: (text) => `\x1b[35m${text}${color.reset}`,
  cyan: (text) => `\x1b[36m${text}${color.reset}`,
  white: (text) => `\x1b[37m${text}${color.reset}`,

  // Bright foreground colors (Basic + 60)
  brightBlack: (text) => `\x1b[90m${text}${color.reset}`,
  brightRed: (text) => `\x1b[91m${text}${color.reset}`,
  brightGreen: (text) => `\x1b[92m${text}${color.reset}`,
  brightYellow: (text) => `\x1b[93m${text}${color.reset}`,
  brightBlue: (text) => `\x1b[94m${text}${color.reset}`,
  brightMagenta: (text) => `\x1b[95m${text}${color.reset}`,
  brightCyan: (text) => `\x1b[96m${text}${color.reset}`,
  brightWhite: (text) => `\x1b[97m${text}${color.reset}`,

  // Basic background colors
  bgBlack: (text) => `\x1b[40m${text}${color.reset}`,
  bgRed: (text) => `\x1b[41m${text}${color.reset}`,
  bgGreen: (text) => `\x1b[42m${text}${color.reset}`,
  bgYellow: (text) => `\x1b[43m${text}${color.reset}`,
  bgBlue: (text) => `\x1b[44m${text}${color.reset}`,
  bgMagenta: (text) => `\x1b[45m${text}${color.reset}`,
  bgCyan: (text) => `\x1b[46m${text}${color.reset}`,
  bgWhite: (text) => `\x1b[47m${text}${color.reset}`,

  // Bright background colors
  bgBrightBlack: (text) => `\x1b[100m${text}${color.reset}`,
  bgBrightRed: (text) => `\x1b[101m${text}${color.reset}`,
  bgBrightGreen: (text) => `\x1b[102m${text}${color.reset}`,
  bgBrightYellow: (text) => `\x1b[103m${text}${color.reset}`,
  bgBrightBlue: (text) => `\x1b[104m${text}${color.reset}`,
  bgBrightMagenta: (text) => `\x1b[105m${text}${color.reset}`,
  bgBrightCyan: (text) => `\x1b[106m${text}${color.reset}`,
  bgBrightWhite: (text) => `\x1b[107m${text}${color.reset}`,

  // 256-color foreground (some useful colors)
  orange: (text) => `\x1b[38;5;208m${text}${color.reset}`,
  gray: (text) => `\x1b[38;5;245m${text}${color.reset}`,
  lightGray: (text) => `\x1b[38;5;250m${text}${color.reset}`,
  darkGray: (text) => `\x1b[38;5;240m${text}${color.reset}`,
  pink: (text) => `\x1b[38;5;213m${text}${color.reset}`,
  lightGreen: (text) => `\x1b[38;5;120m${text}${color.reset}`,
  lightBlue: (text) => `\x1b[38;5;117m${text}${color.reset}`,
  purple: (text) => `\x1b[38;5;99m${text}${color.reset}`,
  gold: (text) => `\x1b[38;5;220m${text}${color.reset}`,
  turquoise: (text) => `\x1b[38;5;44m${text}${color.reset}`,
  coral: (text) => `\x1b[38;5;203m${text}${color.reset}`,
  lavender: (text) => `\x1b[38;5;183m${text}${color.reset}`,
  olive: (text) => `\x1b[38;5;100m${text}${color.reset}`,
  teal: (text) => `\x1b[38;5;37m${text}${color.reset}`,
  salmon: (text) => `\x1b[38;5;210m${text}${color.reset}`,

  // 256-color background
  bgOrange: (text) => `\x1b[48;5;208m${text}${color.reset}`,
  bgGray: (text) => `\x1b[48;5;245m${text}${color.reset}`,
  bgLightGray: (text) => `\x1b[48;5;250m${text}${color.reset}`,
  bgDarkGray: (text) => `\x1b[48;5;240m${text}${color.reset}`,
  bgPink: (text) => `\x1b[48;5;213m${text}${color.reset}`,
  bgLightGreen: (text) => `\x1b[48;5;120m${text}${color.reset}`,
  bgLightBlue: (text) => `\x1b[48;5;117m${text}${color.reset}`,
  bgPurple: (text) => `\x1b[48;5;99m${text}${color.reset}`,
  bgGold: (text) => `\x1b[48;5;220m${text}${color.reset}`,
  bgTurquoise: (text) => `\x1b[48;5;44m${text}${color.reset}`,
  bgCoral: (text) => `\x1b[48;5;203m${text}${color.reset}`,
  bgLavender: (text) => `\x1b[48;5;183m${text}${color.reset}`,
  bgOlive: (text) => `\x1b[48;5;100m${text}${color.reset}`,
  bgTeal: (text) => `\x1b[48;5;37m${text}${color.reset}`,
  bgSalmon: (text) => `\x1b[48;5;210m${text}${color.reset}`,

  // RGB (24-bit) foreground color (if terminal supports)
  rgb: (r, g, b, text) => `\x1b[38;2;${r};${g};${b}m${text}${color.reset}`,
  // RGB (24-bit) background color
  bgRgb: (r, g, b, text) => `\x1b[48;2;${r};${g};${b}m${text}${color.reset}`,

  // Additional styles if needed
  bold: (text) => `\x1b[1m${text}${color.reset}`,
  dim: (text) => `\x1b[2m${text}${color.reset}`,
  italic: (text) => `\x1b[3m${text}${color.reset}`,
  underline: (text) => `\x1b[4m${text}${color.reset}`,
  inverse: (text) => `\x1b[7m${text}${color.reset}`,
  strikethrough: (text) => `\x1b[9m${text}${color.reset}`,
};

module.exports = { color };