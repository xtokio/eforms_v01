module Model
    class History < Crecto::Model

        schema "history" do # table name
            field :id, Int32, primary_key: true
            field :form_id, Int32
            field :status, String
            field :user, String
        end
    
        validate_required [:form_id, :status, :user]
    end
end