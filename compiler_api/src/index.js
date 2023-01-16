// compiler microservice

const express = require('express')
const app = express()
const port = 8080
const fs = require('fs');
let spawn = require('child_process').spawnSync;

const cors = require('cors')

app.use(express.json())
app.use(cors())

const corsOptions = {
    origin: 'http://automarker_orchestrator',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

function createFile(path, content) {

    let created = false;

    fs.writeFileSync(path, content, function(err){
        if (err) {
            throw err;
        }
        else{
            console.log(path + ' created successfully');
            created = true;
        }
    });

    return created;
}

function compile(language, code){
    const tmp_folder = 'tmp_code/';

    let shell_command;
    let file_extension;

    language = language.toUpperCase();

    switch(language) {
        case "PYTHON":
            shell_command = "python3";
            file_extension = ".py";
            break;
        case "C":
            shell_command = "gcc";
            file_extension = ".c";
            break;
        case "C++":
            shell_command = "g++";
            file_extension = ".cpp";
            break;
        case "JAVA":
            shell_command = "javac";
            file_extension = ".java";
            break;
        case "JAVASCRIPT":
            shell_command = "node";
            file_extension = ".js";
            break;
        case "RUST":
            shell_command = "rustc";
            file_extension = ".rs";
            break;
        default:
            shell_command = "echo";
            break;
      }
    
    let shell;
    
    if(language == "JAVA")
        code = 'package tmp_code;\n' + code;

    createFile(tmp_folder + 'test' + file_extension, code)
        
    if(language == "PYTHON" || language == "JAVASCRIPT"){
        shell = spawn(shell_command, [tmp_folder + 'test' + file_extension]);
    }
    else if(language == "C" || language == "C++"|| language == "RUST"){
        shell = spawn(shell_command, [tmp_folder + 'test' + file_extension, '-o', tmp_folder + 'test']);

        // execute only if there are no compliation errors
        if(!shell.stderr.toString())
            shell = spawn('./' + tmp_folder + 'test');

        // for c we run:  gcc test_code/test.c -o test_code/test && ./test_code/test
        // for cpp we run:  g++ test_code/test.cpp -o test_code/test && ./test_code/test
        // for rust we run:  rustc test_code/test.rs -o test_code/test && ./test_code/test

        // ADD DELETION OF COMPILED FILES
    }
    else{ // only java left
        shell = spawn(shell_command, [tmp_folder + 'test' + file_extension]);

        // execute only if there are no compliation errors
        if(!shell.stderr.toString())
            shell = spawn('java', [tmp_folder + 'test']);
        // for java we run:  javac test_code/test.java && java test_code/test

        // ADD DELETION OF COMPILED FILES
    } 

    console.log('STDOUT: ' + shell.stdout.toString());
    console.error('STDERR: ' + shell.stderr.toString());
    
    return {out: shell.stdout.toString(), err:shell.stderr.toString()};
}

// define a route handler for the default home page
app.post( "/api", cors(corsOptions), async (req, res) => {
    const body = await req.body;

    console.log('PRINTING REQUESTED LANGUAGE ' + req.body.language);
    console.log('PRINTING REQUESTED CODE ' + req.body.code);

    const comp_res = compile(req.body.language, req.body.code);

    res.json(
        {
            "request_body" : req.body,
            "compiler_output" : comp_res.out,
            "compiler_error" : comp_res.err,
        }
    );
} );

// start the Express server
app.listen( port, () => {
    console.log( `Compiler Microservice started at http://localhost:${ port }` );
} );
