export interface User {
  id: string;
  username: string;
}

export interface HostedZone {
  id: string;
  aws_zone_id: string;
  name: string;
  type: string;
  description: string | null;
  created_at: string;
  record_count: number;
}

export interface DNSRecord {
  id: string;
  zone_id: string;
  name: string;
  type: string;
  value: string;
  ttl: number;
  routing_policy: string;
  system: boolean;
  priority?: number;
  weight?: number;
  port?: number;
  target?: string;
  flags?: number;
  tag?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}
