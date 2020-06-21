module Controller
    module Forms
        extend self

        Query = Crecto::Repo::Query

        def all()
            Model::ConnDB.all(Model::Form)
        end

        def create(env)
            form_number  = env.params.json["form_number"].as(String)
            widgets      = env.params.json["widgets"].as(String)
            form_type_id = env.params.json["form_type_id"].as(String)
            form_data    = env.params.json["form_data"].as(String)
            created_by   = env.params.json["created_by"].as(String)
            user         = env.session.string("user_name")
            status = "Open"

            form_record = Model::Form.new
            form_record.form_number = form_number
            form_record.widgets = widgets
            form_record.form_type_id = form_type_id.to_i
            form_record.form_data = form_data
            form_record.status = status
            form_record.created_by = created_by
            form_record.assigned_to = ""
            changeset = Model::ConnDB.insert(form_record)

            form_id = changeset.instance.id

            if form_number == "0000"
                form_record = Model::ConnDB.get!(Model::Form, form_id)
                form_record.form_number = form_id.to_s
                changeset = Model::ConnDB.update(form_record)
            end

            # History
            history_record = Model::History.new
            history_record.form_id = form_id
            history_record.status = status
            history_record.user = user
            changeset = Model::ConnDB.insert(history_record)

            {status: "OK", message: "Form : #{form_id} was created."}.to_json
        end

        def update(env)
            id =         env.params.json["id"].as(String)
            form_data =  env.params.json["form_data"].as(String)

            form_record = Model::ConnDB.get!(Model::Form, id)
            form_record.form_data = form_data
            if form_record.assigned_to == ""
                form_record.assigned_to = env.session.string("user_name")
            end
            changeset = Model::ConnDB.update(form_record)

            {status: "OK", message: "Form : #{id} was updated."}.to_json
        end

        def update_status(env)
            id     =  env.params.json["id"].as(String)
            user   =  env.session.string("user_name")
            status =  env.params.json["status"].as(String)

            form_record = Model::ConnDB.get!(Model::Form, id)
            form_record.status = status
            changeset = Model::ConnDB.update(form_record)

            # History
            history_record = Model::History.new
            history_record.form_id = id.to_i
            history_record.status = status
            history_record.user = user
            changeset = Model::ConnDB.insert(history_record)

            {status: "OK", message: "Form : #{id} was updated."}.to_json
        end

    end
end