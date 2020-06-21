module Controller
    module FormTypes
        extend self

        Query = Crecto::Repo::Query

        def all()
            Model::ConnDB.all(Model::FormType)
        end

        def active()
            Model::ConnDB.all(Model::FormType, Query.where(on_off: 1))
        end

        def create(env)
            form_type =        env.params.json["form_type"].as(String)
            form_type_string = env.params.json["form_type_string"].as(String)
            on_off =           env.params.json["on_off"].as(Int64).to_i
            widgets =          env.params.json["widgets"].as(String)

            form_type_record = Model::FormType.new
            form_type_record.form_type = form_type
            form_type_record.form_type_string = form_type_string
            form_type_record.on_off = on_off
            changeset = Model::ConnDB.insert(form_type_record)

            form_type_id = changeset.instance.id

            widgets.split(',').each do |widget_id|
                form_type_widget_record = Model::FormTypeWidget.new
                form_type_widget_record.form_type_id = form_type_id
                form_type_widget_record.widget_id = widget_id.to_i
                changeset = Model::ConnDB.insert(form_type_widget_record)
            end
            
            {status: "OK", message: "Form Type: #{form_type} was created."}.to_json
        end

        def update(env)
            id               = env.params.json["id"].as(String)
            form_type        = env.params.json["form_type"].as(String)
            form_type_string = env.params.json["form_type_string"].as(String)
            on_off           = env.params.json["on_off"].as(String).to_i

            item_record = Model::ConnDB.get!(Model::FormType, id)
            item_record.form_type = form_type
            item_record.form_type_string = form_type_string
            item_record.on_off = on_off
            changeset = Model::ConnDB.update(item_record)

            {status: "OK",id: id, message: "Status : #{id} was updated."}.to_json
        end

        def remove(env)
            id = env.params.json["id"].as(String)

            item_record = Model::ConnDB.get!(Model::FormType, id)
            changeset = Model::ConnDB.delete(item_record)

            {status: "OK",id: id, message: "Status : #{id} was removed."}.to_json
        end

    end
end