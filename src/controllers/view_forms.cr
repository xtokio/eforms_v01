module Controller
    module ViewForms
        extend self

        Query = Crecto::Repo::Query

        def all()
            Model::ConnDB.all(Model::ViewForms)
        end

        def agent(agent : String)
            Model::ConnDB.all(Model::ViewForms, Query.where(assigned_to: agent))
        end

        def show(id : String)
            Model::ConnDB.all(Model::ViewForms, Query.where(id: id))
        end

        def search(id : String)
            Model::ConnDB.all(Model::ViewForms, Query.where(id: id).or_where(form_number: id))
        end

        def status(status : String, admin : Bool, agent : String)
            if admin
                Model::ConnDB.all(Model::ViewForms, Query.where(status: status))
            else
                Model::ConnDB.all(Model::ViewForms, Query.where(status: status, assigned_to: agent))
            end
        end

        def status_all()
            response = [] of Hash(String, String)
            form_status = Controller::Status.all()
            form_status.each do |form_record|
                response_status = status(form_record.status.to_s, true, "")
                row = {"id" => form_record.id , "status" => form_record.status, "total" => response_status.size}
                response = response + [row]
            end

            response.to_json
        end

        def status_agent(agent : String)
            response = [] of Hash(String, String)
            form_status = Controller::Status.all()
            form_status.each do |form_record|
                response_status = status(form_record.status.to_s, false, agent)
                row = {"id" => form_record.id , "status" => form_record.status, "total" => response_status.size}
                response = response + [row]
            end

            response.to_json
        end

    end
end