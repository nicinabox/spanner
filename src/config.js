const envs = {
  development: {
    host: 'http://localhost:8080'
  },
  production: {
    host: 'https://spanner-api.apps.nicinabox.com'
  }
}

const defaultEnv = __DEV__ ? 'development' : 'production'
export default envs[defaultEnv]
