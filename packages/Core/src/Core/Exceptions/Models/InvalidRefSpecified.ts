import {Exception} from "@App/Exceptions/Exception";

export class InvalidRefSpecified extends Exception {
	constructor(entityName: string, ref: string) {
		super('Ref ' + ref + ' is not defined on model(entity) ' + entityName);
	}
}
