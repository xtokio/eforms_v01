module Controller
    module ViewComments
        extend self

        Query = Crecto::Repo::Query

        def all()
            Model::ConnDB.all(Model::ViewComments)
        end

        def form(env)
            form_id = env.params.json["form_id"].as(String)
            Model::ConnDB.all(Model::ViewComments, Query.where(form_id: form_id.to_i))
        end
    end
end