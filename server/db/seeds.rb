# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

User.create!([
  {id: 1, name: "kikurage", password: "kikurage", description: "I am Kikurage", icon: "https://1tess.files.wordpress.com/2008/08/kikurage_0096.jpg"},
  {id: 2, name: "stogu", password: "stogu", description: "I am stogu", icon: "http://static.panoramio.com/photos/large/4953084.jpg"},
  {id: 3, name: "jinssk", password: "jinssk", description: "I am jinssk", icon: "http://3.bp.blogspot.com/-qvJINsskM_k/TysTXG8-k9I/AAAAAAAAAKY/h0RN1E5abyQ/s1600/davidoakesaswilliamhamleigh-16.jpg"},
  {id: 4, name: "guerrini", password: "guerrini", description: "I am hotel", icon: "http://accordionplus.com/images/Oxford.jpg"}
])
Project.create!([
  {id: 1, owner: "kikurage", name: "KikurageProject", user_id: 1},
  {id: 2, owner: "kikurage", name: "OkinawaProject", user_id: 1},
  {id: 3, owner: "stogu", name: "StoguProject", user_id: 2},
  {id: 4, owner: "jinssk", name: "JinsskProject", user_id: 3},
])
Comment.create!([
  {id: 1, owner: "kikurage", text: "それな", user_id: 1, target: "/jinssk/project/JinsskProject", project_id: 4},
  {id: 2, owner: "kikurage", text: "それはない", user_id: 1, target: "stogu/project/StoguProject", project_id: 3}
])