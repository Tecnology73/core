export declare const STUB_RESOURCE_CONTROLLER = "import {Controller} from \"@Providers/Http/Controller/Controller\";\nimport {get, post, put, patch, destroy, controller, middleware, param, dto} from \"@Decorators\";\nimport {DataTransferObject} from \"@Providers/Http/Controller/DataTransferObject\";\n\nclass StoreBody extends DataTransferObject {\n\n}\nclass UpdateBody extends DataTransferObject {\n\n}\n\n//@middleware()\n@controller('/')\nexport class {{name}} extends Controller {\n\n\t@get('/')\n\tpublic async list() {\n\n\t}\n\n\t@get('/:id')\n\tpublic async get(@param id : string) {\n\n\t}\n\n\t@put('/')\n\tpublic async store(@dto() body : StoreBody) {\n\n\t}\n\n\t@patch('/:id')\n\tpublic async update(@param id :string, @dto() body : UpdateBody) {\n\n\t}\n\n\t@destroy('/:id')\n\tpublic async delete(@param id :string) {\n\n\t}\n\n}\n";
