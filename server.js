var port, server, service,
    system = require('system');

if (system.args.length !== 2) {
    console.log('Usage: simpleserver.js <portnumber>');
    phantom.exit(1);
} else {
    port = system.args[1];
    server = require('webserver').create();

    service = server.listen(port, function (request, response) {

        


        console.log('Request at ' + new Date());
        console.dir(JSON.stringify(request,null,4));
            response.statusCode = 200;
            response.headers = {
                'Cache': 'no-cache',
                'Content-Type': 'text/html'
            };
            var url=request.url;
            url=url.replace("/?url=","");
            url="http://"+url.replace("http://","");


            var page = require('webpage').create();
        page.open(url, function () {
            var doc = page.evaluate(function () {
                //window.document.body.scrollTop = document.body.scrollHeight;
                console.log('window loaded !')      
                var images = document.querySelectorAll('img');
                var doc=[];
                for (var i = images.length - 1; i >= 0; i--) {
                    var img=images[i];
                    //console.log(img);
                    /*
                    var src=img.src;

                    if(src.split('.git').length===2){

                    }
                    if(src.split('.jpg').length===2){

                    }
                    if(src.split('.png').length===2){

                    }*/

                    if(img.naturalWidth>=200 || mg.naturalHeight>=200){
                        doc.push({
                            src:img.src,
                            width:img.naturalWidth,
                            height:img.naturalHeight
                        });
                    }

                    
                };
                return doc;
            });
            console.dir(page.title);
            
            //console.log(page.content);

            //phantom.exit();
            response.write('<html>');
            response.write('<head>');
            response.write('<meta charset="UTF-8">');
            response.write('<title>Hello, world!</title>');
            response.write('</head>');
            response.write('<body>');
            /*
            response.write('<p>This is from PhantomJS web server.</p>');
            response.write('<p>Request data:</p>');
            response.write('<pre>');
            response.write(JSON.stringify(request, null, 4));
            response.write('</pre>');

            */
            response.write('<form><input style="width:200px" type=text name=url /><input type=submit value=ok /></form>');
        
            response.write(page.title);

            for (var i = doc.length - 1; i >= 0; i--) {
                var line=doc[i];
                response.write('['+line.width+'*'+line.height+']'+line.src);
                response.write('</br>');
                console.log('['+line.width+'*'+line.height+']'+line.src);
            };
            response.write('</body>');
            response.write('</html>');

            response.close();

        });



        
    });

    if (service) {
        console.log('Web server running on port ' + port);
    } else {
        console.log('Error: Could not create web server listening on port ' + port);
        phantom.exit();
    }
}
