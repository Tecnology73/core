
import {StatusCodes} from "http-status-codes";
import {Exception} from "../../Common";

export class NotFoundException extends Exception {

	constructor(message?: string) {
		super(message ?? 'Not found.', StatusCodes.NOT_FOUND);
	}

}
