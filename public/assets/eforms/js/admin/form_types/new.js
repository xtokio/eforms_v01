$("#btn_widgets_add").on("click",async function(){
    let widget_id = $("#cmb_widget_add").find('option:selected').attr("data-id");
    let widget_page = $("#cmb_widget_add").val();
    let duplicated = false;

    $(".widget").each(function(){
        if(widget_id == $(this).attr("data-widget-id"))
            duplicated = true;
    });

    if(duplicated)
        Main.show_error("Widget already added.");
    else
    {
        const response = await fetch(`/assets/eforms/html/widgets/${widget_page}.html`, {credentials: 'include'});
        const content = await response.text();
        let widget = `
        <div class="widget" data-widget="${widget_page}" data-widget-id="${widget_id}">
            <br>
            <div class="widget-container">
                ${content}
                <div style="display: flex; align-items: flex-end; flex-direction: column;">
                    <a href="#" class="text-danger remove-widget" style="margin-top: auto; margin-right: 10px; font-size: 0.8rem;">remove</a>
                </div>
            </div>
        </div>
        `;
        $("#div_form_types_new_widgets").append(widget);

        $(".remove-widget").on("click",function(e){
            e.preventDefault();

            $(this).closest(".widget").remove();
        });
    }
});

$("#btn_widgets_create").on("click", async function(){
    let form_type = $("#txt_form_type").val();
    let form_type_string = $("#txt_form_type_string").val();
    let on_off = 0;
    if($("#chk_form_type_on_off").prop("checked"))
        on_off = 1;

    let widgets = "";

    $(".widget").each(function(){
        if(widgets == "")
            widgets += `${$(this).attr("data-widget-id")}`;
        else
            widgets += `,${$(this).attr("data-widget-id")}`;
    });
    
    let params = {form_type,form_type_string,on_off,widgets};
    let response = await Main.post("/eforms/admin/form_types/new",params).catch(message => Main.show_error(message));
    let response_data = await response.json();

    Main.show_success(response_data.message);
});