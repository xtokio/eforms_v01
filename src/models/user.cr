module Model
    class User < Crecto::Model

        schema "users" do # table name
            field :id, Int32, primary_key: true
            field :user, String
            field :password, String
            field :name, String
            field :photo, String
            field :type, String
            field :active, Int32
        end
    
        validate_required [:user, :password, :name, :type]
    end
end