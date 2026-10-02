import { contextBridge } from 'electron'

contextBridge.exposeInMainWorld('projectApp', {
  ready: async () => true,
})

declare global {
  interface Window {
    projectApp: {
      ready: () => Promise<boolean>
    }
  }
}
