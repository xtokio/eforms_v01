# TODO: Write documentation for `Dialercr`
require "dotenv"

# Load ENV variables
Dotenv.load #("/Users/luis/Desktop/Code/Crystal/apps/eforms/.env")
PUBLIC_PATH = ENV["PUBLIC_PATH"]
PORT        = ENV["PORT"].to_i

require "kemal"
require "kemal-session"
require "sqlite3"
require "crecto"
require "./models/*"
require "./controllers/*"

public_folder PUBLIC_PATH

module Eforms
  VERSION = "0.1.0"

  # TODO: Put your code here
  Kemal::Session.config.secret = "9e7abe8ae041296820a0b69ef0e4a397c87f5866f454d35d432840bc98cfd789439addc260bb6f9a058e88faa7e4a4e416e39d05273f459dd3373dc6387cf69c"
  
  static_headers do |response, filepath, filestat|
    response.headers.add("Cache-control", "public")
    response.headers.add("Cache-control", "max-age=31557600")
    response.headers.add("Cache-control", "s-max-age=31557600")
    response.headers.add("Content-Size", filestat.size.to_s)
  end

  error 404 do
    error_code = "404"
    error_message = "Page / Resource not found"
    render "src/views/error_page.ecr"
  end

  error 500 do
    error_code = "500"
    error_message = "Server error"
    render "src/views/error_page.ecr"
  end

  get "/eforms" do |env|
    if Controller::Application.user_logged(env)
      user_id =     env.session.string("user_id")
      user_name =   env.session.string("user_name")
      user_photo =  env.session.string("user_photo")
      is_admin =    env.session.bool("is_admin")

      status_label = "All"

      status = Controller::Status.all()
      form_types = Controller::FormTypes.active()

      if env.session.bool("is_admin")
        forms = Controller::ViewForms.all()
      else
        forms = Controller::ViewForms.agent(user_name)
      end

      render "src/views/dashboard/forms/index.ecr" , "src/layouts/base.ecr"
    else
      env.redirect "/eforms/login"
    end
  end

  get "/eforms/login" do |env|
    render "src/layouts/login.ecr"
  end

  post "/eforms/login" do |env|
    env.response.content_type = "application/json"

    Controller::Users.login(env)
    if Controller::Application.user_logged(env)
      {status: "OK"}.to_json
    else
      {status: "ERROR"}.to_json
    end
  end

  get "/eforms/logout" do |env|
    env.session.destroy
    env.redirect "/eforms/login"
  end

  post "/eforms/assumeid" do |env|
    env.response.content_type = "application/json"
    if Controller::Application.user_logged(env)
      user = env.params.json["user_id"].as(String)
      if env.session.bool("is_admin")
        Controller::Users.assume_id(env,user)
      else
        {status: "ERROR", message: "You do not have Admin privileges"}.to_json
      end
    else
      {status: "ERROR", message: "You are not logged in"}.to_json
    end
  end

  get "/eforms/form/:id" do |env|
    if Controller::Application.user_logged(env)
      id = env.params.url["id"]
      user_id =     env.session.string("user_id")
      user_name =   env.session.string("user_name")
      user_photo =  env.session.string("user_photo")
      is_admin =    env.session.bool("is_admin")

      status = Controller::Status.all()
      form_types = Controller::FormTypes.active()
      forms = Controller::ViewForms.show(id)
      render "src/views/dashboard/forms/show.ecr" , "src/layouts/base.ecr"
    else
      env.redirect "/eforms/login"
    end
  end

  get "/eforms/form/search/:id" do |env|
    if Controller::Application.user_logged(env)
      id = env.params.url["id"]
      status_label = "Search"

      forms = Controller::ViewForms.search(id)
      render "src/views/dashboard/forms/index.ecr"
    else
      env.redirect "/eforms/login"
    end
  end

  get "/eforms/dashboard" do |env|
    if Controller::Application.user_logged(env)
      user_name =   env.session.string("user_name")

      status_label = "All"

      if env.session.bool("is_admin")
        forms = Controller::ViewForms.all()
      else
        forms = Controller::ViewForms.agent(user_name)
      end
      render "src/views/dashboard/forms/index.ecr"
    else
      {status: "ERROR"}.to_json
    end
  end

  get "/eforms/dashboard/status/:status" do |env|
    if Controller::Application.user_logged(env)
      user_name    = env.session.string("user_name")
      status_label = env.params.url["status"]
      
      if env.session.bool("is_admin")
        forms = Controller::ViewForms.status(status_label, true, "")
      else
        forms = Controller::ViewForms.status(status_label, false, user_name)
      end

      render "src/views/dashboard/forms/index.ecr"
    else
      {status: "ERROR"}.to_json
    end
  end

  get "/eforms/dashboard/form/:id" do |env|
    if Controller::Application.user_logged(env)
      id = env.params.url["id"]
      forms = Controller::ViewForms.show(id)
      status = Controller::Status.all()
      render "src/views/dashboard/forms/show.ecr"
    else
      {status: "ERROR"}.to_json
    end
  end

  get "/eforms/dashboard/form/new/:id" do |env|
    if Controller::Application.user_logged(env)
      form_type_id = env.params.url["id"]
      form_type = ""
      form_type_string = ""
      widgets = ""
      widgets_model = Controller::ViewFormTypesWidgets.widgets(form_type_id)
      widgets_model.each do |item|
        form_type = item.form_type
        form_type_string = item.form_type_string

        if widgets == ""
          widgets += "#{item.code_value}"
        else
          widgets += ",#{item.code_value}"
        end
      end
      render "src/views/dashboard/forms/new.ecr"
    else
      {status: "ERROR"}.to_json
    end
  end

  post "/eforms/dashboard/status/all" do |env|
    env.response.content_type = "application/json"
    if Controller::Application.user_logged(env)
      user_name =   env.session.string("user_name")
      if env.session.bool("is_admin")
        Controller::ViewForms.status_all()
      else
        Controller::ViewForms.status_agent(user_name)
      end
    else
      {status: "ERROR"}.to_json
    end
  end

  post "/eforms/dashboard/form/new" do |env|
    env.response.content_type = "application/json"
    if Controller::Application.user_logged(env)
      Controller::Forms.create(env)
    else
      {status: "ERROR"}.to_json
    end
  end

  post "/eforms/dashboard/form/history" do |env|
    env.response.content_type = "application/json"
    if Controller::Application.user_logged(env)
      Controller::History.form(env).to_json
    else
      {status: "ERROR"}.to_json
    end
  end

  post "/eforms/dashboard/form/comments" do |env|
    env.response.content_type = "application/json"
    if Controller::Application.user_logged(env)
      Controller::ViewComments.form(env).to_json
    else
      {status: "ERROR"}.to_json
    end
  end

  post "/eforms/dashboard/form/comment/new" do |env|
    env.response.content_type = "application/json"
    if Controller::Application.user_logged(env)
      Controller::Comments.create(env)
    else
      {status: "ERROR"}.to_json
    end
  end

  post "/eforms/dashboard/form/update" do |env|
    env.response.content_type = "application/json"
    if Controller::Application.user_logged(env)
      Controller::Forms.update(env)
    else
      {status: "ERROR"}.to_json
    end
  end

  post "/eforms/dashboard/form/update/status" do |env|
    env.response.content_type = "application/json"
    if Controller::Application.user_logged(env)
      Controller::Forms.update_status(env)
    else
      {status: "ERROR"}.to_json
    end
  end

  # Admin
  get "/eforms/admin/users" do |env|
    if Controller::Application.user_logged(env)
      if env.session.bool("is_admin")
        users = Controller::Users.all()
        render "src/views/admin/users/index.ecr"
      else
        {status: "ERROR"}.to_json
      end
    else
      {status: "ERROR"}.to_json
    end
  end

  get "/eforms/admin/users/new" do |env|
    if Controller::Application.user_logged(env)
      if env.session.bool("is_admin")
        
        render "src/views/admin/users/new.ecr"
      else
        {status: "ERROR"}.to_json
      end
    else
      {status: "ERROR"}.to_json
    end
  end

  post "/eforms/admin/users/new" do |env|
    env.response.content_type = "application/json"
    if Controller::Application.user_logged(env)
      Controller::Users.create(env)
    else
      {status: "ERROR"}.to_json
    end
  end

  post "/eforms/admin/users/update" do |env|
    env.response.content_type = "application/json"
    if Controller::Application.user_logged(env)
      Controller::Users.update(env)
    else
      {status: "ERROR"}.to_json
    end
  end

  get "/eforms/admin/status" do |env|
    if Controller::Application.user_logged(env)
      if env.session.bool("is_admin")
        status = Controller::Status.all()
        render "src/views/admin/status/index.ecr"
      else
        {status: "ERROR"}.to_json
      end
    else
      {status: "ERROR"}.to_json
    end
  end

  get "/eforms/admin/status/new" do |env|
    if Controller::Application.user_logged(env)
      if env.session.bool("is_admin")
        
        render "src/views/admin/status/new.ecr"
      else
        {status: "ERROR"}.to_json
      end
    else
      {status: "ERROR"}.to_json
    end
  end

  post "/eforms/admin/status/new" do |env|
    env.response.content_type = "application/json"
    if Controller::Application.user_logged(env)
      Controller::Status.create(env)
    else
      {status: "ERROR"}.to_json
    end
  end

  post "/eforms/admin/status/update" do |env|
    env.response.content_type = "application/json"
    if Controller::Application.user_logged(env)
      Controller::Status.update(env)
    else
      {status: "ERROR"}.to_json
    end
  end

  post "/eforms/admin/status/remove" do |env|
    env.response.content_type = "application/json"
    if Controller::Application.user_logged(env)
      Controller::Status.remove(env)
    else
      {status: "ERROR"}.to_json
    end
  end

  get "/eforms/admin/widgets" do |env|
    if Controller::Application.user_logged(env)
      if env.session.bool("is_admin")
        widgets = Controller::Widgets.all()
        render "src/views/admin/widgets/index.ecr"
      else
        {status: "ERROR"}.to_json
      end
    else
      {status: "ERROR"}.to_json
    end
  end

  get "/eforms/admin/widgets/new" do |env|
    if Controller::Application.user_logged(env)
      if env.session.bool("is_admin")
        widgets = Controller::Widgets.all()
        render "src/views/admin/widgets/new.ecr"
      else
        {status: "ERROR"}.to_json
      end
    else
      {status: "ERROR"}.to_json
    end
  end

  post "/eforms/admin/widgets/new" do |env|
    env.response.content_type = "application/json"
    if Controller::Application.user_logged(env)
      Controller::Widgets.create(env)
    else
      {status: "ERROR"}.to_json
    end
  end

  post "/eforms/admin/widgets/update" do |env|
    env.response.content_type = "application/json"
    if Controller::Application.user_logged(env)
      Controller::Widgets.update(env)
    else
      {status: "ERROR"}.to_json
    end
  end

  post "/eforms/admin/widgets/remove" do |env|
    env.response.content_type = "application/json"
    if Controller::Application.user_logged(env)
      Controller::Widgets.remove(env)
    else
      {status: "ERROR"}.to_json
    end
  end

  post "/eforms/upload/widget" do |env|
    upload_folder = "#{PUBLIC_PATH}/assets/eforms/html/widgets/"
    filename = ""
    HTTP::FormData.parse(env.request) do |upload|
      filename = upload.filename
    # Be sure to check if file.filename is not empty otherwise it'll raise a compile time error
      if !filename.is_a?(String)
        p "No filename included in upload"
      else
        ext = filename.split(".").pop()
        filename = "widget_" + Random::Secure.hex(8) + "." + ext
        file_path = ::File.join [upload_folder, filename]
        File.open(file_path, "w") do |f|
          IO.copy(upload.body, f)
        end

        # DataBase.upload(filename,ext,upload.filename,iproperty,iuser)
        
      end
    end
    {status: "OK", filename: filename}.to_json
  end

  get "/eforms/admin/form_types" do |env|
    if Controller::Application.user_logged(env)
      if env.session.bool("is_admin")
        form_types = Controller::FormTypes.all()
        render "src/views/admin/form_types/index.ecr"
      else
        {status: "ERROR"}.to_json
      end
    else
      {status: "ERROR"}.to_json
    end
  end

  get "/eforms/admin/form_types/new" do |env|
    if Controller::Application.user_logged(env)
      if env.session.bool("is_admin")
        widgets = Controller::Widgets.all()
        render "src/views/admin/form_types/new.ecr"
      else
        {status: "ERROR"}.to_json
      end
    else
      {status: "ERROR"}.to_json
    end
  end

  post "/eforms/admin/form_types/new" do |env|
    env.response.content_type = "application/json"
    if Controller::Application.user_logged(env)
      if env.session.bool("is_admin")
        Controller::FormTypes.create(env)
      else
        {status: "ERROR"}.to_json
      end
    else
      {status: "ERROR"}.to_json
    end
  end

  post "/eforms/admin/form_types/update" do |env|
    env.response.content_type = "application/json"
    if Controller::Application.user_logged(env)
      Controller::FormTypes.update(env)
    else
      {status: "ERROR"}.to_json
    end
  end

  post "/eforms/admin/form_types/remove" do |env|
    env.response.content_type = "application/json"
    if Controller::Application.user_logged(env)
      Controller::FormTypes.remove(env)
    else
      {status: "ERROR"}.to_json
    end
  end

end
Kemal.run(PORT)