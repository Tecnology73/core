import {FastifyRequest, HTTPMethods} from "fastify";
import {Multipart} from "fastify-multipart";
import {IncomingMessage} from "http";
import {Authenticatable} from "../../../Common";
import {Storage} from "../../../Storage";
import {RequestContext} from "../RequestContext";
import {UploadedFile} from "./UploadedFile";

export class Request {

	private readonly _request: FastifyRequest | IncomingMessage;

	/**
	 * If this request contains files that have been uploaded
	 *
	 * Then we will store some information about them here.
	 * At this stage, they have been semi-processed and are
	 * ready to be accessed without async code
	 *
	 * @private
	 */
	private _uploadedFiles: UploadedFile[] = [];

	constructor(request: FastifyRequest | IncomingMessage) {
		this._request = request;
	}

	isFastifyRequest(request: FastifyRequest | IncomingMessage): request is FastifyRequest {
		return (this._request as FastifyRequest)?.routerMethod !== undefined;
	}

	isSocketRequest(request: FastifyRequest | IncomingMessage): request is IncomingMessage {
		return (this._request as FastifyRequest)?.routerMethod === undefined;
	}

	get socketRequest(): IncomingMessage {
		return this.isSocketRequest(this._request) ? this._request : null;
	}

	get fastifyRequest(): FastifyRequest {
		return this.isFastifyRequest(this._request) ? this._request : null;
	}

	/**
	 * Get the value of a header from the request
	 *
	 * @param header
	 * @param _default
	 */
	header(header: string, _default: any = null): string {
		return this._request.headers[header] ?? _default;
	}

	/**
	 * Get all of the headers from the request
	 */
	headers() {
		return this._request.headers;
	}

	/**
	 * Get the body of the request
	 */
	body<T>() {
		if (!this.isFastifyRequest(this._request))
			return null;

		return <T>this._request.body;
	}

	/**
	 * Get the ip the request originated from
	 */
	ip() {
		if (!this.isFastifyRequest(this._request))
			return null;

		return this._request.ip;
	}

	/**
	 * an array of the IP addresses, ordered from closest to furthest,
	 * in the X-Forwarded-For header of the incoming request
	 * (only when the trustProxy option is enabled)
	 *
	 * @see https://www.fastify.io/docs/latest/Request/
	 */
	ips() {
		if (!this.isFastifyRequest(this._request))
			return null;

		return this._request.ips;
	}

	/**
	 * The full url of the incoming request
	 */
	url() {
		return this._request.url;
	}

	/**
	 * The method of the incoming request, GET, PUT etc
	 */
	method(): HTTPMethods {
		return <HTTPMethods>this._request.method;
	}

	/**
	 * The id assigned to this request
	 */
	id() {
		if (!this.isFastifyRequest(this._request))
			return null;


		return this._request.id;
	}

	/**
	 * Get a value from the request body
	 *
	 * @param key
	 * @param _default
	 */
	get<T>(key: string, _default: any = null): T {
		if(!this.isFastifyRequest(this._request))
			return null;

		if (this._request.body && this._request.body[key]) {
			return this._request.body[key] as T;
		}

		if (this._request.query && this._request.query[key]) {
			return this._request.query[key] as T;
		}

		return _default as T;
	}

	/**
	 * Set file information that has been processed and is
	 * ready to upload/stream to s3 etc
	 *
	 * @param file
	 */
	async setUploadedFile(file: Multipart) {
		const tempFileName = await Storage.saveTemporaryFile(
			file.filename, file.file
		);

		const fileInstance = new UploadedFile(file, tempFileName);
		await fileInstance.setAdditionalInformation();

		this._uploadedFiles.push(fileInstance);
	}

	/**
	 * Does the request contain any files?
	 */
	hasFiles() {
		return !!this._uploadedFiles.length;
	}

	/**
	 * Get all files on the request
	 */
	files(): UploadedFile[] {
		return this._uploadedFiles;
	}

	/**
	 * Get a singular file on the request
	 *
	 * @param key
	 */
	file(key: string): UploadedFile | null {
		if (!this.hasFiles())
			return null;

		return this._uploadedFiles.find(
			f => f.getFieldName() === key
		) ?? null;
	}

	/**
	 * Get the currently authenticated user.
	 * Returns null if user is not authenticated.
	 *
	 * @returns {Authenticatable | null}
	 */
	user<T>(): Authenticatable<T> | null {
		return RequestContext.get().user ?? null;
	}

}
