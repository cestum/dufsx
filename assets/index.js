/**
 * @typedef {object} PathItem
 * @property {"Dir"|"SymlinkDir"|"File"|"SymlinkFile"} path_type
 * @property {string} name
 * @property {number} mtime
 * @property {number} size
 */

/**
 * @typedef {object} DATA
 * @property {string} href
 * @property {string} uri_prefix
 * @property {"Index" | "Edit" | "View"} kind
 * @property {PathItem[]} paths
 * @property {boolean} allow_upload
 * @property {boolean} allow_delete
 * @property {boolean} allow_search
 * @property {boolean} allow_archive
 * @property {boolean} auth
 * @property {string} user
 * @property {boolean} dir_exists
 * @property {string} editable
 */

var DUFS_MAX_UPLOADINGS = 1;

/**
 * @type {DATA} DATA
 */
var DATA;

/**
 * @type {string}
 */
var DIR_EMPTY_NOTE;

/**
 * @type {PARAMS}
 * @typedef {object} PARAMS
 * @property {string} q
 * @property {string} sort
 * @property {string} order
 */
const PARAMS = Object.fromEntries(new URLSearchParams(window.location.search).entries());

const IFRAME_FORMATS = [
  ".pdf",
  ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".svg",
  ".mp4", ".mov", ".avi", ".wmv", ".flv", ".webm",
  ".mp3", ".ogg", ".wav", ".m4a",
];

const IMAGE_FORMATS = [
  ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".svg", ".webp", ".ico", ".tiff", ".tif"
];

const VIDEO_FORMATS = [
  ".mp4", ".mov", ".avi", ".wmv", ".flv", ".webm", ".mkv", ".m4v", ".3gp", ".ogv"
];

const AUDIO_FORMATS = [
  ".mp3", ".ogg", ".wav", ".m4a", ".aac", ".flac", ".wma", ".opus"
];

const PDF_FORMATS = [".pdf"];

const MAX_SUBPATHS_COUNT = 1000;
const EDITABLE_TEXT_MAX_SIZE = 4194304; // 4M

const ICONS = {
  dir: `<svg height="16" viewBox="0 0 14 16" width="14"><path fill-rule="evenodd" d="M13 4H7V3c0-.66-.31-1-1-1H1c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V5c0-.55-.45-1-1-1zM6 4H1V3h5v1z"></path></svg>`,
  symlinkFile: `<svg height="16" viewBox="0 0 12 16" width="12"><path fill-rule="evenodd" d="M8.5 1H1c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1h10c.55 0 1-.45 1-1V4.5L8.5 1zM11 14H1V2h7l3 3v9zM6 4.5l4 3-4 3v-2c-.98-.02-1.84.22-2.55.7-.71.48-1.19 1.25-1.45 2.3.02-1.64.39-2.88 1.13-3.73.73-.84 1.69-1.27 2.88-1.27v-2H6z"></path></svg>`,
  symlinkDir: `<svg height="16" viewBox="0 0 14 16" width="14"><path fill-rule="evenodd" d="M13 4H7V3c0-.66-.31-1-1-1H1c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V5c0-.55-.45-1-1-1zM1 3h5v1H1V3zm6 9v-2c-.98-.02-1.84.22-2.55.7-.71.48-1.19 1.25-1.45 2.3.02-1.64.39-2.88 1.13-3.73C4.86 8.43 5.82 8 7.01 8V6l4 3-4 3H7z"></path></svg>`,
  file: `<svg height="16" viewBox="0 0 12 16" width="12"><path fill-rule="evenodd" d="M6 5H2V4h4v1zM2 8h7V7H2v1zm0 2h7V9H2v1zm0 2h7v-1H2v1zm10-7.5V14c0 .55-.45 1-1 1H1c-.55 0-1-.45-1-1V2c0-.55.45-1 1-1h7.5L12 4.5zM11 5L8 2H1v12h10V5z"></path></svg>`,
  download: `<svg width="16" height="16" viewBox="0 0 16 16"><path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/><path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/></svg>`,
  move: `<svg width="16" height="16" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1.5 1.5A.5.5 0 0 0 1 2v4.8a2.5 2.5 0 0 0 2.5 2.5h9.793l-3.347 3.346a.5.5 0 0 0 .708.708l4.2-4.2a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 8.3H3.5A1.5 1.5 0 0 1 2 6.8V2a.5.5 0 0 0-.5-.5z"/></svg>`,
  edit: `<svg width="16" height="16" viewBox="0 0 16 16"><path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/></svg>`,
  delete: `<svg width="16" height="16" viewBox="0 0 16 16"><path d="M6.854 7.146a.5.5 0 1 0-.708.708L7.293 9l-1.147 1.146a.5.5 0 0 0 .708.708L8 9.707l1.146 1.147a.5.5 0 0 0 .708-.708L8.707 9l1.147-1.146a.5.5 0 0 0-.708-.708L8 8.293 6.854 7.146z"/><path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z"/></svg>`,
  view: `<svg width="16" height="16" viewBox="0 0 16 16"><path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm0 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1"/></svg>`,
}

/**
 * @type Map<string, Uploader>
 */
const failUploaders = new Map();

/**
 * @type Element
 */
let $pathsTable;
/**
 * @type Element
 */
let $pathsTableHead;
/**
 * @type Element
 */
let $pathsTableBody;
/**
 * @type Element
 */
let $uploadersTable;
/**
 * @type Element
 */
let $emptyFolder;
/**
 * @type Element
 */
let $editor;
/**
 * @type EasyMDE
 */
let markdownEditor;
/**
 * @type Element
 */
let $markdownEditorContainer;
/**
 * @type EditorView
 */
let codeMirrorEditor;
/**
 * @type Element
 */
let $editorContainer;
/**
 * @type Element
 */
let $directryContainer;
/**
 * @type number
 */
let autoSaveTimer;
/**
 * @type boolean
 */
let hasUnsavedChanges = false;
let $loginBtn;
/**
 * @type Element
 */
let $logoutBtn;
/**
 * @type Element
 */
let $userName;
let $fileTree;
let $welcomeScreen;
let $fileContent;
let $currentFileName;
let $currentFilePath;
let $contentHeaderCustom;
let currentFilePath = null;
let fileTreeData = {};
let selectedDirectory = null;

// Media viewer elements
let $imageViewer;
let $pdfViewer;
let $videoViewer;
let $audioViewer;
let $mediaViewer;
let $iframeContainer;

// Produce table when window loads
window.addEventListener("DOMContentLoaded", async () => {
  const $indexData = document.getElementById('index-data');
  if (!$indexData) {
    alert("No data");
    return;
  }

  DATA = JSON.parse(decodeBase64($indexData.innerHTML));
  DATA.relative_uri_prefix = DATA.href + DATA.uri_prefix;
  DATA.relative_uri_prefix = DATA.relative_uri_prefix.replace("//", "/");
  DIR_EMPTY_NOTE = PARAMS.q ? 'No results' : DATA.dir_exists ? 'Empty folder' : 'Folder will be created when a file is uploaded';

  await ready();
});

async function ready() {
  // Initialize all DOM elements
  $pathsTable = document.querySelector(".paths-table");
  $pathsTableHead = document.querySelector(".paths-table thead");
  $pathsTableBody = document.querySelector(".paths-table tbody");
  $uploadersTable = document.querySelector(".uploaders-table");
  $emptyFolder = document.querySelector(".empty-folder");
  $editor = document.querySelector(".editor");
  $markdownEditorContainer = document.querySelector("#markdown-editor-container");
  $editorContainer = document.querySelector(".editor-container");
  $directryContainer = document.querySelector(".directory-container");
  $loginBtn = document.querySelector(".login-btn");
  $logoutBtn = document.querySelector(".logout-btn");
  $userName = document.querySelector(".user-name");

  // IDE layout elements
  $fileTree = document.querySelector("#file-tree");
  $welcomeScreen = document.querySelector("#welcome-screen");
  $fileContent = document.querySelector("#file-content");
  $currentFileName = document.querySelector(".current-file-name");
  $currentFilePath = document.querySelector(".current-file-path");
  $contentHeaderCustom = document.querySelector(".content-header-custom");

  // Media viewer elements
  $imageViewer = document.querySelector("#image-viewer");
  $pdfViewer = document.querySelector("#pdf-viewer");
  $videoViewer = document.querySelector("#video-viewer");
  $audioViewer = document.querySelector("#audio-viewer");
  $mediaViewer = document.querySelector("#media-viewer");
  $iframeContainer = document.querySelector("#iframe-container");

  addBreadcrumb(DATA.href, DATA.uri_prefix);

  // Always setup IDE layout
  document.title = `${DATA.href} - Dufs IDE`;
  await setupIDELayout();
}

class Uploader {
  /**
   *
   * @param {File} file
   * @param {string[]} pathParts
   */
  constructor(file, pathParts) {
    /**
     * @type Element
     */
    this.$uploadStatus = null
    this.uploaded = 0;
    this.uploadOffset = 0;
    this.lastUptime = 0;
    this.name = [...pathParts, file.name].join("/");
    this.idx = Uploader.globalIdx++;
    this.file = file;
    this.url = newUrl(this.name);
  }

  upload() {
    const { idx, name, url } = this;
    const encodedName = encodedStr(name);
    $uploadersTable.insertAdjacentHTML("beforeend", `
  <tr id="upload${idx}" class="uploader">
    <td class="path cell-icon">
      ${getPathSvg()}
    </td>
    <td class="path cell-name">
      <a href="${url}">${encodedName}</a>
    </td>
    <td class="cell-status upload-status" id="uploadStatus${idx}"></td>
  </tr>`);
    $uploadersTable.classList.remove("hidden");
    $emptyFolder.classList.add("hidden");
    this.$uploadStatus = document.getElementById(`uploadStatus${idx}`);
    this.$uploadStatus.innerHTML = '-';
    this.$uploadStatus.addEventListener("click", e => {
      const nodeId = e.target.id;
      const matches = /^retry(\d+)$/.exec(nodeId);
      if (matches) {
        const id = parseInt(matches[1]);
        let uploader = failUploaders.get(id);
        if (uploader) uploader.retry();
      }
    });
    Uploader.queues.push(this);
    Uploader.runQueue();
  }

  ajax() {
    const { url } = this;

    this.uploaded = 0;
    this.lastUptime = Date.now();

    const ajax = new XMLHttpRequest();
    ajax.upload.addEventListener("progress", e => this.progress(e), false);
    ajax.addEventListener("readystatechange", () => {
      if (ajax.readyState === 4) {
        if (ajax.status >= 200 && ajax.status < 300) {
          this.complete();
        } else {
          if (ajax.status != 0) {
            this.fail(`${ajax.status} ${ajax.statusText}`);
          }
        }
      }
    })
    ajax.addEventListener("error", () => this.fail(), false);
    ajax.addEventListener("abort", () => this.fail(), false);
    if (this.uploadOffset > 0) {
      ajax.open("PATCH", url);
      ajax.setRequestHeader("X-Update-Range", "append");
      ajax.send(this.file.slice(this.uploadOffset));
    } else {
      ajax.open("PUT", url);
      ajax.send(this.file);
      // setTimeout(() => ajax.abort(), 3000);
    }
  }

  async retry() {
    const { url } = this;
    let res = await fetch(url, {
      method: "HEAD",
    });
    let uploadOffset = 0;
    if (res.status == 200) {
      let value = res.headers.get("content-length");
      uploadOffset = parseInt(value) || 0;
    }
    this.uploadOffset = uploadOffset;
    this.ajax();
  }

  progress(event) {
    const now = Date.now();
    const speed = (event.loaded - this.uploaded) / (now - this.lastUptime) * 1000;
    const [speedValue, speedUnit] = formatFileSize(speed);
    const speedText = `${speedValue} ${speedUnit}/s`;
    const progress = formatPercent(((event.loaded + this.uploadOffset) / this.file.size) * 100);
    const duration = formatDuration((event.total - event.loaded) / speed);
    this.$uploadStatus.innerHTML = `<span style="width: 80px;">${speedText}</span><span>${progress} ${duration}</span>`;
    this.uploaded = event.loaded;
    this.lastUptime = now;
  }

  complete() {
    const $uploadStatusNew = this.$uploadStatus.cloneNode(true);
    $uploadStatusNew.innerHTML = `✓`;
    this.$uploadStatus.parentNode.replaceChild($uploadStatusNew, this.$uploadStatus);
    this.$uploadStatus = null;
    failUploaders.delete(this.idx);
    Uploader.runnings--;
    Uploader.runQueue();
  }

  fail(reason = "") {
    this.$uploadStatus.innerHTML = `<span style="width: 20px;" title="${reason}">✗</span><span class="retry-btn" id="retry${this.idx}" title="Retry">↻</span>`;
    failUploaders.set(this.idx, this);
    Uploader.runnings--;
    Uploader.runQueue();
  }
}

Uploader.globalIdx = 0;

Uploader.runnings = 0;

Uploader.auth = false;

/**
 * @type Uploader[]
 */
Uploader.queues = [];


Uploader.runQueue = async () => {
  if (Uploader.runnings >= DUFS_MAX_UPLOADINGS) return;
  if (Uploader.queues.length == 0) return;
  Uploader.runnings++;
  let uploader = Uploader.queues.shift();
  if (!Uploader.auth) {
    Uploader.auth = true;
    try {
      await checkAuth();
    } catch {
      Uploader.auth = false;
    }
  }
  uploader.ajax();
}

/**
 * Add breadcrumb
 * @param {string} href
 * @param {string} uri_prefix
 */
function addBreadcrumb(href, uri_prefix) {
  const $breadcrumb = document.querySelector(".breadcrumb");
  let parts = [];
  if (href === "/") {
    parts = [""];
  } else {
    parts = href.split("/");
  }
  const len = parts.length;
  let path = uri_prefix;
  for (let i = 0; i < len; i++) {
    const name = parts[i];
    if (i > 0) {
      if (!path.endsWith("/")) {
        path += "/";
      }
      path += encodeURIComponent(name);
    }
    const encodedName = encodedStr(name);
    if (i === 0) {
      $breadcrumb.insertAdjacentHTML("beforeend", `<a href="${path}" title="Root"><svg width="16" height="16" viewBox="0 0 16 16"><path d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5z"/></svg></a>`);
    } else if (i === len - 1) {
      $breadcrumb.insertAdjacentHTML("beforeend", `<b>${encodedName}</b>`);
    } else {
      $breadcrumb.insertAdjacentHTML("beforeend", `<a href="${path}">${encodedName}</a>`);
    }
    if (i !== len - 1) {
      $breadcrumb.insertAdjacentHTML("beforeend", `<span class="separator">/</span>`);
    }
  }
}

// async function setupIndexPage(paths) {
//   hideAllViewers();
//   $fileContent.classList.remove('hidden');

//   if (DATA.allow_archive) {
//     const $download = document.querySelector(".download");
//     $download.href = baseUrl() + "?zip";
//     $download.title = "Download folder as a .zip file";
//     $download.classList.remove("hidden");
//   }

//   if (DATA.allow_upload) {
//     setupDropzone();
//     setupUploadFile();
//     setupNewFolder();
//     setupNewFile();
//   }

//   if (DATA.auth) {
//     await setupAuth();
//   }

//   if (DATA.allow_search) {
//     setupSearch();
//   }

//   renderPathsTableHead();
//   renderPathsTableBody(paths);
// }

/**
 * Render path table thead
 */
// function renderPathsTableHead() {
//   const headerItems = [
//     {
//       name: "name",
//       props: `colspan="2"`,
//       text: "Name",
//     },
//     {
//       name: "mtime",
//       props: ``,
//       text: "Last Modified",
//     },
//     {
//       name: "size",
//       props: ``,
//       text: "Size",
//     }
//   ];
//   $pathsTableHead.innerHTML = `
//     <tr>
//       ${headerItems.map(item => {
//     let svg = `<svg width="12" height="12" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M11.5 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L11 2.707V14.5a.5.5 0 0 0 .5.5zm-7-14a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L4 13.293V1.5a.5.5 0 0 1 .5-.5z"/></svg>`;
//     let order = "desc";
//     if (PARAMS.sort === item.name) {
//       if (PARAMS.order === "desc") {
//         order = "asc";
//         svg = `<svg width="12" height="12" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z"/></svg>`
//       } else {
//         svg = `<svg width="12" height="12" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"/></svg>`
//       }
//     }
//     const qs = new URLSearchParams({ ...PARAMS, order, sort: item.name }).toString();
//     const icon = `<span>${svg}</span>`
//     return `<th class="cell-${item.name}" ${item.props}><a href="?${qs}">${item.text}${icon}</a></th>`
//   }).join("\n")}
//       <th class="cell-actions">Actions</th>
//     </tr>
//   `;
// }

// /**
//  * Render path table tbody
//  */
// function renderPathsTableBody(paths) {
//   if (paths && paths.length > 0) {
//     console.log("Rendering paths", paths);
//     const len = paths.length;
//     if (len > 0) {
//       $pathsTable.classList.remove("hidden");
//       $pathsTableBody.innerHTML = "";
//     }
//     for (let i = 0; i < len; i++) {
//       addPath(paths[i], i);
//     }
//   } else {
//     $emptyFolder.textContent = DIR_EMPTY_NOTE;
//     $emptyFolder.classList.remove("hidden");
//   }
// }

/**
 * Add pathitem
 * @param {PathItem} file
 * @param {number} index
 */
function addPath(file, index) {
  const encodedName = encodedStr(file.name);
  let url = newUrl(file.name);
  let actionDelete = "";
  let actionDownload = "";
  let actionMove = "";
  let actionEdit = "";
  let actionView = "";
  let isDir = file.path_type.endsWith("Dir");
  if (isDir) {
    url += "/";
    if (DATA.allow_archive) {
      actionDownload = `
      <div class="action-btn">
        <a href="${url}?zip" title="Download folder as a .zip file">${ICONS.download}</a>
      </div>`;
    }
  } else {
    actionDownload = `
    <div class="action-btn" >
      <a href="${url}" title="Download file" download>${ICONS.download}</a>
    </div>`;
  }
  if (DATA.allow_delete) {
    if (DATA.allow_upload) {
      actionMove = `<div onclick="movePath(${index})" class="action-btn" id="moveBtn${index}" title="Move to new path">${ICONS.move}</div>`;
      if (!isDir) {
        actionEdit = `<a class="action-btn" title="Edit file" target="_blank" href="${url}?edit">${ICONS.edit}</a>`;
      }
    }
    actionDelete = `
    <div onclick="deletePath(${index})" class="action-btn" id="deleteBtn${index}" title="Delete">${ICONS.delete}</div>`;
  }
  if (!actionEdit && !isDir) {
    actionView = `<a class="action-btn" title="View file" target="_blank" href="${url}?view">${ICONS.view}</a>`;
  }
  let actionCell = `
  <td class="cell-actions">
    ${actionDownload}
    ${actionView}
    ${actionMove}
    ${actionDelete}
    ${actionEdit}
  </td>`;

  let sizeDisplay = isDir ? formatDirSize(file.size) : formatFileSize(file.size).join(" ");

  $pathsTableBody.insertAdjacentHTML("beforeend", `
<tr id="addPath${index}">
  <td class="path cell-icon">
    ${getPathSvg(file.path_type)}
  </td>
  <td class="path cell-name">
    <a href="${url}" ${isDir ? "" : `target="_blank"`}>${encodedName}</a>
  </td>
  <td class="cell-mtime">${formatMtime(file.mtime)}</td>
  <td class="cell-size">${sizeDisplay}</td>
  ${actionCell}
</tr>`);
}

function setupDropzone() {
  ["drag", "dragstart", "dragend", "dragover", "dragenter", "dragleave", "drop"].forEach(name => {
    document.addEventListener(name, e => {
      e.preventDefault();
      e.stopPropagation();
    });
  });
  document.addEventListener("drop", async e => {
    if (!e.dataTransfer.items[0].webkitGetAsEntry) {
      const files = Array.from(e.dataTransfer.files).filter(v => v.size > 0);
      for (const file of files) {
        new Uploader(file, [selectedDirectory]).upload();
      }
    } else {
      const entries = [];
      const len = e.dataTransfer.items.length;
      for (let i = 0; i < len; i++) {
        entries.push(e.dataTransfer.items[i].webkitGetAsEntry());
      }
      addFileEntries(entries, [selectedDirectory]);
    }
  });
}

async function setupAuth() {
  if (DATA.user) {
    $logoutBtn.classList.remove("hidden");
    $logoutBtn.addEventListener("click", logout);
    $userName.textContent = DATA.user;
  } else {
    $loginBtn.classList.remove("hidden");
    $loginBtn.addEventListener("click", async () => {
      try {
        await checkAuth();
      } catch {}
      location.reload();
    });
  }
}

function setupSearch() {
  const $searchbar = document.querySelector(".searchbar");
  $searchbar.classList.remove("hidden");
  $searchbar.addEventListener("submit", event => {
    event.preventDefault();
    const formData = new FormData($searchbar);
    const q = formData.get("q");
    let href = baseUrl();
    if (q) {
      href += "?q=" + q;
    }
    location.href = href;
  });
  if (PARAMS.q) {
    document.getElementById('search').value = PARAMS.q;
  }
}

function setupUploadFile() {
  document.querySelector(".upload-file").classList.remove("hidden");
  document.getElementById("file").addEventListener("change", async e => {
    const files = e.target.files;
    for (let file of files) {
      new Uploader(file, [selectedDirectory]).upload();
    }
  });
}

function setupNewFolder() {
  const $newFolder = document.querySelector(".new-folder");
  $newFolder.classList.remove("hidden");
  $newFolder.addEventListener("click", () => {
    const name = prompt("Enter folder name");
    if (name) createFolder(name);
  });
}

function setupNewFile() {
  const $newFile = document.querySelector(".new-file");
  $newFile.classList.remove("hidden");
  $newFile.addEventListener("click", () => {
    const name = prompt("Enter file name");
    if (name) createFile(name);
  });
}

function isMarkdownFile(filename) {
  const ext = extName(filename).toLowerCase();
  return ['.md', '.markdown', '.mdown', '.mkd', '.mkdn', '.mdx'].includes(ext);
}

function getFileType(filename) {
  const ext = extName(filename).toLowerCase();

  if (IMAGE_FORMATS.includes(ext)) return 'image';
  if (VIDEO_FORMATS.includes(ext)) return 'video';
  if (AUDIO_FORMATS.includes(ext)) return 'audio';
  if (PDF_FORMATS.includes(ext)) return 'pdf';
  if (isMarkdownFile(filename)) return 'markdown';

  // Check if it's a text file
  const textExts = ['.txt', '.log', '.json', '.xml', '.html', '.htm', '.css', '.js', '.ts',
                   '.jsx', '.tsx', '.py', '.java', '.c', '.cpp', '.h', '.hpp', '.rs', '.go',
                   '.php', '.rb', '.sh', '.bash', '.zsh', '.fish', '.ps1', '.bat', '.cmd',
                   '.yml', '.yaml', '.toml', '.ini', '.conf', '.cfg', '.properties'];
  if (textExts.includes(ext)) return 'text';

  return 'binary';
}

function cleanupEditor() {
  if (markdownEditor) {
    markdownEditor.toTextArea();
    markdownEditor = null;
  }

  if (codeMirrorEditor) {
    codeMirrorEditor.destroy();
    codeMirrorEditor = null;
  }

  // Stop auto-save timer
  if (autoSaveTimer) {
    clearInterval(autoSaveTimer);
    autoSaveTimer = null;
  }

  // Clear the markdown editor container
  if ($markdownEditorContainer) {
    $markdownEditorContainer.innerHTML = '';
    $markdownEditorContainer.classList.add("hidden");
  }

  // Hide the basic editor
  if ($editor) {
    $editor.classList.add("hidden");
    $editor.value = '';
  }

  // Clear enhanced editor container
  if ($editorContainer) {
    $editorContainer.innerHTML = '';
    $editorContainer.classList.add("hidden");
  }

  if ($directryContainer) {
    $directryContainer.innerHTML = "";
    $directryContainer.classList.add("hidden");
  }

  if ($pathsTable) {
    $pathsTableBody.innerHTML = "";
    $pathsTableHead.innerHTML = "";
    $pathsTable.classList.add("hidden");
  }

  // Reset unsaved changes
  setUnsavedChanges(false);

  // Hide all media viewers
  hideAllViewers();

  hasUnsavedChanges = false;
}

function getCurrentEditorContent() {
  if (markdownEditor) {
    return markdownEditor.value();
  } else if (codeMirrorEditor) {
    return codeMirrorEditor.state.doc.toString();
  } else if ($editor) {
    return $editor.value;
  }
  return '';
}

function startAutoSave() {
  if (DATA.kind !== "Edit") return;

  // Clear existing timer
  if (autoSaveTimer) {
    clearInterval(autoSaveTimer);
  }

  // Auto-save every 30 seconds if there are unsaved changes
  autoSaveTimer = setInterval(async () => {
    if (hasUnsavedChanges) {
      try {
        await saveChange(true); // true indicates auto-save
      } catch (err) {
        console.warn('Auto-save failed:', err.message);
      }
    }
  }, 30000);
}

function setUnsavedChanges(unsaved) {
  hasUnsavedChanges = unsaved;
  const $saveBtn = document.querySelector(".save-btn");
  if ($saveBtn) {
    if (unsaved) {
      $saveBtn.classList.add("unsaved");
      $saveBtn.title = "Save file (unsaved changes)";
    } else {
      $saveBtn.classList.remove("unsaved");
      $saveBtn.title = "Save file";
    }
  }
}

function selectTreeItem(treeItem) {
  // Remove selection from all items
  document.querySelectorAll('.tree-item.selected').forEach(item => {
    item.classList.remove('selected');
  });

  // Select current item
  treeItem.classList.add('selected');
}

function showWelcomeScreen() {
  $welcomeScreen.classList.remove('hidden');
  $fileContent.classList.add('hidden');
  $currentFileName.textContent = 'No file selected';
  $currentFilePath.textContent = '';
  currentFilePath = null;

  // Hide file actions
  document.querySelector('.download').classList.add('hidden');
  document.querySelector('.move-file').classList.add('hidden');
  document.querySelector('.delete-file').classList.add('hidden');
  document.querySelector('.save-btn').classList.add('hidden');
}

async function loadFileContent(path, fileInfo) {
  try {
    currentFilePath = path;
    $currentFileName.textContent = fileInfo.name;
    $currentFilePath.textContent = path;
    $contentHeaderCustom.innerHTML = "";

    // Show file actions
    const $download = document.querySelector('.download');
    $download.classList.remove('hidden');
    $download.href = `${DATA.relative_uri_prefix}${encodeURIComponent(path)}`;

    if (DATA.allow_delete) {
      const $deleteFile = document.querySelector('.delete-file');
      $deleteFile.classList.remove('hidden');
      $deleteFile.onclick = () => deleteCurrentFile();
    }

    if (DATA.allow_upload) {
      const $moveFile = document.querySelector('.move-file');
      $moveFile.classList.remove('hidden');
      $moveFile.onclick = () => moveCurrentFile();
    }

    // Hide welcome screen, show content
    $welcomeScreen.classList.add('hidden');
    $fileContent.classList.remove('hidden');

    // Clean up previous editor
    cleanupEditor();

    // Check if file is editable
    const url = `${DATA.relative_uri_prefix}${encodeURIComponent(path)}`;
    const response = await fetch(url, { method: 'HEAD' });

    const contentLength = parseInt(response.headers.get('content-length') || '0');
    let isEditable = true;

    const contentType = response.headers.get('content-type') || "";

    if (contentType.indexOf("application/octet-stream") > -1 ) {
      isEditable = false;
    }
    console.log("Content type is ", contentType, isEditable);
    //restrict by content length
    isEditable = contentLength <= EDITABLE_TEXT_MAX_SIZE;
    // For non-editable files, check if we can still display them
    if (!isEditable) {
      const fileType = getFileType(fileInfo.name);

      if (['image', 'video', 'audio', 'pdf'].includes(fileType)) {
        // These can be displayed even if not editable
        switch (fileType) {
          case 'image':
            setupImageViewer(url);
            break;
          case 'video':
            setupVideoViewer(url);
            break;
          case 'audio':
            setupAudioViewer(url, fileInfo.name);
            break;
          case 'pdf':
            setupPDFViewer(url);
            break;
        }
        return;
      }

      const ext = extName(fileInfo.name);
      if (IFRAME_FORMATS.find(v => v === ext)) {
        $iframeContainer.innerHTML = `<iframe src="${url}" sandbox></iframe>`;
        $iframeContainer.classList.remove('hidden');
      } else {
        const $notEditable = document.querySelector('.not-editable');
        $notEditable.classList.remove('hidden');
        $notEditable.textContent = 'Cannot edit because file is too large or binary.';
      }
      return;
    }

    // Show save button for editable files
    if (DATA.allow_upload) {
      const $saveBtn = document.querySelector('.save-btn');
      $saveBtn.classList.remove('hidden');
      $saveBtn.onclick = () => saveChange();
    }

    // Load file content
    const contentResponse = await fetch(url);
    await assertResOK(contentResponse);
    const encoding = getEncoding(contentResponse.headers.get('content-type'));
    let content;
    if (encoding === 'utf-8') {
      content = await contentResponse.text();
    } else {
      const bytes = await contentResponse.arrayBuffer();
      const dataView = new DataView(bytes);
      const decoder = new TextDecoder(encoding);
      content = decoder.decode(dataView);
    }

    // Setup appropriate viewer/editor based on file type
    const fileType = getFileType(fileInfo.name);

    switch (fileType) {
      case 'image':
        setupImageViewer(url);
        break;
      case 'video':
        setupVideoViewer(url);
        break;
      case 'audio':
        setupAudioViewer(url, fileInfo.name);
        break;
      case 'pdf':
        setupPDFViewer(url);
        break;
      case 'markdown':
        if (typeof EasyMDE !== 'undefined') {
          await setupMarkdownEditor(content);
        } else {
          setupTextEditor(content);
        }
        break;
      case 'text':
        setupTextEditor(content);
        break;
      default:
        setupBasicTextEditor(content);
        break;
    }

    // Add beforeunload warning
    window.addEventListener('beforeunload', handleBeforeUnload);

  } catch (err) {
    alert(`Failed to load file: ${err.message}`);
  }
}

async function setupMarkdownEditor(content) {
  $markdownEditorContainer.classList.remove('hidden');

  // Create a textarea for EasyMDE
  const textarea = document.createElement('textarea');
  textarea.value = content;
  $markdownEditorContainer.appendChild(textarea);

  markdownEditor = new EasyMDE({
    element: textarea,
    initialValue: content,
    spellChecker: false,
    autofocus: true,
    placeholder: "Type your markdown here...",
    status: ['autosave', 'lines', 'words', 'cursor', {
      className: 'keystrokes',
      defaultValue: function(el) {
        el.innerHTML = 'Ctrl+S to save';
      }
    }],
    toolbar: [
      'bold', 'italic', 'strikethrough', '|',
      'heading-1', 'heading-2', 'heading-3', '|',
      'quote', 'unordered-list', 'ordered-list', '|',
      'link', 'image', 'table', '|',
      'code', 'horizontal-rule', '|',
      'preview', 'side-by-side', 'fullscreen', '|',
      'guide'
    ],
    shortcuts: {
      'toggleBold': 'Cmd-B',
      'toggleItalic': 'Cmd-I',
      'togglePreview': 'Cmd-P',
      'toggleSideBySide': 'F9',
      'toggleFullScreen': 'F11'
    }
  });

  // Add keyboard shortcuts
  markdownEditor.codemirror.setOption("extraKeys", {
    "Ctrl-S": function() {
      saveChange();
      return false;
    },
    "Cmd-S": function() {
      saveChange();
      return false;
    }
  });

  // Add change listener
  markdownEditor.codemirror.on("change", function() {
    setUnsavedChanges(true);
  });

  if (DATA.allow_upload) {
    startAutoSave();
  }
}

function setupTextEditor(content) {
  // Check if CodeMirror 6 is available
  if (window.CodeMirror6) {
    setupEnhancedTextEditor(content);
  } else {
    // Fallback to basic textarea
    setupBasicTextEditor(content);
  }
}

function setupBasicTextEditor(content) {
  $editor.classList.remove('hidden');
  $editor.value = content;

  // Add keyboard shortcuts
  $editor.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      saveChange();
    }
  });

  // Add change listener
  if (DATA.allow_upload) {
    $editor.addEventListener('input', function() {
      setUnsavedChanges(true);
    });
    startAutoSave();
  }
}

async function setupEnhancedTextEditor(content) {
  // Create editor container if it doesn't exist
  if (!$editorContainer) {
    $editorContainer = document.createElement('div');
    $editorContainer.className = 'editor-container';
    $editor.parentNode.insertBefore($editorContainer, $editor);
  }

  $editorContainer.classList.remove('hidden');

  // Create toolbar
  const toolbar = createEditorToolbar();
  // $editorContainer.appendChild(toolbar);

  // Create editor wrapper
  const editorWrapper = document.createElement('div');
  editorWrapper.className = 'editor-wrapper';
  $editorContainer.appendChild(editorWrapper);

  // Detect language for syntax highlighting
  const language = detectLanguage(currentFilePath);
  const languageExtension = getLanguageExtension(language);

  // Create CodeMirror extensions
  const extensions = [
    window.CodeMirror6.basicSetup,
    window.CodeMirror6.languageCompartment.of(languageExtension)
  ]

  // Add theme (you can make this configurable)
  const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (isDarkMode) {
    extensions.push(window.CodeMirror6.themes.oneDark);
  }

  // Add change listener
  if (DATA.allow_upload) {
      extensions.push(window.CodeMirror6.EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          setUnsavedChanges(true);
        }
      }));

    // console.log("reconfigure...1", extensions);
    // codeMirrorEditor.dispatch({
    //   effects: window.CodeMirror6.EditorState.reconfigure.of([
    //     ...extensions,
    //     updateListener
    //   ])
    // });

    startAutoSave();
  }

  // Create editor state
  const state = window.CodeMirror6.EditorState.create({
    doc: content,
    extensions: extensions
  });

  // Create editor view
  codeMirrorEditor = new window.CodeMirror6.EditorView({
    state: state,
    parent: editorWrapper
  });

  // Update toolbar info
  updateEditorInfo();
}

function createEditorToolbar() {
  // const toolbar = document.createElement('div');
  const toolbar = $contentHeaderCustom;
  // toolbar.className = 'editor-toolbar';

  // <button id="format-btn" title="Format Document (Ctrl+Shift+F)">Format</button>
  // <button id="fold-all-btn" title="Fold All">Fold All</button>
  // <button id="unfold-all-btn" title="Unfold All">Unfold All</button>
  toolbar.innerHTML = `
    <div class="separator"></div>
    <select id="language-select" title="Language Mode">
      <option value="javascript">JavaScript</option>
      <option value="python">Python</option>
      <option value="java">Java</option>
      <option value="cpp">C++</option>
      <option value="rust">Rust</option>
      <option value="go">Go</option>
      <option value="php">PHP</option>
      <option value="html">HTML</option>
      <option value="css">CSS</option>
      <option value="json">JSON</option>
      <option value="xml">XML</option>
      <option value="sql">SQL</option>
      <option value="yaml">YAML</option>
      <option value="markdown">Markdown</option>
      <option value="text">Plain Text</option>
    </select>
    <div class="separator"></div>
    <span class="file-info" id="editor-info">Ready</span>
  `;

  // Add event listeners
  // const formatBtn = toolbar.querySelector('#format-btn');
  // const foldAllBtn = toolbar.querySelector('#fold-all-btn');
  // const unfoldAllBtn = toolbar.querySelector('#unfold-all-btn');
  const languageSelect = toolbar.querySelector('#language-select');

  // formatBtn.addEventListener('click', formatDocument);
  // foldAllBtn.addEventListener('click', foldAll);
  // unfoldAllBtn.addEventListener('click', unfoldAll);
  languageSelect.addEventListener('change', changeLanguage);

  // Set initial language
  const detectedLang = detectLanguage(currentFilePath);
  languageSelect.value = detectedLang;

  return toolbar;
}

function detectLanguage(filePath) {
  if (!filePath) return 'text';

  const ext = filePath.toLowerCase().split('.').pop();
  const languageMap = {
    'js': 'javascript',
    'jsx': 'javascript',
    'ts': 'javascript',
    'tsx': 'javascript',
    'py': 'python',
    'java': 'java',
    'cpp': 'cpp',
    'cc': 'cpp',
    'cxx': 'cpp',
    'c': 'cpp',
    'h': 'cpp',
    'hpp': 'cpp',
    'rs': 'rust',
    'go': 'go',
    'php': 'php',
    'html': 'html',
    'htm': 'html',
    'css': 'css',
    'scss': 'css',
    'sass': 'css',
    'less': 'css',
    'json': 'json',
    'xml': 'xml',
    'svg': 'xml',
    'sql': 'sql',
    'yaml': 'yaml',
    'yml': 'yaml',
    'md': 'markdown',
    'markdown': 'markdown'
  };

  return languageMap[ext] || 'text';
}

function getLanguageExtension(language) {
  if (!window.CodeMirror6 || !window.CodeMirror6.languages) return [];

  const languages = window.CodeMirror6.languages;
  switch (language) {
    case 'javascript': return languages.javascript();
    case 'python': return languages.python();
    case 'java': return languages.java();
    case 'cpp': return languages.cpp();
    case 'rust': return languages.rust();
    case 'go': return languages.go();
    case 'php': return languages.php();
    case 'html': return languages.html();
    case 'css': return languages.css();
    case 'json': return languages.json();
    case 'xml': return languages.xml();
    case 'sql': return languages.sql();
    case 'yaml': return languages.yaml();
    case 'markdown': return languages.markdown();
    default: return [];
  }
}

function formatDocument() {
  if (!codeMirrorEditor) return;

  // Basic formatting - indent properly
  const doc = codeMirrorEditor.state.doc;
  const formatted = formatCode(doc.toString(), detectLanguage(currentFilePath));

  codeMirrorEditor.dispatch({
    changes: {
      from: 0,
      to: doc.length,
      insert: formatted
    }
  });

  showMessage('Document formatted');
}

function formatCode(code, language) {
  // Basic code formatting logic - needs work use prettier lib
  const lines = code.split('\n');
  let indentLevel = 0;
  const indentSize = 2;

  return lines.map(line => {
    const trimmed = line.trim();
    if (!trimmed) return '';

    // Decrease indent for closing brackets
    if (trimmed.match(/^[}\])]/) && indentLevel > 0) {
      indentLevel--;
    }

    const formatted = ' '.repeat(indentLevel * indentSize) + trimmed;

    // Increase indent for opening brackets
    if (trimmed.match(/[{\[(]$/) || trimmed.match(/:\s*$/) && language === 'python') {
      indentLevel++;
    }

    return formatted;
  }).join('\n');
}

function foldAll() {
  if (!codeMirrorEditor || !window.CodeMirror6.extensions.foldAll) return;

  window.CodeMirror6.extensions.foldAll(codeMirrorEditor);
  showMessage('All sections folded');
}

function unfoldAll() {
  if (!codeMirrorEditor || !window.CodeMirror6.extensions.unfoldAll) return;

  window.CodeMirror6.extensions.unfoldAll(codeMirrorEditor);
  showMessage('All sections unfolded');
}

function changeLanguage() {
  if (!codeMirrorEditor) return;
  const languageSelect = document.querySelector('#language-select');
  const newLanguage = languageSelect.value;
  const languageExtension = getLanguageExtension(newLanguage);

  // // Reconfigure editor with new language
  // const extensions = [
  //   // window.CodeMirror6.basicSetup,
  //   window.CodeMirror6.extensions.keymap.of([
  //     ...window.CodeMirror6.extensions.defaultKeymap,
  //     ...window.CodeMirror6.extensions.searchKeymap,
  //     window.CodeMirror6.extensions.indentWithTab
  //   ]),
  //   window.CodeMirror6.extensions.foldGutter(),
  //   window.CodeMirror6.extensions.search(),
  //   window.CodeMirror6.extensions.autocompletion(),
  //   // window.CodeMirror6.extensions.lintGutter()
  // ];

  // // if (languageExtension) {
  // //   extensions.push(languageExtension);
  // // }

  codeMirrorEditor.dispatch({
    effects: window.CodeMirror6.languageCompartment.reconfigure(languageExtension)
  });

  showMessage(`Language changed to ${newLanguage}`);
}

function updateEditorInfo() {
  if (!codeMirrorEditor) return;

  const editorInfo = document.querySelector('#editor-info');
  if (!editorInfo) return;

  const doc = codeMirrorEditor.state.doc;
  const lines = doc.lines;
  const chars = doc.length;

  editorInfo.textContent = `Lines: ${lines}, Characters: ${chars}`;
}

function showMessage(message) {
  // Simple message display - you could enhance this with better UI
  console.log(message);

  // Update editor info temporarily
  const editorInfo = document.querySelector('#editor-info');
  if (editorInfo) {
    const originalText = editorInfo.textContent;
    editorInfo.textContent = message;
    setTimeout(() => {
      editorInfo.textContent = originalText;
    }, 2000);
  }
}

function handleBeforeUnload(e) {
  if (hasUnsavedChanges && DATA.allow_upload) {
    e.preventDefault();
    e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
    return 'You have unsaved changes. Are you sure you want to leave?';
  }
}

function hideAllViewers() {
  $imageViewer.classList.add('hidden');
  $pdfViewer.classList.add('hidden');
  $videoViewer.classList.add('hidden');
  $audioViewer.classList.add('hidden');
  $mediaViewer.classList.add('hidden');
  $iframeContainer.classList.add('hidden');
  document.querySelector('.not-editable').classList.add('hidden');
  $directryContainer.classList.add('hidden');
  $editor.classList.add('hidden');
  $markdownEditorContainer.classList.add('hidden');
  if ($editorContainer) {
    $editorContainer.classList.add('hidden');
  }
}

function setupImageViewer(url) {
  hideAllViewers();

  const imageDisplay = document.querySelector('#image-display');
  const zoomLevel = document.querySelector('.zoom-level');
  const imageInfo = document.querySelector('.image-info');

  $imageViewer.classList.remove('hidden');
  imageDisplay.src = url;

  let currentZoom = 1;
  let isDragging = false;
  let startX, startY, scrollLeft, scrollTop;

  // Load image and get dimensions
  imageDisplay.onload = function() {
    const dimensions = `${this.naturalWidth} × ${this.naturalHeight}`;
    imageInfo.innerHTML = `<span class="image-dimensions">${dimensions}</span>`;
    updateZoom(1);
  };

  function updateZoom(zoom) {
    currentZoom = zoom;
    imageDisplay.style.transform = `scale(${zoom})`;
    zoomLevel.textContent = `${Math.round(zoom * 100)}%`;
  }

  // Zoom controls
  document.querySelector('#zoom-in').onclick = () => updateZoom(currentZoom * 1.25);
  document.querySelector('#zoom-out').onclick = () => updateZoom(currentZoom / 1.25);
  document.querySelector('#fit-to-screen').onclick = () => {
    const container = document.querySelector('.image-container');
    const scaleX = container.clientWidth / imageDisplay.naturalWidth;
    const scaleY = container.clientHeight / imageDisplay.naturalHeight;
    updateZoom(Math.min(scaleX, scaleY, 1));
  };
  document.querySelector('#actual-size').onclick = () => updateZoom(1);

  // Pan functionality
  const container = document.querySelector('.image-container');

  imageDisplay.onmousedown = (e) => {
    isDragging = true;
    startX = e.pageX - container.offsetLeft;
    startY = e.pageY - container.offsetTop;
    scrollLeft = container.scrollLeft;
    scrollTop = container.scrollTop;
    e.preventDefault();
  };

  container.onmousemove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const y = e.pageY - container.offsetTop;
    const walkX = (x - startX) * 2;
    const walkY = (y - startY) * 2;
    container.scrollLeft = scrollLeft - walkX;
    container.scrollTop = scrollTop - walkY;
  };

  document.onmouseup = () => {
    isDragging = false;
  };
}

function setupPDFViewer(url) {
  hideAllViewers();

  const pdfDisplay = document.querySelector('#pdf-display');
  const downloadLink = document.querySelector('#pdf-download');

  $pdfViewer.classList.remove('hidden');
  pdfDisplay.src = url;
  downloadLink.href = url;

  // Note: Advanced PDF controls would require PDF.js library
  // For now, we use the browser's built-in PDF viewer
}

function setupVideoViewer(url) {
  hideAllViewers();

  const videoDisplay = document.querySelector('#video-display');

  $videoViewer.classList.remove('hidden');
  videoDisplay.src = url;
  videoDisplay.load();
}

function setupAudioViewer(url, filename) {
  hideAllViewers();

  const audioDisplay = document.querySelector('#audio-display');
  const audioTitle = document.querySelector('.audio-title');

  $audioViewer.classList.remove('hidden');
  audioDisplay.src = url;
  audioTitle.textContent = filename;
  audioDisplay.load();

  // Update metadata when loaded
  audioDisplay.onloadedmetadata = function() {
    const duration = formatDuration(this.duration);
    const metadata = document.querySelector('.audio-metadata');
    metadata.innerHTML = `<span class="audio-duration">${duration}</span>`;
  };
}

function setupMediaViewer(url, filename) {
  hideAllViewers();

  const mediaFilename = document.querySelector('.media-filename');
  const mediaDownload = document.querySelector('#media-download');

  $mediaViewer.classList.remove('hidden');
  mediaFilename.textContent = filename;
  mediaDownload.href = url;
  mediaDownload.download = filename;
}

async function deleteCurrentFile() {
  if (!currentFilePath) return;

  const name = baseName(currentFilePath);
  if (!confirm(`Delete \`${name}\`?`)) return;

  try {
    await checkAuth();
    const url = `${DATA.relative_uri_prefix}${encodeURIComponent(currentFilePath)}`;
    const res = await fetch(url, { method: 'DELETE' });
    await assertResOK(res);

    // Refresh tree and show welcome screen
    await refreshFileTree();
    showWelcomeScreen();
  } catch (err) {
    alert(`Cannot delete \`${name}\`, ${err.message}`);
  }
}

async function moveCurrentFile() {
  if (!currentFilePath) return;

  const newPath = prompt('Enter new path:', currentFilePath);
  if (!newPath || newPath === currentFilePath) return;

  try {
    await checkAuth();
    const url = `${DATA.relative_uri_prefix}${encodeURIComponent(currentFilePath)}`;
    const destUrl = `${location.origin}${DATA.relative_uri_prefix}${encodeURIComponent(newPath)}`;

    const res = await fetch(url, {
      method: 'MOVE',
      headers: { 'Destination': destUrl }
    });
    await assertResOK(res);

    // Refresh tree and load new file
    await refreshFileTree();
    // Find and select the moved file
    const treeItem = findTreeItem(newPath);
    if (treeItem) {
      selectTreeItem(treeItem);
      const fileInfo = getFileInfoFromTreeItem(treeItem);
      await loadFileContent(newPath, fileInfo);
    }
  } catch (err) {
    alert(`Cannot move file, ${err.message}`);
  }
}

async function setupIDELayout() {
  await setupAuth();
  setupResizer();
  setupTreeActions();
  await buildFileTree();
  showWelcomeScreen();
}

function setupResizer() {
  const resizer = document.querySelector('.resizer');
  const treePanel = document.querySelector('.file-tree-panel');
  let isResizing = false;

  resizer.addEventListener('mousedown', (e) => {
    isResizing = true;
    resizer.classList.add('dragging');
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    e.preventDefault();
  });

  function handleMouseMove(e) {
    if (!isResizing) return;
    const newWidth = e.clientX;
    if (newWidth >= 200 && newWidth <= 500) {
      treePanel.style.width = newWidth + 'px';
    }
  }

  function handleMouseUp() {
    isResizing = false;
    resizer.classList.remove('dragging');
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }
}

function setupTreeActions() {
  document.querySelector('.new-file-tree').addEventListener('click', createNewFile);
  document.querySelector('.new-folder-tree').addEventListener('click', createNewFolder);
  document.querySelector('.refresh-tree').addEventListener('click', refreshFileTree);
}

async function createNewFile() {
  const name = prompt('Enter file name:');
  if (!name) return;

  try {
    await checkAuth();

    // Create file in selected directory or root
    const targetPath = selectedDirectory ? `${selectedDirectory}/${name}` : name;
    const url = `${DATA.relative_uri_prefix}${encodeURIComponent(targetPath)}`;
    const res = await fetch(url, {
      method: 'PUT',
      body: ''
    });
    await assertResOK(res);

    await refreshFileTree();
    // Select the new file
    const treeItem = findTreeItem(targetPath);
    if (treeItem) {
      selectTreeItem(treeItem);
      const fileInfo = { name: name, path_type: 'File' };
      await loadFileContent(targetPath, fileInfo);
    }
  } catch (err) {
    alert(`Cannot create file, ${err.message}`);
  }
}

async function createNewFolder() {
  const name = prompt('Enter folder name:');
  if (!name) return;

  try {
    await checkAuth();

    // Create folder in selected directory or root
    const targetPath = selectedDirectory ? `${selectedDirectory}/${name}` : name;
    const url = `${DATA.relative_uri_prefix}${encodeURIComponent(targetPath)}`;
    const res = await fetch(url, { method: 'MKCOL' });
    await assertResOK(res);

    await refreshFileTree();
  } catch (err) {
    alert(`Cannot create folder, ${err.message}`);
  }
}

async function refreshFileTree() {
  try {
    const response = await fetch(`${DATA.relative_uri_prefix}?json`);
    await assertResOK(response);
    const data = await response.json();
    DATA.paths = data.paths || [];
    await buildFileTree();
  } catch (err) {
    console.error('Failed to refresh tree:', err);
  }
}

async function buildFileTree() {
  if (!DATA.paths || DATA.paths.length === 0) {
    $fileTree.innerHTML = '';
    document.querySelector('.file-tree-container .empty-folder').classList.remove('hidden');
    return;
  }

  document.querySelector('.file-tree-container .empty-folder').classList.add('hidden');

  // Build tree structure
  const tree = buildTreeStructure(DATA.paths);
  $fileTree.innerHTML = '';
  renderTreeNode(tree, $fileTree, '');
}

function buildTreeStructure(paths) {
  const tree = { children: {}, files: [] };

  paths.forEach(item => {
    if (item.path_type === 'Dir' || item.path_type === 'SymlinkDir') {
      if (!tree.children[item.name]) {
        tree.children[item.name] = { children: {}, files: [], info: item };
      }
    } else {
      tree.files.push(item);
    }
  });

  return tree;
}

function renderTreeNode(node, container, basePath) {
  // Render files first
  node.files.forEach(file => {
    const filePath = basePath ? `${basePath}/${file.name}` : file.name;
    const treeItem = createTreeItem(file, filePath, false);
    container.appendChild(treeItem);
  });

  // Render directories
  Object.keys(node.children).sort().forEach(dirName => {
    const dirNode = node.children[dirName];
    const dirPath = basePath ? `${basePath}/${dirName}` : dirName;
    const treeItem = createTreeItem(dirNode.info, dirPath, true);
    container.appendChild(treeItem);

    // Create children container
    const childrenContainer = document.createElement('div');
    childrenContainer.className = 'tree-children collapsed';
    container.appendChild(childrenContainer);

    // Add click handler for directory expansion
    const toggle = treeItem.querySelector('.tree-item-toggle');
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = treeItem.classList.contains('expanded');
      if (isExpanded) {
        treeItem.classList.remove('expanded');
        childrenContainer.classList.add('collapsed');
      } else {
        treeItem.classList.add('expanded');
        childrenContainer.classList.remove('collapsed');
        // Lazy load directory contents if needed
        loadDirectoryContents(dirPath, childrenContainer, dirNode);
      }
    });
  });
}

function createTreeItem(item, path, isDirectory) {
  const treeItem = document.createElement('div');
  treeItem.className = 'tree-item';
  treeItem.dataset.path = path;
  treeItem.dataset.type = item.path_type;

  const content = document.createElement('div');
  content.className = 'tree-item-content';

  // Toggle arrow for directories
  const toggle = document.createElement('div');
  toggle.className = `tree-item-toggle ${isDirectory ? '' : 'empty'}`;
  if (isDirectory) {
    toggle.innerHTML = `<svg width="12" height="12" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M6.22 3.22a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06-1.06L9.94 8 6.22 4.28a.75.75 0 010-1.06z"/>
    </svg>`;
  }
  content.appendChild(toggle);

  // File/folder icon
  const icon = document.createElement('div');
  icon.className = 'tree-item-icon';
  icon.innerHTML = getPathSvg(item);
  content.appendChild(icon);

  // Name
  const name = document.createElement('div');
  name.className = 'tree-item-name';
  name.textContent = item.name;
  content.appendChild(name);

  treeItem.appendChild(content);

  // Click handler for files
  if (!isDirectory) {
    treeItem.addEventListener('click', async () => {
      selectTreeItem(treeItem);
      await loadFileContent(path, item);
    });
  } else {
    // Click handler for directories - clicking name toggles and selects
    name.addEventListener('click', async (e) => {
      e.stopPropagation();
      await toggleDirectoryAndSelect(treeItem, path, item);
    });

    // Also allow clicking the entire directory item to select it
    treeItem.addEventListener('click', async (e) => {
      if (e.target === toggle || toggle.contains(e.target)) return; // Don't interfere with toggle click
      await selectDirectory(treeItem, path, item);
    });
  }

  return treeItem;
}

async function loadDirectoryContents(path, container, dirNode) {

  if (container.children.length > 0) return; // Already loaded

  try {
    const response = await fetch(`${DATA.relative_uri_prefix}${encodeURIComponent(path)}/?json`);
    await assertResOK(response);
    const data = await response.json();

    if (data.paths && data.paths.length > 0) {
      const subTree = buildTreeStructure(data.paths);
      renderTreeNode(subTree, container, path);
    }
  } catch (err) {
    console.error('Failed to load directory contents:', err);
  }
}

async function toggleDirectoryAndSelect(treeItem, path, item) {
  const isExpanded = treeItem.classList.contains('expanded');
  const childrenContainer = treeItem.nextElementSibling;

  if (isExpanded) {
    // Collapse
    treeItem.classList.remove('expanded');
    if (childrenContainer) {
      childrenContainer.classList.add('collapsed');
    }
  } else {
    // Expand
    treeItem.classList.add('expanded');
    if (childrenContainer) {
      childrenContainer.classList.remove('collapsed');
      // Lazy load directory contents if needed
      await loadDirectoryContents(path, childrenContainer, null);
    }
  }

  // Select the directory
  await selectDirectory(treeItem, path, item);
}

async function selectDirectory(treeItem, path, item) {
  // Remove selection from all items
  document.querySelectorAll('.tree-item.selected').forEach(item => {
    item.classList.remove('selected');
  });

  // Select current directory
  treeItem.classList.add('selected');
  selectedDirectory = path;

  // Update current path display
  if ($currentFileName) {
    $currentFileName.textContent = `Directory: ${item.name}`;
  }
  if ($currentFilePath) {
    $currentFilePath.textContent = path;
  }
  $contentHeaderCustom.innerHTML = "";

  // Load and display directory contents in the right panel
  await showDirectoryContents(path);
  // const response = await fetch(`${DATA.relative_uri_prefix}${encodeURIComponent(path)}/?json`);
  // await assertResOK(response);
  // const data = await response.json();
  // await setupIndexPage(data.paths);
}

async function showDirectoryContents(dirPath) {
  try {
    hideAllViewers();
    $fileContent.classList.remove('hidden');

    const response = await fetch(`${DATA.relative_uri_prefix}${encodeURIComponent(dirPath)}/?json`);
    await assertResOK(response);
    const data = await response.json();

    // Create directory listing view
    // const contentBody = document.querySelector('.content-body .directory-item');
    $directryContainer.innerHTML = `
      <div class="directory-listing">
        <div class="directory-contents">
          ${data.paths && data.paths.length > 0 ?
            `<table class="directory-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Size</th>
                  <th>Modified</th>
                </tr>
              </thead>
              <tbody>
                ${data.paths.map(item => `
                  <tr class="directory-item" data-path="${dirPath ? dirPath + '/' + item.name : item.name}" data-type="${item.path_type}">
                    <td class="item-name">
                      <div class="item-info">
                        <span class="item-icon">${getPathSvg(item)}</span>
                        <span class="item-text">${item.name}</span>
                      </div>
                    </td>
                    <td class="item-type">${item.path_type === 'Dir' ? 'Directory' : item.path_type === 'File' ? 'File' : item.path_type}</td>
                    <td class="item-size">${item.path_type === 'Dir' ? formatDirSize(item.size) : formatFileSize(item.size).join(" ")}</td>
                    <td class="item-modified">${formatDateTime(item.mtime)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>` :
            '<p class="empty-directory">This directory is empty.</p>'
          }
        </div>
      </div>
    `;

    // Add click handlers for directory items
    $directryContainer.querySelectorAll('.directory-item').forEach(row => {
      row.addEventListener('click', async () => {
        const itemPath = row.dataset.path;
        const itemType = row.dataset.type;

        if (itemType === 'Dir' || itemType === 'SymlinkDir') {
          // Navigate to directory in tree and select it
          const treeItem = findTreeItem(itemPath);
          if (treeItem) {
            await selectDirectory(treeItem, itemPath, { name: itemPath.split('/').pop(), path_type: itemType });
          }
        } else {
          // Open file for editing
          const fileName = itemPath.split('/').pop();
          const fileInfo = data.paths.find(p => p.name === fileName);
          if (fileInfo) {
            const treeItem = findTreeItem(itemPath);
            if (treeItem) {
              selectTreeItem(treeItem);
            }
            await loadFileContent(itemPath, fileInfo);
          }
        }
      });
    });
    $directryContainer.classList.remove('hidden');


    if (DATA.allow_archive) {
      const $download = document.querySelector(".download");
      $download.href = baseUrl() + "?zip";
      $download.title = "Download folder as a .zip file";
      $download.classList.remove("hidden");
    }

    if (DATA.allow_upload) {
      setupDropzone();
      setupUploadFile();
      // setupNewFolder();
      // setupNewFile();
    }

    if (DATA.auth) {
      await setupAuth();
    }

    if (DATA.allow_search) {
      setupSearch();
    }

  } catch (err) {
    console.error('Failed to load directory contents:', err);
    alert(`Failed to load directory contents: ${err.message}`);
  }
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + '' + sizes[i];
}

function formatDateTime(timestamp) {
  if (!timestamp) return '-';
  const date = new Date(timestamp * 1000);
  return date.toLocaleString();
}

function findTreeItem(path) {
  return document.querySelector(`.tree-item[data-path="${path}"]`);
}

function getFileInfoFromTreeItem(treeItem) {
  return {
    name: treeItem.querySelector('.tree-item-name').textContent,
    path_type: treeItem.dataset.type
  };
}

/**
 * Delete path
 * @param {number} index
 * @returns
 */
async function deletePath(index) {
  const file = DATA.paths[index];
  if (!file) return;
  await doDeletePath(file.name, newUrl(file.name), () => {
    document.getElementById(`addPath${index}`)?.remove();
    DATA.paths[index] = null;
    if (!DATA.paths.find(v => !!v)) {
      $pathsTable.classList.add("hidden");
      $emptyFolder.textContent = DIR_EMPTY_NOTE;
      $emptyFolder.classList.remove("hidden");
    }
  });
}

async function doDeletePath(name, url, cb) {
  if (!confirm(`Delete \`${name}\`?`)) return;
  try {
    await checkAuth();
    const res = await fetch(url, {
      method: "DELETE",
    });
    await assertResOK(res);
    cb();
  } catch (err) {
    alert(`Cannot delete \`${name}\`, ${err.message}`);
  }
}

/**
 * Move path
 * @param {number} index
 * @returns
 */
async function movePath(index) {
  const file = DATA.paths[index];
  if (!file) return;
  const fileUrl = newUrl(file.name);
  const newFileUrl = await doMovePath(fileUrl);
  if (newFileUrl) {
    location.href = newFileUrl.split("/").slice(0, -1).join("/");
  }
}

async function doMovePath(fileUrl) {
  const fileUrlObj = new URL(fileUrl);

  const prefix = DATA.relative_uri_prefix.slice(0, -1);

  const filePath = decodeURIComponent(fileUrlObj.pathname.slice(prefix.length));

  let newPath = prompt("Enter new path", filePath);
  if (!newPath) return;
  if (!newPath.startsWith("/")) newPath = "/" + newPath;
  if (filePath === newPath) return;
  const newFileUrl = fileUrlObj.origin + prefix + newPath.split("/").map(encodeURIComponent).join("/");

  try {
    await checkAuth();
    const res1 = await fetch(newFileUrl, {
      method: "HEAD",
    });
    if (res1.status === 200) {
      if (!confirm("Override existing file?")) {
        return;
      }
    }
    const res2 = await fetch(fileUrl, {
      method: "MOVE",
      headers: {
        "Destination": newFileUrl,
      }
    });
    await assertResOK(res2);
    return newFileUrl;
  } catch (err) {
    alert(`Cannot move \`${filePath}\` to \`${newPath}\`, ${err.message}`);
  }
}


/**
 * Save file
 * @param {boolean} isAutoSave - Whether this is an auto-save operation
 */
async function saveChange(isAutoSave = false) {
  if (!currentFilePath) return;

  try {
    const content = getCurrentEditorContent();

    // Show saving indicator
    const $saveBtn = document.querySelector(".save-btn");
    if ($saveBtn && !isAutoSave) {
      $saveBtn.style.color = "#ffc107";
      $saveBtn.title = "Saving...";
    }

    const url = `${DATA.relative_uri_prefix}${encodeURIComponent(currentFilePath)}`;
    const response = await fetch(url, {
      method: "PUT",
      body: content,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8'
      }
    });

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      try {
        const errorText = await response.text();
        if (errorText) {
          errorMessage += ` - ${errorText}`;
        }
      } catch (e) {
        // Ignore error getting response text
      }
      throw new Error(errorMessage);
    }

    // Update saved state
    setUnsavedChanges(false);

    // Show success message briefly
    if ($saveBtn) {
      if (isAutoSave) {
        // For auto-save, just briefly flash the button
        $saveBtn.style.color = "#28a745";
        setTimeout(() => {
          $saveBtn.style.color = "";
        }, 1000);
      } else {
        // For manual save, show longer feedback
        $saveBtn.title = "Saved!";
        $saveBtn.style.color = "#28a745";

        setTimeout(() => {
          $saveBtn.title = "Save file";
          $saveBtn.style.color = "";
        }, 2000);
      }
    }

  } catch (err) {
    console.error('Save failed:', err);

    // Reset saving indicator
    const $saveBtn = document.querySelector(".save-btn");
    if ($saveBtn) {
      $saveBtn.style.color = "";
      setUnsavedChanges(true);
    }

    if (!isAutoSave) {
      // Only show alert for manual saves, not auto-saves
      alert(`Failed to save file: ${err.message}`);
    } else {
      // For auto-save failures, just log and update status
      console.warn('Auto-save failed:', err.message);
      if ($saveBtn) {
        $saveBtn.title = `Auto-save failed: ${err.message}`;
        setTimeout(() => {
          $saveBtn.title = "Save file (unsaved changes)";
        }, 5000);
      }
    }
  }
}

async function checkAuth() {
  if (!DATA.auth) return;
  const res = await fetch(baseUrl(), {
    method: "CHECKAUTH",
  });
  await assertResOK(res);
  $loginBtn.classList.add("hidden");
  $logoutBtn.classList.remove("hidden");
  $userName.textContent = await res.text();
}

function logout() {
  if (!DATA.auth) return;
  const url = baseUrl();
  const xhr = new XMLHttpRequest();
  xhr.open("LOGOUT", url, true, DATA.user);
  xhr.onload = () => {
    location.href = url;
  }
  xhr.send();
}

/**
 * Create a folder
 * @param {string} name
 */
async function createFolder(name) {
  const url = newUrl(name);
  try {
    await checkAuth();
    const res = await fetch(url, {
      method: "MKCOL",
    });
    await assertResOK(res);
    location.href = url;
  } catch (err) {
    alert(`Cannot create folder \`${name}\`, ${err.message}`);
  }
}

async function createFile(name) {
  const url = newUrl(name);
  try {
    await checkAuth();
    const res = await fetch(url, {
      method: "PUT",
      body: "",
    });
    await assertResOK(res);
    location.href = url + "?edit";
  } catch (err) {
    alert(`Cannot create file \`${name}\`, ${err.message}`);
  }
}

async function addFileEntries(entries, dirs) {
  for (const entry of entries) {
    if (entry.isFile) {
      entry.file(file => {
        new Uploader(file, dirs).upload();
      });
    } else if (entry.isDirectory) {
      const dirReader = entry.createReader();

      const successCallback = entries => {
        if (entries.length > 0) {
          addFileEntries(entries, [...dirs, entry.name]);
          dirReader.readEntries(successCallback);
        }
      };

      dirReader.readEntries(successCallback);
    }
  }
}


function newUrl(name) {
  let url = baseUrl();
  if (!url.endsWith("/")) url += "/";
  url += name.split("/").map(encodeURIComponent).join("/");
  return url;
}

function baseUrl() {
  return location.href.split(/[?#]/)[0];
}

function baseName(url) {
  return decodeURIComponent(url.split("/").filter(v => v.length > 0).slice(-1)[0]);
}

function extName(filename) {
  const dotIndex = filename.lastIndexOf('.');

  if (dotIndex === -1 || dotIndex === 0 || dotIndex === filename.length - 1) {
    return '';
  }

  return filename.substring(dotIndex);
}

function getPathSvg(path_type) {
  switch (path_type) {
    case "Dir":
      return ICONS.dir;
    case "SymlinkFile":
      return ICONS.symlinkFile;
    case "SymlinkDir":
      return ICONS.symlinkDir;
    default:
      return ICONS.file;
  }
}

function formatMtime(mtime) {
  if (!mtime) return "";
  const date = new Date(mtime);
  const year = date.getFullYear();
  const month = padZero(date.getMonth() + 1, 2);
  const day = padZero(date.getDate(), 2);
  const hours = padZero(date.getHours(), 2);
  const minutes = padZero(date.getMinutes(), 2);
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

function padZero(value, size) {
  return ("0".repeat(size) + value).slice(-1 * size);
}

function formatDirSize(size) {
  const unit = size === 1 ? "item" : "items";
  const num = size >= MAX_SUBPATHS_COUNT ? `>${MAX_SUBPATHS_COUNT - 1}` : `${size}`;
  return ` ${num} ${unit}`;
}

function formatFileSize(size) {
  if (size == null) return [0, "B"];
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  if (size == 0) return [0, "B"];
  const i = parseInt(Math.floor(Math.log(size) / Math.log(1024)));
  let ratio = 1;
  if (i >= 3) {
    ratio = 100;
  }
  return [Math.round(size * ratio / Math.pow(1024, i), 2) / ratio, sizes[i]];
}

function formatDuration(seconds) {
  seconds = Math.ceil(seconds);
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds - h * 3600) / 60);
  const s = seconds - h * 3600 - m * 60;
  return `${padZero(h, 2)}:${padZero(m, 2)}:${padZero(s, 2)}`;
}

function formatPercent(percent) {
  if (percent > 10) {
    return percent.toFixed(1) + "%";
  } else {
    return percent.toFixed(2) + "%";
  }
}

function encodedStr(rawStr) {
  return rawStr.replace(/[\u00A0-\u9999<>\&]/g, function (i) {
    return '&#' + i.charCodeAt(0) + ';';
  });
}

async function assertResOK(res) {
  if (!(res.status >= 200 && res.status < 300)) {
    throw new Error(await res.text() || `Invalid status ${res.status}`);
  }
}

function getEncoding(contentType) {
  const charset = contentType?.split(";")[1];
  if (/charset/i.test(charset)) {
    let encoding = charset.split("=")[1];
    if (encoding) {
      return encoding.toLowerCase();
    }
  }
  return 'utf-8';
}

// Parsing base64 strings with Unicode characters
function decodeBase64(base64String) {
  const binString = atob(base64String);
  const len = binString.length;
  const bytes = new Uint8Array(len);
  const arr = new Uint32Array(bytes.buffer, 0, Math.floor(len / 4));
  let i = 0;
  for (; i < arr.length; i++) {
    arr[i] = binString.charCodeAt(i * 4) |
      (binString.charCodeAt(i * 4 + 1) << 8) |
      (binString.charCodeAt(i * 4 + 2) << 16) |
      (binString.charCodeAt(i * 4 + 3) << 24);
  }
  for (i = i * 4; i < len; i++) {
    bytes[i] = binString.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}
