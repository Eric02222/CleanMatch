import { defineConfig, env } from 'prisma/config'; 
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  // Point to your schema
  schema: 'prisma/schema.prisma',
  
  // Define the connection for Migrations
  datasource: {
    url: process.env.DATABASE_URL
  },
});