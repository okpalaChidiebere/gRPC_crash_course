const PROTO_PATH = __dirname + '/proto/todo.proto';

import * as protoLoader from '@grpc/proto-loader';
import * as grpc from 'grpc';

/*The object parameter is a configuration where we specify how we want to treat a case-sensitive schema or how we want to treat long, etc  */
const packageDef = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
//const packageDef = protoLoader.loadSync(PROTO_PATH, {}); //here we use default configuration for package definition
const grpcObject = grpc.loadPackageDefinition(packageDef) as any;
const todoPackage = grpcObject.todoPackage;

const todos = [];
const createTodo = async(call: any, callback: any) => {
    /*The example here, when we get a task from the client, we increase the id by one and push to the array. 
    Ideally we do som database stuff like here https://gitlab.com/infoverload/grpc-server-client/-/tree/master*/
    const todoItem = {
        "id": todos.length + 1,
        "text": call.request.text
    };
    todos.push(todoItem)
    callback(null, todoItem); // callbacks tells the client when we are done. The client recieve what we send back in the 'response' param
    console.log(call);
}

const server = new grpc.Server();
server.addService(todoPackage.Todo.service, { //the method defined here will be mapped to our protoRPC, so for consistency reaso, the MUST be thesame name
    createTodo
});

const port = process.env.PORT || 3000;
const uri = `0.0.0.0:${port}`;
server.bind(uri, grpc.ServerCredentials.createInsecure());
const message = `
The gRPC server is being started on ${uri}.

You can invoke the client script by running: ${`$ npm run client`}.

Use ${`BloomRPC`} if you prefer a GUI client (download: ${`https://github.com/uw-labs/bloomrpc`}).
`
console.log(message);
server.start();

