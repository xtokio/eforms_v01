$(".lnk_widget_update").on("click", async function(e){
    e.preventDefault();
    
    let id = $(this).attr("data-id");
    let widget = $.trim($(`#txt_widget_${id}`).text());
    let code = $.trim($(`#txt_code_${id}`).text());
    let description = $.trim($(`#txt_description_${id}`).text());

    let params = {id, widget, code, description};
    let response = await Main.post("/eforms/admin/widgets/update",params).catch(message => Main.show_error(message));
    let response_data = await response.json();
    if(response_data.status == "OK")
        Main.show_success(response_data.message);
    else
        Main.show_error(response_data.message);
});

$(".lnk_widget_remove").on("click", async function(e){
    e.preventDefault();
    
    let id = $(this).attr("data-id");

    let params = {id};
    let response = await Main.post("/eforms/admin/widgets/remove",params).catch(message => Main.show_error(message));
    let response_data = await response.json();
    if(response_data.status == "OK")
        Main.show_success(response_data.message,async function(){
            let link = "/eforms/admin/widgets";
            await Main.load_page(link).catch(message => Main.show_error(message));
            window.history.pushState({}, null, "/eforms");
        });
    else
        Main.show_error(response_data.message);
});