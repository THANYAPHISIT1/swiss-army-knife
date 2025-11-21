# Dev Utility Belt

A lightweight macOS desktop application that consolidates commonly-used developer utilities into a single, fast-loading app.

## Features

- **JSON Formatter/Validator** - Format, validate, and beautify JSON with syntax highlighting
- **Base64 Encoder/Decoder** - Convert text to/from Base64
- **Unix Timestamp Converter** - Convert timestamps with timezone support
- **Regex Tester** - Test regular expressions with match highlighting
- **Color Picker** - Pick colors with outputs in HEX, RGB, HSL formats
- **Clipboard Integration** - Quick copy functionality across all utilities
- **Theme Support** - Dark and light mode
- **Keyboard Shortcuts** - Fast navigation with keyboard shortcuts

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
