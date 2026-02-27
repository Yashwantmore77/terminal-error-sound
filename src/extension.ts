import * as vscode from 'vscode';
import * as path from 'path';
import { exec } from 'child_process';

// --- Sound Playback ---
let isPlaying = false;
let debounceTimer: ReturnType<typeof setTimeout> | null = null;
const DEBOUNCE_MS = 1500;

function playErrorSound(context: vscode.ExtensionContext, log: vscode.OutputChannel): void {
  const config = vscode.workspace.getConfiguration('terminalErrorSound');

  if (!config.get<boolean>('enabled', true)) {
    log.appendLine('Sound skipped: extension is disabled.');
    return;
  }

  // Debounce: reset the timer on each call, only play after silence.
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  debounceTimer = setTimeout(() => {
    if (isPlaying) {
      log.appendLine('Sound skipped: another sound is already playing.');
      return;
    }

    const customPath = config.get<string>('customSoundPath', '');
    const soundPath = customPath
      ? customPath
      : path.join(context.extensionPath, 'sounds', 'error.wav');

    isPlaying = true;

    const platform = process.platform;
    let cmd = '';

    if (platform === 'win32') {
      cmd = `powershell -c "(New-Object Media.SoundPlayer '${soundPath}').PlaySync()"`;
    } else if (platform === 'darwin') {
      cmd = `afplay "${soundPath}"`;
    } else {
      cmd = `aplay "${soundPath}"`;
    }

    log.appendLine(`Playing sound using command: ${cmd}`);
    exec(cmd, (err) => {
      isPlaying = false;
      if (err) {
        log.appendLine(`Audio playback failed: ${err.message}`);
        console.error('[faaa] Failed to play sound:', err.message);
        vscode.window.showWarningMessage(
          `FAAA: Could not play audio. Error: ${err.message}`
        );
      }
    });
  }, DEBOUNCE_MS);
}

// --- Activation ---
export function activate(context: vscode.ExtensionContext): void {
  const log = vscode.window.createOutputChannel('FAAA');
  context.subscriptions.push(log);

  log.appendLine('Extension activated.');

  if (!vscode.window.onDidEndTerminalShellExecution) {
    const msg = 'Terminal shell integration API is unavailable. Update VS Code and ensure shell integration is enabled for the terminal profile.';
    log.appendLine(msg);
    void vscode.window.showWarningMessage(`FAAA: ${msg}`);
  }

  const listener = vscode.window.onDidEndTerminalShellExecution((event) => {
    log.appendLine(`Terminal command ended. exitCode=${String(event.exitCode)}`);

    if (typeof event.exitCode === 'number' && event.exitCode !== 0) {
      playErrorSound(context, log);
      return;
    }

    if (event.exitCode === undefined) {
      log.appendLine('No exit code reported for this command.');
    }
  });

  const testCommand = vscode.commands.registerCommand(
    'terminalErrorSound.testSound',
    () => {
      playErrorSound(context, log);
      vscode.window.showInformationMessage('FAAA: Playing test sound!');
    }
  );

  const toggleCommand = vscode.commands.registerCommand(
    'terminalErrorSound.toggle',
    async () => {
      const config = vscode.workspace.getConfiguration('terminalErrorSound');
      const current = config.get<boolean>('enabled', true);
      await config.update('enabled', !current, vscode.ConfigurationTarget.Global);
      vscode.window.showInformationMessage(
        `FAAA: ${!current ? 'Enabled' : 'Disabled'}`
      );
      log.appendLine(`Extension ${!current ? 'enabled' : 'disabled'} by user.`);
    }
  );

  context.subscriptions.push(listener, testCommand, toggleCommand);
}

export function deactivate(): void {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
}
