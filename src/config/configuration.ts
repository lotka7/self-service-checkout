export interface EnvironmentVariables {
  DATABASE_USER: string;
  DATABASE_PASSWORD: string;
  DATABASE_HOST: string;
  DATABASE_PORT: number;
}

export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    host: process.env.DATABASE_HOST || 'test',
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  },
});
