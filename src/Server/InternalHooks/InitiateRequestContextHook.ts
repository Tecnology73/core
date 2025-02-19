import {RequestContext} from "../../Routing";
import {HookHandlerArgs, PreHandlerHook} from "../ServerHooks";

/**
 * This hook will initiate our request context
 * Our request context stores fastify's request/reply for this request
 * It will also store our authorised user if any and more...
 *
 * Without RequestContext, we can't have certain parts of the framework
 * work with each user/request that we get hit with.
 */
export class InitiateRequestContextHook extends PreHandlerHook {

	public async handleAsync({request, response, payload, error, done}: HookHandlerArgs): Promise<boolean> {
		//If this request is a cors preflight request... we don't want to handle our internal logic.
		if ((request as any).corsPreflightEnabled) {
			return;
		}

		const context = RequestContext.get();

		if (!context) {
			return;
		}

		await context.initiateForRequest();
	}

}
