module Controller
  module Application
      extend self

      def user_logged(env)
          if env.session.int?("login") && env.session.int("login") > 0
            return true
          else
            return false
          end
      end

  end
end