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

function main() {

    const client = new todoPackage.Todo(
        'localhost:3000',
        grpc.credentials.createInsecure()
    );

    const todoItem = {
        "id": -1,
        "text": "Do Laundry"
    };

    client.createTodo(todoItem, (err: any, response: any) => {
        if (err) {
            console.error(err);
            return;
          }
          console.log("Received from server " + JSON.stringify(response));
      
    });
    
}

main();