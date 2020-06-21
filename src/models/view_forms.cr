module Model
    class ViewForms < Crecto::Model

        schema "view_forms" do # table name
            field :id, Int32, primary_key: true
            field :form_number, String
            field :widgets, String
            field :form_type_id, Int32
            field :form_type, String
            field :form_type_string, String
            field :form_data, String
            field :status, String
            field :created_by, String
            field :assigned_to, String
        end

    end
end