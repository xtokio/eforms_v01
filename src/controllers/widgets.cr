module Controller
    module Widgets
        extend self

        Query = Crecto::Repo::Query

        def all()
            Model::ConnDB.all(Model::Widget)
        end

        def create(env)
            widget      = env.params.json["widget"].as(String)
            code        = env.params.json["code"].as(String)
            description = env.params.json["description"].as(String)
            
            item_record = Model::Widget.new
            item_record.widget      = widget
            item_record.code_value  = code
            item_record.description = description
            changeset = Model::ConnDB.insert(item_record)

            id = changeset.instance.id

            {status: "OK",id: id, message: "Widget : #{id} was created."}.to_json
        end

        def update(env)
            id          = env.params.json["id"].as(String)
            widget      = env.params.json["widget"].as(String)
            code        = env.params.json["code"].as(String)
            description = env.params.json["description"].as(String)

            item_record = Model::ConnDB.get!(Model::Widget, id)
            item_record.widget      = widget
            item_record.code_value  = code
            item_record.description = description
            changeset = Model::ConnDB.update(item_record)

            {status: "OK",id: id, message: "Widget : #{id} was updated."}.to_json
        end

        def remove(env)
            id = env.params.json["id"].as(String)

            item_record = Model::ConnDB.get!(Model::Widget, id)
            changeset = Model::ConnDB.delete(item_record)

            {status: "OK",id: id, message: "Widget : #{id} was removed."}.to_json
        end
    end
end