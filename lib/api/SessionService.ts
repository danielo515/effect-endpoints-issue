import * as Context from "effect/Context";

export type ISessionService = {
  session: { organizationId: string | undefined };
  headers: Headers;
};

export class SessionService extends Context.Tag("SessionService")<
  SessionService,
  ISessionService
>() {}
