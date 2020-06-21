module Model
    class Widget < Crecto::Model

        schema "widgets" do # table name
            field :id, Int32, primary_key: true
            field :widget, String
            field :code_value, String
            field :description, String
        end
    
        validate_required [:widget]
    end
end