import { HttpApiMiddleware } from "@effect/platform";
import { SessionService } from "./SessionService";

/**
 * HttpApiMiddleware for SessionService
 * Provides session context to HTTP API endpoints
 */

export class SessionMiddleware extends HttpApiMiddleware.Tag<SessionMiddleware>()(
  "SessionMiddleware",
  {
    provides: SessionService,
  }
) {}
