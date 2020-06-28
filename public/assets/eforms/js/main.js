class Main
{
    static post(url,params={})
    {
        var token = $('meta[name="csrf-token"]').attr('content');
        return fetch(url,{
        method: 'POST',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json',
            'X-CSRF-Token': token
        },
        credentials: 'same-origin',
        body: JSON.stringify(params)
        });
    }

    // Load Page
    static load_page(page,element="#main",callback=function(){})
    {
        return new Promise(
        async function(resolve,reject)
        {
            // Show full page LoadingOverlay
            // $.LoadingOverlay("show");
            try
            {
                const response = await fetch(page, {credentials: 'include'});
                let content = await response.text();
                
                if(content.indexOf("<script src=") > -1)
                {
                    var parser = new DOMParser();
                    var doc = parser.parseFromString(content, 'text/html');
                    var script_tag = doc.querySelector('script');
                    var newScript = document.createElement("script");
                    newScript.src = script_tag.getAttribute("src");

                    content = content.substring(content.indexOf("<script src="),-1);
                    document.querySelector(element).innerHTML = content;
                    
                    document.querySelector(element).appendChild(newScript);
                }
                else
                    if(content.indexOf('{"status":"ERROR"}') > -1)
                        window.location.href = "/eforms"
                    else
                        document.querySelector(element).innerHTML = content;

                // window.history.pushState({}, null, "/eforms");
                callback();
            }
            catch(error)
            {
                //Close the LoadingOverlay
                $.LoadingOverlay("hide");

                console.log('Error:' + error.message);
                reject(error.message);
            }
            //Close the LoadingOverlay
            $.LoadingOverlay("hide");
            resolve();
        }
        )
    }

    static async status_all()
    {
        let response = await Main.post("/eforms/dashboard/status/all").catch(message => Main.show_error(message));
        let response_data = await response.json();
        
        response_data.forEach(function(item){
            $(`#span_status_${item.id}`).text(item.total);
        });
    }

    static form_data()
    {
        let data = [];
        let inputs = document.querySelector(".grid-form").elements;

        // Iterate over the form controls
        for (let i = 0; i < inputs.length; i++)
        {
            if(inputs[i].nodeName != "FIELDSET")
                // Comments are saved in a different process
                if(inputs[i].id != "txt_comment")
                    if (inputs[i].nodeName === "INPUT" && (inputs[i].type === "radio" || inputs[i].type === "checkbox"))
                    {
                        if(inputs[i].checked)
                            data.push({"element":inputs[i].nodeName,"type":inputs[i].type,"id":inputs[i].id,"value":inputs[i].value});
                    }
                    else
                        if(inputs[i].className == "sellect-element")
                        {
                            var values = "";
                            // Array of selected items
                            var arr = $(`#${inputs[i].id}`).parent().find(".sellect-destination-list .sellect-item");
                            for(var pos = 0; pos < arr.length; pos++)
                            {
                                if(values == "")
                                    values += arr[pos].innerText;
                                else
                                    values += ","+arr[pos].innerText;
                            }
                            data.push({"element":inputs[i].nodeName,"type":"multi","id":inputs[i].id,"value":values});
                        }
                        else
                            data.push({"element":inputs[i].nodeName,"type":inputs[i].type,"id":inputs[i].id,"value":inputs[i].value});
        }

        return data;
    }

    static upload_widget(element)
    {
        return new Promise(
            function(resolve,reject)
            {
                $(element).simpleUpload("/eforms/upload/widget", {

                    start: function(file){
                        //upload started
                        console.log("Upload started");
                    },
            
                    progress: function(progress){
                        //received progress
                        console.log("Progress: " + Math.round(progress) + "%");
                    },
            
                    success: function(data){
                        //upload successful
                        console.log("Success!");
                        resolve(data);
                    },
            
                    error: function(error){
                        //upload failed
                        console.log("Failure!<br>" + error.name + ": " + error.message);
                        reject(error.message);
                    }
            
                });
            }
        )
    }

    static sortMeBy(arg, sel, elem, order) 
    {
        var $selector = $(sel);
        var $element = $selector.children(elem);

        $element.sort(function(a, b) 
        {
            var an = parseInt(a.getAttribute(arg)),
            bn = parseInt(b.getAttribute(arg));
                if (order == "asc") {
                        if (an > bn)
                        return 1;
                        if (an < bn)
                        return -1;
                } else if (order == "desc") {
                        if (an < bn)
                        return 1;
                        if (an > bn)
                        return -1;
                }
                return 0;
        });
        $element.detach().appendTo($selector);
    }

    static timeout(ms) 
    {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    static setItem(name, data)
    {
        window.localStorage.setItem(name, data);
    }

    static getItem(name)
    {
        return window.localStorage.getItem(name);
    }

    static show_success(message,callback=function(){})
    {
        swal({
        title: "Success",
        text: message,
        type: "success",
        buttonsStyling: !1,
        confirmButtonClass: "btn btn-success"
        })
        .then((Ok) => {
        if (Ok) 
        {
            callback();
        }
        });
    }

    static show_error(message,callback=function(){})
    {
        swal({
        title: "Warning",
        text: message,
        type: "warning",
        buttonsStyling: !1,
        confirmButtonClass: "btn btn-warning"
        })
        .then((Ok) => {
        if (Ok) 
        {
            callback();
        }
        });
    }

    static show_info(title,message,callback=function(){})
    {
        swal({
        title: title,
        html: message,
        type: "info",
        buttonsStyling: !1,
        confirmButtonClass: "btn btn-primary",
        width: 650
        })
        .then((Ok) => {
        if (Ok) 
        {
            callback();
        }
        });
    }
}