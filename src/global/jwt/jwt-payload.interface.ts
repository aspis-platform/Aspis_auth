import { UserAuthority } from "src/domain/user/entity/authority.enum";

// jwt-payload.interface.ts - JWT 페이로드 인터페이스에 역할 추가
export interface JwtPayload {
    id: any;
    exp?: number; // exp는 타임스탬프(숫자)임
    sub?: number;
    authority: UserAuthority[] | string;
    iat?: number; // 토큰 발급 시간
    nbf?: number; // Not Before
    jti?: string; // JWT ID
  }