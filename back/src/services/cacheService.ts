import Redis from "ioredis";
import { Company } from "../constants";
import { DocumentsResponse } from "../types";

interface CachedData {
  data: DocumentsResponse;
  createdAt: string;
}

export class CacheService {
  private redis: Redis;
  private readonly TTL = 60 * 60 * 24; // 24 hours in seconds

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || "localhost",
      port: parseInt(process.env.REDIS_PORT || "6379"),
    });
  }

  private getKey(company: Company): string {
    return `documents:${company.cik}`;
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  async getCachedDocuments(
    company: Company
  ): Promise<DocumentsResponse | null> {
    try {
      const cachedData = await this.redis.get(this.getKey(company));
      if (!cachedData) return null;

      const parsedData: CachedData = JSON.parse(cachedData);
      const createdAt = new Date(parsedData.createdAt);
      const now = new Date();

      // If cache was not created on the same day, return null
      if (!this.isSameDay(createdAt, now)) {
        await this.invalidateCache(company);
        return null;
      }

      return parsedData.data;
    } catch (error) {
      console.error("Error fetching data from cache:", error);
      return null;
    }
  }

  async setCachedDocuments(
    company: Company,
    data: DocumentsResponse
  ): Promise<void> {
    try {
      const cachedData: CachedData = {
        data,
        createdAt: new Date().toISOString(),
      };

      await this.redis.setex(
        this.getKey(company),
        this.TTL,
        JSON.stringify(cachedData)
      );
    } catch (error) {
      console.error("Error saving data to cache:", error);
    }
  }

  async invalidateCache(company: Company): Promise<void> {
    try {
      await this.redis.del(this.getKey(company));
    } catch (error) {
      console.error("Error invalidating cache:", error);
    }
  }
}
