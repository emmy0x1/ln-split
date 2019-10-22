import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

// Override environment variables with values from .env.test
const envConfig = dotenv.parse(fs.readFileSync('.env.test'));
for (const key in envConfig) {
  process.env[key] = envConfig[key];
}
