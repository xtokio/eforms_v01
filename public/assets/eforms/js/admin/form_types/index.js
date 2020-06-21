$(".lnk_form_type_update").on("click", async function(e){
    e.preventDefault();
    
    let id = $(this).attr("data-id");
    let form_type = $.trim($(`#txt_form_type_${id}`).text());
    let form_type_string = $.trim($(`#txt_form_type_string_${id}`).text());
    let on_off = $.trim($(`#txt_on_off_${id}`).text());

    let params = {id, form_type, form_type_string, on_off};
    let response = await Main.post("/eforms/admin/form_types/update",params).catch(message => Main.show_error(message));
    let response_data = await response.json();
    if(response_data.status == "OK")
        Main.show_success(response_data.message);
    else
        Main.show_error(response_data.message);
});

$(".lnk_form_type_remove").on("click", async function(e){
    e.preventDefault();
    
    let id = $(this).attr("data-id");

    let params = {id};
    let response = await Main.post("/eforms/admin/form_types/remove",params).catch(message => Main.show_error(message));
    let response_data = await response.json();
    if(response_data.status == "OK")
        Main.show_success(response_data.message,async function(){
            let link = "/eforms/admin/form_types";
            await Main.load_page(link).catch(message => Main.show_error(message));
            window.history.pushState({}, null, "/eforms");
        });
    else
        Main.show_error(response_data.message);
});