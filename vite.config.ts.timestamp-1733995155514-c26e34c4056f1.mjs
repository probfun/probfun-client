// vite.config.ts
import { PrimeVueResolver } from "file:///D:/Learning/Creation/Probability/probfun-client/node_modules/@primevue/auto-import-resolver/index.mjs";
import vue from "file:///D:/Learning/Creation/Probability/probfun-client/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import Components from "file:///D:/Learning/Creation/Probability/probfun-client/node_modules/unplugin-vue-components/dist/vite.js";
import { defineConfig } from "file:///D:/Learning/Creation/Probability/probfun-client/node_modules/vite/dist/node/index.js";
var vite_config_default = defineConfig({
  optimizeDeps: {
    exclude: ["js-big-decimal", ""]
  },
  base: "/",
  plugins: [
    vue(),
    Components({
      resolvers: [
        PrimeVueResolver()
      ]
    })
  ],
  resolve: {
    alias: {
      "@": "/src"
    }
  },
  server: {
    proxy: {
      "/api": {
        target: "http://192.144.199.178",
        // target: 'http://127.0.0.1:4523/m1/4811506-4465979-default',
        changeOrigin: true
      },
      "/ai": {
        // target: 'ws://192.144.199.178',
        target: "ws://127.0.0.1:8000",
        ws: true,
        // target: 'http://127.0.0.1:4523/m1/4811506-4465979-default',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ai/, "")
      },
      "/uploads": {
        target: "http://192.144.199.178",
        changeOrigin: true,
        secure: false
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxMZWFybmluZ1xcXFxDcmVhdGlvblxcXFxQcm9iYWJpbGl0eVxcXFxwcm9iZnVuLWNsaWVudFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcTGVhcm5pbmdcXFxcQ3JlYXRpb25cXFxcUHJvYmFiaWxpdHlcXFxccHJvYmZ1bi1jbGllbnRcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L0xlYXJuaW5nL0NyZWF0aW9uL1Byb2JhYmlsaXR5L3Byb2JmdW4tY2xpZW50L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgUHJpbWVWdWVSZXNvbHZlciB9IGZyb20gJ0BwcmltZXZ1ZS9hdXRvLWltcG9ydC1yZXNvbHZlcic7XHJcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJztcclxuaW1wb3J0IENvbXBvbmVudHMgZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvdml0ZSc7XHJcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBvcHRpbWl6ZURlcHM6IHtcclxuICAgIGV4Y2x1ZGU6IFsnanMtYmlnLWRlY2ltYWwnLCAnJ10sXHJcbiAgfSxcclxuICBiYXNlOiAnLycsXHJcbiAgcGx1Z2luczogW1xyXG4gICAgdnVlKCksXHJcbiAgICBDb21wb25lbnRzKHtcclxuICAgICAgcmVzb2x2ZXJzOiBbXHJcbiAgICAgICAgUHJpbWVWdWVSZXNvbHZlcigpLFxyXG4gICAgICBdLFxyXG4gICAgfSksXHJcbiAgXSxcclxuICByZXNvbHZlOiB7XHJcbiAgICBhbGlhczoge1xyXG4gICAgICAnQCc6ICcvc3JjJyxcclxuICAgIH0sXHJcbiAgfSxcclxuICBzZXJ2ZXI6IHtcclxuICAgIHByb3h5OiB7XHJcbiAgICAgICcvYXBpJzoge1xyXG4gICAgICAgIHRhcmdldDogJ2h0dHA6Ly8xOTIuMTQ0LjE5OS4xNzgnLFxyXG4gICAgICAgIC8vIHRhcmdldDogJ2h0dHA6Ly8xMjcuMC4wLjE6NDUyMy9tMS80ODExNTA2LTQ0NjU5NzktZGVmYXVsdCcsXHJcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICB9LFxyXG4gICAgICAnL2FpJzoge1xyXG4gICAgICAgIC8vIHRhcmdldDogJ3dzOi8vMTkyLjE0NC4xOTkuMTc4JyxcclxuICAgICAgICB0YXJnZXQ6ICd3czovLzEyNy4wLjAuMTo4MDAwJyxcclxuICAgICAgICB3czogdHJ1ZSxcclxuICAgICAgICAvLyB0YXJnZXQ6ICdodHRwOi8vMTI3LjAuMC4xOjQ1MjMvbTEvNDgxMTUwNi00NDY1OTc5LWRlZmF1bHQnLFxyXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgICAgICByZXdyaXRlOiBwYXRoID0+IHBhdGgucmVwbGFjZSgvXlxcL2FpLywgJycpLFxyXG4gICAgICB9LFxyXG4gICAgICAnL3VwbG9hZHMnOiB7XHJcbiAgICAgICAgdGFyZ2V0OiAnaHR0cDovLzE5Mi4xNDQuMTk5LjE3OCcsXHJcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICAgIHNlY3VyZTogZmFsc2UsXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIH0sXHJcbn0pXHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBeVUsU0FBUyx3QkFBd0I7QUFDMVcsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sZ0JBQWdCO0FBQ3ZCLFNBQVMsb0JBQW9CO0FBRTdCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLGNBQWM7QUFBQSxJQUNaLFNBQVMsQ0FBQyxrQkFBa0IsRUFBRTtBQUFBLEVBQ2hDO0FBQUEsRUFDQSxNQUFNO0FBQUEsRUFDTixTQUFTO0FBQUEsSUFDUCxJQUFJO0FBQUEsSUFDSixXQUFXO0FBQUEsTUFDVCxXQUFXO0FBQUEsUUFDVCxpQkFBaUI7QUFBQSxNQUNuQjtBQUFBLElBQ0YsQ0FBQztBQUFBLEVBQ0g7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUs7QUFBQSxJQUNQO0FBQUEsRUFDRjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sT0FBTztBQUFBLE1BQ0wsUUFBUTtBQUFBLFFBQ04sUUFBUTtBQUFBO0FBQUEsUUFFUixjQUFjO0FBQUEsTUFDaEI7QUFBQSxNQUNBLE9BQU87QUFBQTtBQUFBLFFBRUwsUUFBUTtBQUFBLFFBQ1IsSUFBSTtBQUFBO0FBQUEsUUFFSixjQUFjO0FBQUEsUUFDZCxTQUFTLFVBQVEsS0FBSyxRQUFRLFNBQVMsRUFBRTtBQUFBLE1BQzNDO0FBQUEsTUFDQSxZQUFZO0FBQUEsUUFDVixRQUFRO0FBQUEsUUFDUixjQUFjO0FBQUEsUUFDZCxRQUFRO0FBQUEsTUFDVjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
