const { PrismaClient } = require('@prisma/client');
const { PrismaMysql } = require('@prisma/adapter-mysql');
const mysql = require('mysql2/promise');

// 1. Setup the connection pool
const pool = mysql.createPool(process.env.DATABASE_URL);

// 2. Create the adapter
const adapter = new PrismaMysql(pool);

// 3. Initialize Prisma with the adapter
const prisma = new PrismaClient({ adapter });

module.exports = prisma;