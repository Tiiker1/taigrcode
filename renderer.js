const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', () => {
    const editorElement = document.getElementById('code-editor');
    
    const editor = CodeMirror.fromTextArea(editorElement, {
        lineNumbers: true,
        mode: 'javascript',
        theme: 'dracula',
        autoCloseBrackets: true,
        matchBrackets: true,
        tabSize: 2,
        extraKeys: { "Ctrl-Space": "autocomplete" }
    });

    // Example content to show syntax highlighting
    editor.setValue(`function hello() {
    console.log("Hello, world!");
}`);

    // Handle file open
    ipcRenderer.on('file-opened', (event, data) => {
        editor.setValue(data);
    });

    // Handle file save
    ipcRenderer.on('save-file', (event, filePath) => {
        const fs = require('fs');
        fs.writeFile(filePath, editor.getValue(), err => {
            if (err) {
                alert('An error occurred saving the file: ' + err.message);
            }
        });
    });

    // Handle 'find' message
    ipcRenderer.on('find', () => {
        console.log('Received find message'); // Check if the message is received
        const term = prompt('Enter search term:');
        if (term) {
            const cursor = editor.getSearchCursor(term);
            if (cursor.findNext()) {
                editor.setSelection(cursor.from(), cursor.to());
            } else {
                alert('No matches found.');
            }
        }
    });

    // Resize CodeMirror to fit the window
    const resizeEditor = () => {
        editor.setSize('100%', '100%');
    };

    window.addEventListener('resize', resizeEditor);
    resizeEditor(); // Initial call to set size
});
