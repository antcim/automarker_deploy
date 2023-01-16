# AUTOMARKER COMPILER API

## First Step
```
npm install
```

## How the api works
The api expects a request body as follows
```
{
    "language" : "",
    "code" : ""
}
```

The language field can be either one of these, case does not matter.
```
c
c++
rust
java
javascript
python
```

The code field can be directly taken from a text input
but it **must be processed by JSON.stringify() before sending it in the request**.

Requests must be done in POST to the "/api" route.

The api responds with a body as follows
```
{
  "request_body": {
    "language": "",
    "code": ""
  },
  "compiler_output": "",
  "compiler_error": ""
}
```