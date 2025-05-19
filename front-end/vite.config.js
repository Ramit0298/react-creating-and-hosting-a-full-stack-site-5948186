import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://wmmhqrpq-8000.inc1.devtunnels.ms",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
// This configuration file sets up a Vite project with React and configures a proxy for API requests.
// The proxy redirects requests from the front-end to the back-end server running on localhost:5173.
// The `changeOrigin` option is set to true to change the origin of the host header to the target URL.
// The `secure` option is set to false to allow self-signed certificates.
//
// The `defineConfig` function is used to define the configuration object for Vite.
// The `react` plugin is included to enable React support in the Vite project.
// The `server` property contains the proxy configuration for API requests.
// The `plugins` array includes the React plugin to enable React support in the Vite project.
// The `export default` statement exports the configuration object as the default export of the module.
// This allows Vite to use the configuration when starting the development server or building the project.
// The `server` property contains the configuration for the development server.
// The `proxy` property is used to set up a proxy for API requests.
// The `target` property specifies the URL of the back-end server to which the requests will be proxied.
