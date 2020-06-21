$("#file_widget").on("change",async function(){
    let filename = $(this).val().split("\\");
    $(this).next().text(filename[filename.length-1]);

    // let response = await Main.upload($(this)).catch(message => Main.show_error(message));
    // console.log(JSON.parse(response).filename);
});

$("#lnk_add_new_widget").on("click", async function(e){
    e.preventDefault();
    let widget = $.trim($("#txt_widget").val());
    let code = "";
    let description = $.trim($("#txt_description").val());
    
    if(widget != "")
    {
        let response_file = await Main.upload_widget($("#file_widget")).catch(message => Main.show_error(message));
        code = JSON.parse(response_file).filename.split(".html")[0];

        let params = {widget,code,description};
        let response = await Main.post("/eforms/admin/widgets/new",params).catch(message => Main.show_error(message));
        let response_data = await response.json();
        if(response_data.status == "OK")
        {
            Main.show_success(response_data.message,async function(){
                let link = "/eforms/admin/widgets";
                await Main.load_page(link).catch(message => Main.show_error(message));
                window.history.pushState({}, null, "/eforms");
            });
        }
        else
            Main.show_error(response_data.message);
    }
    else
        Main.show_error("Widget field is empty.");
});