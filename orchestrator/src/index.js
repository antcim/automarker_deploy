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

    console.log('PRINTING REQUESTED LANGUAGE ' + req.body.language);
    console.log('PRINTING REQUESTED CODE ' + req.body.code);

    const microservice_port = Math.floor(Math.random() * 100) % 1;

    const url = 'http://localhost:808' + microservice_port + '/api';

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
