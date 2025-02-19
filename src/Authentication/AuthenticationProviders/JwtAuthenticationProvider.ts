import {ConfigRepository, resolve} from "../../AppContainer";
import {Authenticatable, Hash, Log} from "../../Common";
import {AuthCredentialContract, AuthenticationIdentifier} from "../../Config/Auth";
import {Request} from "../../Routing";
import {AuthenticationProvider} from "../AuthenticationProvider";
import {sign, SignOptions, verify, VerifyOptions} from 'jsonwebtoken';
import {UserProvider} from "../UserProvider/UserProvider";


interface JwtAuthenticationConfig {
	primaryIdentifier: AuthenticationIdentifier;
	authorizationHeaderPrefix: string;
	jwtSigningOptions: SignOptions;
	jwtVerifyOptions: VerifyOptions;
}

export interface VerifiedTokenInterface {
	id: string;
	iat: number;
	exp: number;
	iss: string;
}

export class JwtAuthenticationProvider extends AuthenticationProvider {

	private _config: JwtAuthenticationConfig;
	private _appKey: string;
	private _userProvider: UserProvider;

	constructor(userProvider: UserProvider) {
		super();
		this._userProvider = userProvider;

		this._appKey = resolve(ConfigRepository).get('app.appKey', null);

		if (!this._appKey) {
			Log.warn('You are trying to use JWT Auth. But there is no app key defined in config(Config/App.ts), which is needed to sign Json Web Tokens.');
			return;
		}

		this._config = resolve(ConfigRepository).get('app.auth', {
			/**
			 * The prefix used in authorization header checks
			 */
			authorizationHeaderPrefix : 'Bearer',

			/**
			 * Used to sign JWT
			 */
			jwtSigningOptions : {
				expiresIn : "24h",
				algorithm : "HS256",
			} as SignOptions,

			/**
			 * Used to verify JWT are valid
			 */
			jwtVerifyOptions : {
				ignoreExpiration : false,
				algorithms       : ["HS256"],
			} as VerifyOptions
		});


		if (!this._config?.authorizationHeaderPrefix) {
			this._config.authorizationHeaderPrefix = 'Bearer';
		}
	}

	public getAuthenticationInformation(request: Request) {
		const authHeader = request.header('authorization');

		if (!authHeader) {
			return null;
		}

		const tokenParts = authHeader.split(" ");
		if (tokenParts.length !== 2) {
			return null;
		}

		const type  = tokenParts[0];
		const token = tokenParts[1];
		if (!token || !type) {
			return null;
		}

		if (type && token && type === this._config.authorizationHeaderPrefix) {
			return token;
		}

		return null;
	}

	public validateAuthenticationInformation<T extends VerifiedTokenInterface>(credential: string): T | null {
		if (!credential) {
			return null;
		}

		return <T>verify(
			credential,
			this._appKey,
			this._config.jwtVerifyOptions
		);
	}

	public async authoriseRequest<T>(request: Request): Promise<Authenticatable<T>> {
		const token = this.getAuthenticationInformation(request);

		if (!token) {
			return null;
		}

		const verifiedToken = this.validateAuthenticationInformation(token);

		if (!verifiedToken) {
			return null;
		}

		const userId = verifiedToken?.id;

		if (!userId) {
			return null;
		}

		const user = await this._userProvider.getUser<T>(userId);

		if (!user) {
			return null;
		}

		return new Authenticatable().setUser(user.getUser()) as Authenticatable<T>;
	}

	public issueToken(id: string, additionalPayload?: any): string {
		return sign(
			{
				...additionalPayload,
				...{id}
			},
			this._appKey,
			this._config.jwtSigningOptions
		);
	}

}
