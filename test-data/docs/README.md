# DufsX Documentation

Welcome to DufsX - an enhanced version of the Dufs file server with IDE-like capabilities and advanced file management features.

## Overview

DufsX extends the original [Dufs](https://github.com/sigoden/dufs) file server with powerful new features that transform it into a web-based IDE and file management system.

## Key Features

### 🎨 Enhanced Text Editor
- **Syntax Highlighting**: Support for 15+ programming languages
- **Code Formatting**: Intelligent code formatting with proper indentation
- **Code Folding**: Collapse and expand code blocks for better navigation
- **Auto-completion**: Context-aware code completion suggestions
- **Search & Replace**: Powerful search functionality with regex support

### 📁 Advanced File Management
- **IDE-style Tree Layout**: Visual file explorer with expandable directories
- **Directory Navigation**: Click directory names to expand/collapse and view contents
- **Context-aware Creation**: Create files and folders in selected directories
- **File Timestamps**: View modification times and file sizes
- **Drag & Drop**: Upload files by dragging them into the interface

### 📝 Markdown Editor
- **Live Preview**: Side-by-side markdown editing with real-time preview
- **Rich Toolbar**: Easy-to-use formatting buttons
- **Table Support**: Built-in table creation and editing tools
- **Auto-save**: Automatic saving with unsaved changes indicator

### 🎯 Supported File Types

#### Programming Languages
- **JavaScript/TypeScript** (.js, .jsx, .ts, .tsx)
- **Python** (.py)
- **Java** (.java)
- **C/C++** (.c, .cpp, .cc, .cxx, .h, .hpp)
- **Rust** (.rs)
- **Go** (.go)
- **PHP** (.php)

#### Web Technologies
- **HTML** (.html, .htm)
- **CSS/SCSS/Sass** (.css, .scss, .sass, .less)
- **JSON** (.json)
- **XML/SVG** (.xml, .svg)

#### Data & Config
- **SQL** (.sql)
- **YAML** (.yaml, .yml)
- **Markdown** (.md, .markdown)

### 🎮 Keyboard Shortcuts

#### Editor Shortcuts
- `Ctrl+S` / `Cmd+S`: Save file
- `Ctrl+Shift+F` / `Cmd+Shift+F`: Format document
- `Ctrl+F` / `Cmd+F`: Search
- `Ctrl+H` / `Cmd+H`: Search and replace
- `Tab` / `Shift+Tab`: Indent/unindent

#### Navigation
- Click directory names to expand/collapse
- Click files to open in editor
- Use tree controls for fine-grained navigation

## Getting Started

### Installation

```bash
# Install from source
cargo install dufs

# Or using Docker
docker run -v `pwd`:/data -p 5000:5000 --rm sigoden/dufs /data -A
```

### Basic Usage

```bash
# Start server with full permissions
dufs -A

# Serve specific directory
dufs /path/to/directory

# Custom port and host
dufs -b 0.0.0.0 -p 8080
```

### Web Interface

1. Open your browser and navigate to `http://localhost:5000`
2. Use the file tree on the left to navigate directories
3. Click files to edit them with syntax highlighting
4. Click directory names to expand/collapse and view contents
5. Create new files and folders using the toolbar buttons

## Directory Navigation

### Tree Interaction
- **Expand/Collapse**: Click the arrow (▶) or directory name
- **Select Directory**: Click anywhere on the directory item
- **View Contents**: Selected directories show their contents in the right panel

### File Creation
- Files and folders are created in the currently selected directory
- If no directory is selected, they're created in the root
- Use the "New File" and "New Folder" buttons in the tree toolbar

## Advanced Features

### Authentication
```bash
# Basic authentication
dufs -a admin:password@/:rw

# Multiple users with different permissions
dufs -a admin:admin@/:rw -a user:pass@/docs:ro
```

### SSL/TLS
```bash
dufs --tls-cert cert.pem --tls-key key.pem
```

### Configuration File
Create a `dufs.yaml` configuration file:

```yaml
serve-path: '.'
bind: 0.0.0.0
port: 5000
allow-all: true
auth:
  - admin:admin@/:rw
  - user:pass@/docs:ro
tls-cert: cert.pem
tls-key: key.pem
```

## API Endpoints

### File Operations
```bash
# Upload file
curl -T file.txt http://localhost:5000/path/file.txt

# Download file
curl http://localhost:5000/path/file.txt

# Delete file
curl -X DELETE http://localhost:5000/path/file.txt

# Create directory
curl -X MKCOL http://localhost:5000/path/newdir

# Move/rename
curl -X MOVE http://localhost:5000/old-path \
  -H "Destination: http://localhost:5000/new-path"
```

### Directory Listing
```bash
# JSON format
curl http://localhost:5000/path/?json

# Simple list
curl http://localhost:5000/path/?simple

# Search files
curl http://localhost:5000/?q=filename
```

## Browser Compatibility

DufsX works best with modern browsers that support:
- ES6+ JavaScript features
- CSS Grid and Flexbox
- WebRTC for real-time features
- Local Storage for preferences

### Recommended Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Troubleshooting

### Common Issues

#### CodeMirror Not Loading
If syntax highlighting doesn't work, check:
- Browser console for JavaScript errors
- Network connectivity to CDN
- Browser compatibility

#### File Upload Issues
- Check file size limits
- Verify write permissions
- Ensure sufficient disk space

#### Authentication Problems
- Verify user credentials
- Check path permissions
- Review authentication configuration

### Performance Tips

1. **Large Directories**: Use search functionality for directories with many files
2. **File Size**: Large files may load slowly in the editor
3. **Browser Memory**: Close unused tabs when working with many files
4. **Network**: Use local installation for better performance

## Contributing

DufsX is built on top of the excellent Dufs project. Contributions are welcome!

### Development Setup
```bash
git clone https://github.com/sigoden/dufs.git
cd dufs
cargo build
cargo run -- test-data -A
```

### Code Style
- Follow Rust conventions for backend code
- Use modern JavaScript/CSS for frontend
- Maintain accessibility standards
- Write comprehensive tests

## License

DufsX maintains the same licensing as the original Dufs project:
- MIT License or Apache License 2.0, at your option

## Acknowledgments

- Original [Dufs](https://github.com/sigoden/dufs) project by sigoden
- [CodeMirror 6](https://codemirror.net/) for advanced text editing
- [EasyMDE](https://github.com/Ionaru/easy-markdown-editor) for markdown editing

---

For more information, visit the [original Dufs repository](https://github.com/sigoden/dufs).