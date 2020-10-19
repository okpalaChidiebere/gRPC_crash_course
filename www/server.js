"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const PROTO_PATH = __dirname + '/proto/todo.proto';
const protoLoader = __importStar(require("@grpc/proto-loader"));
const grpc = __importStar(require("grpc"));
/*The object parameter is a configuration where we specify how we want to treat a case-sensitive schema or how we want to treat long, etc  */
const packageDef = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
//const packageDef = protoLoader.loadSync(PROTO_PATH, {}); //here we use default configuration for package definition
const grpcObject = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObject.todoPackage;
const todos = [];
const createTodo = (call, callback) => __awaiter(void 0, void 0, void 0, function* () {
    /*The example here, when we get a task from the client, we increase the id by one and push to the array.
    Ideally we do som database stuff like here https://gitlab.com/infoverload/grpc-server-client/-/tree/master*/
    const todoItem = {
        "id": todos.length + 1,
        "text": call.request.text
    };
    todos.push(todoItem);
    callback(null, todoItem); // callbacks tells the client when we are done. The client recieve what we send back in the 'response' param
    console.log(call);
});
const readTodos = (call, callback) => __awaiter(void 0, void 0, void 0, function* () {
    //FYI: we did not do anything with the call, because we don't exprect any parameter for this RPC
    callback(null, { "items": todos });
});
const readTodosStream = (call, callback) => __awaiter(void 0, void 0, void 0, function* () {
    //You can stream however you want. You can make write and wait a mili second and write again. Cool stuffs!
    for (const todo of todos) { //we stream each row in the array to the user one by one
        call.write(todo);
    }
    call.end(); //this ends the communication between the client and server when it is done streaming the list
});
const server = new grpc.Server();
server.addService(todoPackage.Todo.service, {
    createTodo,
    readTodos,
    readTodosStream
});
const port = process.env.PORT || 3000;
const uri = `0.0.0.0:${port}`;
server.bind(uri, grpc.ServerCredentials.createInsecure());
const message = `
The gRPC server is being started on ${uri}.

You can invoke the client script by running: ${`$ npm run client`}.

Use ${`BloomRPC`} if you prefer a GUI client (download: ${`https://github.com/uw-labs/bloomrpc`}).
`;
console.log(message);
server.start();
/*
Ideally, you work with databases, so you can arrange your package RPC's in another file eg /services/todo for better maintenance and then you can import it into the this file
*/
//# sourceMappingURL=server.js.map