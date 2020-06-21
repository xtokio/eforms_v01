$("#lnk_add_comment").on("click", async function(e){
    e.preventDefault();

    let form_id = $(".grid-form").attr("data-form-id");
    let user_id = $("#lnk_user").attr("data-user-id");
    let comment = $("#txt_comment").val();
    let params = {form_id,user_id,comment};

    if(comment.length > 0)
    {
        var response = await Main.post("/eforms/dashboard/form/comment/new",params).catch(message => Main.show_error(message));
        var response_data = await response.json();
        
        $("#txt_comment").val("");
        previous_comments();

        Main.show_success(response_data.message);
    }
    else
        Main.show_error("Comment is empty!");
});

$("#lnk_previous_comments").on("click",async function(){
    previous_comments();
});

async function previous_comments()
{
    let form_id = $(".grid-form").attr("data-form-id");
    let params = {form_id};
    if (form_id != undefined)
    {
        var response = await Main.post("/eforms/dashboard/form/comments",params).catch(message => Main.show_error(message));
        var response_data = await response.json();
        if(response_data.length > 0)
        {
            $("#div_previous_comments > .card-body").html("");

            response_data.forEach(function(record){
                var created_at = new Date(record.created_at);

                let comment = `
                <div class="media media-comment">
                    <img alt="Image placeholder" class="avatar avatar-lg media-comment-avatar rounded-circle" src="/assets/eforms/img/users/${record.photo}">
                    <div class="media-body">
                        <div class="media-comment-text">
                            <h6 class="h5 mt-0">${record.name}</h6>
                            <p class="text-sm lh-160">
                                ${record.comment}
                            </p>
                            <div class="d-flex align-items-center justify-content-sm-end">
                                ${created_at.toLocaleString()}
                            </div>
                        </div>
                    </div>
                </div>
                `;

                $("#div_previous_comments > .card-body").prepend(comment);
            });
        }
    }
}