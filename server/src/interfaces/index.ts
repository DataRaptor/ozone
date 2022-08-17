import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { IUser } from "./auth";
import { ICompany } from "./company";

export * from "./auth";
export * from "./client";
export * from "./address";
export * from "./token";
export * from "./company";
export * from "./invoice";
export * from "./user";
export * from "./payment";
export * from "./paymentLink";

export interface AppInstance extends FastifyInstance {
  authUser?: any;
  authCompany?: any;
}

export interface IRequest extends FastifyRequest {
  user: IUser;
  company?: ICompany;
}

export interface IReply extends FastifyReply {}

export interface Context {
  user?: IUser;
  company?: ICompany;
}
