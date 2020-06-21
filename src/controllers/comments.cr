module Controller
    module Comments
        extend self

        Query = Crecto::Repo::Query

        def all()
            Model::ConnDB.all(Model::Comment)
        end

        def create(env)
            form_id = env.params.json["form_id"].as(String)
            user_id = env.params.json["user_id"].as(String)
            comment = env.params.json["comment"].as(String)

            comment_record = Model::Comment.new
            comment_record.form_id = form_id.to_i
            comment_record.user_id = user_id.to_i
            comment_record.comment = comment
            changeset = Model::ConnDB.insert(comment_record)          

            {status: "OK", message: "Comment was added."}.to_json
        end
    end
end