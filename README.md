# Dev Utility Belt

A comprehensive macOS desktop application that consolidates 12+ commonly-used developer utilities into a single, fast-loading app. Built with Tauri + React + TypeScript for native performance and modern UX.

## Features

### Data & Formatting
- **JSON Formatter/Validator** - Format, validate, and beautify JSON with customizable indentation
- **Base64 Encoder/Decoder** - Convert text to/from Base64
- **Unix Timestamp Converter** - Convert timestamps with timezone support (seconds/milliseconds)
- **Regex Tester** - Test regular expressions with live match highlighting and all flags

### Image Tools
- **Image Resizer** - Resize images by pixel or percentage, maintain aspect ratio
- **Image Converter** - Convert between JPG, PNG, WebP, GIF, BMP, TIFF, ICO formats

### Color
- **Color Picker** - Visual color picker with HEX, RGB, HSL outputs

### Security & Generators
- **UUID Generator** - Generate UUID v4 (random) and v7 (time-based), bulk generation
- **Hash Generator** - Generate MD5, SHA-256, and SHA-512 hashes
- **Password Generator** - Generate secure passwords with customizable options
- **JWT Debugger** - Decode and inspect JWT tokens offline (no external servers)

### Utilities
- **Smart Scratchpad** - Auto-saving notepad with JSON/XML formatting

### System Features
- **Clipboard Integration** - Quick copy functionality across all utilities
- **Theme Support** - Dark and light mode with persistence
- **Category Navigation** - Organized by function for easy access

## Tech Stack

- **Frontend:** React with TypeScript
- **Backend:** Tauri (Rust) - for lightweight, native performance
- **UI Library:** Tailwind CSS
- **State Management:** Zustand

## Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Rust (latest stable version)
- Platform-specific dependencies for Tauri

### Install Dependencies

```bash
npm install
```

### Development

Run the app in development mode:

```bash
npm run tauri dev
```

### Build

Build the production version:

```bash
npm run build
npm run tauri build
```

## Keyboard Shortcuts

- `Cmd/Ctrl + 1` - Switch to JSON Formatter
- `Cmd/Ctrl + 2` - Switch to Base64 Converter
- `Cmd/Ctrl + 3` - Switch to Timestamp Converter
- `Cmd/Ctrl + 4` - Switch to Regex Tester
- `Cmd/Ctrl + 5` - Switch to Color Picker
- `Cmd/Ctrl + D` - Toggle Dark/Light theme

## Project Structure

```
dev-utility-belt/
├── src/                      # React frontend
│   ├── components/          # React components
│   │   ├── utilities/      # Utility components (JSON, Base64, etc.)
│   │   ├── TabNavigation.tsx
│   │   └── ThemeToggle.tsx
│   ├── hooks/              # Custom React hooks
│   ├── store/              # Zustand stores
│   ├── App.tsx             # Main app component
│   └── main.tsx            # Entry point
├── src-tauri/               # Tauri (Rust) backend
│   ├── src/
│   │   └── lib.rs          # Rust entry point
│   └── Cargo.toml          # Rust dependencies
├── public/                  # Static assets
└── package.json            # Node dependencies
```

## Features in Detail

### JSON Formatter/Validator
- Format JSON with customizable indentation (2, 4, or 8 spaces)
- Minify JSON
- Validate JSON with error messages
- Copy formatted output to clipboard

### Base64 Encoder/Decoder
- Encode text to Base64
- Decode Base64 to text
- Error handling for invalid Base64 strings
- Copy output to clipboard

### Unix Timestamp Converter
- Convert Unix timestamps to human-readable dates
- Convert dates to Unix timestamps
- Support for both seconds and milliseconds timestamps
- Get current timestamp with one click

### Regex Tester
- Test regular expressions with live matching
- Visual highlighting of matches
- Support for all regex flags (g, i, m, s, u, y)
- Display match details including capture groups

### Color Picker
- Visual color picker
- Display color values in HEX, RGB, and HSL formats
- Copy any format to clipboard
- Individual RGB component values

## Performance

- Fast startup time (< 1 second)
- Minimal memory footprint (~50-100MB)
- Native performance with Tauri
- All utilities work completely offline

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
