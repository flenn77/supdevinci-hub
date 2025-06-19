// backend/src/db.js
import { MongoClient } from 'mongodb';
import Redis from 'ioredis';
import neo4j from 'neo4j-driver';
import dotenv from 'dotenv';
dotenv.config();

// MongoDB
export const mongoClient = new MongoClient(process.env.MONGO_URI);
export const db = mongoClient.db();

// Redis
export const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

// Neo4j
export const neo4jDriver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);
