
import {StatusCodes} from "http-status-codes";
import {Exception} from "../../Common";

export class UnauthorisedException extends Exception {

	constructor(message?: string) {
		super(message ?? 'Unauthorised.', StatusCodes.UNAUTHORIZED);
	}

}
