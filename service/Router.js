import RoutePattern from 'route-pattern';
import {merge} from 'diffy-update';

export class RouteError extends Error {
    constructor(url, type) {
        super(`Reouting error ${type} on ${url}`);

        this.type = type;
        this.url = url;
    }
}

export default class Router {
    constructor() {
        this.routes = [];
    }

    register([method, url, handler]) {
        let pattern = RoutePattern.fromString(url);
        this.routes.push(Object.assign({pattern}, {method, url, handler}));
    }

    registerAll(routes) {
        routes.forEach(this.register, this);
    }

    async execute(incomingRequest) {
        let route = this.routes.find(route => route.pattern.matches(incomingRequest.url));

        if (!route) {
            throw new RouteError(incomingRequest.url, 'NotFound');
        }

        let matchedData = route.pattern.match(incomingRequest.url);
        let routeParams = Object.assign({}, matchedData.namedParams, matchedData.queryParams);
        let requestContext = merge(incomingRequest, 'params', routeParams);

        let result = await route.handler.call(null, requestContext);
        return result;
    }
}
