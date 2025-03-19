import { UserAuthority } from "src/domain/user/entity/authority.enum";

// jwt-payload.interface.ts - JWT 페이로드 인터페이스에 역할 추가
export interface JwtPayload {
    exp: boolean;
    sub: number;
    email: string;
    authority: UserAuthority[];
  }