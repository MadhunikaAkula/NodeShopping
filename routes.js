const fs = require('fs');
const routehandlers = (req, res) => {
    const url = req.url;
    const method = req.method;
    if (url === '/') {
        res.write("<html>");
        res.write("<head>hi</head>");
        res.write(`<body><form  action='/message' method="POST"><input name='message' type='text'><button type='submit'>Send</button></form></body>`)
        res.write("</html>");
        return res.end();
    }
    if (url === '/message' && method == 'POST') {
        const body = [];
        req.on('data', (chunk) => {
            body.push(chunk);
        });
        return req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            const message = parsedBody.split("=")[1];
            fs.writeFile("message.txt", message, (error) => {
                res.statusCode = 302;
                res.setHeader('Location', '/');
                return res.end();
            });
        })
    }
    res.setHeader('content-header', 'text/html');
    res.write("<html>");
    res.write("<head>hi</head>");
    res.write("</html>");
    res.end();
}

exports.handler = routehandlers;
exports.sometext = "madhu";
               //types of exporting modules
//module.exports=routehandlers; 

// module.exports={            
//     handler:routehandlers,
//     sometext:"sometext"
// };

// module.exports.handler = routehandlers; 
// module.exports.sometext = "madhu";
