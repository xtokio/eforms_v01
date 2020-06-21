module Model
    class FormType < Crecto::Model

        schema "form_types" do # table name
            field :id, Int32, primary_key: true
            field :form_type, String
            field :form_type_string, String
            field :on_off, Int32
        end
    
        validate_required [:form_type]
    end
end