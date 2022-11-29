import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'

import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism'

import 'katex/dist/katex.min.css'


function MySyntaxHighlighter(props) {



    return (
        <SyntaxHighlighter
            children={props.children}
            style={dracula}
            language={props.language}
            PreTag={props.PreTag}
            {...props}

        />
    );


}
export default MySyntaxHighlighter;