
import AceEditor from "react-ace-editor";
import React, { Component, useState } from 'react';
import { Button } from "react-bootstrap";


function CodeEditor(props) {
    
    const [value, setValue] = useState(props.value);
    

    function onChange(newValue) {
        console.log("change", newValue);
        setValue(newValue);
    }

    return (
        <>
            <AceEditor
                mode="javascript"
                theme="twilight"
                style={{ height: '79vh', width: '100%', fontSize: "18px" }}
                onChange={onChange}
                name="editor"
                editorProps={{ $blockScrolling: true }}
                setValue={value}


            />
            <br />
            <Button onClick={() => console.log(value)} variant="success">Run & Save</Button>
        </>
    );


}
export default CodeEditor