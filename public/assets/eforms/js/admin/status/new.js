$("#lnk_add_new_status").on("click", async function(e){
    e.preventDefault();
    let status = $.trim($("#txt_status").val());
    let params = {status};
    
    let response = await Main.post("/eforms/admin/status/new",params).catch(message => Main.show_error(message));
    let response_data = await response.json();
    if(response_data.status == "OK")
        Main.show_success(response_data.message,async function(){
            let link = "/eforms/admin/status";
            await Main.load_page(link).catch(message => Main.show_error(message));
            window.history.pushState({}, null, "/eforms");
        });
    else
        Main.show_error(response_data.message);
});