# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

User.create!([
  {id: 1, name: "kikurage", description: "I am Kikurage", icon: "https://1tess.files.wordpress.com/2008/08/kikurage_0096.jpg"},
  {id: 2, name: "stogu", description: "I am stogu", icon: "http://static.panoramio.com/photos/large/4953084.jpg"},
  {id: 3, name: "jinssk", description: "I am jinssk", icon: "http://3.bp.blogspot.com/-qvJINsskM_k/TysTXG8-k9I/AAAAAAAAAKY/h0RN1E5abyQ/s1600/davidoakesaswilliamhamleigh-16.jpg"}
])
Project.create!([
  {id: 1, owner: "kikurage", name: "KikurageProject", user_id: 1},
  {id: 2, owner: "kikurage", name: "OkinawaProject", user_id: 1},
  {id: 3, owner: "stogu", name: "StoguProject", user_id: 2},
  {id: 4, owner: "stogu", name: "ChanmikaProject", user_id: 2},
  {id: 5, owner: "jinssk", name: "JinsskProject", user_id: 3},
  {id: 6, owner: "jinssk", name: ""}
])