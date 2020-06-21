$("#lnk_add_new_user").on("click", async function(e){
    e.preventDefault();
    let user = $.trim($("#txt_user").val());
    let password = $.trim($("#txt_password").val());
    let name = $.trim($("#txt_name").val());
    let photo = $.trim($("#txt_photo").val());
    let type = $.trim($("#cmb_type").val());
    let params = {user,password,name,photo,type};
    
    let response = await Main.post("/eforms/admin/users/new",params).catch(message => Main.show_error(message));
    let response_data = await response.json();
    if(response_data.status == "OK")
        Main.show_success(response_data.message,async function(){
            let link = "/eforms/admin/users";
            await Main.load_page(link).catch(message => Main.show_error(message));
            window.history.pushState({}, null, "/eforms");
        });
    else
        Main.show_error(response_data.message);
});