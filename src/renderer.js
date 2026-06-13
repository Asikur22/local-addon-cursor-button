import React from 'react';
import { TextButton } from '@getflywheel/local-components';

export default function (context) {
    const { hooks } = context;

    hooks.addContent('SiteInfo_Top_TopRight', (site) => (
        <TextButton onClick={() => {
            try {
                if (!site) {
                    alert('Cursor Addon Error: site object is undefined.');
                    return;
                }
                if (!site.path) {
                    alert('Cursor Addon Error: site.path is undefined. Site object keys: ' + Object.keys(site).join(', '));
                    return;
                }

                const fs = require('fs');
                const { spawn } = require('child_process');
                const url = site.path + '/app/public';

                if (process.platform === 'darwin') {
                    const bundleId = 'com.todesktop.230313mzl4w4u92';

                    const child = spawn('open', ['-b', bundleId, url], {
                        detached: true,
                        stdio: 'ignore'
                    });
                    child.on('error', (err) => {
                        console.error('Failed to spawn open command:', err);
                        alert('Cursor Addon: failed to spawn open command: ' + err.message);
                    });
                    child.unref();
                } else if (process.platform === 'win32') {
                    const path = require('path');
                    const localAppData = process.env ? process.env.LOCALAPPDATA : '';
                    const paths = [
                        localAppData ? path.join(localAppData, 'Programs', 'cursor', 'Cursor.exe') : '',
                        'C:\\Program Files\\cursor\\Cursor.exe',
                        'C:\\Program Files (x86)\\cursor\\Cursor.exe'
                    ].filter(Boolean);

                    let cursorPath = 'cursor';
                    for (const p of paths) {
                        if (fs.existsSync(p)) {
                            cursorPath = p;
                            break;
                        }
                    }
                    const child = spawn(cursorPath, [url], {
                        detached: true,
                        stdio: 'ignore'
                    });
                    child.on('error', (err) => {
                        console.error('Failed to spawn Cursor binary:', err);
                        alert('Cursor Addon: failed to spawn binary: ' + err.message);
                    });
                    child.unref();
                } else {
                    // Linux / other fallback
                    const child = spawn('cursor', [url], {
                        detached: true,
                        stdio: 'ignore'
                    });
                    child.on('error', (err) => {
                        console.error('Failed to spawn Cursor binary on Linux:', err);
                    });
                    child.unref();
                }
            } catch (error) {
                console.error('Cursor Addon Catch:', error);
                alert('Cursor Addon Catch: ' + error.message + '\n\nStack:\n' + error.stack);
            }
        }}>
            Open in Cursor
        </TextButton>
    ));
}