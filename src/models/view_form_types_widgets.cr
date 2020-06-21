module Model
    class ViewFormTypesWidgets < Crecto::Model
        set_created_at_field nil
        set_updated_at_field nil

        schema "view_form_types_widgets" do # table name
            field :form_type_id, Int32
            field :widget_id, Int32
            field :form_type, String
            field :form_type_string, String
            field :on_off, Int32
            field :widget, String
            field :code_value, String
            field :description, String
        end
    end
end