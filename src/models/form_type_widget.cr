module Model
    class FormTypeWidget < Crecto::Model

        schema "form_types_widgets" do # table name
            field :id, Int32, primary_key: true
            field :form_type_id, Int32
            field :widget_id, Int32
        end

        validate_required [:form_type_id, :widget_id]
    end
end