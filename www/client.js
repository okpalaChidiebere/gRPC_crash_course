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
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
const grpcObject = grpc.loadPackageDefinition(packageDefinition);
const todoPackage = grpcObject.todoPackage;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const client = new todoPackage.Todo('localhost:3000', grpc.credentials.createInsecure());
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
        call.on("data", (item) => {
            console.log("received item from server " + JSON.stringify(item));
        });
        //eventlistener for when the stream is done
        call.on("end", () => console.log("server done!"));
        client.createTodo(todoItem, (err, response) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log("Received from server " + JSON.stringify(response));
        });
    });
}
main();
//# sourceMappingURL=client.js.map