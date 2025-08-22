/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import type { TsoaRoute } from '@tsoa/runtime';
import { fetchMiddlewares, KoaTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { UserController } from './../controllers/user.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { RootController } from './../controllers/root.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { RepoController } from './../controllers/repo.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { MeController } from './../controllers/me.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { FavoriteController } from './../controllers/favorite.comtroller';
import type { Context, Next, Middleware, Request as KRequest, Response as KResponse } from 'koa';
import type * as KoaRouter from '@koa/router';
const multer = require('@koa/multer');


// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "DefaultSelection_Prisma._36_userPayload_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"avatar":{"dataType":"string","required":true},"nickname":{"dataType":"string","required":true},"des":{"dataType":"string","required":true},"username":{"dataType":"string","required":true},"role":{"dataType":"string","required":true},"password":{"dataType":"string","required":true},"email":{"dataType":"string","required":true},"id":{"dataType":"double","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "User": {
        "dataType": "refAlias",
        "type": {"ref":"DefaultSelection_Prisma._36_userPayload_","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "JsonResultType_User_": {
        "dataType": "refObject",
        "properties": {
            "code": {"dataType":"double","required":true},
            "msg": {"dataType":"string","required":true},
            "data": {"ref":"User","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiResponse_User_": {
        "dataType": "refAlias",
        "type": {"ref":"JsonResultType_User_","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "JsonResultType__token-string--me-User__": {
        "dataType": "refObject",
        "properties": {
            "code": {"dataType":"double","required":true},
            "msg": {"dataType":"string","required":true},
            "data": {"dataType":"nestedObjectLiteral","nestedProperties":{"me":{"ref":"User","required":true},"token":{"dataType":"string","required":true}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiResponse__token-string--me-User__": {
        "dataType": "refAlias",
        "type": {"ref":"JsonResultType__token-string--me-User__","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "LoginParams": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"code":{"dataType":"string"},"phone":{"dataType":"string"},"email":{"dataType":"string"},"password":{"dataType":"string"},"account":{"dataType":"string"}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "JsonResultType_any_": {
        "dataType": "refObject",
        "properties": {
            "code": {"dataType":"double","required":true},
            "msg": {"dataType":"string","required":true},
            "data": {"dataType":"any","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiResponse": {
        "dataType": "refAlias",
        "type": {"ref":"JsonResultType_any_","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RepoOrDirOrFile": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"url":{"dataType":"string","required":true},"size":{"dataType":"double"},"name":{"dataType":"string","required":true},"type":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "JsonResultType_RepoOrDirOrFile-Array_": {
        "dataType": "refObject",
        "properties": {
            "code": {"dataType":"double","required":true},
            "msg": {"dataType":"string","required":true},
            "data": {"dataType":"array","array":{"dataType":"refAlias","ref":"RepoOrDirOrFile"},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiResponse_RepoOrDirOrFile-Array_": {
        "dataType": "refAlias",
        "type": {"ref":"JsonResultType_RepoOrDirOrFile-Array_","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DefaultSelection_Prisma._36_repoPayload_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"rname":{"dataType":"string","required":true},"uid":{"dataType":"double","required":true},"id":{"dataType":"double","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Repo": {
        "dataType": "refAlias",
        "type": {"ref":"DefaultSelection_Prisma._36_repoPayload_","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "JsonResultType_Repo_": {
        "dataType": "refObject",
        "properties": {
            "code": {"dataType":"double","required":true},
            "msg": {"dataType":"string","required":true},
            "data": {"ref":"Repo","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiResponse_Repo_": {
        "dataType": "refAlias",
        "type": {"ref":"JsonResultType_Repo_","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Prisma.repoCreateInput": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"rname":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}]},"uid":{"dataType":"double","required":true},"id":{"dataType":"double","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiResponse_any_": {
        "dataType": "refAlias",
        "type": {"ref":"JsonResultType_any_","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Prisma.StringFieldUpdateOperationsInput": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"set":{"dataType":"string"}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Prisma.NullableStringFieldUpdateOperationsInput": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"set":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}]}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Prisma.userUpdateInput": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"avatar":{"dataType":"union","subSchemas":[{"ref":"Prisma.NullableStringFieldUpdateOperationsInput"},{"dataType":"string"},{"dataType":"enum","enums":[null]}]},"nickname":{"dataType":"union","subSchemas":[{"ref":"Prisma.NullableStringFieldUpdateOperationsInput"},{"dataType":"string"},{"dataType":"enum","enums":[null]}]},"des":{"dataType":"union","subSchemas":[{"ref":"Prisma.NullableStringFieldUpdateOperationsInput"},{"dataType":"string"},{"dataType":"enum","enums":[null]}]},"username":{"dataType":"union","subSchemas":[{"ref":"Prisma.NullableStringFieldUpdateOperationsInput"},{"dataType":"string"},{"dataType":"enum","enums":[null]}]},"role":{"dataType":"union","subSchemas":[{"ref":"Prisma.NullableStringFieldUpdateOperationsInput"},{"dataType":"string"},{"dataType":"enum","enums":[null]}]},"password":{"dataType":"union","subSchemas":[{"ref":"Prisma.NullableStringFieldUpdateOperationsInput"},{"dataType":"string"},{"dataType":"enum","enums":[null]}]},"email":{"dataType":"union","subSchemas":[{"ref":"Prisma.StringFieldUpdateOperationsInput"},{"dataType":"string"}]}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DefaultSelection_Prisma._36_favoritePayload_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"label":{"dataType":"string","required":true},"path":{"dataType":"string","required":true},"uid":{"dataType":"double","required":true},"id":{"dataType":"double","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Favorite": {
        "dataType": "refAlias",
        "type": {"ref":"DefaultSelection_Prisma._36_favoritePayload_","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "JsonResultType_Favorite-Array_": {
        "dataType": "refObject",
        "properties": {
            "code": {"dataType":"double","required":true},
            "msg": {"dataType":"string","required":true},
            "data": {"dataType":"array","array":{"dataType":"refAlias","ref":"Favorite"},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiResponse_Favorite-Array_": {
        "dataType": "refAlias",
        "type": {"ref":"JsonResultType_Favorite-Array_","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "JsonResultType_Favorite_": {
        "dataType": "refObject",
        "properties": {
            "code": {"dataType":"double","required":true},
            "msg": {"dataType":"string","required":true},
            "data": {"ref":"Favorite","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiResponse_Favorite_": {
        "dataType": "refAlias",
        "type": {"ref":"JsonResultType_Favorite_","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_Prisma.favoriteCreateInput.Exclude_keyofPrisma.favoriteCreateInput.uid__": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"path":{"dataType":"string"},"label":{"dataType":"string"}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Omit_Prisma.favoriteCreateInput.uid_": {
        "dataType": "refAlias",
        "type": {"ref":"Pick_Prisma.favoriteCreateInput.Exclude_keyofPrisma.favoriteCreateInput.uid__","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateFavoriteDto": {
        "dataType": "refAlias",
        "type": {"ref":"Omit_Prisma.favoriteCreateInput.uid_","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new KoaTemplateService(models, {"noImplicitAdditionalProperties":"throw-on-extras","bodyCoercion":true});

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


export function RegisterRoutes(router: KoaRouter,opts?:{multer?:ReturnType<typeof multer>}) {

    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################

    const upload = opts?.multer ||  multer({"limits":{"fileSize":8388608}});

        const argsUserController_get: Record<string, TsoaRoute.ParameterSchema> = {
                userId: {"in":"query","name":"userId","required":true,"dataType":"string"},
        };
        router.get('/api/user',
            ...(fetchMiddlewares<Middleware>(UserController)),
            ...(fetchMiddlewares<Middleware>(UserController.prototype.get)),

            async function UserController_get(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args: argsUserController_get, context, next });
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new UserController();

            return templateService.apiHandler({
              methodName: 'get',
              controller,
              context,
              validatedArgs,
              successStatus: undefined,
            });
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsRootController_ui: Record<string, TsoaRoute.ParameterSchema> = {
        };
        router.get('/api',
            ...(fetchMiddlewares<Middleware>(RootController)),
            ...(fetchMiddlewares<Middleware>(RootController.prototype.ui)),

            async function RootController_ui(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args: argsRootController_ui, context, next });
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new RootController();

            return templateService.apiHandler({
              methodName: 'ui',
              controller,
              context,
              validatedArgs,
              successStatus: undefined,
            });
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsRootController_doc: Record<string, TsoaRoute.ParameterSchema> = {
        };
        router.get('/api/doc',
            ...(fetchMiddlewares<Middleware>(RootController)),
            ...(fetchMiddlewares<Middleware>(RootController.prototype.doc)),

            async function RootController_doc(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args: argsRootController_doc, context, next });
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new RootController();

            return templateService.apiHandler({
              methodName: 'doc',
              controller,
              context,
              validatedArgs,
              successStatus: undefined,
            });
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsRootController_login: Record<string, TsoaRoute.ParameterSchema> = {
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"LoginParams"},
        };
        router.post('/api/login',
            ...(fetchMiddlewares<Middleware>(RootController)),
            ...(fetchMiddlewares<Middleware>(RootController.prototype.login)),

            async function RootController_login(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args: argsRootController_login, context, next });
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new RootController();

            return templateService.apiHandler({
              methodName: 'login',
              controller,
              context,
              validatedArgs,
              successStatus: undefined,
            });
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsRootController_logout: Record<string, TsoaRoute.ParameterSchema> = {
                authorization: {"in":"header","name":"Authorization","required":true,"dataType":"string"},
        };
        router.post('/api/logout',
            ...(fetchMiddlewares<Middleware>(RootController)),
            ...(fetchMiddlewares<Middleware>(RootController.prototype.logout)),

            async function RootController_logout(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args: argsRootController_logout, context, next });
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new RootController();

            return templateService.apiHandler({
              methodName: 'logout',
              controller,
              context,
              validatedArgs,
              successStatus: undefined,
            });
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsRootController_sendCode: Record<string, TsoaRoute.ParameterSchema> = {
                params: {"in":"body","name":"params","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"type":{"dataType":"string"},"phone":{"dataType":"string"},"email":{"dataType":"string"}}},
        };
        router.post('/api/send-code',
            ...(fetchMiddlewares<Middleware>(RootController)),
            ...(fetchMiddlewares<Middleware>(RootController.prototype.sendCode)),

            async function RootController_sendCode(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args: argsRootController_sendCode, context, next });
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new RootController();

            return templateService.apiHandler({
              methodName: 'sendCode',
              controller,
              context,
              validatedArgs,
              successStatus: undefined,
            });
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsRepoController_getList: Record<string, TsoaRoute.ParameterSchema> = {
        };
        router.get('/api/repo/list',
            ...(fetchMiddlewares<Middleware>(RepoController)),
            ...(fetchMiddlewares<Middleware>(RepoController.prototype.getList)),

            async function RepoController_getList(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args: argsRepoController_getList, context, next });
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new RepoController();

            return templateService.apiHandler({
              methodName: 'getList',
              controller,
              context,
              validatedArgs,
              successStatus: undefined,
            });
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsRepoController_create: Record<string, TsoaRoute.ParameterSchema> = {
                repo: {"in":"body","name":"repo","required":true,"ref":"Prisma.repoCreateInput"},
        };
        router.post('/api/repo',
            ...(fetchMiddlewares<Middleware>(RepoController)),
            ...(fetchMiddlewares<Middleware>(RepoController.prototype.create)),

            async function RepoController_create(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args: argsRepoController_create, context, next });
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new RepoController();

            return templateService.apiHandler({
              methodName: 'create',
              controller,
              context,
              validatedArgs,
              successStatus: undefined,
            });
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsRepoController_remove: Record<string, TsoaRoute.ParameterSchema> = {
                repo: {"in":"query","name":"repo","required":true,"dataType":"string"},
                path: {"in":"query","name":"path","required":true,"dataType":"string"},
        };
        router.delete('/api/repo',
            ...(fetchMiddlewares<Middleware>(RepoController)),
            ...(fetchMiddlewares<Middleware>(RepoController.prototype.remove)),

            async function RepoController_remove(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args: argsRepoController_remove, context, next });
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new RepoController();

            return templateService.apiHandler({
              methodName: 'remove',
              controller,
              context,
              validatedArgs,
              successStatus: undefined,
            });
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsRepoController_get: Record<string, TsoaRoute.ParameterSchema> = {
                repo: {"in":"query","name":"repo","required":true,"dataType":"string"},
                path: {"in":"query","name":"path","required":true,"dataType":"string"},
        };
        router.get('/api/repo',
            ...(fetchMiddlewares<Middleware>(RepoController)),
            ...(fetchMiddlewares<Middleware>(RepoController.prototype.get)),

            async function RepoController_get(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args: argsRepoController_get, context, next });
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new RepoController();

            return templateService.apiHandler({
              methodName: 'get',
              controller,
              context,
              validatedArgs,
              successStatus: undefined,
            });
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsRepoController_addFolder: Record<string, TsoaRoute.ParameterSchema> = {
                repo: {"in":"body-prop","name":"repo","required":true,"dataType":"string"},
                path: {"in":"body-prop","name":"path","required":true,"dataType":"string"},
        };
        router.post('/api/repo/add-folder',
            ...(fetchMiddlewares<Middleware>(RepoController)),
            ...(fetchMiddlewares<Middleware>(RepoController.prototype.addFolder)),

            async function RepoController_addFolder(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args: argsRepoController_addFolder, context, next });
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new RepoController();

            return templateService.apiHandler({
              methodName: 'addFolder',
              controller,
              context,
              validatedArgs,
              successStatus: undefined,
            });
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsRepoController_uploadFile: Record<string, TsoaRoute.ParameterSchema> = {
                path: {"in":"formData","name":"path","required":true,"dataType":"string"},
                repo: {"in":"formData","name":"repo","required":true,"dataType":"string"},
                file: {"in":"formData","name":"file","required":true,"dataType":"file"},
        };
        router.post('/api/repo/upload-file',
            upload.fields([
                {
                    name: "file",
                    maxCount: 1
                }
            ]),
            ...(fetchMiddlewares<Middleware>(RepoController)),
            ...(fetchMiddlewares<Middleware>(RepoController.prototype.uploadFile)),

            async function RepoController_uploadFile(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args: argsRepoController_uploadFile, context, next });
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new RepoController();

            return templateService.apiHandler({
              methodName: 'uploadFile',
              controller,
              context,
              validatedArgs,
              successStatus: undefined,
            });
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsRepoController_rename: Record<string, TsoaRoute.ParameterSchema> = {
                path: {"in":"body-prop","name":"path","required":true,"dataType":"string"},
                repo: {"in":"body-prop","name":"repo","required":true,"dataType":"string"},
                newName: {"in":"body-prop","name":"newName","required":true,"dataType":"string"},
                oldName: {"in":"body-prop","name":"oldName","required":true,"dataType":"string"},
        };
        router.post('/api/repo/rename',
            ...(fetchMiddlewares<Middleware>(RepoController)),
            ...(fetchMiddlewares<Middleware>(RepoController.prototype.rename)),

            async function RepoController_rename(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args: argsRepoController_rename, context, next });
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new RepoController();

            return templateService.apiHandler({
              methodName: 'rename',
              controller,
              context,
              validatedArgs,
              successStatus: undefined,
            });
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsMeController_get: Record<string, TsoaRoute.ParameterSchema> = {
        };
        router.get('/api/me',
            ...(fetchMiddlewares<Middleware>(MeController)),
            ...(fetchMiddlewares<Middleware>(MeController.prototype.get)),

            async function MeController_get(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args: argsMeController_get, context, next });
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new MeController();

            return templateService.apiHandler({
              methodName: 'get',
              controller,
              context,
              validatedArgs,
              successStatus: undefined,
            });
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsMeController_update: Record<string, TsoaRoute.ParameterSchema> = {
                user: {"in":"body","name":"user","required":true,"ref":"Prisma.userUpdateInput"},
        };
        router.put('/api/me',
            ...(fetchMiddlewares<Middleware>(MeController)),
            ...(fetchMiddlewares<Middleware>(MeController.prototype.update)),

            async function MeController_update(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args: argsMeController_update, context, next });
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new MeController();

            return templateService.apiHandler({
              methodName: 'update',
              controller,
              context,
              validatedArgs,
              successStatus: undefined,
            });
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsMeController_resetEmail: Record<string, TsoaRoute.ParameterSchema> = {
                params: {"in":"body","name":"params","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"code":{"dataType":"string","required":true},"email":{"dataType":"string","required":true}}},
        };
        router.post('/api/me/reset-email',
            ...(fetchMiddlewares<Middleware>(MeController)),
            ...(fetchMiddlewares<Middleware>(MeController.prototype.resetEmail)),

            async function MeController_resetEmail(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args: argsMeController_resetEmail, context, next });
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new MeController();

            return templateService.apiHandler({
              methodName: 'resetEmail',
              controller,
              context,
              validatedArgs,
              successStatus: undefined,
            });
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsFavoriteController_getList: Record<string, TsoaRoute.ParameterSchema> = {
        };
        router.get('/api/favorite/list',
            ...(fetchMiddlewares<Middleware>(FavoriteController)),
            ...(fetchMiddlewares<Middleware>(FavoriteController.prototype.getList)),

            async function FavoriteController_getList(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args: argsFavoriteController_getList, context, next });
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new FavoriteController();

            return templateService.apiHandler({
              methodName: 'getList',
              controller,
              context,
              validatedArgs,
              successStatus: undefined,
            });
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsFavoriteController_create: Record<string, TsoaRoute.ParameterSchema> = {
                favoriteParam: {"in":"body","name":"favoriteParam","required":true,"ref":"CreateFavoriteDto"},
        };
        router.post('/api/favorite',
            ...(fetchMiddlewares<Middleware>(FavoriteController)),
            ...(fetchMiddlewares<Middleware>(FavoriteController.prototype.create)),

            async function FavoriteController_create(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args: argsFavoriteController_create, context, next });
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new FavoriteController();

            return templateService.apiHandler({
              methodName: 'create',
              controller,
              context,
              validatedArgs,
              successStatus: undefined,
            });
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
