import {resolve} from "../../../AppContainer";
import {UnauthorisedException} from "../../../AppContainer/Exceptions/UnauthorisedException";
import {Auth, Authentication, JwtAuthenticationProvider} from "../../../Authentication";
import {RequestContext} from "../../Context/RequestContext";
import {Middleware} from "../Middleware";


export class JwtAuthenticationMiddleware extends Middleware {

	public async handle(context: RequestContext) {

		const authentication = resolve(Authentication);
		const provider       = authentication.getAuthProvider(JwtAuthenticationProvider);
		const authedUser     = await provider.authoriseRequest(context.request);

		if (!authedUser) {
			throw new UnauthorisedException();
		}

		authentication.authoriseAs(authedUser);

		if (!authentication.check()) {
			throw new UnauthorisedException();
		}

	}

}
