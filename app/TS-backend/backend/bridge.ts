import {
  contextBridge,
  ipcRenderer
} from "electron";
import {
  customResponse,
  userCredentialObject
} from "../../@types/@type-module";

window.addEventListener("DOMContentLoaded", () => {
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

const processVersion = {
  node: (): string => process.versions.node,
  chrome: (): string => process.versions.chrome,
  electron: (): string => process.versions.electron,
}

const backend = {
  generateId: () => ipcRenderer.invoke("generateId"),
  getData: (key: string): Promise < customResponse > => ipcRenderer.invoke("getData", key),
  deleteData: (id: string, key: string): Promise < customResponse > => ipcRenderer.invoke("deleteData", id, key),
  updateData: (id: string, putData: userCredentialObject, key: string): Promise < customResponse > => ipcRenderer.invoke("updateData", id, putData, key),
  postData: (postData: userCredentialObject, key: string): Promise < customResponse > => ipcRenderer.invoke("postData", postData, key),
  encryptData: (data: string, secretKey: string) => ipcRenderer.invoke("encryptData", data, secretKey),
  decryptData: (data: string, secretKey: string) => ipcRenderer.invoke("decryptData", data, secretKey),
}

const API = {
  processVersion: processVersion,
  backend: backend
}

contextBridge.exposeInMainWorld("API", API);