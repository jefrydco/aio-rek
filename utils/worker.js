// Taken from: https://stackoverflow.com/questions/5408406/web-workers-without-a-separate-javascript-file

export const runInWorker = (fn, transferable, ...args) => {
  return new Promise((resolve, reject) => {
    const code = `self.onmessage = e => self.postMessage((${fn.toString()}).call(...e.data));`
    const blob = new Blob([code], { type: 'text/javascript' })
    const worker = new Worker(window.URL.createObjectURL(blob))
    worker.onmessage = e => {
      resolve(e.data)
      worker.terminate()
    }
    worker.onerror = e => {
      reject(e.message)
      worker.terminate()
    }
    console.log(args)
    worker.postMessage(args, transferable)
  })
}
