const PROTO_PATH = __dirname + '/proto/todo.proto';

import * as protoLoader from '@grpc/proto-loader';
import * as grpc from 'grpc';

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
})
const grpcObject = grpc.loadPackageDefinition(packageDefinition) as any;
const todoPackage = grpcObject.todoPackage;

async function main() {

    const client = new todoPackage.Todo(
        'localhost:3000',
        grpc.credentials.createInsecure()
    );

    const todoItem = {
        "id": -1,
        "text": "running"
    };

    //we passed null as the first argument, because, the RPC expects an empty argument as input but returns an array list
    client.readTodos(null, (err: any, response: any) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log("Received from server; readTodos: " + JSON.stringify(response));
        for (const item of response.items) { //you can loop through each itemrow from the response array and do whtever you want
            console.log(item.text);
        }
    });

    client.createTodo(todoItem, (err: any, response: any) => {
        if (err) {
            console.error(err);
            return;
          }
          console.log("Received from server " + JSON.stringify(response));
      
    });
    
}

main();