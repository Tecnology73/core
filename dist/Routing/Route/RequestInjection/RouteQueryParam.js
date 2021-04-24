"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteQueryParam = void 0;
const Common_1 = require("../../../Common");
const MethodParameterDecorator_1 = require("./MethodParameterDecorator");
class RouteQueryParam extends MethodParameterDecorator_1.MethodParameterDecorator {
    constructor(parameterName, type, paramIndex) {
        super(type);
        this.parameterName = parameterName;
        this.paramIndex = paramIndex;
    }
    static handleParameter(reflector) {
        const types = Common_1.DecoratorHelpers.paramTypes(reflector.target, reflector.propertyKey);
        const parameterNames = Common_1.DecoratorHelpers.getParameterNames(reflector.target[reflector.propertyKey]);
        const routeParameterParam = new RouteQueryParam(parameterNames[reflector.parameterIndex], types[reflector.parameterIndex], reflector.parameterIndex);
        this.setMetadata(reflector, routeParameterParam);
    }
    static setMetadata(reflector, param) {
        const target = reflector.target[reflector.propertyKey];
        Reflect.defineMetadata(Common_1.METADATA.REQUEST_METHOD_QUERY_PARAMETER, param, target);
    }
    static getMetadata(target) {
        return Reflect.getMetadata(Common_1.METADATA.REQUEST_METHOD_QUERY_PARAMETER, target);
    }
    canBind(target, param, parameterIndex) {
        if (parameterIndex !== this.paramIndex) {
            return false;
        }
        const res = this.expectedParamType === param;
        return res;
        //		return this instanceof RouteQueryParam;
    }
    bind(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const paramValue = request.query[this.parameterName];
            const param = this.expectedParamType(paramValue);
            if (!param) {
                throw new Error(`Expected type of ${typeof param} for param ${this.parameterName} but ${typeof paramValue} cannot be cast to ${typeof param}`);
            }
            return param !== null && param !== void 0 ? param : null;
        });
    }
}
exports.RouteQueryParam = RouteQueryParam;
//# sourceMappingURL=RouteQueryParam.js.map