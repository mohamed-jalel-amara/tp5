const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const PROTO_PATH = __dirname + "/my-service.proto";
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const serviceProto = grpc.loadPackageDefinition(packageDefinition).myservice;

const myServiceClient = new serviceProto.MyService(
  "localhost:50051",
  grpc.credentials.createInsecure()
);

app.get("/api/:id", (req, res) => {
  const id = req.params.id;
  myServiceClient.getRecord({ id }, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response);
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Reverse proxy server listening on port ${PORT}`);
});
