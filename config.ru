require 'sprockets'
map '/assets' do
  environment = Sprockets::Environment.new
  environment.append_path 'app/assets/javascripts'
  environment.append_path 'app/assets/stylesheets'
  run environment
end

use Rack::Static, urls: ["/"], root: Dir.pwd

map '/' do
  run Proc.new {|env| [200, {"Content-Type" => "text/html"}, ["Hello Rack!"]]}
end
