module Model
    class Comment < Crecto::Model

        schema "comments" do # table name
            field :id, Int32, primary_key: true
            field :comment, String
            field :form_id, Int32
            field :user_id, Int32
        end
    
        validate_required [:form_id, :user_id]
    end
end