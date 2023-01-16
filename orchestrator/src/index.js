// compiler orchestator

const express = require('express')
const app = express()
const port = 8079

const cors = require('cors')
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

app.use(express.json())
app.use(cors())

const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

// define a route handler for the default home page
app.post( "/api", cors(corsOptions), async (req, res) => {
    const body = await req.body;

    const MAX_NUM = 100;
    const NUM_MICROSERVICES = 2;

    const microservice_port = Math.floor(Math.random() * MAX_NUM) % NUM_MICROSERVICES;

    const url = 'http://automarker_compiler_8' + microservice_port + ':8080/api';

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    };

    let comp_ress;
    // async await syntax
    try {
        console.log('Sending to Compiler #' + microservice_port);
        let comp_res = await fetch(url, options);
        comp_ress = await comp_res.json();
    } catch (err) {
        console.log(err);
    }

    res.json(
        {
            "request_body" : comp_ress.request_body,
            "compiler_output" : comp_ress.compiler_output,
            "compiler_error" : comp_ress.compiler_error,
        }
    );
} );

// start the Express server
app.listen( port, () => {
    console.log( `Orchestrator started at http://localhost:${ port }` );
} );
