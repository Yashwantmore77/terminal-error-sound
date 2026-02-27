# FAAA 🔊

A free, open-source VSCode extension that plays a sound whenever your integrated terminal throws an error. Never miss a broken build or failing command again — even when you're looking away from your screen.

---

## Features

- 🎵 Plays a sound the moment an error is detected in your terminal
- 🧠 Smart debouncing — plays once per error, not once per output line
- 🔧 Configurable: enable/disable, set volume, use your own sound file
- 🖥️ Cross-platform: works on macOS, Linux, and Windows
- ⚡ Lightweight — no bundler, no bloat

## Detected Error Patterns

The extension listens for common error signatures including:

- `error:`, `TypeError`, `SyntaxError`, `ReferenceError`, `RangeError`
- `npm ERR!`
- `command not found`
- `Exception`, `Traceback` (Python errors)
- `cannot find module`
- `failed`, `ENOENT`, `EACCES`

## Commands

| Command | Description |
|---|---|
| `FAAA: Test Sound 🔊` | Manually trigger the sound to verify it works |
| `FAAA: Toggle On/Off` | Quickly enable or disable the extension |

Access these via the Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`).

## Settings

| Setting | Type | Default | Description |
|---|---|---|---|
| `terminalErrorSound.enabled` | boolean | `true` | Enable or disable the extension |
| `terminalErrorSound.volume` | number | `1.0` | Volume from 0.0 (silent) to 1.0 (full) |
| `terminalErrorSound.customSoundPath` | string | `""` | Absolute path to a custom sound file |

### Example: Use a custom sound

```json
{
  "terminalErrorSound.customSoundPath": "/Users/you/sounds/myerror.wav"
}
```

## Requirements

The extension uses your system's native audio player:

| Platform | Player Used |
|---|---|
| macOS | `afplay` (built-in) |
| Linux | `aplay` or `mplayer` — install if needed |
| Windows | `mplayer` — install if needed |

If audio fails, the extension will show a warning message with details.

## Installation

### From the Marketplace
Search for **"FAAA"** in the VSCode Extensions panel.

### From source
```bash
git clone https://github.com/you/terminal-error-sound
cd terminal-error-sound
npm install
npm run compile
# Press F5 in VSCode to launch the Extension Development Host
```

## Adding Your Own Sound File

Drop any `.mp3`, `.wav`, or `.ogg` file into `sounds/error.mp3` (replacing the default), or point to it via `terminalErrorSound.customSoundPath` in your settings.

## Contributing

PRs and issues welcome! This is a free, open-source project.

## License

MIT
