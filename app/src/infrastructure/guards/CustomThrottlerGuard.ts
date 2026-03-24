import {
  Injectable,
  CanActivate,
  ExecutionContext,
  SetMetadata,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const RATE_LIMIT_KEY = 'rateLimit';
export const SKIP_RATE_LIMIT_KEY = 'skipRateLimit';

export interface RateLimitOptions {
  limit: number;
  ttl: number; // seconds
}

export const RateLimit = (config: RateLimitOptions) => SetMetadata(RATE_LIMIT_KEY, config);

export const SkipRateLimit = () => SetMetadata(SKIP_RATE_LIMIT_KEY, true);

/**
 * Decorator to apply per-endpoint rate limiting.
 * @param _attemptsKey  settings key for limit (ignored at runtime, uses defaultLimit)
 * @param _ttlKey       settings key for TTL   (ignored at runtime, uses defaultTtlMs)
 * @param defaultLimit  max requests in window
 * @param defaultTtlMs  window duration in milliseconds
 */
export const RateLimitConfig = (
  _attemptsKey: string,
  _ttlKey: string,
  defaultLimit: number,
  defaultTtlMs: number,
) => RateLimit({ limit: defaultLimit, ttl: Math.ceil(defaultTtlMs / 1000) });

const requestCounts = new Map<string, { count: number; resetAt: number }>();

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const skip = this.reflector.getAllAndOverride<boolean>(SKIP_RATE_LIMIT_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (skip) return true;

    const config = this.reflector.getAllAndOverride<RateLimitOptions>(RATE_LIMIT_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!config) return true;

    const request = context.switchToHttp().getRequest<{ ip: string; path: string }>();
    const key = `${request.ip}-${request.path}`;
    const now = Date.now();

    const entry = requestCounts.get(key);

    if (!entry || now > entry.resetAt) {
      requestCounts.set(key, { count: 1, resetAt: now + config.ttl * 1000 });
      return true;
    }

    if (entry.count >= config.limit) {
      throw new HttpException('Too Many Requests', HttpStatus.TOO_MANY_REQUESTS);
    }

    entry.count++;
    return true;
  }
}
