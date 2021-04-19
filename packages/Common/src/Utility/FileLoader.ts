import {glob} from "glob";
import path from 'path';
import {Log} from "../Logger/Log";

interface FormatPathInformation {
	//When running in ts-node, we can use a .ts file extension
	forTsNode: string; // 'ts';
	//When running in production/compiled code(for example, with webpack) it will be .js
	forNode: string; //'js';
}

interface ImportedModule {
	instance: any;
	name: any;
	originalPath: string;
	forRunEnvironment: string;
}

export class FileLoader {

	/**
	 * Check if we're currently running via ts-node or regular node
	 *
	 * Credits to ActionHero:
	 * https://github.com/actionhero/actionhero/blob/master/src/classes/process/typescript.ts
	 */
	static isTypescript(): boolean {

		const extension = path.extname(__filename);
		if (extension === ".ts") {
			return true;
		}

		// are we running via a ts-node/ts-node-dev shim?
		const lastArg = process.execArgv[process.execArgv.length - 1];
		if (lastArg && path.parse(lastArg).name.indexOf("ts-node") >= 0) {
			return true;
		}

		try {
			/**
			 * Are we running in typescript at the moment?
			 * see https://github.com/TypeStrong/ts-node/pull/858 for more details
			 */
			const isTsNode = process[Symbol.for("ts-node.register.instance")];

			return isTsNode?.ts !== undefined;
		} catch (error) {
			console.error(error);
			return false;
		}
	}

	/**
	 * Will give an array of files at the path
	 *
	 * @param path
	 */
	static filesInPath(path) {
		return glob.sync(
			path, {follow : true}
		);
	}

	/**
	 * Get the name and class instance of a module from import()
	 *
	 * @param module
	 */
	static moduleInformation(module) {
		const moduleInstanceKey = Object.keys(module).shift() || null;

		if (!moduleInstanceKey) {
			throw new Error('There was an error loading the module from classAndNameFromModule path: ' + module);
		}

		const instance = module[moduleInstanceKey];
		const name     = instance.name;

		return {instance, name};
	}

	/**
	 * Normalize our path so that it's absolute and runs from the processes root dir
	 *
	 * @param pathToNormalize
	 */
	static normalizePath(pathToNormalize: string) {
		return path.isAbsolute(pathToNormalize)
			? path.normalize(pathToNormalize)
			: path.join(process.cwd(), pathToNormalize);
	}

	/**
	 * When we're running with ts-node,
	 * we want to use .ts extensions and resolve files from /src/
	 *
	 * When we've compiled and are running via node /dist/main.js for ex
	 * We want to use .js extensions and resolve files from /dist/
	 *
	 * @param pathToFormat
	 * @param extensions
	 */
	static formatPathForRunEnvironment(
		pathToFormat: string,
		extensions: FormatPathInformation = {forTsNode : 'ts', forNode : 'js'}
	) {
		const isTS            = this.isTypescript();
		pathToFormat          = this.normalizePath(pathToFormat);
		const pathInformation = path.parse(pathToFormat);

		pathInformation.ext = isTS ? extensions.forTsNode : extensions.forNode;

		if (!isTS)
			pathInformation.base = pathInformation.base.replace(
				`${pathInformation.name}.${extensions.forTsNode}`,
				`${pathInformation.name}.${extensions.forNode}`
			);

		if (!isTS && pathInformation.dir.includes('/src/')) {
			pathInformation.dir = pathInformation.dir.replace('/src/', '/dist/');
		}

		return path.format(pathInformation);
	}

	/**
	 * Import modules from the specified path and attempt
	 * to convert them to the correct run environments
	 * @param path
	 */
	static async importModulesFrom(path: string): Promise<ImportedModule[]> {
		const files   = this.filesInPath(path);
		const modules = [];

		for (let path of files) {
			const pathForEnv = this.formatPathForRunEnvironment(path);
			try {
				const module = await import(pathForEnv);

				const {instance, name} = this.moduleInformation(module);

				modules.push({
					instance          : instance,
					name              : name,
					originalPath      : path,
					forRunEnvironment : pathForEnv
				});
			} catch (error) {
				Log.error(error.toString(), {error : error});
			}
		}

		return modules;
	}

}
