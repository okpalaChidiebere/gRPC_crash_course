const PROTO_PATH = __dirname + '/proto/todo.proto';

import * as protoLoader from '@grpc/proto-loader';
import * as grpc from 'grpc';
import fs from 'fs';

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
    /*client.readTodos(null, (err: any, response: any) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log("Received from server; readTodos: " + JSON.stringify(response));
        for (const item of response.items) { //you can loop through each itemrow from the response array and do whtever you want
            console.log(item.text);
        }
    });*/

    const call = client.readTodosStream(); //the call we get here will be a stream
    //eventlistener for when we get a data from the stream
    call.on("data", ( item: any )=> { 
        console.log("received item from server " + JSON.stringify(item));
    });
    //eventlistener for when the stream is done
    call.on("end", () => console.log("server done!"))

    client.createTodo(todoItem, (err: any, response: any) => {
        if (err) {
            console.error(err);
            return;
          }
          console.log("Received from server " + JSON.stringify(response));
      
    });

    addPhoto(client);

    function addPhoto (client: any) {

        const md = new grpc.Metadata();
        md.add('badgenumber', '2080');
        
        //creates client to send stream message accross (Photo)
        //return error if any or result if streaming is Ok
        const call = client.addPhoto(md, function (err: any, result: any) {
            console.log(result);
        });
        
        //uses fs to read image file
        const stream = fs.createReadStream(__dirname + '/Penguins.jpg');
        //Chunk data to send it in different pieces
        stream.on('data', (chunk: any) => {
            call.write({data: chunk});
        });
        stream.on('end', function () {
            call.end();
        });
    }
    
}

main();