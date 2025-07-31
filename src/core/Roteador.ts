import { Request, Response, Router } from "express";
import * as fs from 'fs'
import * as path from 'path'
import { camelCase, cloneDeep, drop, get, isEmpty, method, snakeCase } from "lodash";
import { environment } from "../environment/environment";

export class CoreRoteador {

    public rotas: Router = Router();
    private _methods = ['get', 'post', 'put', 'delete', 'patch']
    
    constructor() {

        this.rotas.use((req: Request, res: Response, next) => {

            next();
            return
            const [module, resource, route, id] = drop(req.path.split('/'))

            if (module == 'public') {
                next();
            } else {
                try {
                    const jwt = require('jsonwebtoken');
                    const userToken = req.headers.authorization?.split(' ').pop()
                    const aclBackendToken = req.headers.aclbackend

                    const user = jwt.verify(userToken, environment.jwtPrivateKey);
                    if (user.master) {
                        next();
                    } else {

                        const aclBackend = jwt.verify(aclBackendToken, environment.jwtPrivateKey);

                        const RoutePattern = require("route-pattern");

                        const hasPermission = aclBackend[req.method]
                            .some((endpoint: string) => {
                                const pattern = RoutePattern.fromString(endpoint)
                                return pattern.matches(req.path)
                            })

                        if (!hasPermission) res.status(403).json({ error: 'Você não tem permissão para acessar esse endpoint.' })
                        else next()
                    }

                } catch (err) {
                    res.status(401).json({ error: 'Você não está autenticado.' })
                }
            }

        });

        this.registrarRecursos()
        setTimeout(() => {
            this.rotas.all('*', (requisicao: Request, resposta: Response) => {
                resposta.status(404).json({ error: `O Endpoint solicitado "[${requisicao.method.toUpperCase()}] ${requisicao.path}" não existe.` })
            })
        }, 5000)
    }

    async registrarRecursos(modulo: string = '') {
        const basePath = `${__dirname.replace('core', '')}servicos/${modulo}`;
        const dir = await fs.readdirSync(basePath)
        dir.forEach(async (pathItem: any) => {
            const localPath = path.join(basePath, pathItem)
            const isDir = await fs.lstatSync(localPath).isDirectory()
            if (isDir) {
                const modulo = !basePath.endsWith('/') ? basePath.split('/').pop() : ''
                if(modulo){
                    this.registrarRecursos(`${modulo}/${pathItem}`)    
                }else{
                    this.registrarRecursos(pathItem)
                }
            } else {
                let instanciaClasse = await import(localPath)
                const nomeClasse = Object.keys(instanciaClasse).pop();
                //@ts-ignore
                instanciaClasse = new instanciaClasse[nomeClasse]()
                this.registrarRotas(modulo, instanciaClasse)
            }
        })
    }

    private registrarRotas(modulo: string, instancia: any) {
        //console.log(instancia.constructor.name)
        Object.getOwnPropertyNames(instancia)
            .filter((name: string) => typeof instancia[name] === 'function')
            .filter((name: string) => this._methods.some((method: string) => name.startsWith(method)))
            .forEach((functionName: any) => {
                const replace = ['consultar-registros', 'consultar-registro', 'inserir-registro', 'atualizar-registro', 'remover-registro']
                const parameters = this.getParametersFromFunction(instancia, functionName)
                const resource = snakeCase(instancia.constructor.name)
                    .split('_')
                    .filter((name: string) => ![modulo, 'svc'].includes(name))
                    .join('-')
                let endpoint = drop(snakeCase(functionName).split('_')).join('-')
                let method = snakeCase(functionName).split('_').shift()
                if (replace.includes(endpoint)) endpoint = ''
                else endpoint = `/${endpoint}`

                const urlParams = this.getUrlParams(parameters)

                let fullEndpoint = `${modulo ? '/' + modulo : ''}/${resource}${endpoint}${urlParams}`
                //TODO Corrigir ajustes abaixo
                fullEndpoint = fullEndpoint.replace('//', '/') 
                if(fullEndpoint.endsWith('/'))fullEndpoint = fullEndpoint.substring(0, fullEndpoint.length - 1)
                //TODO Corrigir ajustes acima
                
                //console.log('\t',`[${method?.toUpperCase()}] ${fullEndpoint}`)
                try {
                    //@ts-ignore
                    this.rotas[method](fullEndpoint, (requisicao: Request, resposta: Response) => {
                        instancia.requisicao = requisicao;
                        instancia.resposta = resposta;
                        const values = parameters.map((name: string) => {
                            const type: any = snakeCase(name).split('_').shift()
                            const param = camelCase(name.replace(type, ''))
                            if (type == name) return get(requisicao, type, {})
                            return cloneDeep(get(requisicao, `${type}.${param}`, null))
                        })
                        instancia[functionName](...values)
                    })
                } catch (err) {
                    console.error(method, fullEndpoint)
                }
            })

    }

    private getUrlParams(parameters: any) {
        const urlParams = parameters
            .filter((param: string) => param.startsWith('params'))
            .map((param: string) => camelCase(param.replace('params', '')))
        if (urlParams.length <= 0) return ''
        return `/:${urlParams.join('/:')}`
    }

    private getParametersFromFunction(instance: any, method: string) {
        const propertyDescriptor: any = Object.getOwnPropertyDescriptor(instance, method)
        let methodString = propertyDescriptor.value.toString()

        methodString = methodString.replace(/\/\*[\s\S]*?\*\//g, '')
            .replace(/\/\/(.)*/g, '')
            .replace(/{[\s\S]*}/, '')
            .replace(/=>/g, '')
            .trim();
        const start = methodString.indexOf("(") + 1;
        const end = methodString.length - 1;
        const parameters = methodString.substring(start, end).split(", ");

        return parameters.map((param: any) => param.replace(/=[\s\S]*/g, '').trim())
    }

}