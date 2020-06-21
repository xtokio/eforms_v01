Widget.render();

// Form create
$("#btn_form_create").on("click", async function(){
    $.LoadingOverlay("show");

    let form_number = $("#txt_form_number").text();
    let widgets = $("#form_widgets").attr("data-widgets");
    let form_type_id = $("#form_widgets").attr("data-form-type-id");
    let form_data = JSON.stringify(Main.form_data());
    let created_by = $("#span_user_name").text();
    let params = {form_number,widgets,form_type_id,form_data,created_by};

    var response = await Main.post("/eforms/dashboard/form/new",params).catch(message => Main.show_error(message));
    var response_data = await response.json();
    console.log(response_data);

    Main.show_success(response_data.message);

    $.LoadingOverlay("hide");
});