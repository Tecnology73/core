import {FastifyReply, FastifyRequest} from "fastify";
import {DecoratorHelpers, METADATA} from "../../../Common";
import {MethodParameterDecorator, ReflectControllerMethodParamData} from "./MethodParameterDecorator";

export class RouteQueryParam extends MethodParameterDecorator {
	private parameterName: string;
	private paramIndex: number;

	constructor(parameterName: string, type: Function, paramIndex: number) {
		super(type);
		this.parameterName = parameterName;
		this.paramIndex    = paramIndex;
	}

	static handleParameter(reflector: ReflectControllerMethodParamData) {
		const types          = DecoratorHelpers.paramTypes(reflector.target, reflector.propertyKey)
		const parameterNames = DecoratorHelpers.getParameterNames(reflector.target[reflector.propertyKey])

		const routeParameterParam = new RouteQueryParam(
			parameterNames[reflector.parameterIndex],
			types[reflector.parameterIndex],
			reflector.parameterIndex
		);

		this.setMetadata(reflector, routeParameterParam)
	}

	private static setMetadata(reflector: ReflectControllerMethodParamData, param: RouteQueryParam) {
		const target = reflector.target[reflector.propertyKey];

		Reflect.defineMetadata(METADATA.REQUEST_METHOD_QUERY_PARAMETER, param, target)
	}

	static getMetadata(target: Function): RouteQueryParam | undefined {
		return Reflect.getMetadata(METADATA.REQUEST_METHOD_QUERY_PARAMETER, target);
	}

	public canBind(target: Function, param: any, parameterIndex: number) {

		if (parameterIndex !== this.paramIndex) {
			return false;
		}

		const res = this.expectedParamType === param;
		return res;
//		return this instanceof RouteQueryParam;
	}

	bind(request: FastifyRequest, response: FastifyReply) {
		const paramValue = request.query[this.parameterName];
		const param      = this.expectedParamType(paramValue);

		if (!param) {
			throw new Error(`Expected type of ${typeof param} for param ${this.parameterName} but ${typeof paramValue} cannot be cast to ${typeof param}`);
		}

		return param ?? null;
	}

}
