module.exports = {
  apps: [
    {
      name: "sqlize",
      script: "index.js",
      instances: 4,
      exec_mode: "cluster",
      watch: false,
      max_memory_restart: "500M",
      args: ["--port", 8000],
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
