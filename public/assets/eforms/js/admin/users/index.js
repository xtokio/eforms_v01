$("#lnk_add_user").on("change", async function(e){
    let user = "";
    let password = "";
    let name = "";
    let photo = "";
    let type = "";

    var fileUpload = document.getElementById("lnk_add_user");
    var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
    if (regex.test(fileUpload.value.toLowerCase())) 
    {
        if (typeof (FileReader) != "undefined") 
        {
            var reader = new FileReader();
            reader.onload = function (e) 
            {
                var rows = e.target.result.split("\n");
                for (var i = 0; i < rows.length; i++) 
                {
                    var cells = rows[i].split(",");
                    if (cells.length > 1) 
                    {
                        for (var j = 0; j < cells.length; j++) 
                        {
                            if(j == 0)
                                user = cells[j];
                            if(j == 1)
                                password = cells[j];
                            if(j == 2)
                                name = cells[j];
                            if(j == 3)
                                photo = cells[j];
                            if(j == 4)
                                type = cells[j];
                        }

                        let row = `
                        <tr>
                            <th scope="row">
                                <a href="#"></a>
                            </th>
                            <td style="text-align:center; vertical-align: middle;">
                                <p class="text-sm mb-0" contenteditable="true">${user}</p>
                            </td>
                            <td style="text-align:center; vertical-align: middle;">
                                <p class="text-sm mb-0" contenteditable="true">${password}</p>
                            </td>
                            <td style="text-align:center; vertical-align: middle;">
                                <p class="text-sm mb-0" contenteditable="true">${name}</p>
                            </td>
                            <td style="text-align:center; vertical-align: middle;">
                                <p class="text-sm mb-0" contenteditable="true">${photo}</p>
                            </td>
                            <td style="text-align:center; vertical-align: middle;">
                                <p class="text-sm mb-0" contenteditable="true">${type}</p>
                            </td>
                            <td style="text-align:center; vertical-align: middle;">
                                <p class="text-sm mb-0"></p>
                            </td>
                            <td style="text-align:center; vertical-align: middle;">
                                <a id="lnk_add_${i}" href="#" class="btn btn-sm btn-primary add-record">Add</a>
                            </td>
                        </tr>
                        `;

                        $("#tbody_users").append(row);

                        $(`#lnk_add_${i}`).on("click", async function(){
                            var tr = $(this).closest("tr");
                            let user = tr.children()[1].children[0].textContent;
                            let password = tr.children()[2].children[0].textContent;
                            let name = tr.children()[3].children[0].textContent;
                            let photo = tr.children()[4].children[0].textContent;
                            let type = tr.children()[5].children[0].textContent;
                            let params = {user,password,name,photo,type};

                            var response = await Main.post("/eforms/admin/users/new",params).catch(message => Main.show_error(message));
                            var response_data = await response.json();
                            if(response_data.status == "OK")
                            {
                                tr.children()[0].children[0].textContent = response_data.id;
                                $(this).remove();
                            }
                        });
                    }
                }
                
            }
            reader.readAsText(fileUpload.files[0]);
        } 
        else 
        {
            Main.show_error("This browser does not support HTML5.");
        }
    } 
    else 
    {
        Main.show_error("Please upload a valid CSV file.");
    }
});

$(".lnk_user_update").on("click", async function(e){
    e.preventDefault();
    
    let id = $(this).attr("data-id");
    let user = $.trim($(`#txt_user_${id}`).text());
    let password = $.trim($(`#txt_password_${id}`).text());
    let name = $.trim($(`#txt_name_${id}`).text());
    let photo = $.trim($(`#txt_photo_${id}`).text());
    let type = $.trim($(`#txt_type_${id}`).text());

    let params = {id, user, password, name, photo, type};
    let response = await Main.post("/eforms/admin/users/update",params).catch(message => Main.show_error(message));
    let response_data = await response.json();
    if(response_data.status == "OK")
        Main.show_success(response_data.message);
    else
        Main.show_error(response_data.message);
});