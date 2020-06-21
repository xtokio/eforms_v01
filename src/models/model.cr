module Model
    module ConnDB
        extend Crecto::Repo

        DATABASE_PATH = ENV["DATABASE_PATH"]

        config do |conf|
            conf.adapter = Crecto::Adapters::SQLite3
            conf.database = DATABASE_PATH
        end

    end
end