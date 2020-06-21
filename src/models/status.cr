module Model
    class Status < Crecto::Model

        schema "status" do # table name
            field :id, Int32, primary_key: true
            field :status, String
        end
    
        validate_required [:status]
    end
end