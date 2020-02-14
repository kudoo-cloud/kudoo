import path from "path";
import appConfig from "./app";

const config = new Map();

// ------------------------------------
// User Configuration
// ------------------------------------
config.set("dir_src", "src");
config.set("dir_dist", "build");

config.set("env", process.env.NODE_ENV);
config.set("port", appConfig.appPort);

config.set("globals", {
  "process.env": {
    NODE_ENV: JSON.stringify(config.get("env"))
  },
  SERVICE_HOST: JSON.stringify(config.get("service-host")),
  NODE_ENV: config.get("env"),
  __DEV__: config.get("env") === "development",
  __PROD__: config.get("env") === "production",
  __DEBUG__: config.get("env") === "development"
});

// Project
config.set("path_project", path.resolve(__dirname, "../"));

// Utilities
const paths = (() => {
  const base = [config.get("path_project")];
  const resolve = path.resolve;
  const project = (...args) => resolve.apply(resolve, [...base, ...args]);
  return {
    project: project,
    src: project.bind(null, config.get("dir_src"))
  };
})();

config.set("utils_paths", paths);

export default config;
