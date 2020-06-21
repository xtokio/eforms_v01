$(".lnk_status_update").on("click", async function(e){
    e.preventDefault();
    
    let id = $(this).attr("data-id");
    let status = $.trim($(`#txt_status_${id}`).text());

    let params = {id, status};
    let response = await Main.post("/eforms/admin/status/update",params).catch(message => Main.show_error(message));
    let response_data = await response.json();
    if(response_data.status == "OK")
        Main.show_success(response_data.message);
    else
        Main.show_error(response_data.message);
});

$(".lnk_status_remove").on("click", async function(e){
    e.preventDefault();
    
    let id = $(this).attr("data-id");

    let params = {id};
    let response = await Main.post("/eforms/admin/status/remove",params).catch(message => Main.show_error(message));
    let response_data = await response.json();
    if(response_data.status == "OK")
        Main.show_success(response_data.message,async function(){
            let link = "/eforms/admin/form_status";
            await Main.load_page(link).catch(message => Main.show_error(message));
            window.history.pushState({}, null, "/eforms");
        });
    else
        Main.show_error(response_data.message);
});