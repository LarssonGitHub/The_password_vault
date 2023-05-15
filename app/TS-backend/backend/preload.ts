import { contextBridge, ipcRenderer } from "electron";
import { websiteObject } from "../../@types/@type-module";

window.addEventListener("DOMContentLoaded", () => {
  console.log("hi")
  const replaceText = (selector: string, text: string) => {
    const element = document.getElementById(selector);
    if (element) {
      element.innerText = text;
    }
  };
  for (const type of ["chrome", "node", "electron"]) {
    replaceText(
      `${type}-version`,
          //@ts-ignore
      process.versions[type as keyof NodeJS.ProcessVersions]
    );
  }
});

// contextBridge.exposeInMainWorld("versions", {
//   node: (): string => process.versions.node,
//   chrome: (): string => process.versions.chrome,
//   electron: (): string => process.versions.electron,
// });

// //  With ipcRender, turns into a promise
// contextBridge.exposeInMainWorld("save", {
//   isString: (a: any) => ipcRenderer.invoke("isString", a),
//   generateId: () => ipcRenderer.invoke("generateId"),
// });

const processVersion = {
  node: (): string  => process.versions.node,
  chrome: (): string  => process.versions.chrome,
  electron: (): string  => process.versions.electron,
}

const backend = {
  generateId: () => ipcRenderer.invoke("generateId"),
  getData: () => ipcRenderer.invoke("getData"),
  deleteData: (id: string) => ipcRenderer.invoke("deleteData", id),
  updateData: (id: string, newData: websiteObject) => ipcRenderer.invoke("updateData", id, newData),
  postData: (newData: websiteObject) => ipcRenderer.invoke("postData", newData),
  encryptData: (data: string, secretKey: string) => ipcRenderer.invoke("encryptData", data, secretKey),
  decryptData: (data: string, secretKey: string) => ipcRenderer.invoke("decryptData", data, secretKey),
}


const API = {
  processVersion: processVersion,
  backend: backend
}

contextBridge.exposeInMainWorld("API", API);