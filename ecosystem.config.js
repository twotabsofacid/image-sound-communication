module.exports = {
  apps: [
    {
      name: 'image-sound-backend',
      script: 'npm',
      args: 'run server',
      env_production: {
        NODE_ENV: 'production'
      },
      env_development: {
        NODE_ENV: 'development'
      }
    },
    {
      name: "image-sound-electron",
      script: "npm",
      args: "run electron",
      env_production: {
				NODE_ENV: "production",
			},
			env_development: {
				NODE_ENV: "development",
			},
    }
  ]
};
