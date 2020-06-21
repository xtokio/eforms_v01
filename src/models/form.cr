module Model
    class Form < Crecto::Model

        schema "forms" do # table name
            field :id, Int32, primary_key: true
            field :form_number, String
            field :widgets, String
            field :form_type_id, Int32
            field :form_data, String
            field :status, String
            field :created_by, String
            field :assigned_to, String
        end
    
        validate_required [:form_type_id, :created_by]
    end
end