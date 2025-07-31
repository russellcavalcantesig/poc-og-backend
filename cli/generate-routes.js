const fs = require('fs')

let Routes = `
import { Request, Response, Router } from "express";
<IMPORTS>
export class CoreRouter {
    public router: Router = Router();
    constructor(){
        <ROUTES>
    }
}
`

async function registerResources(module = null) {
    module = module ? module : ''
    const dirname = __dirname.replace('cli', '')
    const basePath = `${dirname}src/servicos/${module}`;
    const dir = await fs.readdirSync(basePath)
    dir.forEach(async (path) => {
        const localPath = `${basePath}/${path}`
        const isDir = await fs.lstatSync(localPath).isDirectory()
        if (isDir) {
            registerResources(path)
        } else {
            /*let classInstance = await require(localPath)
            const className = Object.keys(classInstance).pop();
            classInstance = new classInstance[className]()
            */
            
            //this.registerRoutes(module, classInstance)


        }
    })
}

async function registerRoutes(module, instance) {
    Object.getOwnPropertyNames(instance)
        .filter((name) => typeof instance[name] === 'function')
        .filter((name) => this._methods.some((method) => name.startsWith(method)))
        .forEach((functionName) => {
            const replace = ['find-all', 'find-by-id', 'create', 'update', 'remove']
            const parameters = this.getParametersFromFunction(instance, functionName)
            const resource = snakeCase(instance.constructor.name)
                .split('_')
                .filter((name) => ![module, 'service'].includes(name))
                .join('-')
            let endpoint = drop(snakeCase(functionName).split('_')).join('-')
            const method = snakeCase(functionName).split('_').shift()
            if (replace.includes(endpoint)) endpoint = ''
            else endpoint = `/${endpoint}`

            const urlParams = this.getUrlParams(parameters)

            const fullEndpoint = `${module ? '/' + module : ''}/${resource}${endpoint}${urlParams}`
            //@ts-ignore
            this.router[method](fullEndpoint, (req, res) => {
                instance.req = req;
                instance.res = res;
                const values = parameters.map((name) => {
                    const type = snakeCase(name).split('_').shift()
                    const param = camelCase(name.replace(type, ''))
                    if (type == name) return get(req, type, {})
                    return get(req, `${type}.${param}`, null)
                })
                instance[functionName](...values)
            })
        })

}

async function getUrlParams(parameters) {
    const urlParams = parameters
        .filter((param) => param.startsWith('params'))
        .map((param) => camelCase(param.replace('params', '')))
    if (urlParams.length <= 0) return ''
    return `/:${urlParams.join('/:')}`
}

async function getParametersFromFunction(instance, method) {
    const propertyDescriptor = Object.getOwnPropertyDescriptor(instance, method)
    let methodString = propertyDescriptor.value.toString()

    methodString = methodString.replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/\/\/(.)*/g, '')
        .replace(/{[\s\S]*}/, '')
        .replace(/=>/g, '')
        .trim();
    const start = methodString.indexOf("(") + 1;
    const end = methodString.length - 1;
    const parameters = methodString.substring(start, end).split(", ");

    return parameters.map((param) => param.replace(/=[\s\S]*/g, '').trim())
}

registerResources()