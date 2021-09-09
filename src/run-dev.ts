import "reflect-metadata";

import path from "path";
import Environment from "./AppContainer/Config/Environment";

Environment.load(path.join(__dirname, "..", ".env"));

import Configuration from "./Config/Configuration";
import { Envuso } from "./Envuso";
import { Log } from "./Common";

Log.exception('Wat', new Error('ya'));

const envuso = new Envuso();

Configuration.initiate()
	.then(() => envuso.boot())
	.then(() => envuso.serve())
	.catch(error => Log.exception(error));

//envuso.addExceptionHandler(async (exception: Error | Exception, request: FastifyRequest, reply: FastifyReply) => {
//	Log.exception('Server error: ', exception);
//
//	if (!response()?.json) {
//		console.log('response.json not defined??');
//	}
//
//	const data = exception instanceof Exception ? exception.response : {
//		message : exception.toString(),
//		code    : 500,
//	};
//
//	//			return response().negotiated(
//	//				data,
//	//				{
//	//					templatePath : 'Exceptions/exception',
//	//					data         : {
//	//						message:
//	//					}
//	//				}
//	//			);
//	//			return response().json(exception instanceof Exception ? exception.response : exception);
//
//	return response().negotiatedErrorView(
//		data,
//		exception instanceof Exception ? exception.code : 500,
//		exception,
//	);
//});
