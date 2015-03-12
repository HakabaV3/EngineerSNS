namespace :curl do
  task :before => :environment do
    @command = 'curl -D - '
    @header = '-H "Content-Type: application/json" '
    @body = '-d \'{"password": "susaki"}\' '
    @url = 'http://localhost:3000/api/v1'
  end

  desc "curl command"
  # ユーザー新規作成
  task :user_post => :environment do
    @command = @command + "-X POST " + @header + @body + @url + "/user/susaki"
    result = system("#{@command}")
    puts "\ndone."
  end

  # ユーザーログイン
  task :auth_signin => :environment do
    @body = '-d \'{"userName": "susaki", "password": "susaki"}\' '
    @command = @command + "-X POST " + @header + @body + @url + "/auth/signin"
    result = system("#{@command}")
    puts "\ndone."
  end

  # ユーザーミー
  task :auth_me => :environment do
  	token = User.find_by(name: "susaki").token
  	@header = "-H \"X-token: #{token}\" "
    @command = @command + "-X GET " + @header + @url + "/auth/me"
    result = system("#{@command}")
    puts "\ndone."
  end

  task user_post: :before
  task auth_signin: :before
  task auth_me: :before
end
