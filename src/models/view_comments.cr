module Model
    class ViewComments < Crecto::Model

        schema "view_comments" do # table name
            field :id, Int32, primary_key: true
            field :comment, String
            field :form_id, Int32
            field :user_id, Int32
            field :user, String
            field :name, String
            field :photo, String
            field :type, String
        end
        
    end
end