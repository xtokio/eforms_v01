module Controller
    module Status
        extend self

        Query = Crecto::Repo::Query

        def all()
            Model::ConnDB.all(Model::Status)
        end

        def create(env)
            status = env.params.json["status"].as(String)
            
            item_record = Model::Status.new
            item_record.status = status
            changeset = Model::ConnDB.insert(item_record)

            id = changeset.instance.id

            {status: "OK",id: id, message: "Status : #{id} was created."}.to_json
        end

        def update(env)
            id     = env.params.json["id"].as(String)
            status = env.params.json["status"].as(String)

            item_record = Model::ConnDB.get!(Model::Status, id)
            item_record.status = status
            changeset = Model::ConnDB.update(item_record)

            {status: "OK",id: id, message: "Status : #{id} was updated."}.to_json
        end

        def remove(env)
            id = env.params.json["id"].as(String)

            item_record = Model::ConnDB.get!(Model::Status, id)
            changeset = Model::ConnDB.delete(item_record)

            {status: "OK",id: id, message: "Status : #{id} was removed."}.to_json
        end
    end
end