import {classToPlainFromExist, Exclude} from "class-transformer";
import {ClassTransformOptions} from "class-transformer/types/interfaces";
import {config, resolve} from "../../AppContainer";
import {Authentication, JwtAuthenticationProvider} from "../../Authentication";
import {Authorization, ModelConstructorOrInstantiatedModel} from "../../Authorization/Authorization";
import {Model} from "../../Database";
import {SocketEvents} from "../../Sockets/SocketEvents";
import {SocketChannelListener} from "../../Sockets/SocketChannelListener";
import {SocketServer} from "../../Sockets/SocketServer";

export class Authenticatable<T> extends Model<T> {

	@Exclude()
	private _user: any;

	generateToken(additionalPayload?: any) {
		return resolve(Authentication)
			.getAuthProvider<JwtAuthenticationProvider>(JwtAuthenticationProvider)
			.issueToken((this as any)._id as unknown as string, additionalPayload);
	}

	sendSocketChannelEvent(channel: new () => SocketChannelListener, eventName: SocketEvents | string, data: any) {
		resolve(SocketServer).sendToUserViaChannel(
			(this as any)._id.toString(), channel, eventName, data
		);
	}

	sendSocketEvent(eventName: SocketEvents | string, data: any) {
		resolve(SocketServer).sendToUser(this._user._id.toString(), eventName, data);
	}

	setUser(user: any) {
		Object.assign(this, user);
		this._user = user;

		return this;
	}

	getUser<T>(): T {
		return this._user as T;
	}

	can<T extends ModelConstructorOrInstantiatedModel>(permission: string, model: T, ...additional): Promise<boolean> {
		return Authorization.can<T>(permission, model, ...additional);
	}

	cannot<T extends ModelConstructorOrInstantiatedModel>(permission: string, model: T, ...additional): Promise<boolean> {
		return Authorization.cannot<T>(permission, model, ...additional);
	}

	toJSON() {
		const options = config('server.responseSerialization') as ClassTransformOptions;

		const obj = classToPlainFromExist(
			this._user ? this._user : this,
			{},
			options
		);

		if (this._user)
			Object.keys(obj).forEach(key => obj[key] = this[key]);

		return obj;
	}
}
