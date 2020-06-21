module Controller
    module History
        extend self

        Query = Crecto::Repo::Query

        def all()
            Model::ConnDB.all(Model::History)
        end

        def form(env)
            form_id = env.params.json["form_id"].as(String)
            Model::ConnDB.all(Model::History, Query.where(form_id: form_id))
        end

    end
end