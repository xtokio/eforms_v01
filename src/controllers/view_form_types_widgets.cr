module Controller
    module ViewFormTypesWidgets
        extend self

        Query = Crecto::Repo::Query

        def all()
            Model::ConnDB.all(Model::ViewFormTypesWidgets)
        end

        def widgets(form_type_id)
            Model::ConnDB.all(Model::ViewFormTypesWidgets, Query.where(form_type_id: form_type_id))
        end
    end
end