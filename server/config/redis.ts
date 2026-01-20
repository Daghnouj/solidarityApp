import { createClient, RedisClientType } from 'redis';
import { env } from './env';

class RedisConfig {
  private static instance: RedisConfig;
  private client: RedisClientType;
  private isConnected: boolean = false;

  private constructor() {
    const redisOptions = this.getRedisConfig();
    this.client = createClient(redisOptions);
    this.setupEventListeners();
  }

  private getRedisConfig() {
    // Si REDIS_URL est fournie, l'utiliser directement
    if (env.REDIS_URL) {
      console.log('🔗 Using Redis URL configuration');
      
      // Vérifier et corriger l'URL si nécessaire
      let redisUrl = env.REDIS_URL;
      
      // Si l'URL commence par rediss:// mais cause des problèmes SSL, essayez redis://
      if (redisUrl.startsWith('rediss://') && process.env.NODE_ENV === 'development') {
        console.log('🔄 Switching to redis:// for development due to SSL issues');
        redisUrl = redisUrl.replace('rediss://', 'redis://');
      }
      
      return {
        url: redisUrl,
        socket: {
          connectTimeout: 10000,
          lazyConnect: true,
          reconnectStrategy: (retries: number) => {
            if (retries > 5) {
              console.log('❌ Too many Redis connection attempts');
              return new Error('Too many retries');
            }
            return Math.min(retries * 100, 3000);
          }
        },
        // Désactiver la vérification SSL en développement si nécessaire
        ...(process.env.NODE_ENV === 'development' && {
          tls: {
            rejectUnauthorized: false
          }
        })
      };
    } 
    // Configuration manuelle pour Redis Cloud
    else if (env.REDIS_HOST && env.REDIS_PASSWORD) {
      console.log('🔗 Using Redis Cloud manual configuration');
      
      return {
        socket: {
          host: env.REDIS_HOST,
          port: parseInt(env.REDIS_PORT || '6379'),
          tls: true, // Redis Cloud nécessite TLS
          connectTimeout: 10000,
          lazyConnect: true,
          reconnectStrategy: (retries: number) => {
            if (retries > 5) {
              console.log('❌ Too many Redis connection attempts');
              return new Error('Too many retries');
            }
            return Math.min(retries * 100, 3000);
          }
        },
        password: env.REDIS_PASSWORD,
        // Désactiver la vérification SSL en développement si nécessaire
        ...(process.env.NODE_ENV === 'development' && {
          tls: {
            rejectUnauthorized: false
          }
        })
      };
    }
    // Redis local (fallback)
    else {
      console.log('🔗 Using Redis Local configuration');
      return {
        socket: {
          host: env.REDIS_HOST || 'localhost',
          port: parseInt(env.REDIS_PORT || '6379'),
          connectTimeout: 10000,
          lazyConnect: true,
        },
        password: env.REDIS_PASSWORD,
      };
    }
  }

  private setupEventListeners(): void {
    this.client.on('connect', () => {
      console.log('🟡 Connecting to Redis...');
    });

    this.client.on('ready', () => {
      this.isConnected = true;
      console.log('✅ Redis connected and ready');
    });

    this.client.on('error', (err) => {
      this.isConnected = false;
      console.error('❌ Redis Client Error:', err.message);
      
      // Suggestions de dépannage basées sur l'erreur
      if (err.message.includes('EPROTO') || err.message.includes('SSL')) {
        console.log('💡 SSL Error - Try these solutions:');
        console.log('1. Use redis:// instead of rediss:// in development');
        console.log('2. Check if Redis Cloud instance supports TLS');
        console.log('3. Verify Redis Cloud connection details');
      }
    });

    this.client.on('end', () => {
      this.isConnected = false;
      console.log('🔴 Redis connection closed');
    });

    this.client.on('reconnecting', () => {
      console.log('🟠 Redis reconnecting...');
    });
  }

  public static getInstance(): RedisConfig {
    if (!RedisConfig.instance) {
      RedisConfig.instance = new RedisConfig();
    }
    return RedisConfig.instance;
  }

  public async connect(): Promise<void> {
    if (this.client.isOpen) {
      return;
    }

    try {
      await this.client.connect();
      this.isConnected = true;
    } catch (error) {
      console.error('❌ Failed to connect to Redis:', error);
      
      // Suggestions basées sur le type d'erreur
      if (error instanceof Error) {
        if (error.message.includes('Auth')) {
          console.log('💡 Check Redis password in environment variables');
        } else if (error.message.includes('ECONNREFUSED')) {
          console.log('💡 Check if Redis server is running and accessible');
        } else if (error.message.includes('SSL') || error.message.includes('TLS')) {
          console.log('💡 Try disabling TLS in development with redis://');
        }
      }
      
      throw error;
    }
  }

  public getClient(): RedisClientType {
    return this.client;
  }

  public async disconnect(): Promise<void> {
    if (this.client.isOpen) {
      await this.client.disconnect();
      this.isConnected = false;
      console.log('🔌 Redis disconnected');
    }
  }

  public async healthCheck(): Promise<boolean> {
    try {
      await this.connect();
      await this.client.ping();
      return true;
    } catch (error) {
      console.error('❌ Redis health check failed');
      return false;
    }
  }

  public getConnectionStatus(): boolean {
    return this.isConnected && this.client.isOpen;
  }
}

export const redisConfig = RedisConfig.getInstance();
export default redisConfig;