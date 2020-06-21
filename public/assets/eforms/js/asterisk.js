class Asterisk
{
    static phone_login()
    {
        // Show full page LoadingOverlay
        $.LoadingOverlay("show");

        Main.post("/eforms/phone/login").then(response => response.json()).then(data => {
            console.log(data);
            if(data.status == "OK")
            {
                Main.setItem('agent_bridge', data.bridge);
                Main.setItem('agent_channel', data.channel);

                $("#lnk_phone_login").addClass("display-none");
                $("#lnk_phone_logout").removeClass("display-none");

                Main.show_success(data.message);
            }
            else
                Main.show_error(data.message);
            
            //Close the LoadingOverlay
            $.LoadingOverlay("hide");
        }).catch(message => {
            //Close the LoadingOverlay
            $.LoadingOverlay("hide");

            Main.show_error(message);
        });
    }

    static phone_logout()
    {
        // Show full page LoadingOverlay
        $.LoadingOverlay("show");

        Main.post("/eforms/phone/logout").then(response => response.json()).then(data => {
            console.log(data);
            if(data.status == "OK")
            {
                Main.setItem('agent_bridge', data.bridge);
                Main.setItem('agent_channel', data.channel);

                $("#lnk_phone_login").removeClass("display-none");
                $("#lnk_phone_logout").addClass("display-none");

                Main.show_success(data.message);
            }
            else
                Main.show_error(data.message);
            
            //Close the LoadingOverlay
            $.LoadingOverlay("hide");
        }).catch(message => {
            //Close the LoadingOverlay
            $.LoadingOverlay("hide");

            Main.show_error(message);
        });
    }

    static async phone_dial(phone)
    {
        let params = {phone};
        var response = await Main.post("/eforms/phone/manual/dial",params).catch(message => Main.show_error(message));
        var response_data = await response.json();
        
        if(response_data.status == "OK")
        {
            Main.setItem('client_channel', response_data.client_channel);
        }
        else
            if(response_data.status == "error")
                Main.show_error(response_data.message);
        
        return response_data;
    }

    static async phone_hangup(channel)
    {
        let params = {channel};
        var response = await Main.post("/eforms/phone/manual/hangup",params).catch(message => Main.show_error(message));
        var response_data = await response.json();
        
        if(response_data.status == "error")
            Main.show_error(response_data.message);
    
        return response_data;
    }
}