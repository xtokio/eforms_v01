class Widget
{
    static async render(action="new")
    {
        var form_id = $(".grid-form").attr("data-form-id");
        var form_data = [];
        var widgets = $(".grid-form").attr("data-widgets").split(",");
        var element = "#div_widgets";
        $(element).html('');

        if(action == "show")
        {
            form_data = JSON.parse($('script[type="text/json"]#script_json_' + form_id).text());
            
            // History
            var response_history = await Main.post("/eforms/dashboard/form/history",{form_id: form_id}).catch(message => Main.show_error(message));
            var response_data_history = await response_history.json();
            if(response_data_history.length > 0)
            {
                response_data_history.forEach(function(record){
                    let created_at = new Date(record.created_at);

                    let history = `
                    <ul class="nav nav-sm flex-column" style="margin-left: 10px;">
                        <li class="nav-item">
                            <span style="font-size: 0.7rem;">Status <a href="#">${record.status}</a></span>
                            <br>
                            <span style="font-size: 0.7rem;">User &nbsp;&nbsp;&nbsp;<a href="#">${record.user}</a></span>
                            <br>
                            <span style="font-size: 0.7rem;"> ${created_at.toLocaleString()} </span>
                            <hr class="my-2" style="border-bottom: 1px solid rgba(0, 0, 0, .05); margin-right: 10px;">
                        </li>
                    </ul>
                    `;

                    $("#div_history_list").prepend(history);
                });
            }
        }

        widgets.forEach(async function(widget, index){
            const response = await fetch(`/assets/eforms/html/widgets/${widget}.html`, {credentials: 'include'});
            var content = await response.text();
            var widget_content = "";
            if(content.indexOf("<script src=") > -1)
            {
                var parser = new DOMParser();
                var doc = parser.parseFromString(content, 'text/html');
                var script_tag = doc.querySelector('script');
                var newScript = document.createElement("script");
                newScript.src = script_tag.getAttribute("src");
        
                content = content.substring(content.indexOf("<script src="),-1);
                
                widget_content = `
                <div class="widget" data-widget="${widget}" data-order="${index+1}">
                    <div>
                        <div style="margin-bottom: 30px;">
                            ${content}
                        </div>
                    </div>
                </div>
                `;
                $(element).append(widget_content);
                document.querySelector(element).appendChild(newScript);
            }
            else
            {
                widget_content = `
                <div class="widget" data-widget="${widget}" data-order="${index+1}">
                    <div>
                        <div style="margin-bottom: 30px;">
                            ${content}
                        </div>
                    </div>
                </div>
                `;
                $(element).append(widget_content);
            }

            form_data.forEach(function(data){
                if(data.type == "radio" || data.type == "checkbox")
                    $(`#${data.id}`).prop("checked",true);
                else
                    if(data.type == "multi")
                    {
                        $(`#${data.id}`).attr("data-destinationList",data.value);
                        // var multi_select = sellect(`#${data.id}`);
                        // multi_select.init();
                    }
                    else
                        $(`#${data.id}`).val(data.value)
            });

            // Wait 100ms to allow widget to be added in order
            // await Main.timeout(500);
            Main.sortMeBy("data-order", element, "div", "asc");

        });

        // Update Form
        $("#btn_form_update").on("click",async function(){
            let id = $(this).attr("data-form-id");
            let form_data = JSON.stringify(Main.form_data());
            let params = {id,form_data};

            var response = await Main.post("/eforms/dashboard/form/update",params).catch(message => Main.show_error(message));
            var response_data = await response.json();
            console.log(response_data);

            Main.show_success(response_data.message);
        });

        // Update Form status
        $(".lnk_update_status").on("click", async function(){
            let id = $(this).attr("data-form-id");
            let status = $(this).text();
            let params = {id,status};

            var response = await Main.post("/eforms/dashboard/form/update/status",params).catch(message => Main.show_error(message));
            var response_data = await response.json();
            
            Main.show_success("Form updated to: "+status,function(){window.location.href = "/eforms";});
            
        });
    }
}