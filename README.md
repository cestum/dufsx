# DufsX

It's [Dufs](https://github.com/sigoden/dufs) with enhanced tree layout, markdown editor, image, pdf viewer, much more

Dufs is a distinctive utility file server that supports static serving, uploading, searching, accessing control, webdav...

![demo](https://user-images.githubusercontent.com/4012553/220513063-ff0f186b-ac54-4682-9af4-47a9781dee0d.png)

## Features

- DUFS Features
- EasyMDE markdown editor
- Enhanced text editor with syntax highlighting, formatting, and code folding
- IDE style tree layout with interactive directory navigation
- Context-aware file and folder creation
- Directory content viewer with timestamps and file details

### Enhanced Markdown Editor

Dufs includes a sophisticated markdown editor powered by EasyMDE for an enhanced editing experience:

- **Live Preview**: Side-by-side markdown editing with real-time preview
- **Syntax Highlighting**: CodeMirror-based syntax highlighting for markdown
- **Rich Toolbar**: Easy-to-use toolbar with formatting buttons
- **Keyboard Shortcuts**: Standard shortcuts (Ctrl+B for bold, Ctrl+I for italic, etc.)
- **Auto-save**: Automatic saving every 30 seconds with unsaved changes indicator
- **Dark Mode Support**: Seamless dark/light theme integration
- **Full-screen Mode**: Distraction-free editing experience
- **Table Support**: Built-in table creation and editing tools
- **Image & Link Insertion**: Easy insertion of images and links
- **Multiple View Modes**: Edit, preview, and side-by-side modes

The enhanced editor automatically activates for files with `.md`, `.markdown`, `.mdown`, `.mkd`, `.mkdn`, and `.mdx` extensions.

**Keyboard Shortcuts:**
- `Ctrl+S` / `Cmd+S`: Save file
- `Ctrl+B` / `Cmd+B`: Bold text
- `Ctrl+I` / `Cmd+I`: Italic text
- `Ctrl+P` / `Cmd+P`: Toggle preview
- `F9`: Toggle side-by-side view
- `F11`: Toggle fullscreen

### Enhanced Text Editor

DufsX includes a powerful code editor powered by CodeMirror 6 for an enhanced text editing experience:

- **Syntax Highlighting**: Advanced syntax highlighting for 15+ programming languages including JavaScript, Python, Java, C++, Rust, Go, PHP, HTML, CSS, JSON, XML, SQL, YAML, and more
- **Code Formatting**: Intelligent code formatting with proper indentation (Ctrl+Shift+F)
- **Code Folding**: Collapse and expand code blocks for better navigation
- **Line Numbers**: Display line numbers with fold indicators in the gutter
- **Auto-completion**: Context-aware code completion suggestions
- **Search & Replace**: Powerful search functionality with regex support
- **Language Detection**: Automatic language detection based on file extensions
- **Dark/Light Themes**: Seamless theme integration with system preferences
- **Multiple Cursors**: Advanced editing capabilities
- **Bracket Matching**: Visual bracket and parentheses matching
- **Auto-save**: Automatic saving with unsaved changes indicator

**Supported Languages:**
- JavaScript/TypeScript (.js, .jsx, .ts, .tsx)
- Python (.py)
- Java (.java)
- C/C++ (.c, .cpp, .cc, .cxx, .h, .hpp)
- Rust (.rs)
- Go (.go)
- PHP (.php)
- HTML (.html, .htm)
- CSS/SCSS/Sass (.css, .scss, .sass, .less)
- JSON (.json)
- XML/SVG (.xml, .svg)
- SQL (.sql)
- YAML (.yaml, .yml)
- Markdown (.md, .markdown)

**Enhanced Editor Keyboard Shortcuts:**
- `Ctrl+S` / `Cmd+S`: Save file
- `Ctrl+Shift+F` / `Cmd+Shift+F`: Format document
- `Ctrl+F` / `Cmd+F`: Search
- `Ctrl+H` / `Cmd+H`: Search and replace
- `Tab` / `Shift+Tab`: Indent/unindent
- `Ctrl+/` / `Cmd+/`: Toggle line comment
- `Alt+Up/Down`: Move line up/down
- `Ctrl+D` / `Cmd+D`: Select next occurrence

The enhanced editor automatically activates for text files when CodeMirror 6 is available, with fallback to a basic textarea editor for maximum compatibility.

### Interactive Directory Navigation

DufsX provides an intuitive file tree interface with advanced directory navigation capabilities:

- **Click to Expand**: Click on any directory name to expand/collapse it and view its contents
- **Directory Selection**: Click anywhere on a directory item to select it
- **Content Preview**: Selected directories display their contents in the right panel with detailed file information
- **Timestamp Display**: View file modification times and sizes in an organized table format
- **Context-aware Creation**: New files and folders are created in the currently selected directory

**Directory Navigation Features:**
- Click directory names or arrow icons to expand/collapse folders
- Selected directories show highlighted in blue with white text
- Right panel displays directory contents with:
  - File/folder names with appropriate icons
  - File types (Directory, File, etc.)
  - File sizes for regular files
  - Last modified timestamps
- Click on items in the directory listing to navigate or edit files
- Empty directories show a helpful "This directory is empty" message

**File and Folder Creation:**
- Use the toolbar buttons (📄 New File, 📁 New Folder) in the file tree panel
- Files and folders are created in the currently selected directory
- If no directory is selected, they are created in the root directory
- Newly created files automatically open in the editor for immediate editing

## Install

### With cargo

```
cargo install dufs
```

### With docker

```
docker run -v `pwd`:/data -p 5000:5000 --rm sigoden/dufs /data -A
```

### With [Homebrew](https://brew.sh)

```
brew install dufs
```

### Binaries on macOS, Linux, Windows

Download from [Github Releases](https://github.com/sigoden/dufs/releases), unzip and add dufs to your $PATH.

## CLI

```
Dufs is a distinctive utility file server - https://github.com/sigoden/dufs

Usage: dufs [OPTIONS] [serve-path]

Arguments:
  [serve-path]  Specific path to serve [default: .]

Options:
  -c, --config <file>        Specify configuration file
  -b, --bind <addrs>         Specify bind address or unix socket
  -p, --port <port>          Specify port to listen on [default: 5000]
      --path-prefix <path>   Specify a path prefix
      --hidden <value>       Hide paths from directory listings, e.g. tmp,*.log,*.lock
  -a, --auth <rules>         Add auth roles, e.g. user:pass@/dir1:rw,/dir2
  -A, --allow-all            Allow all operations
      --allow-upload         Allow upload files/folders
      --allow-delete         Allow delete files/folders
      --allow-search         Allow search files/folders
      --allow-symlink        Allow symlink to files/folders outside root directory
      --allow-archive        Allow download folders as archive file
      --enable-cors          Enable CORS, sets `Access-Control-Allow-Origin: *`
      --render-index         Serve index.html when requesting a directory, returns 404 if not found index.html
      --render-try-index     Serve index.html when requesting a directory, returns directory listing if not found index.html
      --render-spa           Serve SPA(Single Page Application)
      --assets <path>        Set the path to the assets directory for overriding the built-in assets
      --log-format <format>  Customize http log format
      --log-file <file>      Specify the file to save logs to, other than stdout/stderr
      --compress <level>     Set zip compress level [default: low] [possible values: none, low, medium, high]
      --completions <shell>  Print shell completion script for <shell> [possible values: bash, elvish, fish, powershell, zsh]
      --tls-cert <path>      Path to an SSL/TLS certificate to serve with HTTPS
      --tls-key <path>       Path to the SSL/TLS certificate's private key
  -h, --help                 Print help
  -V, --version              Print version
```

## Examples

Serve current working directory in read-only mode

```
dufs
```

Allow all operations like upload/delete/search/create/edit...

```
dufs -A
```

Only allow upload operation

```
dufs --allow-upload
```

Serve a specific directory

```
dufs Downloads
```

Serve a single file

```
dufs linux-distro.iso
```

Serve a single-page application like react/vue

```
dufs --render-spa
```

Serve a static website with index.html

```
dufs --render-index
```

Require username/password

```
dufs -a admin:123@/:rw
```

Listen on specific host:ip

```
dufs -b 127.0.0.1 -p 80
```

Listen on unix socket
```
dufs -b /tmp/dufs.socket
```

Use https

```
dufs --tls-cert my.crt --tls-key my.key
```

## API

Upload a file

```sh
curl -T path-to-file http://127.0.0.1:5000/new-path/path-to-file
```

Download a file
```sh
curl http://127.0.0.1:5000/path-to-file           # download the file
curl http://127.0.0.1:5000/path-to-file?hash      # retrieve the sha256 hash of the file
```

Download a folder as zip file

```sh
curl -o path-to-folder.zip http://127.0.0.1:5000/path-to-folder?zip
```

Delete a file/folder

```sh
curl -X DELETE http://127.0.0.1:5000/path-to-file-or-folder
```

Create a directory

```sh
curl -X MKCOL http://127.0.0.1:5000/path-to-folder
```

Move the file/folder to the new path

```sh
curl -X MOVE http://127.0.0.1:5000/path -H "Destination: http://127.0.0.1:5000/new-path"
```

List/search directory contents

```sh
curl http://127.0.0.1:5000?q=Dockerfile           # search for files, similar to `find -name Dockerfile`
curl http://127.0.0.1:5000?simple                 # output names only, similar to `ls -1`
curl http://127.0.0.1:5000?json                   # output paths in json format
```

With authorization (Both basic or digest auth works)

```sh
curl http://127.0.0.1:5000/file --user user:pass                 # basic auth
curl http://127.0.0.1:5000/file --user user:pass --digest        # digest auth
```

Resumable downloads

```sh
curl -C- -o file http://127.0.0.1:5000/file
```

Resumable uploads

```sh
upload_offset=$(curl -I -s http://127.0.0.1:5000/file | tr -d '\r' | sed -n 's/content-length: //p')
dd skip=$upload_offset if=file status=none ibs=1 | \
  curl -X PATCH -H "X-Update-Range: append" --data-binary @- http://127.0.0.1:5000/file
```

Health checks

```sh
curl http://127.0.0.1:5000/__dufs__/health
```

<details>
<summary><h2>Advanced Topics</h2></summary>

### Access Control

Dufs supports account based access control. You can control who can do what on which path with `--auth`/`-a`.

```
dufs -a admin:admin@/:rw -a guest:guest@/
dufs -a user:pass@/:rw,/dir1 -a @/
```

1. Use `@` to separate the account and paths. No account means anonymous user.
2. Use `:` to separate the username and password of the account.
3. Use `,` to separate paths.
4. Use path suffix `:rw`/`:ro` set permissions: `read-write`/`read-only`. `:ro` can be omitted.

- `-a admin:admin@/:rw`: `admin` has complete permissions for all paths.
- `-a guest:guest@/`: `guest` has read-only permissions for all paths.
- `-a user:pass@/:rw,/dir1`: `user` has read-write permissions for `/*`, has read-only permissions for `/dir1/*`.
- `-a @/`: All paths is publicly accessible, everyone can view/download it.

**Auth permissions are restricted by dufs global permissions.** If dufs does not enable upload permissions via `--allow-upload`, then the account will not have upload permissions even if it is granted `read-write`(`:rw`) permissions.

#### Hashed Password

DUFS supports the use of sha-512 hashed password.

Create hashed password:

```sh
$ openssl passwd -6 123456 # or `mkpasswd -m sha-512 123456`
$6$tWMB51u6Kb2ui3wd$5gVHP92V9kZcMwQeKTjyTRgySsYJu471Jb1I6iHQ8iZ6s07GgCIO69KcPBRuwPE5tDq05xMAzye0NxVKuJdYs/
```

Use hashed password:

```sh
dufs -a 'admin:$6$tWMB51u6Kb2ui3wd$5gVHP92V9kZcMwQeKTjyTRgySsYJu471Jb1I6iHQ8iZ6s07GgCIO69KcPBRuwPE5tDq05xMAzye0NxVKuJdYs/@/:rw'
```
> The hashed password contains `$6`, which can expand to a variable in some shells, so you have to use **single quotes** to wrap it.

Two important things for hashed passwords:

1. Dufs only supports sha-512 hashed passwords, so ensure that the password string always starts with `$6$`.
2. Digest authentication does not function properly with hashed passwords.


### Hide Paths

Dufs supports hiding paths from directory listings via option `--hidden <glob>,...`.

```
dufs --hidden .git,.DS_Store,tmp
```

> The glob used in --hidden only matches file and directory names, not paths. So `--hidden dir1/file` is invalid.

```sh
dufs --hidden '.*'                          # hidden dotfiles
dufs --hidden '*/'                          # hidden all folders
dufs --hidden '*.log,*.lock'                # hidden by exts
dufs --hidden '*.log' --hidden '*.lock'
```

### Log Format

Dufs supports customize http log format with option `--log-format`.

The log format can use following variables.

| variable     | description                                                               |
| ------------ | ------------------------------------------------------------------------- |
| $remote_addr | client address                                                            |
| $remote_user | user name supplied with authentication                                    |
| $request     | full original request line                                                |
| $status      | response status                                                           |
| $http_       | arbitrary request header field. examples: $http_user_agent, $http_referer |


The default log format is `'$remote_addr "$request" $status'`.
```
2022-08-06T06:59:31+08:00 INFO - 127.0.0.1 "GET /" 200
```

Disable http log
```
dufs --log-format=''
```

Log user-agent
```
dufs --log-format '$remote_addr "$request" $status $http_user_agent'
```
```
2022-08-06T06:53:55+08:00 INFO - 127.0.0.1 "GET /" 200 Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36
```

Log remote-user
```
dufs --log-format '$remote_addr $remote_user "$request" $status' -a /@admin:admin -a /folder1@user1:pass1
```
```
2022-08-06T07:04:37+08:00 INFO - 127.0.0.1 admin "GET /" 200
```

## Environment variables

All options can be set using environment variables prefixed with `DUFS_`.

```
[serve-path]                DUFS_SERVE_PATH="."
    --config <file>         DUFS_CONFIG=config.yaml
-b, --bind <addrs>          DUFS_BIND=0.0.0.0
-p, --port <port>           DUFS_PORT=5000
    --path-prefix <path>    DUFS_PATH_PREFIX=/dufs
    --hidden <value>        DUFS_HIDDEN=tmp,*.log,*.lock
-a, --auth <rules>          DUFS_AUTH="admin:admin@/:rw|@/"
-A, --allow-all             DUFS_ALLOW_ALL=true
    --allow-upload          DUFS_ALLOW_UPLOAD=true
    --allow-delete          DUFS_ALLOW_DELETE=true
    --allow-search          DUFS_ALLOW_SEARCH=true
    --allow-symlink         DUFS_ALLOW_SYMLINK=true
    --allow-archive         DUFS_ALLOW_ARCHIVE=true
    --enable-cors           DUFS_ENABLE_CORS=true
    --render-index          DUFS_RENDER_INDEX=true
    --render-try-index      DUFS_RENDER_TRY_INDEX=true
    --render-spa            DUFS_RENDER_SPA=true
    --assets <path>         DUFS_ASSETS=./assets
    --log-format <format>   DUFS_LOG_FORMAT=""
    --log-file <file>       DUFS_LOG_FILE=./dufs.log
    --compress <compress>   DUFS_COMPRESS=low
    --tls-cert <path>       DUFS_TLS_CERT=cert.pem
    --tls-key <path>        DUFS_TLS_KEY=key.pem
```

## Configuration File

You can specify and use the configuration file by selecting the option `--config <path-to-config.yaml>`.

The following are the configuration items:

```yaml
serve-path: '.'
bind: 0.0.0.0
port: 5000
path-prefix: /dufs
hidden:
  - tmp
  - '*.log'
  - '*.lock'
auth:
  - admin:admin@/:rw
  - user:pass@/src:rw,/share
  - '@/'  # According to the YAML spec, quoting is required.
allow-all: false
allow-upload: true
allow-delete: true
allow-search: true
allow-symlink: true
allow-archive: true
enable-cors: true
render-index: true
render-try-index: true
render-spa: true
assets: ./assets/
log-format: '$remote_addr "$request" $status $http_user_agent'
log-file: ./dufs.log
compress: low
tls-cert: tests/data/cert.pem
tls-key: tests/data/key_pkcs1.pem
```

### Customize UI

Dufs allows users to customize the UI with your own assets.

```
dufs --assets my-assets-dir/
```

> If you only need to make slight adjustments to the current UI, you copy dufs's [assets](https://github.com/sigoden/dufs/tree/main/assets) directory and modify it accordingly. The current UI doesn't use any frameworks, just plain HTML/JS/CSS. As long as you have some basic knowledge of web development, it shouldn't be difficult to modify.

Your assets folder must contains a `index.html` file.

`index.html` can use the following placeholder variables to retrieve internal data.

- `__INDEX_DATA__`: directory listing data
- `__ASSETS_PREFIX__`: assets url prefix

</details>

## License

Copyright (c) 2022-2024 dufs-developers.

dufs is made available under the terms of either the MIT License or the Apache License 2.0, at your option.

See the LICENSE-APACHE and LICENSE-MIT files for license details.
