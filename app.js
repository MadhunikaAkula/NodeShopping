const http=require('http');
const fs=require('fs');
const server=http.createServer((req,res)=>{
    const url=req.url;
    const method=req.method;
    if(url==='/'){
        res.write("<html>");
        res.write("<head>hi</head>");
        res.write(`<body><form  action='/message' method="POST"><input name='message' type='text'><button type='submit'>Send</button></form></body>`)
        res.write("</html>");
        return res.end();
    }
    if(url==='/message' && method=='POST'){
        const body=[];
        req.on('data',(chunk)=>{
        body.push(chunk);
        });
        req.on('end',()=>{
       const parsedBody= Buffer.concat(body).toString();
       const message=parsedBody.split("=")[1];
       fs.writeFileSync("message.txt",message);

        })
        res.statusCode=302;
        res.setHeader('Location','/');
        return res.end();
        }
    res.setHeader('content-header','text/html');
    res.write("<html>");
    // res.write("<head>hi</head>");
    res.write("</html>");
    res.end();
});
server.listen(3000);