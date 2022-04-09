import { createServer, build } from 'vite'

/**
 * @type {(server: import('vite').ViteDevServer) => Promise<import('rollup').RollupWatcher>}
 */
function watchMain(server) {
  /**
   * @type {import('child_process').ChildProcessWithoutNullStreams | null}
   */ 

  return build({
    configFile: 'packages/main/vite.config.ts',
    mode: 'development',
    // plugins: [!debug && startElectron].filter(Boolean),
    build: {
      watch: true,
    },
  })
}


// bootstrap
const server = await createServer({ configFile: 'packages/renderer/react.config.ts' })
console.log("http://localhost:3000/")
await watchMain(server)
await server.listen()
