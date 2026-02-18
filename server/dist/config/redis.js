"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisConfig = void 0;
const redis_1 = require("redis");
const env_1 = require("./env");
class RedisConfig {
    constructor() {
        this.isConnected = false;
        const redisOptions = this.getRedisConfig();
        this.client = (0, redis_1.createClient)(redisOptions);
        this.setupEventListeners();
    }
    getRedisConfig() {
        if (env_1.env.REDIS_URL) {
            console.log('🔗 Using Redis URL configuration');
            let redisUrl = env_1.env.REDIS_URL;
            if (redisUrl.startsWith('rediss://') && process.env.NODE_ENV === 'development') {
                console.log('🔄 Switching to redis:// for development due to SSL issues');
                redisUrl = redisUrl.replace('rediss://', 'redis://');
            }
            return {
                url: redisUrl,
                socket: {
                    connectTimeout: 10000,
                    lazyConnect: true,
                    reconnectStrategy: (retries) => {
                        if (retries > 5) {
                            console.log('❌ Too many Redis connection attempts');
                            return new Error('Too many retries');
                        }
                        return Math.min(retries * 100, 3000);
                    }
                },
                ...(process.env.NODE_ENV === 'development' && {
                    tls: {
                        rejectUnauthorized: false
                    }
                })
            };
        }
        else if (env_1.env.REDIS_HOST && env_1.env.REDIS_PASSWORD) {
            console.log('🔗 Using Redis Cloud manual configuration');
            return {
                socket: {
                    host: env_1.env.REDIS_HOST,
                    port: parseInt(env_1.env.REDIS_PORT || '6379'),
                    tls: true,
                    connectTimeout: 10000,
                    lazyConnect: true,
                    reconnectStrategy: (retries) => {
                        if (retries > 5) {
                            console.log('❌ Too many Redis connection attempts');
                            return new Error('Too many retries');
                        }
                        return Math.min(retries * 100, 3000);
                    }
                },
                password: env_1.env.REDIS_PASSWORD,
                ...(process.env.NODE_ENV === 'development' && {
                    tls: {
                        rejectUnauthorized: false
                    }
                })
            };
        }
        else {
            console.log('🔗 Using Redis Local configuration');
            return {
                socket: {
                    host: env_1.env.REDIS_HOST || 'localhost',
                    port: parseInt(env_1.env.REDIS_PORT || '6379'),
                    connectTimeout: 10000,
                    lazyConnect: true,
                },
                password: env_1.env.REDIS_PASSWORD,
            };
        }
    }
    setupEventListeners() {
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
    static getInstance() {
        if (!RedisConfig.instance) {
            RedisConfig.instance = new RedisConfig();
        }
        return RedisConfig.instance;
    }
    async connect() {
        if (this.client.isOpen) {
            return;
        }
        try {
            await this.client.connect();
            this.isConnected = true;
        }
        catch (error) {
            console.error('❌ Failed to connect to Redis:', error);
            if (error instanceof Error) {
                if (error.message.includes('Auth')) {
                    console.log('💡 Check Redis password in environment variables');
                }
                else if (error.message.includes('ECONNREFUSED')) {
                    console.log('💡 Check if Redis server is running and accessible');
                }
                else if (error.message.includes('SSL') || error.message.includes('TLS')) {
                    console.log('💡 Try disabling TLS in development with redis://');
                }
            }
            throw error;
        }
    }
    getClient() {
        return this.client;
    }
    async disconnect() {
        if (this.client.isOpen) {
            await this.client.disconnect();
            this.isConnected = false;
            console.log('🔌 Redis disconnected');
        }
    }
    async healthCheck() {
        try {
            await this.connect();
            await this.client.ping();
            return true;
        }
        catch (error) {
            console.error('❌ Redis health check failed');
            return false;
        }
    }
    getConnectionStatus() {
        return this.isConnected && this.client.isOpen;
    }
}
exports.redisConfig = RedisConfig.getInstance();
exports.default = exports.redisConfig;
//# sourceMappingURL=redis.js.map